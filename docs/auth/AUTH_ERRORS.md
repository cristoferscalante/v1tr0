# Librería de Mensajes de Error de Autenticación

Sistema centralizado para el manejo de errores de autenticación con mensajes amigables en español.

## 📦 Ubicación

`lib/auth-errors.ts`

## 🎯 Propósito

Traduce los errores técnicos de Supabase a mensajes comprensibles en español para mejorar la experiencia del usuario.

## 🚀 Uso Básico

### Importar

```typescript
import { 
  getAuthErrorMessage, 
  formatAuthError, 
  logAuthError 
} from '@/lib/auth-errors'
```

### En componentes de autenticación

```typescript
try {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    // Registrar el error (en desarrollo muestra más detalles)
    logAuthError(error, 'LOGIN')
    
    // Obtener mensaje amigable
    const authError = getAuthErrorMessage(error)
    
    // Mostrar al usuario con toast
    toast.error(authError.message, {
      description: authError.description,
      action: authError.action ? {
        label: 'Entendido',
        onClick: () => {}
      } : undefined,
      duration: 5000
    })
  }
} catch (error) {
  logAuthError(error, 'LOGIN_EXCEPTION')
  const authError = getAuthErrorMessage(error)
  
  toast.error(authError.message, {
    description: authError.description
  })
}
```

### Uso simple con formateo automático

```typescript
try {
  // ... operación de autenticación
} catch (error) {
  logAuthError(error, 'OPERACION')
  
  // Mensaje formateado completo
  const mensaje = formatAuthError(error, true) // incluye acción sugerida
  toast.error(mensaje)
}
```

## 📝 Tipos de Error Soportados

### Errores de Autenticación
- ✅ Credenciales incorrectas
- ✅ Usuario no encontrado
- ✅ Email no verificado
- ✅ Email inválido
- ✅ Contraseña débil
- ✅ Email ya registrado

### Errores de Sesión
- ✅ Sesión no encontrada
- ✅ Sesión expirada
- ✅ Token de refresco inválido

### Errores de Red
- ✅ Error de conexión
- ✅ Tiempo agotado

### Errores de OAuth
- ✅ Proveedor no soportado
- ✅ Error de autenticación externa

### Errores de Límite
- ✅ Demasiados intentos
- ✅ Demasiadas solicitudes

### Errores de Permisos
- ✅ Permisos insuficientes
- ✅ Acceso denegado

## 🔧 API

### `getAuthErrorMessage(error: unknown): AuthError`

Convierte un error de Supabase en un objeto `AuthError` con:
- `message`: Título del error
- `description`: Explicación detallada
- `action`: Acción sugerida para el usuario

### `formatAuthError(error: unknown, includeAction = true): string`

Formatea el error como un string legible. Si `includeAction` es `true`, incluye la acción sugerida.

### `logAuthError(error: unknown, context?: string): void`

Registra el error de forma segura en la consola:
- En **desarrollo**: Muestra todos los detalles
- En **producción**: Solo muestra información básica (sin datos sensibles)

## 📋 Estructura de AuthError

```typescript
interface AuthError {
  message: string        // Título del error
  description?: string   // Explicación detallada
  action?: string        // Acción sugerida
}
```

## 🎨 Ejemplos de Mensajes

### Credenciales incorrectas
```
Mensaje: "Credenciales incorrectas"
Descripción: "El correo electrónico o la contraseña son incorrectos."
Acción: "Verifica tus datos e intenta nuevamente."
```

### Email no verificado
```
Mensaje: "Correo no verificado"
Descripción: "Debes verificar tu correo electrónico antes de iniciar sesión."
Acción: "Revisa tu bandeja de entrada y haz clic en el enlace de verificación."
```

### Demasiados intentos
```
Mensaje: "Demasiados intentos"
Descripción: "Has realizado demasiados intentos de inicio de sesión."
Acción: "Espera unos minutos antes de intentar nuevamente."
```

## 🔍 Detección Inteligente

La librería detecta automáticamente errores basándose en:
1. **Código de error** de Supabase
2. **Mensaje de error** (búsqueda de patrones)
3. **Código de estado HTTP**

## 📦 Componentes Actualizados

Esta librería ya está integrada en:
- ✅ `/app/(auth)/login/page.tsx` - Login
- ✅ `/app/(auth)/register/page.tsx` - Registro
- ⏳ Otros componentes de autenticación según necesidad

## 🛠️ Agregar Nuevos Errores

Para agregar un nuevo tipo de error:

```typescript
// En auth-errors.ts
export const AUTH_ERROR_MESSAGES: Record<string, AuthError> = {
  // ... errores existentes
  
  'nuevo_error': {
    message: 'Título del Error',
    description: 'Explicación detallada del error.',
    action: 'Qué debe hacer el usuario.'
  }
}
```

## 🌐 Internacionalización Futura

Para agregar más idiomas en el futuro:

```typescript
// Crear auth-errors-en.ts, auth-errors-pt.ts, etc.
export const AUTH_ERROR_MESSAGES_EN: Record<string, AuthError> = {
  'invalid_credentials': {
    message: 'Invalid credentials',
    description: 'The email or password is incorrect.',
    action: 'Please check your credentials and try again.'
  }
  // ...
}

// Función para obtener mensajes según idioma
export function getAuthErrorMessage(error: unknown, lang = 'es'): AuthError {
  // Lógica para seleccionar el diccionario correcto
}
```

## 📚 Ver También

- [DEBUG_AUTH.md](../docs/auth/DEBUG_AUTH.md) - Guía de depuración de autenticación
- [Documentación de Supabase Auth](https://supabase.com/docs/guides/auth)
