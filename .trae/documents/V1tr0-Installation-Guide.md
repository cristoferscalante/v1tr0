# V1tr0 - Guía de Instalación y Configuración

## 1. Requisitos del Sistema

### 1.1 Requisitos Mínimos
- **Node.js**: v18.17.0 o superior (recomendado v20.x)
- **npm**: v9.0.0 o superior
- **Git**: v2.30.0 o superior
- **Sistema Operativo**: Windows 10+, macOS 10.15+, Ubuntu 20.04+

### 1.2 Herramientas Recomendadas
- **Editor**: Visual Studio Code con extensiones:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Importer
  - Prettier - Code formatter
  - ESLint
- **Terminal**: Windows Terminal, iTerm2, o terminal integrado de VS Code
- **Navegador**: Chrome/Edge (para DevTools) o Firefox Developer Edition

## 2. Configuración del Entorno de Desarrollo

### 2.1 Clonar el Repositorio

```bash
# Clonar el proyecto
git clone <repository-url>
cd v1tr0/frontend

# Verificar la rama actual
git branch
```

### 2.2 Instalación de Dependencias

```bash
# Instalar todas las dependencias
pnpm install

# Verificar la instalación
pnpm list --depth=0
```

### 2.3 Configuración de Variables de Entorno

1. **Crear archivo de configuración:**
```bash
# Copiar el archivo de ejemplo
cp .env.example .env.local
```

2. **Configurar variables en `.env.local`:**
```env
# ===========================================
# CONFIGURACIÓN DE SUPABASE
# ===========================================
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio_supabase

# ===========================================
# CONFIGURACIÓN DE GOOGLE APIS
# ===========================================
GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_REFRESH_TOKEN=tu_google_refresh_token
GOOGLE_CALENDAR_ID=tu_calendar_id@gmail.com

# ===========================================
# CONFIGURACIÓN DE EMAIL (SMTP)
# ===========================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password
SMTP_FROM=tu_email@gmail.com

# ===========================================
# CONFIGURACIÓN DE LA APLICACIÓN
# ===========================================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_nextauth_secret_muy_seguro
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ===========================================
# CONFIGURACIÓN DE DESARROLLO
# ===========================================
NODE_ENV=development
NEXT_PUBLIC_ENVIRONMENT=development
```

## 3. Configuración de Servicios Externos

### 3.1 Configuración de Supabase

1. **Crear proyecto en Supabase:**
   - Ir a [supabase.com](https://supabase.com)
   - Crear nueva organización y proyecto
   - Anotar la URL y las claves API

2. **Configurar la base de datos:**
```bash
# Ejecutar el script de configuración
psql -h db.tu-proyecto.supabase.co -p 5432 -d postgres -U postgres -f supabase-setup.sql
```

3. **Configurar autenticación:**
   - En el dashboard de Supabase, ir a Authentication > Settings
   - Configurar providers (Email, Google OAuth)
   - Añadir URLs de redirección:
     - `http://localhost:3000/auth/callback` (desarrollo)
     - `https://tu-dominio.com/auth/callback` (producción)

### 3.2 Configuración de Google APIs

1. **Crear proyecto en Google Cloud Console:**
   - Ir a [console.cloud.google.com](https://console.cloud.google.com)
   - Crear nuevo proyecto o seleccionar existente
   - Habilitar APIs necesarias:
     - Google Calendar API
     - Google OAuth2 API

2. **Configurar OAuth 2.0:**
   - Ir a "Credenciales" > "Crear credenciales" > "ID de cliente OAuth 2.0"
   - Tipo de aplicación: Aplicación web
   - URIs de redirección autorizados:
     - `http://localhost:3000/auth/callback`
     - `https://tu-dominio.com/auth/callback`

3. **Obtener Refresh Token:**
```bash
# Usar el script de configuración de Google Auth
node scripts/setup-google-auth.js
```

### 3.3 Configuración de Email (SMTP)

1. **Para Gmail:**
   - Habilitar autenticación de 2 factores
   - Generar contraseña de aplicación
   - Usar la contraseña de aplicación en `SMTP_PASS`

2. **Para otros proveedores:**
   - Configurar según la documentación del proveedor
   - Actualizar `SMTP_HOST`, `SMTP_PORT` según corresponda

## 4. Inicialización del Proyecto

### 4.1 Verificar Configuración

```bash
# Verificar variables de entorno
pnpm check-env

# Verificar conexión a Supabase
pnpm test-supabase

# Verificar configuración de Google APIs
pnpm test-google-apis
```

### 4.2 Inicializar Base de Datos

```bash
# Ejecutar migraciones (si existen)
pnpm db:migrate

# Poblar con datos de ejemplo
pnpm db:seed
```

### 4.3 Iniciar Servidor de Desarrollo

```bash
# Iniciar en modo desarrollo
pnpm dev

# El servidor estará disponible en:
# http://localhost:3000
```

## 5. Verificación de la Instalación

### 5.1 Checklist de Funcionalidades

- [ ] **Página de inicio carga correctamente**
  - Navegación funcional
  - Animaciones GSAP funcionando
  - Componentes 3D renderizando

- [ ] **Sistema de autenticación**
  - Registro de usuario funcional
  - Login con email/contraseña
  - Login con Google OAuth
  - Redirección después del login

- [ ] **Sistema de reuniones**
  - Calendario muestra disponibilidad
  - Formulario de agendamiento funcional
  - Emails de confirmación enviándose
  - Integración con Google Calendar

- [ ] **Blog corporativo**
  - Lista de posts carga correctamente
  - Detalle de posts renderiza MDX
  - Navegación entre posts funcional
  - Filtrado por tags operativo

- [ ] **Dashboard administrativo**
  - Acceso restringido a usuarios autenticados
  - Gestión de clientes funcional
  - Gestión de reuniones operativa
  - Analytics y métricas mostrándose

### 5.2 Tests de Funcionalidad

```bash
# Ejecutar tests unitarios (si están configurados)
pnpm test

# Ejecutar tests de integración
pnpm test:integration

# Verificar linting
pnpm lint

# Verificar tipos TypeScript
pnpm type-check
```

## 6. Solución de Problemas Comunes

### 6.1 Errores de Instalación

**Error: "Cannot resolve dependency"**
```bash
# Limpiar cache y reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Error: "Node version incompatible"**
```bash
# Verificar versión de Node
node --version

# Actualizar Node.js si es necesario
# Usar nvm para gestionar versiones
nvm install 20
nvm use 20
```

### 6.2 Errores de Configuración

**Error: "Supabase connection failed"**
- Verificar URL y claves en `.env.local`
- Comprobar que el proyecto Supabase esté activo
- Verificar configuración de RLS en las tablas

**Error: "Google Calendar API not working"**
- Verificar que las APIs estén habilitadas en Google Cloud
- Comprobar que las credenciales OAuth estén correctas
- Verificar que el refresh token sea válido

**Error: "SMTP authentication failed"**
- Verificar credenciales de email
- Para Gmail, usar contraseña de aplicación
- Comprobar configuración de firewall/antivirus

### 6.3 Errores de Desarrollo

**Error: "Module not found"**
```bash
# Verificar que el módulo esté instalado
npm list nombre-del-modulo

# Reinstalar si es necesario
npm install nombre-del-modulo
```

**Error: "TypeScript compilation failed"**
```bash
# Verificar configuración de TypeScript
npx tsc --noEmit

# Regenerar tipos si es necesario
pnpm generate-types
```

## 7. Configuración para Diferentes Entornos

### 7.1 Desarrollo Local
```env
# .env.local
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development
```

### 7.2 Staging/Testing
```env
# .env.staging
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://staging.v1tr0.com
NEXT_PUBLIC_ENVIRONMENT=staging
```

### 7.3 Producción
```env
# .env.production
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://v1tr0.com
NEXT_PUBLIC_ENVIRONMENT=production
```

## 8. Scripts Útiles

### 8.1 Scripts de Desarrollo
```bash
# Desarrollo con hot reload
pnpm dev

# Desarrollo con debug
pnpm dev:debug

# Análisis del bundle
pnpm analyze
```

### 8.2 Scripts de Build
```bash
# Build para producción
pnpm build

# Previsualizar build de producción
pnpm start

# Verificar build
pnpm build:check
```

### 8.3 Scripts de Mantenimiento
```bash
# Actualizar dependencias
pnpm update-deps

# Limpiar archivos temporales
pnpm clean

# Generar documentación
pnpm docs:generate
```

## 9. Configuración del Editor (VS Code)

### 9.1 Extensiones Recomendadas

Crear `.vscode/extensions.json`:
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### 9.2 Configuración del Workspace

Crear `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## 10. Próximos Pasos

Después de completar la instalación:

1. **Familiarizarse con la estructura del proyecto**
   - Revisar la documentación de arquitectura
   - Explorar los componentes principales
   - Entender el flujo de datos

2. **Configurar herramientas de desarrollo**
   - Configurar debugger
   - Instalar extensiones del navegador
   - Configurar Git hooks (pre-commit)

3. **Realizar primeras modificaciones**
   - Personalizar estilos y colores
   - Actualizar contenido del blog
   - Configurar información de la empresa

4. **Preparar para producción**
   - Configurar dominio personalizado
   - Configurar SSL/TLS
   - Configurar monitoreo y analytics

---

**¿Necesitas ayuda?**
- Revisa la documentación técnica completa
- Consulta los logs de la aplicación
- Verifica la configuración de servicios externos
- Contacta al equipo de desarrollo si persisten los problemas

**Última actualización:** Enero 2025  
**Versión de la guía:** 1.0
