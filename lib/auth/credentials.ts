// Credenciales de ejemplo para la aplicación
// En un entorno real, estas credenciales estarían en una base de datos segura

export const demoCredentials = {
  admin: {
    email: "admin@v1tr0.com",
    password: "admin123",
    role: "admin",
    name: "Administrador V1TR0",
    avatar: "/team/maria.jpg",
  },
  client: {
    email: "cliente@ejemplo.com",
    password: "cliente123",
    role: "client",
    name: "Cliente Demo",
    avatar: "/diverse-professional-profiles.png",
  },
}

// Función para validar credenciales (simulación)
export const validateCredentials = (email: string, password: string) => {
  // Verificar si coincide con el administrador
  if (email === demoCredentials.admin.email && password === demoCredentials.admin.password) {
    return {
      success: true,
      user: { ...demoCredentials.admin },
    }
  }

  // Verificar si coincide con el cliente
  if (email === demoCredentials.client.email && password === demoCredentials.client.password) {
    return {
      success: true,
      user: { ...demoCredentials.client },
    }
  }

  // Si no coincide con ninguno
  return {
    success: false,
    error: "Credenciales incorrectas",
  }
}
