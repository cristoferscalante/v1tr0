/**
 * Sistema de Auto-Renovación de Tokens de Google
 * 
 * Este módulo maneja la renovación automática y periódica de tokens
 */

import { refreshGoogleToken } from './google-auth';

let autoRenewalInterval: NodeJS.Timeout | null = null;
let lastRenewalCheck = 0;

/**
 * Verifica si un token es válido
 */
async function isTokenValid(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=1', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('[AUTO-RENEWAL] Error verificando token:', error);
    return false;
  }
}

/**
 * Obtiene información del token actual
 */
async function getTokenInfo(accessToken: string): Promise<{ valid: boolean; expiresIn?: number }> {
  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
    const data = await response.json();
    
    if (response.ok && data.expires_in) {
      return {
        valid: true,
        expiresIn: parseInt(data.expires_in)
      };
    }
    
    return { valid: false };
  } catch (error) {
    console.error('[AUTO-RENEWAL] Error obteniendo info del token:', error);
    return { valid: false };
  }
}

/**
 * Intenta renovar el token automáticamente
 */
async function attemptTokenRenewal(): Promise<boolean> {
  const currentTime = Date.now();
  
  // Evitar renovaciones muy frecuentes (mínimo 5 minutos)
  if (currentTime - lastRenewalCheck < 5 * 60 * 1000) {
    return false;
  }
  
  lastRenewalCheck = currentTime;
  
  try {
    const currentToken = process.env.GOOGLE_ACCESS_TOKEN;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    
    if (!currentToken || !refreshToken) {
      console.error('[AUTO-RENEWAL] Tokens faltantes, no se puede renovar automáticamente');
      return false;
    }
    
    console.error('[AUTO-RENEWAL] Verificando necesidad de renovación...');
    
    // Verificar si el token actual es válido
    const isValid = await isTokenValid(currentToken);
    
    if (isValid) {
      // Token válido, verificar si está próximo a expirar
      const tokenInfo = await getTokenInfo(currentToken);
      
      if (tokenInfo.valid && tokenInfo.expiresIn) {
        // Si expira en menos de 10 minutos, renovar
        if (tokenInfo.expiresIn < 600) {
          console.error(`[AUTO-RENEWAL] Token expira en ${tokenInfo.expiresIn} segundos, renovando...`);
        } else {
          console.error(`[AUTO-RENEWAL] Token válido, expira en ${Math.floor(tokenInfo.expiresIn / 60)} minutos`);
          return false;
        }
      } else {
        console.error('[AUTO-RENEWAL] Token válido pero no se pudo obtener info de expiración');
        return false;
      }
    } else {
      console.error('[AUTO-RENEWAL] Token inválido, renovando...');
    }
    
    // Intentar renovación
    const newAccessToken = await refreshGoogleToken();
    
    if (newAccessToken) {
      console.error('[AUTO-RENEWAL] ✅ Token renovado automáticamente');
      
      // El token se actualiza automáticamente en las variables de entorno
      // por la función refreshGoogleToken()
      
      return true;
    }
    
    return false;
    
  } catch (error) {
    console.error('[AUTO-RENEWAL] ❌ Error en renovación automática:', error);
    return false;
  }
}

/**
 * Inicia el sistema de auto-renovación
 */
export function startAutoRenewal(): void {
  if (autoRenewalInterval) {
    console.error('[AUTO-RENEWAL] Sistema ya iniciado');
    return;
  }
  
  console.error('[AUTO-RENEWAL] 🚀 Iniciando sistema de auto-renovación');
  
  // Verificar inmediatamente
  attemptTokenRenewal().catch(error => {
    console.error('[AUTO-RENEWAL] Error en verificación inicial:', error);
  });
  
  // Configurar verificación cada 5 minutos
  autoRenewalInterval = setInterval(() => {
    attemptTokenRenewal().catch(error => {
      console.error('[AUTO-RENEWAL] Error en verificación periódica:', error);
    });
  }, 5 * 60 * 1000); // 5 minutos
  
  console.error('[AUTO-RENEWAL] ✅ Sistema configurado para verificar cada 5 minutos');
}

/**
 * Detiene el sistema de auto-renovación
 */
export function stopAutoRenewal(): void {
  if (autoRenewalInterval) {
    clearInterval(autoRenewalInterval);
    autoRenewalInterval = null;
    console.error('[AUTO-RENEWAL] 🛑 Sistema de auto-renovación detenido');
  }
}

/**
 * Fuerza una verificación inmediata
 */
export async function forceRenewalCheck(): Promise<boolean> {
  console.error('[AUTO-RENEWAL] 🔄 Forzando verificación inmediata...');
  lastRenewalCheck = 0; // Reset del throttle
  return await attemptTokenRenewal();
}

/**
 * Obtiene el estado del sistema de auto-renovación
 */
export function getAutoRenewalStatus(): {
  isRunning: boolean;
  lastCheck: number;
  nextCheck: number;
} {
  return {
    isRunning: autoRenewalInterval !== null,
    lastCheck: lastRenewalCheck,
    nextCheck: lastRenewalCheck + (5 * 60 * 1000)
  };
}
