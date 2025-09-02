import { NextRequest, NextResponse } from 'next/server';
import { localMeetingsDB } from '@/lib/local-meetings-db';

// GET - Obtener clientes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const search = searchParams.get('search');

    // Buscar cliente por email
    if (email) {
      const client = localMeetingsDB.getClientByEmail(email);
      if (!client) {
        return NextResponse.json(
          { success: false, error: 'Cliente no encontrado' },
          { status: 404 }
        );
      }
      return NextResponse.json({ 
        success: true, 
        client 
      });
    }

    // Buscar clientes por término de búsqueda
    if (search) {
      const clients = localMeetingsDB.getClients().filter(client => 
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.email.toLowerCase().includes(search.toLowerCase()) ||
        (client.company && client.company.toLowerCase().includes(search.toLowerCase()))
      );
      return NextResponse.json({ 
        success: true, 
        clients,
        count: clients.length 
      });
    }

    // Obtener todos los clientes
    const allClients = localMeetingsDB.getClients();
    return NextResponse.json({ 
      success: true, 
      clients: allClients,
      count: allClients.length 
    });

  } catch (error: unknown) {
    console.error('Error en GET /api/clients:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear o actualizar cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company } = body;

    // Validaciones básicas
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Nombre y email son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    const clientData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim(),
      company: company?.trim()
    };

    const savedClient = localMeetingsDB.saveClient(clientData);

    return NextResponse.json({
      success: true,
      client: savedClient,
      message: 'Cliente guardado exitosamente'
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Error en POST /api/clients:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar cliente existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, ...updates } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email del cliente requerido' },
        { status: 400 }
      );
    }

    const existingClient = localMeetingsDB.getClientByEmail(email);
    if (!existingClient) {
      return NextResponse.json(
        { success: false, error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    const updatedClientData = {
      ...existingClient,
      ...updates,
      email, // Mantener el email original
      updatedAt: new Date().toISOString()
    };

    const updatedClient = localMeetingsDB.saveClient(updatedClientData);

    return NextResponse.json({
      success: true,
      client: updatedClient,
      message: 'Cliente actualizado exitosamente'
    });

  } catch (error: unknown) {
    console.error('Error en PUT /api/clients:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar cliente
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email del cliente requerido' },
        { status: 400 }
      );
    }

    // Verificar si el cliente tiene reuniones programadas
    const clientMeetings = localMeetingsDB.getMeetings().filter(
      meeting => meeting.clientEmail === email && meeting.status === 'scheduled'
    );

    if (clientMeetings.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No se puede eliminar cliente con reuniones programadas',
          meetingsCount: clientMeetings.length
        },
        { status: 409 }
      );
    }

    const deleted = localMeetingsDB.deleteClient(email);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cliente eliminado exitosamente'
    });

  } catch (error: unknown) {
    console.error('Error en DELETE /api/clients:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}