import { NextRequest, NextResponse } from 'next/server'
import { supabaseMeetingsDB } from '@/lib/supabase-meetings-db'
import { createClient } from '@/lib/supabase/server'
import type { ClientInput, Meeting } from '@/lib/supabase-meetings-db'

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
        // Procesar múltiples fechas para obtener slots disponibles
        
        try {
          // Intentar decodificar URL si es necesario
          let decodedDates = dates
          try {
            decodedDates = decodeURIComponent(dates)
          } catch {
            // Decode failed, use original
          }
          
          const dateList = JSON.parse(decodedDates) as string[]
          
          if (!Array.isArray(dateList)) {
            throw new Error('Parsed dates is not an array')
          }
          
          const batchResults: Record<string, string[]> = {}
          
          // Procesar todas las fechas en paralelo
          const promises = dateList.map(async (dateStr) => {
            try {
              const slots = await supabaseMeetingsDB.getAvailableTimeSlots(dateStr)
              return { date: dateStr, slots, success: true }
            } catch (err: unknown) {
              const errorMessage = err instanceof Error ? err.message : 'Unknown error'
              return { date: dateStr, slots: [], success: false, error: errorMessage }
            }
          })
          
          const results = await Promise.all(promises)
          
          let hasErrors = false
          results.forEach(({ date: dateStr, slots, success }) => {
            if (success) {
              batchResults[dateStr] = slots
            } else {
              hasErrors = true
            }
          })
          
          if (hasErrors) {
            throw new Error('One or more dates failed to process')
          }
          
          return NextResponse.json({ success: true, batchResults })
        } catch (error) {
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
    
  } catch (error: unknown) {
    console.error('Error en GET /api/meetings:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Helper function to create project meetings
async function createProjectMeeting(request: NextRequest, body: any) {
  const { title, project_id, start_time } = body;
  
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Check access to project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, client_id, title')
    .eq('id', project_id)
    .single()

  if (projectError || !project) {
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    )
  }

  // Get user role
  const { data: profileData } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAdmin = profileData?.role === 'admin'
  const isClient = project.client_id === user.id

  if (!isAdmin && !isClient) {
    return NextResponse.json(
      { error: 'Access denied to project' },
      { status: 403 }
    )
  }

  // Create meeting
  const { data: meeting, error: meetingError } = await supabase
    .from('meetings')
    .insert({
      title,
      project_id,
      start_time,
      status: 'scheduled',
      created_by: user.id,
    })
    .select(`
      *,
      project:project_id(id, title, client_id)
    `)
    .single()

  if (meetingError) {
    console.error('Database error:', meetingError)
    return NextResponse.json(
      { error: 'Failed to create meeting' },
      { status: 500 }
    )
  }

  return NextResponse.json(meeting, { status: 201 })
}

// POST - Crear nueva reunión
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is a project meeting creation request
    if (body.title && body.project_id && body.start_time) {
      return await createProjectMeeting(request, body)
    }
    
    // Legacy format for website meeting scheduling
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
      const newClient: ClientInput = {
        name: clientName,
        email: clientEmail,
        phone: clientPhone || ''
      };
      const savedClient = await supabaseMeetingsDB.saveClient(newClient);
      client = savedClient || undefined;
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

  } catch (error: unknown) {
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