import { NextResponse } from 'next/server';

// NOTA: Este endpoint está deshabilitado temporalmente
// La gestión de clientes será migrada al nuevo sistema de ecommerce

export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Este endpoint está siendo migrado. Por favor, usa el nuevo sistema de gestión de clientes.' 
    },
    { status: 503 }
  );
}

export async function POST() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Este endpoint está siendo migrado. Por favor, usa el nuevo sistema de gestión de clientes.' 
    },
    { status: 503 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Este endpoint está siendo migrado. Por favor, usa el nuevo sistema de gestión de clientes.' 
    },
    { status: 503 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Este endpoint está siendo migrado. Por favor, usa el nuevo sistema de gestión de clientes.' 
    },
    { status: 503 }
  );
}
