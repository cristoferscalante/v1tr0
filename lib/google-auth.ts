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

  if (!refreshToken || !clientId || !clientSecret) {
    throw new Error('Missing required Google OAuth credentials');
  }

  // Verificar si el refresh token parece ser un placeholder
  if (refreshToken.includes('your_') || refreshToken.includes('placeholder') || refreshToken.length < 80) {
    throw new Error('GOOGLE_REFRESH_TOKEN appears to be a placeholder. Please configure valid OAuth2 credentials.');
  }

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

  if (!response.ok) {
    const error = await response.text();
    const errorData = JSON.parse(error);
    
    if (errorData.error === 'invalid_grant') {
      throw new Error('Refresh token has expired or is invalid. Please re-authenticate with Google OAuth2 to generate new tokens.');
    }
    
    throw new Error(`Failed to refresh token: ${error}`);
  }

  const data: RefreshTokenResponse = await response.json();
  
  if (!data.access_token) {
    throw new Error('No access token received from refresh');
  }

  // Actualizar el archivo .env.local con el nuevo token
  await updateEnvFile('GOOGLE_ACCESS_TOKEN', data.access_token);
  
  console.log('✅ Token de Google renovado exitosamente');
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
      if (lines[i].startsWith(`${key}=`)) {
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
  } catch (err) {
    console.error('Error updating .env.local:', err);
    // No lanzar error para no interrumpir el flujo principal
  }
}

/**
 * Obtiene un access token válido, renovándolo si es necesario
 */
export async function getValidAccessToken(): Promise<string> {
  const accessToken = process.env.GOOGLE_ACCESS_TOKEN;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!refreshToken) {
    throw new Error('Google refresh token not configured');
  }

  // Si no hay access token o es un código de autorización temporal, renovar inmediatamente
  if (!accessToken || accessToken === 'your_access_token_here' || accessToken.startsWith('4/')) {
    return await refreshGoogleToken();
  }

  // Intentar usar el token actual primero
  try {
    // Hacer una llamada de prueba para verificar si el token es válido
    const testResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${process.env.GOOGLE_CALENDAR_ID}/events?maxResults=1`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (testResponse.ok) {
      return accessToken;
    }

    // Si el token no es válido, renovar
    if (testResponse.status === 401) {
      return await refreshGoogleToken();
    }

    throw new Error(`Calendar API error: ${testResponse.status}`);
  } catch {
    // En caso de error, intentar renovar el token
    try {
      return await refreshGoogleToken();
    } catch (refreshError) {
      throw new Error(`Failed to refresh token: ${refreshError}`);
    }
  }
}

/**
 * Ejecuta una función con un token válido, renovándolo automáticamente si es necesario
 */
export async function withValidToken<T>(
  operation: (token: string) => Promise<T>
): Promise<T> {
  const token = await getValidAccessToken();
  
  try {
    return await operation(token);
  } catch (error: unknown) {
    // Si el error es de autenticación, intentar renovar el token y reintentar
    if ((error as Error).message?.includes('401') || (error as Error).message?.includes('unauthorized')) {
      const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
      if (refreshToken) {
        const newToken = await refreshGoogleToken();
        return await operation(newToken);
      }
    }
    throw error;
  }
}