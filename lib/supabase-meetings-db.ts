import { createClient } from '@supabase/supabase-js';
import { googleCalendarService, CalendarEvent } from './google-calendar';
import { toZonedTime, format } from 'date-fns-tz';
import { parseISO } from 'date-fns';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClientInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface Meeting {
  id: string;
  client_id: string;
  date: string;
  time: string;
  duration?: number;
  title?: string;
  description?: string;
  meeting_type?: string;
  status?: string;
  confirmed?: boolean;
  google_calendar_event_id?: string;
  // meet_link?: string; // Columna no existe en Supabase aún
  created_at?: string;
  updated_at?: string;
  client?: Client;
  // Campos adicionales para compatibilidad con la API existente
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  notes?: string;
}

export class SupabaseMeetingsDB {
  // Métodos para Clientes
  async getClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return [];
    }
    
    return data || [];
  }

  async saveClient(client: ClientInput): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();
    
    if (error) {
      return null;
    }
    
    return data;
  }

  async updateClient(id: string, client: Partial<Client>): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      return null;
    }
    
    return data;
  }

  async deleteClient(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      return false;
    }
    
    return true;
  }

  async findOrCreateClient(clientData: ClientInput): Promise<Client | null> {
    try {
      // Primero buscar si el cliente ya existe por email
      const { data: existingClient, error: searchError } = await supabase
        .from('clients')
        .select('*')
        .eq('email', clientData.email)
        .single();
      
      if (searchError && searchError.code !== 'PGRST116') {
        return null;
      }
      
      // Si el cliente existe, devolverlo
      if (existingClient) {
        return existingClient;
      }
      
      // Si no existe, crear uno nuevo
      const newClient = await this.saveClient(clientData);
      return newClient;
      
    } catch {
      return null;
    }
  }

  // Métodos para Reuniones
  async getMeetings(): Promise<Meeting[]> {
    const { data, error } = await supabase
      .from('meetings')
      .select(`
        *,
        client:clients(*)
      `)
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    
    if (error) {
      return [];
    }
    
    return data || [];
  }

  async getMeetingsByDate(date: string): Promise<Meeting[]> {
    const { data, error } = await supabase
      .from('meetings')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('date', date)
      .order('time', { ascending: true });
    
    if (error) {
      return [];
    }
    
    return data || [];
  }

  async getMeetingsByDateRange(startDate: string, endDate: string): Promise<Meeting[]> {
    const { data, error } = await supabase
      .from('meetings')
      .select(`
        *,
        client:clients(*)
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    
    if (error) {
      return [];
    }
    
    return data || [];
  }

  async saveMeeting(meeting: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>): Promise<Meeting | null> {
    const { data, error } = await supabase
      .from('meetings')
      .insert([meeting])
      .select(`
        *,
        client:clients(*)
      `)
      .single();
    
    if (error) {
      return null;
    }

    // Sincronizar con Google Calendar
    if (data && data.client) {
      try {
        const startDateTime = googleCalendarService.createDateTime(data.date, data.time);
        const endDateTime = googleCalendarService.addMinutes(startDateTime, data.duration || 60);
        
        const calendarEvent = {
          summary: data.title || `Reunión con ${data.client.name}`,
          description: `Reunión ${data.meeting_type || 'de consulta'} con ${data.client.name}\n\nContacto: ${data.client.email}${data.client.phone ? `\nTeléfono: ${data.client.phone}` : ''}${data.description ? `\n\nNotas: ${data.description}` : ''}`,
          start: {
            dateTime: startDateTime,
            timeZone: 'America/Bogota'
          },
          end: {
            dateTime: endDateTime,
            timeZone: 'America/Bogota'
          },
          attendees: [
            {
              email: data.client.email,
              displayName: data.client.name
            }
          ]
        };

        const googleEventId = await googleCalendarService.createEvent(calendarEvent);
        
        if (googleEventId) {
          // Actualizar la reunión con el ID del evento de Google Calendar
          await supabase
            .from('meetings')
            .update({ google_calendar_event_id: googleEventId })
            .eq('id', data.id);
          
          data.google_calendar_event_id = googleEventId;
        }
      } catch {
        // No fallar la creación de la reunión si Google Calendar falla
      }
    }
    
    return data;
  }

  async updateMeeting(id: string, meeting: Partial<Meeting>): Promise<Meeting | null> {
    // Obtener la reunión actual para sincronizar con Google Calendar
    const { data: currentMeeting } = await supabase
      .from('meetings')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('id', id)
      .single();

    const { data, error } = await supabase
      .from('meetings')
      .update(meeting)
      .eq('id', id)
      .select(`
        *,
        client:clients(*)
      `)
      .single();
    
    if (error) {
      return null;
    }

    // Sincronizar con Google Calendar si existe el evento
    if (data && currentMeeting?.google_calendar_event_id) {
      try {
        const startDateTime = googleCalendarService.createDateTime(data.date, data.time);
        const endDateTime = googleCalendarService.addMinutes(startDateTime, data.duration || 60);
        
        const calendarEvent: CalendarEvent = {
          summary: data.title || `Reunión con ${data.client?.name}`,
          description: `Reunión ${data.meeting_type || 'de consulta'} con ${data.client?.name}\n\nContacto: ${data.client?.email}${data.client?.phone ? `\nTeléfono: ${data.client.phone}` : ''}${data.description ? `\n\nNotas: ${data.description}` : ''}`,
          start: {
            dateTime: startDateTime,
            timeZone: 'America/Bogota'
          },
          end: {
            dateTime: endDateTime,
            timeZone: 'America/Bogota'
          }
        };
        
        if (data.client) {
          calendarEvent.attendees = [
            {
              email: data.client.email,
              displayName: data.client.name
            }
          ];
        }

        await googleCalendarService.updateEvent(currentMeeting.google_calendar_event_id, calendarEvent);
      } catch {
        // Error actualizando evento en Google Calendar
      }
    }
    
    return data;
  }

  async deleteMeeting(id: string): Promise<boolean> {
    // Obtener la reunión antes de eliminarla para sincronizar con Google Calendar
    const { data: meetingToDelete } = await supabase
      .from('meetings')
      .select('google_calendar_event_id')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id);
    
    if (error) {
      return false;
    }

    // Eliminar evento de Google Calendar si existe
    if (meetingToDelete?.google_calendar_event_id) {
      try {
        await googleCalendarService.deleteEvent(meetingToDelete.google_calendar_event_id);
      } catch {
        // Error eliminando evento de Google Calendar
      }
    }
    
    return true;
  }

  // Métodos de validación de tiempo
  isTimePast(date: string, time: string): boolean {
    const colombiaTimeZone = 'America/Bogota';
    
    // Obtener la hora actual en la zona horaria de Colombia
    const nowUTC = new Date();
    const nowInColombia = toZonedTime(nowUTC, colombiaTimeZone);
    
    // Crear la fecha de la reunión en la zona horaria de Colombia
    const meetingDateTimeString = `${date}T${time}:00`;
    const meetingDateTimeParsed = parseISO(meetingDateTimeString);
    const meetingDateTimeInColombia = toZonedTime(meetingDateTimeParsed, colombiaTimeZone);
    
    // Agregar un margen de 5 minutos para evitar problemas de sincronización
    const fiveMinutesFromNow = new Date(nowInColombia.getTime() + 5 * 60 * 1000);
    

    
    return meetingDateTimeInColombia < fiveMinutesFromNow;
  }

  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    if (hours === undefined || minutes === undefined || isNaN(hours) || isNaN(minutes)) {
      throw new Error(`Formato de tiempo inválido: ${time}`);
    }
    return hours * 60 + minutes;
  }

  minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  async isTimeSlotOccupied(date: string, time: string): Promise<boolean> {
    try {
      // Normalizar el formato de tiempo (agregar segundos si no los tiene)
      const normalizedTime = time.includes(':') && time.split(':').length === 2 ? `${time}:00` : time;
      
      const { data, error } = await supabase
        .from('meetings')
        .select('id, time')
        .eq('date', date)
        .or(`time.eq.${time},time.eq.${normalizedTime}`)
        .in('status', ['confirmed', 'scheduled']);

      if (error) {
        return false;
      }
      
      return data && data.length > 0;
    } catch {
      return false;
    }
  }

  async canScheduleAt(date: string, time: string): Promise<{ canSchedule: boolean; reason?: string }> {
    // Verificar si la fecha/hora ya pasó
    const isPast = this.isTimePast(date, time);
    if (isPast) {
      return { canSchedule: false, reason: 'No se puede agendar en el pasado' };
    }

    // Verificar si el horario está ocupado
    const isOccupied = await this.isTimeSlotOccupied(date, time);
    if (isOccupied) {
      return { canSchedule: false, reason: 'El horario seleccionado no está disponible' };
    }

    // Verificar horarios de trabajo (solo 14:00-18:00)
    const timeMinutes = this.timeToMinutes(time);
    const afternoonStart = this.timeToMinutes('14:00');
    const afternoonEnd = this.timeToMinutes('18:00');

    const isInWorkingHours = timeMinutes >= afternoonStart && timeMinutes < afternoonEnd;

    if (!isInWorkingHours) {
      return { canSchedule: false, reason: 'Horario fuera del horario de trabajo (14:00-18:00)' };
    }

    // Verificar que no sea fin de semana usando zona horaria de Colombia
    const colombiaTimeZone = 'America/Bogota';
    const meetingDateString = `${date}T12:00:00`;
    const meetingDateParsed = parseISO(meetingDateString);
    const meetingDateInColombia = toZonedTime(meetingDateParsed, colombiaTimeZone);
    const dayOfWeek = meetingDateInColombia.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { canSchedule: false, reason: 'No se pueden agendar reuniones los fines de semana' };
    }
    return { canSchedule: true };
  }

  async getAvailableTimeSlots(date: string): Promise<string[]> {
    const slots: string[] = [];
    const colombiaTimeZone = 'America/Bogota';
    
    // Verificar si la fecha ya pasó completamente usando zona horaria de Colombia
    const nowUTC = new Date();
    const nowInColombia = toZonedTime(nowUTC, colombiaTimeZone);
    const todayInColombia = format(nowInColombia, 'yyyy-MM-dd', { timeZone: colombiaTimeZone });
    

    
    if (date < todayInColombia) {
      return slots; // Fecha pasada, no hay horarios disponibles
    }
    
    // Obtener todas las reuniones del día de una sola vez
    const meetings = await this.getMeetingsByDate(date);
    
    // Normalizar los tiempos ocupados para comparación
    const occupiedTimes = new Set(
      meetings
        .filter(m => m.status === 'confirmed' || m.status === 'scheduled')
        .map(m => {
          // Normalizar formato: tanto "17:30" como "17:30:00" deben coincidir
          const normalizedTime = m.time.includes(':') ? m.time.split(':').slice(0, 2).join(':') : m.time;
          return normalizedTime;
        })
    );
    
    // Horarios de tarde únicamente: 14:00 - 18:00 (cada 30 minutos)
    for (let hour = 14; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = this.minutesToTime(hour * 60 + minute);
        
        // Verificar si el horario no está ocupado
        if (!occupiedTimes.has(time)) {
          // Verificar si el horario no ha pasado (solo para el día actual)
          if (date > todayInColombia || !this.isTimePast(date, time)) {
            slots.push(time);
          }
        }
      }
    }
    
    return slots;
  }

  async getNextAvailableSlot(): Promise<{ date: string; time: string } | null> {
    const today = new Date();
    
    // Buscar en los próximos 30 días
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      
      // Saltar fines de semana
      if (checkDate.getDay() === 0 || checkDate.getDay() === 6) {
        continue;
      }
      
      const dateStr = checkDate.toISOString().split('T')[0];
      if (!dateStr) {
        continue;
      }
      const availableSlots = await this.getAvailableTimeSlots(dateStr);
      
      if (availableSlots.length > 0) {
        return {
          date: dateStr,
          time: availableSlots[0]!
        };
      }
    }
    
    return null;
  }

  async clearAllData(): Promise<void> {
    // Eliminar todas las reuniones
    await supabase.from('meetings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Eliminar todos los clientes
    await supabase.from('clients').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  }
}

// Instancia singleton
export const supabaseMeetingsDB = new SupabaseMeetingsDB();
export default supabaseMeetingsDB;