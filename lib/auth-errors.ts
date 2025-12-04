/**
 * Librería de mensajes de error de autenticación en español
 * Traduce los errores de Supabase a mensajes amigables para el usuario
 */

export interface AuthError {
  message: string
  description?: string
  action?: string
}

/**
 * Mapeo de códigos de error de Supabase a mensajes en español
 */
export const AUTH_ERROR_MESSAGES: Record<string, AuthError> = {
  // Errores de autenticación
  'invalid_credentials': {
    message: 'Credenciales incorrectas',
    description: 'El correo electrónico o la contraseña son incorrectos.',
    action: 'Verifica tus datos e intenta nuevamente.'
  },
  'invalid_grant': {
    message: 'Credenciales incorrectas',
    description: 'El correo electrónico o la contraseña son incorrectos.',
    action: 'Verifica tus datos e intenta nuevamente.'
  },
  'user_not_found': {
    message: 'Usuario no encontrado',
    description: 'No existe una cuenta con este correo electrónico.',
    action: '¿Deseas crear una cuenta nueva?'
  },
  'email_not_confirmed': {
    message: 'Correo no verificado',
    description: 'Debes verificar tu correo electrónico antes de iniciar sesión.',
    action: 'Revisa tu bandeja de entrada y haz clic en el enlace de verificación.'
  },
  'invalid_email': {
    message: 'Correo electrónico inválido',
    description: 'El formato del correo electrónico no es válido.',
    action: 'Verifica que el correo esté escrito correctamente.'
  },
  'weak_password': {
    message: 'Contraseña débil',
    description: 'La contraseña debe tener al menos 6 caracteres.',
    action: 'Elige una contraseña más segura.'
  },
  'password_too_short': {
    message: 'Contraseña muy corta',
    description: 'La contraseña debe tener al menos 6 caracteres.',
    action: 'Elige una contraseña más larga.'
  },
  'email_exists': {
    message: 'Correo ya registrado',
    description: 'Ya existe una cuenta con este correo electrónico.',
    action: '¿Olvidaste tu contraseña?'
  },
  'user_already_exists': {
    message: 'Usuario ya existe',
    description: 'Ya existe una cuenta con este correo electrónico.',
    action: 'Intenta iniciar sesión o recuperar tu contraseña.'
  },
  
  // Errores de sesión
  'session_not_found': {
    message: 'Sesión no encontrada',
    description: 'Tu sesión ha expirado o no existe.',
    action: 'Por favor, inicia sesión nuevamente.'
  },
  'refresh_token_not_found': {
    message: 'Sesión expirada',
    description: 'Tu sesión ha expirado.',
    action: 'Por favor, inicia sesión nuevamente.'
  },
  'invalid_refresh_token': {
    message: 'Sesión inválida',
    description: 'Tu sesión es inválida o ha expirado.',
    action: 'Por favor, inicia sesión nuevamente.'
  },
  
  // Errores de red
  'network_error': {
    message: 'Error de conexión',
    description: 'No se pudo conectar con el servidor.',
    action: 'Verifica tu conexión a internet e intenta nuevamente.'
  },
  'timeout': {
    message: 'Tiempo agotado',
    description: 'La solicitud tardó demasiado tiempo.',
    action: 'Intenta nuevamente en unos momentos.'
  },
  
  // Errores de OAuth
  'oauth_provider_not_supported': {
    message: 'Proveedor no soportado',
    description: 'El método de autenticación seleccionado no está disponible.',
    action: 'Intenta con otro método de inicio de sesión.'
  },
  'oauth_error': {
    message: 'Error de autenticación',
    description: 'Hubo un problema al autenticar con el proveedor externo.',
    action: 'Intenta nuevamente o usa otro método de inicio de sesión.'
  },
  
  // Errores de límite de tasa
  'over_request_rate_limit': {
    message: 'Demasiados intentos',
    description: 'Has realizado demasiados intentos de inicio de sesión.',
    action: 'Espera unos minutos antes de intentar nuevamente.'
  },
  'too_many_requests': {
    message: 'Demasiadas solicitudes',
    description: 'Has realizado demasiadas solicitudes en poco tiempo.',
    action: 'Espera unos minutos antes de intentar nuevamente.'
  },
  
  // Errores genéricos
  'unexpected_failure': {
    message: 'Error inesperado',
    description: 'Ocurrió un error inesperado.',
    action: 'Por favor, intenta nuevamente más tarde.'
  },
  'server_error': {
    message: 'Error del servidor',
    description: 'Hubo un problema en nuestros servidores.',
    action: 'Estamos trabajando en solucionarlo. Intenta más tarde.'
  },
  
  // Errores de permisos
  'insufficient_permissions': {
    message: 'Permisos insuficientes',
    description: 'No tienes permisos para realizar esta acción.',
    action: 'Contacta al administrador si crees que esto es un error.'
  },
  'access_denied': {
    message: 'Acceso denegado',
    description: 'No tienes permisos para acceder a este recurso.',
    action: 'Contacta al administrador si necesitas acceso.'
  }
}

/**
 * Obtiene un mensaje de error amigable basado en el error de Supabase
 */
export function getAuthErrorMessage(error: unknown): AuthError {
  // Si el error es null o undefined
  if (!error) {
    return {
      message: 'Error desconocido',
      description: 'Ocurrió un error inesperado.',
      action: 'Por favor, intenta nuevamente.'
    }
  }

  // Si el error es un objeto con mensaje
  if (typeof error === 'object' && error !== null) {
    const err = error as { message?: string; code?: string; status?: number }

    // Buscar por código de error
    if (err.code && AUTH_ERROR_MESSAGES[err.code]) {
      return AUTH_ERROR_MESSAGES[err.code]!
    }

    // Buscar por mensaje de error
    if (err.message) {
      const message = err.message.toLowerCase()

      // Mapear mensajes comunes
      if (message.includes('invalid login credentials') || 
          message.includes('invalid email or password') ||
          message.includes('email or password')) {
        return AUTH_ERROR_MESSAGES['invalid_credentials']!
      }

      if (message.includes('email not confirmed')) {
        return AUTH_ERROR_MESSAGES['email_not_confirmed']!
      }

      if (message.includes('user not found') || message.includes('user does not exist')) {
        return AUTH_ERROR_MESSAGES['user_not_found']!
      }

      if (message.includes('weak password') || message.includes('password is too weak')) {
        return AUTH_ERROR_MESSAGES['weak_password']!
      }

      if (message.includes('email already') || message.includes('already registered')) {
        return AUTH_ERROR_MESSAGES['email_exists']!
      }

      if (message.includes('session') && message.includes('not found')) {
        return AUTH_ERROR_MESSAGES['session_not_found']!
      }

      if (message.includes('network') || message.includes('fetch')) {
        return AUTH_ERROR_MESSAGES['network_error']!
      }

      if (message.includes('timeout')) {
        return AUTH_ERROR_MESSAGES['timeout']!
      }

      if (message.includes('rate limit') || message.includes('too many')) {
        return AUTH_ERROR_MESSAGES['over_request_rate_limit']!
      }

      // Si hay un mensaje pero no coincide con ningún patrón
      return {
        message: 'Error de autenticación',
        description: err.message,
        action: 'Intenta nuevamente o contacta con soporte.'
      }
    }

    // Error de estado HTTP
    if (err.status === 429) {
      return AUTH_ERROR_MESSAGES['too_many_requests']!
    }

    if (err.status && err.status >= 500) {
      return AUTH_ERROR_MESSAGES['server_error']!
    }

    if (err.status === 403) {
      return AUTH_ERROR_MESSAGES['access_denied']!
    }
  }

  // Error desconocido
  return {
    message: 'Error desconocido',
    description: 'Ocurrió un error inesperado durante la autenticación.',
    action: 'Por favor, intenta nuevamente o contacta con soporte.'
  }
}

/**
 * Formatea el error para mostrarlo al usuario
 */
export function formatAuthError(error: unknown, includeAction = true): string {
  const authError = getAuthErrorMessage(error)
  
  let message = authError.message
  
  if (authError.description) {
    message += `: ${authError.description}`
  }
  
  if (includeAction && authError.action) {
    message += ` ${authError.action}`
  }
  
  return message
}

/**
 * Registra el error de forma segura (sin exponer información sensible)
 */
export function logAuthError(error: unknown, context?: string) {
  const prefix = context ? `[AUTH ERROR - ${context}]` : '[AUTH ERROR]'
  
  if (process.env.NODE_ENV === 'development') {
    console.error(prefix, error)
  } else {
    // En producción, solo registrar información básica
    const authError = getAuthErrorMessage(error)
    console.error(prefix, authError.message)
  }
}
