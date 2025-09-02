import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { withValidToken } from '@/lib/google-auth'

// Configuración de Google Calendar
const calendar = google.calendar('v3')

// Función para obtener eventos ocupados en un rango de fechas s
async function getBusyTimes(startDate: string, endDate: string) {
  return await withValidToken(async (accessToken: string) => {
    // Configurar OAuth2 Client con el token válido
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )
    
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN || null,
    })

    const response = await calendar.events.list({
      auth: oauth2Client,
      calendarId: 'vtr.techh@gmail.com',
      timeMin: new Date(startDate).toISOString(),
      timeMax: new Date(endDate).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    })

    const events = response.data.items || []
    const busyTimes = events
      .filter(event => event.start?.dateTime && event.end?.dateTime)
      .map(event => ({
        start: event.start!.dateTime!,
        end: event.end!.dateTime!,
        summary: event.summary || 'Evento ocupado'
      }))

    return busyTimes
  })
}

// Función para generar horarios disponibles
function generateAvailableSlots(date: string, busyTimes: { start: string; end: string; summary: string }[]) {
  const slots = []
  // Horarios de trabajo: 2:00 PM - 6:00 PM únicamente
  const workingHours = [
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ]

  const now = new Date()
  const targetDate = new Date(date)
  const isToday = targetDate.toDateString() === now.toDateString()

  for (const time of workingHours) {
    const [hour, minute] = time.split(':')
    const slotStart = new Date(date)
    slotStart.setHours(parseInt(hour || '0'), parseInt(minute || '0'), 0, 0)
    const slotEnd = new Date(slotStart.getTime() + 30 * 60000) // 30 minutos

    // Verificar si el slot está ocupado por eventos existentes
    const isOccupied = busyTimes.some(busy => {
      const busyStart = new Date(busy.start)
      const busyEnd = new Date(busy.end)
      
      // Verificar si hay solapamiento
      return (
        (slotStart >= busyStart && slotStart < busyEnd) ||
        (slotEnd > busyStart && slotEnd <= busyEnd) ||
        (slotStart <= busyStart && slotEnd >= busyEnd)
      )
    })

    // Verificar si el slot ya pasó (solo para el día actual)
    // Agregar 5 minutos de buffer para evitar conflictos de tiempo
    const hasPassed = isToday && slotStart <= new Date(now.getTime() + 5 * 60000)

    slots.push({
      time,
      available: !isOccupied && !hasPassed,
      occupied: isOccupied,
      passed: hasPassed
    })
  }

  return slots
}

// Función para generar días laborales (excluyendo fines de semana)
function getWorkingDays(startDate: Date, numberOfDays: number) {
  const workingDays = []
  const currentDate = new Date(startDate)
  
  while (workingDays.length < numberOfDays) {
    const dayOfWeek = currentDate.getDay()
    
    // Excluir sábados (6) y domingos (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays.push(new Date(currentDate))
    }
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return workingDays
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requestedDays = parseInt(searchParams.get('days') || '10')
    
    // Limitar a máximo 14 días para evitar sobrecarga
    const days = Math.min(requestedDays, 14)
    
    // Obtener días laborales a partir de hoy
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const workingDays = getWorkingDays(today, days)
    
    // Calcular rango de fechas para consultar eventos
    const startDate = workingDays[0]
    if (!startDate) {
      throw new Error('No working days found')
    }
    const lastWorkingDay = workingDays[workingDays.length - 1]
    if (!lastWorkingDay) {
      throw new Error('No working days found')
    }
    const endDate = new Date(lastWorkingDay)
    endDate.setHours(23, 59, 59, 999)
    
    // Obtener eventos ocupados del calendario
    const busyTimes = await getBusyTimes(
      startDate.toISOString(),
      endDate.toISOString()
    )
    
    // Generar disponibilidad para cada día
    const availability = workingDays.map(date => {
      const dateStr = date.toISOString().split('T')[0] || ''
      const dayBusyTimes = busyTimes.filter(busy => {
        const busyDate = new Date(busy.start).toISOString().split('T')[0] || ''
        return busyDate === dateStr
      })
      
      return {
        date: dateStr,
        dayName: date.toLocaleDateString('es-ES', { weekday: 'long' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('es-ES', { month: 'long' }),
        slots: generateAvailableSlots(dateStr, dayBusyTimes),
        hasAvailableSlots: generateAvailableSlots(dateStr, dayBusyTimes).some(slot => slot.available)
      }
    })
    
    return NextResponse.json({
      success: true,
      availability,
      totalDays: days,
      busyEventsCount: busyTimes.length,
      lastUpdated: new Date().toISOString()
    })
    
  } catch (error: unknown) {
    // Manejar errores específicos de Google Calendar
    const errorMessage = error instanceof Error ? error.message : ''
    if (errorMessage.includes('insufficient authentication scopes')) {
      return NextResponse.json(
        { error: 'Error de autenticación con Google Calendar' },
        { status: 503 }
      )
    }
    
    if (errorMessage.includes('quota')) {
      return NextResponse.json(
        { error: 'Límite de API alcanzado. Intente nuevamente en unos minutos.' },
        { status: 429 }
      )
    }
    
    // En caso de error, devolver disponibilidad estática como fallback
    const today = new Date()
    const workingDays = getWorkingDays(today, 10)
    
    const fallbackAvailability = workingDays.map(date => {
      const dateStr = date.toISOString().split('T')[0] || ''
      return {
        date: dateStr,
        dayName: date.toLocaleDateString('es-ES', { weekday: 'long' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('es-ES', { month: 'long' }),
        slots: generateAvailableSlots(dateStr, []), // Sin eventos ocupados
        hasAvailableSlots: true
      }
    })
    
    return NextResponse.json({
      success: false,
      availability: fallbackAvailability,
      error: 'Usando disponibilidad estática debido a error en la API',
      fallback: true
    })
  }
}