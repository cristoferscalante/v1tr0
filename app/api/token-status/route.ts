import { NextRequest, NextResponse } from 'next/server';
import { getAutoRenewalStatus, forceRenewalCheck } from '@/lib/auto-token-renewal';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    const status = getAutoRenewalStatus();
    const currentToken = process.env.GOOGLE_ACCESS_TOKEN;
    
    // Verificar si el token actual es válido
    let tokenValid = false;
    if (currentToken) {
      try {
        const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=1', {
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Accept': 'application/json'
          }
        });
        tokenValid = response.status === 200;
      } catch (error) {
        console.error('Error verificando token:', error);
      }
    }
    
    return NextResponse.json({
      autoRenewal: {
        isRunning: status.isRunning,
        lastCheck: new Date(status.lastCheck).toISOString(),
        nextCheck: new Date(status.nextCheck).toISOString(),
        minutesUntilNextCheck: Math.max(0, Math.floor((status.nextCheck - Date.now()) / (1000 * 60)))
      },
      token: {
        isValid: tokenValid,
        hasAccessToken: !!currentToken,
        hasRefreshToken: !!process.env.GOOGLE_REFRESH_TOKEN,
        accessTokenLength: currentToken?.length || 0
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error obteniendo estado de tokens:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'force-check') {
      console.error('[API] Forzando verificación de tokens...');
      const renewed = await forceRenewalCheck();
      
      return NextResponse.json({
        success: true,
        renewed,
        message: renewed ? 'Token renovado exitosamente' : 'Token válido, no se renovó',
        timestamp: new Date().toISOString()
      });
    }
    
    return NextResponse.json(
      { error: 'Acción no válida' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Error ejecutando acción:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
