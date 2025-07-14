# Configuración de Google OAuth en Supabase

## Credenciales de Google OAuth
- **Client ID**: `750058552598-f9qbfm9qi5vapfqs2b19nu59c74isr6a.apps.googleusercontent.com`
- **Client Secret**: `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`

## Pasos para configurar en Supabase:

### 1. Ir al Dashboard de Supabase
- URL: https://ykrsxgpaxhtjsuebadnj.supabase.co
- Navegar a: **Authentication** > **Providers**

### 2. Configurar Google Provider
1. Buscar **Google** en la lista de proveedores
2. Hacer clic en **Enable**
3. Introducir las credenciales:
   - **Client ID**: `750058552598-f9qbfm9qi5vapfqs2b19nu59c74isr6a.apps.googleusercontent.com`
   - **Client Secret**: `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`
4. En **Redirect URL**, usar: `https://ykrsxgpaxhtjsuebadnj.supabase.co/auth/v1/callback`
5. Hacer clic en **Save**

### 3. Configurar URLs de redirección en Google Cloud Console
En Google Cloud Console (https://console.cloud.google.com):
1. Ir a **APIs & Services** > **Credentials**
2. Seleccionar tu OAuth 2.0 Client ID
3. En **Authorized redirect URIs**, agregar:
   - `https://ykrsxgpaxhtjsuebadnj.supabase.co/auth/v1/callback`
4. Guardar cambios

### 4. URLs configuradas actualmente
- **Redirect URI**: `https://ykrsxgpaxhtjsuebadnj.supabase.co`
- **JavaScript Origin**: `https://ykrsxgpaxhtjsuebadnj.supabase.co`

⚠️ **IMPORTANTE**: Necesitas actualizar las URLs en Google Cloud Console para que incluyan la ruta `/auth/v1/callback`

## Ejecutar Script SQL
También ejecuta el contenido de `supabase-setup.sql` en el SQL Editor de Supabase para crear las tablas necesarias.

## Probar la Configuración
1. Ir a http://localhost:3000/login
2. Hacer clic en "Continuar con Google"
3. Debería redirigir a Google para autenticación
4. Después de autorizar, redirigir de vuelta a la aplicación
