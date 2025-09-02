import { google } from 'googleapis';

// Configuración de Google Calendar
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';

// Crear cliente OAuth2
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

// Configurar tokens si están disponibles
if (process.env.GOOGLE_ACCESS_TOKEN && process.env.GOOGLE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    access_token: process.env.GOOGLE_ACCESS_TOKEN,
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
}

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
}

interface GoogleCalendarEventRequest {
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
  reminders: {
    useDefault: boolean;
    overrides: Array<{
      method: string;
      minutes: number;
    }>;
  };
}

interface GoogleCalendarUpdateRequest {
  summary?: string;
  description?: string;
  start?: {
    dateTime: string;
    timeZone: string;
  };
  end?: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
}

export class GoogleCalendarService {
  private isConfigured(): boolean {
    return !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && process.env.GOOGLE_ACCESS_TOKEN);
  }

  async createEvent(event: CalendarEvent): Promise<string | null> {
    if (!this.isConfigured()) {
      console.warn('Google Calendar no está configurado correctamente');
      return null;
    }

    try {
      const requestBody: GoogleCalendarEventRequest = {
        summary: event.summary,
        ...(event.description && { description: event.description }),
        start: {
          dateTime: event.start.dateTime,
          timeZone: event.start.timeZone || 'America/Bogota',
        },
        end: {
          dateTime: event.end.dateTime,
          timeZone: event.end.timeZone || 'America/Bogota',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 día antes
            { method: 'popup', minutes: 30 }, // 30 minutos antes
          ],
        },
      };

      if (event.attendees) {
        requestBody.attendees = event.attendees;
      }

      const response = await calendar.events.insert({
        calendarId: GOOGLE_CALENDAR_ID,
        requestBody,
      });

      return response.data.id || null;
    } catch (error) {
      console.error('Error creando evento en Google Calendar:', error);
      return null;
    }
  }

  async updateEvent(eventId: string, event: Partial<CalendarEvent>): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Google Calendar no está configurado correctamente');
      return false;
    }

    try {
      const requestBody: GoogleCalendarUpdateRequest = {
        ...(event.summary && { summary: event.summary }),
        ...(event.description && { description: event.description }),
        ...(event.start && {
          start: {
            dateTime: event.start.dateTime,
            timeZone: event.start.timeZone || 'America/Bogota',
          }
        }),
        ...(event.end && {
          end: {
            dateTime: event.end.dateTime,
            timeZone: event.end.timeZone || 'America/Bogota',
          }
        }),
      };

      if (event.attendees) {
        requestBody.attendees = event.attendees;
      }

      await calendar.events.update({
        calendarId: GOOGLE_CALENDAR_ID,
        eventId: eventId,
        requestBody,
      });

      return true;
    } catch (error) {
      console.error('Error actualizando evento en Google Calendar:', error);
      return false;
    }
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Google Calendar no está configurado correctamente');
      return false;
    }

    try {
      await calendar.events.delete({
        calendarId: GOOGLE_CALENDAR_ID,
        eventId: eventId,
      });

      return true;
    } catch (error) {
      console.error('Error eliminando evento en Google Calendar:', error);
      return false;
    }
  }

  async getEvents(timeMin: string, timeMax: string): Promise<CalendarEvent[]> {
    if (!this.isConfigured()) {
      console.warn('Google Calendar no está configurado correctamente');
      return [];
    }

    try {
      const response = await calendar.events.list({
        calendarId: GOOGLE_CALENDAR_ID,
        timeMin: timeMin,
        timeMax: timeMax,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items?.map(item => {
        const event: CalendarEvent = {
          summary: item.summary || '',
          start: {
            dateTime: item.start?.dateTime || '',
            ...(item.start?.timeZone && { timeZone: item.start.timeZone }),
          },
          end: {
            dateTime: item.end?.dateTime || '',
            ...(item.end?.timeZone && { timeZone: item.end.timeZone }),
          },
        };

        if (item.id) {
          event.id = item.id;
        }

        if (item.description) {
          event.description = item.description;
        }

        if (item.attendees && item.attendees.length > 0) {
          event.attendees = item.attendees.map(attendee => {
            const att: { email: string; displayName?: string } = {
              email: attendee.email || '',
            };
            if (attendee.displayName) {
              att.displayName = attendee.displayName;
            }
            return att;
          });
        }

        return event;
      }) || [];
    } catch (error) {
      console.error('Error obteniendo eventos de Google Calendar:', error);
      return [];
    }
  }

  // Función auxiliar para crear fecha/hora ISO desde fecha y hora separadas
  createDateTime(date: string, time: string): string {
    return `${date}T${time}:00`;
  }

  // Función auxiliar para agregar duración a una fecha/hora
  addMinutes(dateTime: string, minutes: number): string {
    const date = new Date(dateTime);
    date.setMinutes(date.getMinutes() + minutes);
    return date.toISOString();
  }
}

// Instancia singleton
export const googleCalendarService = new GoogleCalendarService();
export default googleCalendarService;