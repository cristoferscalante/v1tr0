import { NextRequest, NextResponse } from 'next/server'
import { supabaseMeetingsDB } from '@/lib/supabase-meetings-db'
import type { Client, Meeting } from '@/lib/supabase-meetings-db'

// GET - Obtener reuniones
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const date = searchParams.get('date')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const email = searchParams.get('email')
    
    // Endpoint para obtener horarios disponibles
    if (action === 'available-slots') {
      if (date) {
        // Consulta individual por fecha
        const availableSlots = await supabaseMeetingsDB.getAvailableTimeSlots(date)
        return NextResponse.json({ success: true, availableSlots })
      }
      
      // Consulta en lote para múltiples fechas
      const dates = searchParams.get('dates')
      if (dates) {
        // Debug logs para ver exactamente qué se está recibiendo
        console.log('🔍 [DEBUG] Raw dates parameter:', dates)
        console.log('🔍 [DEBUG] dates type:', typeof dates)
        console.log('🔍 [DEBUG] dates length:', dates.length)
        console.log('🔍 [DEBUG] First 100 chars:', dates.substring(0, 100))
        
        try {
          // Intentar decodificar URL si es necesario
          let decodedDates = dates
          try {
            decodedDates = decodeURIComponent(dates)
            console.log('🔍 [DEBUG] Decoded dates:', decodedDates)
          } catch (decodeError) {
            console.log('🔍 [DEBUG] No need to decode or decode failed:', decodeError)
          }
          
          const dateList = JSON.parse(decodedDates) as string[]
          console.log('🔍 [DEBUG] Parsed dateList:', dateList)
          console.log('🔍 [DEBUG] dateList type:', typeof dateList)
          console.log('🔍 [DEBUG] dateList is array:', Array.isArray(dateList))
          
          if (!Array.isArray(dateList)) {
            throw new Error('Parsed dates is not an array')
          }
          
          const batchResults: Record<string, string[]> = {}
          
          // Procesar todas las fechas en paralelo
          const promises = dateList.map(async (dateStr) => {
            console.log('🔍 [DEBUG] Processing date:', dateStr)
            try {
              const slots = await supabaseMeetingsDB.getAvailableTimeSlots(dateStr)
              console.log('🔍 [DEBUG] Slots for', dateStr, ':', slots.length, 'slots')
              return { date: dateStr, slots, success: true }
            } catch (error) {
              console.error('❌ [ERROR] Error processing date', dateStr, ':', error)
              return { date: dateStr, slots: [], success: false, error: error.message }
            }
          })
          
          console.log('🔍 [DEBUG] Waiting for all promises to resolve...')
          const results = await Promise.all(promises)
          console.log('🔍 [DEBUG] All promises resolved, processing results...')
          
          let hasErrors = false
          results.forEach(({ date: dateStr, slots, success, error }) => {
            if (success) {
              batchResults[dateStr] = slots
              console.log('🔍 [DEBUG] Added slots for', dateStr, ':', slots.length)
            } else {
              console.error('❌ [ERROR] Failed to process date', dateStr, ':', error)
              hasErrors = true
            }
          })
          
          if (hasErrors) {
            throw new Error('One or more dates failed to process')
          }
          
          console.log('🔍 [DEBUG] Final batchResults:', Object.keys(batchResults))
          return NextResponse.json({ success: true, batchResults })
        } catch (error) {
          console.error('❌ [ERROR] Error parsing dates:', error)
          console.error('❌ [ERROR] Original dates parameter:', dates)
          console.error('❌ [ERROR] Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
          })
          return NextResponse.json(
            { 
              success: false, 
              error: 'Invalid dates format',
              debug: {
                receivedDates: dates,
                errorMessage: error instanceof Error ? error.message : 'Unknown error'
              }
            },
            { status: 400 }
          )
        }
      }
      
      return NextResponse.json(
        { success: false, error: 'Date or dates parameter required' },
        { status: 400 }
      )
    }
    
    if (date) {
      // Obtener reuniones de una fecha específica
      const meetings = await supabaseMeetingsDB.getMeetingsByDate(date)
      return NextResponse.json({ success: true, meetings })
    }
    
    if (startDate && endDate) {
      // Obtener reuniones en un rango de fechas
      const meetings = await supabaseMeetingsDB.getMeetingsByDateRange(startDate, endDate)
      return NextResponse.json({ success: true, meetings })
    }
    
    if (email) {
      // Obtener reuniones de un cliente específico
      const meetings = await supabaseMeetingsDB.getMeetings()
      const filteredMeetings = meetings.filter(m => m.clientEmail === email)
      return NextResponse.json({ success: true, meetings: filteredMeetings })
    }
    
    // Obtener todas las reuniones
    const meetings = await supabaseMeetingsDB.getMeetings()
    return NextResponse.json({ success: true, meetings })
    
  } catch (error) {
    console.error('Error al obtener reuniones:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva reunión
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, time, clientName, clientEmail, clientPhone, meetingType, notes } = body;

    // Validaciones básicas
    if (!date || !time || !clientName || !clientEmail) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios: date, time, clientName, clientEmail' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      return NextResponse.json(
        { success: false, error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Verificar disponibilidad del horario
    const availability = await supabaseMeetingsDB.canScheduleAt(date, time);
    if (!availability.canSchedule) {
      return NextResponse.json(
        { success: false, error: availability.reason || 'El horario seleccionado no está disponible' },
        { status: 409 }
      );
    }

    // Buscar o crear cliente
    const clients = await supabaseMeetingsDB.getClients();
    let client = clients.find(c => c.email === clientEmail);
    if (!client) {
      const newClient: Omit<Client, 'id' | 'created_at' | 'updated_at'> = {
        name: clientName,
        email: clientEmail,
        phone: clientPhone || ''
      };
      client = await supabaseMeetingsDB.saveClient(newClient);
      if (!client) {
        return NextResponse.json(
          { success: false, error: 'Error al crear el cliente' },
          { status: 500 }
        );
      }
    }

    // Crear la reunión
    const newMeeting: Omit<Meeting, 'id' | 'created_at' | 'updated_at'> = {
      client_id: client.id,
      date,
      time,
      meeting_type: meetingType || 'consultation',
      status: 'confirmed',
      notes: notes || ''
    };

    const savedMeeting = await supabaseMeetingsDB.saveMeeting(newMeeting);

    return NextResponse.json({
      success: true,
      meeting: savedMeeting,
      message: 'Reunión agendada exitosamente'
    });

  } catch (error) {
    console.error('Error en POST /api/meetings:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar reunión existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de reunión requerido' },
        { status: 400 }
      );
    }

    // Si se está actualizando fecha/hora, verificar disponibilidad
    if (updateData.date && updateData.time) {
      const availability = await supabaseMeetingsDB.canScheduleAt(updateData.date, updateData.time);
      if (!availability.canSchedule) {
        return NextResponse.json(
          { success: false, error: availability.reason || 'El nuevo horario no está disponible' },
          { status: 409 }
        );
      }
    }

    const updatedMeeting = await supabaseMeetingsDB.updateMeeting(id, updateData);

    if (!updatedMeeting) {
      return NextResponse.json(
        { success: false, error: 'Reunión no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      meeting: updatedMeeting,
      message: 'Reunión actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error en PUT /api/meetings:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar/cancelar reunión
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de reunión requerido' },
        { status: 400 }
      );
    }

    const deleted = await supabaseMeetingsDB.deleteMeeting(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Reunión no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Reunión cancelada exitosamente'
    });

  } catch (error) {
    console.error('Error en DELETE /api/meetings:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}