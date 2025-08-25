import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import nodemailer from 'nodemailer'
import { withValidToken } from '@/lib/google-auth'
import { SupabaseMeetingsDB } from '@/lib/supabase-meetings-db'

// Configuración de Google Calendar
const calendar = google.calendar('v3')

// Función para verificar conflictos en el calendario
async function checkTimeSlotConflicts(date: string, time: string) {
  return await withValidToken(async (accessToken: string) => {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )
    
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    })

    // Crear fecha y hora del slot solicitado
    const [year, month, day] = date.split('-')
    const [hour, minute] = time.split(':')
    const slotStart = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute))
    const slotEnd = new Date(slotStart.getTime() + 30 * 60000) // 30 minutos después

    // Buscar eventos existentes en ese rango de tiempo
    const response = await calendar.events.list({
      auth: oauth2Client,
      calendarId: 'vtr.techh@gmail.com',
      timeMin: slotStart.toISOString(),
      timeMax: slotEnd.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    })

    const existingEvents = response.data.items || []
    
    // Verificar si hay conflictos
    const hasConflicts = existingEvents.some(event => {
      if (!event.start?.dateTime || !event.end?.dateTime) return false
      
      const eventStart = new Date(event.start.dateTime)
      const eventEnd = new Date(event.end.dateTime)
      
      // Verificar solapamiento
      return (
        (slotStart >= eventStart && slotStart < eventEnd) ||
        (slotEnd > eventStart && slotEnd <= eventEnd) ||
        (slotStart <= eventStart && slotEnd >= eventEnd)
      )
    })

    return {
      hasConflicts,
      conflictingEvents: hasConflicts ? existingEvents.map(event => ({
        summary: event.summary || 'Evento sin título',
        start: event.start?.dateTime,
        end: event.end?.dateTime
      })) : []
    }
  })
}

// Configuración de nodemailer (reutilizando la configuración existente)
const createTransport = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// Función para crear evento en Google Calendar con integración dual
async function createCalendarEvent(date: string, time: string, email: string, name: string, phone: string) {
  return await withValidToken(async (accessToken: string) => {
    // Configurar OAuth2 Client con el token válido
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )
    
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    })

    // Crear fecha y hora del evento
    const [year, month, day] = date.split('-')
    const [hour, minute] = time.split(':')
    const startDateTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute))
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000) // 30 minutos después

    const eventData = {
      summary: `Reunión de Consulta - ${name}`,
      description: `Reunión agendada a través del sitio web de V1tr0.\n\nCliente: ${name}\nEmail: ${email}\nTeléfono: ${phone}\n\nTemas a tratar: Consulta sobre desarrollo web y servicios digitales.`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/Bogota',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/Bogota',
      },
      attendees: [
        { email: email, displayName: name },
        { email: 'vtr.techh@gmail.com' },
        { email: 'buzon@v1tr0.com' }
      ],
      conferenceData: {
        createRequest: {
          requestId: `meet_${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 día antes
          { method: 'popup', minutes: 30 }, // 30 minutos antes
        ],
      },
    }

    // Crear evento en el calendario principal (vtr.techh@gmail.com)
    const primaryEvent = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'vtr.techh@gmail.com',
      resource: eventData,
      conferenceDataVersion: 1,
      sendUpdates: 'all'
    })

    // Crear evento en el calendario del usuario (si es diferente)
    let userEvent = null
    if (email !== 'vtr.techh@gmail.com') {
      try {
        userEvent = await calendar.events.insert({
          auth: oauth2Client,
          calendarId: email,
          resource: {
            ...eventData,
            summary: `Reunión con V1tr0 - ${name}`,
            description: `Reunión agendada con V1tr0.\n\nConsulta sobre desarrollo web y servicios digitales.\n\nContacto V1tr0: vtr.techh@gmail.com`
          },
          conferenceDataVersion: 1,
          sendUpdates: 'all'
        })
      } catch (userError) {
        console.warn('No se pudo crear evento en calendario del usuario:', userError.message)
        // Continuar sin fallar si no se puede acceder al calendario del usuario
      }
    }

    const meetLink = primaryEvent.data.conferenceData?.entryPoints?.find(
      entry => entry.entryPointType === 'video'
    )?.uri || null

    return {
      id: primaryEvent.data.id,
      summary: primaryEvent.data.summary,
      start: primaryEvent.data.start,
      end: primaryEvent.data.end,
      meetLink: meetLink,
      htmlLink: primaryEvent.data.htmlLink,
      userEventId: userEvent?.data?.id || null
    }
  })
}

// Función para enviar correos de confirmación
async function sendConfirmationEmails(date: string, time: string, email: string, name: string, phone: string, meetLink: string | null, eventLink: string | null) {
  const transporter = createTransport()
  
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Correo para el cliente
  const clientEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reunión Confirmada - V1tr0</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #020B0A;">
      <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #020B0A 0%, #02505931 100%); color: #26FFDF;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #08A696 0%, #26FFDF 100%); padding: 30px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">V1tr0</h1>
          <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Desarrollo Web Profesional</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <div style="background: rgba(8, 166, 150, 0.1); border: 1px solid rgba(8, 166, 150, 0.2); border-radius: 16px; padding: 30px; margin-bottom: 30px;">
            <h2 style="margin: 0 0 20px 0; color: #26FFDF; font-size: 24px;">¡Reunión Confirmada!</h2>
            <p style="margin: 0 0 20px 0; color: rgba(38, 255, 223, 0.8); font-size: 16px; line-height: 1.6;">
              Tu reunión ha sido agendada exitosamente. Nos pondremos en contacto contigo para confirmar los detalles.
            </p>
            
            <div style="background: rgba(38, 255, 223, 0.1); border-radius: 12px; padding: 20px; margin: 20px 0;">
              <h3 style="margin: 0 0 15px 0; color: #26FFDF; font-size: 18px;">Detalles de la Reunión:</h3>
              <p style="margin: 5px 0; color: #26FFDF;"><strong>Fecha:</strong> ${formatDate(date)}</p>
              <p style="margin: 5px 0; color: #26FFDF;"><strong>Hora:</strong> ${time}</p>
              <p style="margin: 5px 0; color: #26FFDF;"><strong>Duración:</strong> 30 minutos</p>
              ${meetLink ? `<p style="margin: 15px 0 5px 0; color: #26FFDF;"><strong>Enlace de Google Meet:</strong></p>
              <a href="${meetLink}" style="display: inline-block; background: linear-gradient(135deg, #08A696 0%, #26FFDF 100%); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin: 5px 0;">🎥 Unirse a la Reunión</a>` : ''}
              ${eventLink ? `<p style="margin: 15px 0 5px 0; color: #26FFDF;"><strong>Agregar al Calendario:</strong></p>
              <a href="${eventLink}" style="display: inline-block; background: rgba(8, 166, 150, 0.2); color: #26FFDF; text-decoration: none; padding: 10px 20px; border-radius: 8px; border: 1px solid rgba(8, 166, 150, 0.3); margin: 5px 0;">📅 Ver en Google Calendar</a>` : ''}
            </div>
            
            <p style="margin: 20px 0 0 0; color: rgba(38, 255, 223, 0.7); font-size: 14px;">
              Si necesitas reprogramar o cancelar, responde a este correo.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: rgba(8, 166, 150, 0.1); padding: 20px 30px; text-align: center; border-top: 1px solid rgba(8, 166, 150, 0.2);">
          <p style="margin: 0; color: rgba(38, 255, 223, 0.6); font-size: 14px;">
            © 2024 V1tr0. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  // Correo para V1tr0
  const internalEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nueva Reunión Agendada - V1tr0</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #020B0A;">
      <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #020B0A 0%, #02505931 100%); color: #26FFDF;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #08A696 0%, #26FFDF 100%); padding: 30px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">V1tr0</h1>
          <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Sistema de Agendamiento</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <div style="background: rgba(8, 166, 150, 0.1); border: 1px solid rgba(8, 166, 150, 0.2); border-radius: 16px; padding: 30px;">
            <h2 style="margin: 0 0 20px 0; color: #26FFDF; font-size: 24px;">Nueva Reunión Agendada</h2>
            
            <div style="background: rgba(38, 255, 223, 0.1); border-radius: 12px; padding: 20px; margin: 20px 0;">
              <h3 style="margin: 0 0 15px 0; color: #26FFDF; font-size: 18px;">Detalles:</h3>
              <p style="margin: 5px 0; color: #26FFDF;"><strong>Fecha:</strong> ${formatDate(date)}</p>
              <p style="margin: 5px 0; color: #26FFDF;"><strong>Hora:</strong> ${time}</p>
              <p style="margin: 5px 0; color: #26FFDF;"><strong>Cliente:</strong> ${name}</p>
              <p style="margin: 5px 0; color: #26FFDF;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0; color: #26FFDF;"><strong>Teléfono:</strong> ${phone}</p>
              <p style="margin: 5px 0; color: #26FFDF;"><strong>Duración:</strong> 30 minutos</p>
              ${meetLink ? `<p style="margin: 15px 0 5px 0; color: #26FFDF;"><strong>Google Meet:</strong></p>
              <a href="${meetLink}" style="display: inline-block; background: linear-gradient(135deg, #08A696 0%, #26FFDF 100%); color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin: 5px 0;">🎥 Enlace de la Reunión</a>` : ''}
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    // Enviar correo al cliente
    await transporter.sendMail({
      from: `"V1tr0 - Desarrollo Web" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: '✅ Reunión Confirmada - V1tr0',
      html: clientEmailHtml,
    })

    // Enviar correo interno
    await transporter.sendMail({
      from: `"Sistema V1tr0" <${process.env.SMTP_FROM}>`,
      to: 'buzon@v1tr0.com',
      subject: '📅 Nueva Reunión Agendada',
      html: internalEmailHtml,
    })

    console.log('Correos de confirmación enviados exitosamente')
  } catch (error) {
    console.error('Error enviando correos:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const { date, time, email, name, phone } = await request.json()

    // Validar datos requeridos
    if (!date || !time || !email || !name || !phone) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos: fecha, hora, email, nombre y teléfono son obligatorios' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      )
    }

    // Validar que el nombre no esté vacío
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'El nombre debe tener al menos 2 caracteres' },
        { status: 400 }
      )
    }

    // Validar formato básico de teléfono
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,}$/
    if (!phoneRegex.test(phone.trim())) {
      return NextResponse.json(
        { error: 'Formato de teléfono inválido' },
        { status: 400 }
      )
    }

    // Verificar conflictos antes de crear la reunión
    const conflictCheck = await checkTimeSlotConflicts(date, time)
    if (conflictCheck.hasConflicts) {
      return NextResponse.json(
        { 
          error: 'El horario seleccionado ya está ocupado. Por favor, selecciona otro horario disponible.',
          conflictingEvents: conflictCheck.conflictingEvents
        },
        { status: 409 } // Conflict status code
      )
    }

    // Crear evento en Google Calendar con integración dual
    const calendarEvent = await createCalendarEvent(date, time, email, name.trim(), phone.trim())

    // Guardar en Supabase
    const supabaseDB = new SupabaseMeetingsDB()
    
    // Buscar o crear cliente
    const client = await supabaseDB.findOrCreateClient({
      name: name.trim(),
      email: email,
      phone: phone.trim()
    })

    // Guardar reunión (sin meet_link por ahora hasta que se agregue la columna)
    const meeting = await supabaseDB.saveMeeting({
      client_id: client.id,
      date: date,
      time: time,
      duration: 30,
      title: `Reunión con ${name.trim()}`,
      description: `Reunión de consultoría con ${name.trim()}`,
      status: 'confirmed',
      google_calendar_event_id: calendarEvent.id
    })

    if (!meeting) {
      throw new Error('Error al guardar la reunión en la base de datos')
    }

    // Enviar correos de confirmación con enlaces de Meet
    await sendConfirmationEmails(
      date, 
      time, 
      email, 
      name.trim(), 
      phone.trim(), 
      calendarEvent.meetLink, 
      calendarEvent.htmlLink
    )

    return NextResponse.json({
      success: true,
      message: 'Reunión agendada exitosamente en Google Calendar y Supabase',
      eventId: calendarEvent.id,
      userEventId: calendarEvent.userEventId,
      meetingId: meeting.id,
      clientId: client.id,
      meetLink: calendarEvent.meetLink,
      calendarLink: calendarEvent.htmlLink
    })
  } catch (error) {
    console.error('Error en schedule-meeting:', error)
    
    // Manejar errores específicos de Google Calendar
    if (error.message?.includes('insufficient authentication scopes')) {
      return NextResponse.json(
        { error: 'Error de autenticación con Google Calendar. Contacte al administrador.' },
        { status: 503 }
      )
    }
    
    if (error.message?.includes('quota')) {
      return NextResponse.json(
        { error: 'Límite de API alcanzado. Intente nuevamente en unos minutos.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor. Intente nuevamente.' },
      { status: 500 }
    )
  }
}