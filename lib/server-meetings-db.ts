import fs from 'fs';
import path from 'path';

export interface MeetingData {
  id: string;
  date: string;
  time: string;
  duration: number; // en minutos
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientCompany?: string;
  meetingType: 'consultation' | 'follow-up' | 'presentation' | 'other';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  meetings: string[]; // IDs de reuniones
  createdAt: string;
  updatedAt: string;
}

class ServerMeetingsDB {
  private readonly DATA_DIR = path.join(process.cwd(), 'data');
  private readonly MEETINGS_FILE = path.join(this.DATA_DIR, 'meetings.json');
  private readonly CLIENTS_FILE = path.join(this.DATA_DIR, 'clients.json');

  constructor() {
    this.ensureDataDirectory();
  }

  private ensureDataDirectory(): void {
    if (!fs.existsSync(this.DATA_DIR)) {
      fs.mkdirSync(this.DATA_DIR, { recursive: true });
    }
  }

  private readJsonFile<T>(filePath: string, defaultValue: T): T {
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
      }
      return defaultValue;
    } catch (error) {
      console.error(`Error reading ${filePath}:`, error);
      return defaultValue;
    }
  }

  private writeJsonFile<T>(filePath: string, data: T): void {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error(`Error writing ${filePath}:`, error);
      throw error;
    }
  }

  // Métodos para reuniones
  getMeetings(): MeetingData[] {
    return this.readJsonFile<MeetingData[]>(this.MEETINGS_FILE, []);
  }

  saveMeeting(meeting: Omit<MeetingData, 'id' | 'createdAt' | 'updatedAt'>): MeetingData {
    const meetings = this.getMeetings();
    const now = new Date().toISOString();
    const newMeeting: MeetingData = {
      ...meeting,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now
    };

    meetings.push(newMeeting);
    this.writeJsonFile(this.MEETINGS_FILE, meetings);
    
    // Actualizar cliente si existe
    this.updateClientMeetings(meeting.clientEmail, newMeeting.id);
    
    return newMeeting;
  }

  updateMeeting(id: string, updates: Partial<MeetingData>): MeetingData | null {
    const meetings = this.getMeetings();
    const index = meetings.findIndex(m => m.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const originalMeeting = meetings[index];
    if (!originalMeeting) {
      return null;
    }
    
    const updatedMeeting: MeetingData = {
      id: originalMeeting.id,
      date: updates.date ?? originalMeeting.date,
      time: updates.time ?? originalMeeting.time,
      duration: updates.duration ?? originalMeeting.duration,
      clientName: updates.clientName ?? originalMeeting.clientName,
      clientEmail: updates.clientEmail ?? originalMeeting.clientEmail,
      meetingType: updates.meetingType ?? originalMeeting.meetingType,
      status: updates.status ?? originalMeeting.status,
      createdAt: originalMeeting.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    // Manejar propiedades opcionales explícitamente
    if (updates.clientPhone !== undefined) {
      updatedMeeting.clientPhone = updates.clientPhone;
    } else if (originalMeeting.clientPhone !== undefined) {
      updatedMeeting.clientPhone = originalMeeting.clientPhone;
    }
    
    if (updates.clientCompany !== undefined) {
      updatedMeeting.clientCompany = updates.clientCompany;
    } else if (originalMeeting.clientCompany !== undefined) {
      updatedMeeting.clientCompany = originalMeeting.clientCompany;
    }
    
    if (updates.notes !== undefined) {
      updatedMeeting.notes = updates.notes;
    } else if (originalMeeting.notes !== undefined) {
      updatedMeeting.notes = originalMeeting.notes;
    }
    
    meetings[index] = updatedMeeting;
    
    this.writeJsonFile(this.MEETINGS_FILE, meetings);
    return meetings[index] || null;
  }

  deleteMeeting(id: string): boolean {
    const meetings = this.getMeetings();
    const filteredMeetings = meetings.filter(m => m.id !== id);
    
    if (filteredMeetings.length === meetings.length) {
      return false;
    }
    
    this.writeJsonFile(this.MEETINGS_FILE, filteredMeetings);
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
    return this.readJsonFile<ClientData[]>(this.CLIENTS_FILE, []);
  }

  saveClient(client: Omit<ClientData, 'id' | 'meetings' | 'createdAt' | 'updatedAt'>): ClientData {
    const clients = this.getClients();
    const existingClientIndex = clients.findIndex(c => c.email === client.email);
    
    if (existingClientIndex !== -1) {
      // Actualizar cliente existente
      const existingClient = clients[existingClientIndex];
      if (!existingClient) {
        throw new Error('Cliente no encontrado');
      }
      
      const updatedClient: ClientData = {
        id: existingClient.id,
        email: client.email,
        name: client.name,
        meetings: existingClient.meetings,
        createdAt: existingClient.createdAt,
        updatedAt: new Date().toISOString()
      };
      
      // Manejar propiedad opcional phone
      if (client.phone !== undefined) {
        updatedClient.phone = client.phone;
      }
      
      clients[existingClientIndex] = updatedClient;
      this.writeJsonFile(this.CLIENTS_FILE, clients);
      const updatedClientResult = clients[existingClientIndex];
      if (!updatedClientResult) {
        throw new Error('Error al actualizar cliente');
      }
      return updatedClientResult;
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
    this.writeJsonFile(this.CLIENTS_FILE, clients);
    
    return newClient;
  }

  getClientByEmail(email: string): ClientData | null {
    return this.getClients().find(client => client.email === email) || null;
  }

  updateClientMeetings(clientEmail: string, meetingId: string): void {
    const clients = this.getClients();
    const clientIndex = clients.findIndex(c => c.email === clientEmail);
    
    if (clientIndex !== -1) {
      const client = clients[clientIndex];
      if (client) {
        client.meetings.push(meetingId);
        client.updatedAt = new Date().toISOString();
        this.writeJsonFile(this.CLIENTS_FILE, clients);
      }
    }
  }

  deleteClient(email: string): boolean {
    const clients = this.getClients();
    const filteredClients = clients.filter(c => c.email !== email);
    
    if (filteredClients.length === clients.length) {
      return false;
    }
    
    this.writeJsonFile(this.CLIENTS_FILE, filteredClients);
    return true;
  }

  // Métodos de utilidad
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    if (hours === undefined || minutes === undefined || isNaN(hours) || isNaN(minutes)) {
      throw new Error(`Formato de tiempo inválido: ${time}`);
    }
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  // Limpiar datos (para desarrollo/testing)
  clearAllData(): void {
    if (fs.existsSync(this.MEETINGS_FILE)) {
      fs.unlinkSync(this.MEETINGS_FILE);
    }
    if (fs.existsSync(this.CLIENTS_FILE)) {
      fs.unlinkSync(this.CLIENTS_FILE);
    }
  }
}

// Instancia singleton para el servidor
export const serverMeetingsDB = new ServerMeetingsDB();

// Funciones de validación de tiempo (reutilizadas del archivo original)
export const timeValidation = {
  isTimePast(date: string, time: string, bufferMinutes: number = 30): boolean {
    const now = new Date();
    const checkDateTime = new Date(`${date}T${time}:00`);
    const bufferTime = new Date(now.getTime() + bufferMinutes * 60000);
    return checkDateTime <= bufferTime;
  },

  getAvailableTimeSlots(date: string): string[] {
    const workingHours = {
      start: '14:00', // 2:00 PM
      end: '18:00'    // 6:00 PM
    };
    
    const slots: string[] = [];
    const startMinutes = this.timeToMinutes(workingHours.start);
    const endMinutes = this.timeToMinutes(workingHours.end);
    
    // Generar slots cada 30 minutos
    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
      const timeSlot = this.minutesToTime(minutes);
      
      // Verificar si el horario no está en el pasado
      if (!this.isTimePast(date, timeSlot)) {
        // Verificar si el horario no está ocupado
        if (!serverMeetingsDB.isTimeSlotOccupied(date, timeSlot)) {
          slots.push(timeSlot);
        }
      }
    }
    
    return slots;
  },

  canScheduleAt(date: string, time: string): { canSchedule: boolean; reason?: string } {
    if (this.isTimePast(date, time)) {
      return { canSchedule: false, reason: 'El horario seleccionado ya pasó' };
    }
    
    if (serverMeetingsDB.isTimeSlotOccupied(date, time)) {
      return { canSchedule: false, reason: 'El horario seleccionado no está disponible' };
    }
    
    return { canSchedule: true };
  },

  getNextAvailableSlot(date: string): string | null {
    const availableSlots = this.getAvailableTimeSlots(date);
    return availableSlots.length > 0 ? availableSlots[0]! : null;
  },

  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    if (hours === undefined || minutes === undefined || isNaN(hours) || isNaN(minutes)) {
      throw new Error(`Formato de tiempo inválido: ${time}`);
    }
    return hours * 60 + minutes;
  },

  minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
};