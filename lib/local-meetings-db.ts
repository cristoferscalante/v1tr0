// Base de datos local temporal para reuniones programadas
// Utiliza localStorage para persistir datos entre sesiones

export interface MeetingData {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM formato 24h
  duration: number; // duración en minutos
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientCompany?: string;
  meetingType: 'consultation' | 'follow-up' | 'presentation' | 'other';
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ClientData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  meetings: string[]; // IDs de reuniones
  createdAt: string;
  updatedAt: string;
}

class LocalMeetingsDB {
  private readonly MEETINGS_KEY = 'v1tr0_meetings';
  private readonly CLIENTS_KEY = 'v1tr0_clients';

  // Métodos para reuniones
  getMeetings(): MeetingData[] {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const data = localStorage.getItem(this.MEETINGS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al obtener reuniones:', error);
      return [];
    }
  }

  saveMeeting(meeting: Omit<MeetingData, 'id' | 'createdAt' | 'updatedAt'>): MeetingData {
    if (typeof window === 'undefined') {
      throw new Error('localStorage no disponible');
    }
    
    const meetings = this.getMeetings();
    const now = new Date().toISOString();
    const newMeeting: MeetingData = {
      ...meeting,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    };

    meetings.push(newMeeting);
    localStorage.setItem(this.MEETINGS_KEY, JSON.stringify(meetings));
    
    // Actualizar cliente si existe
    this.updateClientMeetings(meeting.clientEmail, newMeeting.id);
    
    return newMeeting;
  }

  updateMeeting(id: string, updates: Partial<MeetingData>): MeetingData | null {
    if (typeof window === 'undefined') {
      return null;
    }
    
    const meetings = this.getMeetings();
    const index = meetings.findIndex(m => m.id === id);
    
    if (index === -1) {
      return null;
    }
    
    meetings[index] = {
      ...meetings[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(this.MEETINGS_KEY, JSON.stringify(meetings));
    return meetings[index];
  }

  deleteMeeting(id: string): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    
    const meetings = this.getMeetings();
    const filteredMeetings = meetings.filter(m => m.id !== id);
    
    if (filteredMeetings.length === meetings.length) {
      return false;
    }
    
    localStorage.setItem(this.MEETINGS_KEY, JSON.stringify(filteredMeetings));
    return true;
  }

  getMeetingsByDate(date: string): MeetingData[] {
    return this.getMeetings().filter(meeting => 
      meeting.date === date && meeting.status === 'scheduled'
    );
  }

  getMeetingsByDateRange(startDate: string, endDate: string): MeetingData[] {
    return this.getMeetings().filter(meeting => {
      const meetingDate = new Date(meeting.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return meetingDate >= start && meetingDate <= end && meeting.status === 'scheduled';
    });
  }

  // Verificar si un horario específico está ocupado
  isTimeSlotOccupied(date: string, time: string): boolean {
    const meetings = this.getMeetingsByDate(date);
    return meetings.some(meeting => {
      const meetingStart = this.timeToMinutes(meeting.time);
      const meetingEnd = meetingStart + meeting.duration;
      const checkTime = this.timeToMinutes(time);
      
      // Verificar si el horario se superpone (incluyendo buffer de 30 min)
      return checkTime >= (meetingStart - 30) && checkTime < meetingEnd;
    });
  }

  // Obtener horarios ocupados para un día específico
  getOccupiedTimeSlots(date: string): string[] {
    const meetings = this.getMeetingsByDate(date);
    const occupiedSlots: string[] = [];
    
    meetings.forEach(meeting => {
      const startMinutes = this.timeToMinutes(meeting.time);
      const endMinutes = startMinutes + meeting.duration;
      
      // Agregar slots ocupados cada 30 minutos
      for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
        occupiedSlots.push(this.minutesToTime(minutes));
      }
    });
    
    return [...new Set(occupiedSlots)]; // Eliminar duplicados
  }

  // Métodos para clientes
  getClients(): ClientData[] {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const data = localStorage.getItem(this.CLIENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      return [];
    }
  }

  saveClient(client: Omit<ClientData, 'id' | 'meetings' | 'createdAt' | 'updatedAt'>): ClientData {
    if (typeof window === 'undefined') {
      throw new Error('localStorage no disponible');
    }
    
    const clients = this.getClients();
    const existingClientIndex = clients.findIndex(c => c.email === client.email);
    
    if (existingClientIndex !== -1) {
      // Actualizar cliente existente
      clients[existingClientIndex] = {
        ...clients[existingClientIndex],
        ...client,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(this.CLIENTS_KEY, JSON.stringify(clients));
      return clients[existingClientIndex];
    }
    
    // Crear nuevo cliente
    const now = new Date().toISOString();
    const newClient: ClientData = {
      ...client,
      id: this.generateId(),
      meetings: [],
      createdAt: now,
      updatedAt: now
    };

    clients.push(newClient);
    localStorage.setItem(this.CLIENTS_KEY, JSON.stringify(clients));
    
    return newClient;
  }

  getClientByEmail(email: string): ClientData | null {
    return this.getClients().find(client => client.email === email) || null;
  }

  updateClientMeetings(clientEmail: string, meetingId: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    const clients = this.getClients();
    const clientIndex = clients.findIndex(c => c.email === clientEmail);
    
    if (clientIndex !== -1) {
      clients[clientIndex].meetings.push(meetingId);
      clients[clientIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(this.CLIENTS_KEY, JSON.stringify(clients));
    }
  }

  deleteClient(email: string): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    
    const clients = this.getClients();
    const filteredClients = clients.filter(c => c.email !== email);
    
    if (filteredClients.length === clients.length) {
      return false;
    }
    
    localStorage.setItem(this.CLIENTS_KEY, JSON.stringify(filteredClients));
    return true;
  }

  // Métodos de utilidad
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  // Limpiar datos (para desarrollo/testing)
  clearAllData(): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem(this.MEETINGS_KEY);
    localStorage.removeItem(this.CLIENTS_KEY);
  }

  // Exportar datos para backup
  exportData(): { meetings: MeetingData[], clients: ClientData[] } {
    return {
      meetings: this.getMeetings(),
      clients: this.getClients()
    };
  }

  // Importar datos desde backup
  importData(data: { meetings: MeetingData[], clients: ClientData[] }): void {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(this.MEETINGS_KEY, JSON.stringify(data.meetings));
    localStorage.setItem(this.CLIENTS_KEY, JSON.stringify(data.clients));
  }
}

// Instancia singleton
export const localMeetingsDB = new LocalMeetingsDB();

// Funciones de utilidad para validación de horarios
export const timeValidation = {
  // Verificar si un horario ya pasó (considerando buffer de seguridad)
  isTimePast(date: string, time: string, bufferMinutes: number = 30): boolean {
    const now = new Date();
    const targetDateTime = new Date(`${date}T${time}:00`);
    
    // Agregar buffer de tiempo (por defecto 30 minutos)
    targetDateTime.setMinutes(targetDateTime.getMinutes() - bufferMinutes);
    
    return targetDateTime <= now;
  },

  // Obtener horarios disponibles para un día específico
  getAvailableTimeSlots(date: string): string[] {
    const workingHours = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
    const meetings = localMeetingsDB.getMeetingsByDate(date);
    const bookedTimes = meetings
      .filter(meeting => meeting.status === 'scheduled')
      .map(meeting => meeting.time);
    
    const today = new Date().toISOString().split('T')[0];
    const isToday = date === today;
    
    return workingHours.filter(time => {
      // Filtrar horarios ya ocupados por reuniones confirmadas
      if (bookedTimes.includes(time)) {
        return false;
      }
      
      // Para el día actual, filtrar horarios pasados con buffer de 30 minutos
      if (isToday && this.isTimePast(date, time, 30)) {
        return false;
      }
      
      // No permitir agendar en días pasados
      if (date < today) {
        return false;
      }
      
      return true;
    });
  },

  // Validar si se puede agendar en un horario específico
  canScheduleAt(date: string, time: string): { canSchedule: boolean, reason?: string } {
    const today = new Date().toISOString().split('T')[0];
    
    // No permitir agendar en días pasados
    if (date < today) {
      return { canSchedule: false, reason: 'No se puede agendar en fechas pasadas' };
    }
    
    // Verificar si es un horario de trabajo válido
    const workingHours = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
    if (!workingHours.includes(time)) {
      return { canSchedule: false, reason: 'Horario fuera del horario de trabajo (2:00 PM - 6:00 PM)' };
    }
    
    // Verificar si ya hay una reunión confirmada en ese horario
    const existingMeeting = localMeetingsDB.getMeetingsByDate(date)
      .find(meeting => meeting.time === time && meeting.status === 'scheduled');
    
    if (existingMeeting) {
      return { canSchedule: false, reason: 'Ya hay una reunión agendada en ese horario' };
    }
    
    // Para el día actual, verificar si el horario ya pasó (con buffer de 30 minutos)
    if (date === today && this.isTimePast(date, time, 30)) {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      return { 
        canSchedule: false, 
        reason: `No se puede agendar en horarios pasados. Hora actual: ${currentTime}` 
      };
    }
    
    return { canSchedule: true };
  },
  
  // Obtener el próximo horario disponible
  getNextAvailableSlot(date?: string): { date: string; time: string } | null {
    const startDate = date || new Date().toISOString().split('T')[0];
    const maxDays = 30; // Buscar hasta 30 días adelante
    
    for (let i = 0; i < maxDays; i++) {
      const checkDate = new Date(startDate);
      checkDate.setDate(checkDate.getDate() + i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      // Saltar fines de semana
      const dayOfWeek = checkDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue;
      }
      
      const availableSlots = this.getAvailableTimeSlots(dateStr);
      if (availableSlots.length > 0) {
        return { date: dateStr, time: availableSlots[0] };
      }
    }
    
    return null;
  }
};