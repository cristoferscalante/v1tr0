import fs from 'fs';
import path from 'path';

interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

/**
 * Renueva el access token usando el refresh token
 */
export async function refreshGoogleToken(): Promise<string> {
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  console.error('[DEBUG] Iniciando refresh de token de Google...');
  console.error('[DEBUG] Configuración:', {
    hasRefreshToken: !!refreshToken,
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    refreshTokenLength: refreshToken?.length || 0
  });

  if (!refreshToken || !clientId || !clientSecret) {
    console.error('[ERROR] Missing required Google OAuth credentials');
    throw new Error('Missing required Google OAuth credentials');
  }

  // Verificar si el refresh token parece ser un placeholder
  if (refreshToken.includes('your_') || refreshToken.includes('placeholder') || refreshToken.length < 80) {
    console.error('[ERROR] GOOGLE_REFRESH_TOKEN appears to be a placeholder');
    throw new Error('GOOGLE_REFRESH_TOKEN appears to be a placeholder. Please configure valid OAuth2 credentials.');
  }

  console.error('[DEBUG] Enviando solicitud de refresh token a Google...');
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  console.error('[DEBUG] Respuesta de Google recibida:', response.status);

  if (!response.ok) {
    const error = await response.text();
    console.error('[ERROR] Failed to refresh token:', error);
    
    try {
      const errorData = JSON.parse(error);
      
      if (errorData.error === 'invalid_grant') {
        console.error('[ERROR] Refresh token has expired or is invalid');
        throw new Error('Refresh token has expired or is invalid. Please re-authenticate with Google OAuth2 to generate new tokens.');
      }
      
      console.error('[ERROR] Google API error:', errorData);
      throw new Error(`Failed to refresh token: ${errorData.error} - ${errorData.error_description || 'Unknown error'}`);
    } catch (parseError) {
      console.error('[ERROR] Failed to parse error response:', parseError);
      throw new Error(`Failed to refresh token: ${error}`);
    }
  }

  const data: RefreshTokenResponse = await response.json();
  
  console.error('[DEBUG] Token refresh exitoso, nuevo access_token recibido');
  
  if (!data.access_token) {
    console.error('[ERROR] No access token received from refresh');
    throw new Error('No access token received from refresh');
  }

  // Actualizar el archivo .env.local con el nuevo token
  await updateEnvFile('GOOGLE_ACCESS_TOKEN', data.access_token);
  
  console.error('[DEBUG] Access token actualizado en .env.local');
  return data.access_token;
}

/**
 * Actualiza una variable en el archivo .env.local
 */
async function updateEnvFile(key: string, value: string): Promise<void> {
  const envPath = path.join(process.cwd(), '.env.local');
  
  try {
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    const lines = envContent.split('\n');
    let found = false;

    // Buscar y actualizar la línea existente
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line && line.startsWith(`${key}=`)) {
        lines[i] = `${key}=${value}`;
        found = true;
        break;
      }
    }

    // Si no se encontró, agregar al final
    if (!found) {
      lines.push(`${key}=${value}`);
    }

    // Escribir el archivo actualizado
    fs.writeFileSync(envPath, lines.join('\n'));
  } catch {
    // No lanzar error para no interrumpir el flujo principal
  }
}

/**
 * Prueba si un access token es válido haciendo una llamada simple a la API
 */
async function testTokenValidity(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=1', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });
    
    console.error('[DEBUG] Respuesta de prueba de token:', response.status);
    return response.status === 200;
  } catch (error) {
    console.error('[DEBUG] Error probando token:', error);
    return false;
  }
}

/**
 * Obtiene un token de acceso válido, renovándolo automáticamente si es necesario
 */
export async function getValidAccessToken(): Promise<string> {
  const currentToken = process.env.GOOGLE_ACCESS_TOKEN;
  
  console.error('[DEBUG] Verificando validez del access token...');
  console.error('[DEBUG] Token info:', {
    hasAccessToken: !!currentToken,
    hasRefreshToken: !!process.env.GOOGLE_REFRESH_TOKEN,
    accessTokenLength: currentToken?.length || 0
  });

  // Si no hay token, intentar renovar inmediatamente
  if (!currentToken) {
    console.error('[DEBUG] No hay access token, renovando...');
    return await refreshGoogleToken();
  }

  // Probar si el token actual funciona
  console.error('[DEBUG] Probando validez del token actual...');
  const isValid = await testTokenValidity(currentToken);
  
  if (isValid) {
    console.error('[DEBUG] Token actual es válido');
    return currentToken;
  }

  // Token no válido, intentar renovar
  console.error('[DEBUG] Token inválido, renovando...');
  try {
    const newToken = await refreshGoogleToken();
    console.error('[DEBUG] Token renovado exitosamente');
    return newToken;
  } catch (error) {
    console.error('[ERROR] Error verificando token:', error);
    
    // Intentar renovar una vez más después del error
    try {
      console.error('[DEBUG] Intentando renovar token después del error...');
      const retryToken = await refreshGoogleToken();
      console.error('[DEBUG] Token renovado en segundo intento');
      return retryToken;
    } catch (retryError) {
      console.error('[ERROR] Failed to refresh token after error:', retryError);
      throw new Error(`Failed to refresh token: ${retryError}`);
    }
  }
}

/**
 * Ejecuta una función con un token válido, renovándolo automáticamente si es necesario
 */
export async function withValidToken<T>(
  operation: (token: string) => Promise<T>
): Promise<T> {
  console.error('[DEBUG] Ejecutando operación con token válido...');
  
  try {
    const token = await getValidAccessToken();
    console.error('[DEBUG] Token obtenido, ejecutando operación...');
    return await operation(token);
  } catch (error: unknown) {
    console.error('[DEBUG] Error en operación con token:', error);
    
    // Si el error es de autenticación, intentar una renovación forzada
    if ((error as Error).message?.includes('401') || 
        (error as Error).message?.includes('unauthorized') ||
        (error as Error).message?.includes('invalid_grant')) {
      
      try {
        console.error('[DEBUG] Error de autenticación detectado, forzando renovación...');
        
        // Usar renovación directa para evitar dependencias circulares
        const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
        if (refreshToken) {
          const newToken = await refreshGoogleToken();
          console.error('[DEBUG] Token renovado, reintentando operación...');
          return await operation(newToken);
        }
        
        console.error('[DEBUG] No hay refresh token disponible');
      } catch (renewError) {
        console.error('[DEBUG] Error en renovación forzada:', renewError);
      }
    }
    
    throw error;
  }
}