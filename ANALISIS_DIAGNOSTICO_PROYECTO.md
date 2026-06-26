# ANÁLISIS DIAGNÓSTICO Y PLAN DE REESTRUCTURACIÓN - V1TR0 WEB

**Fecha:** Junio 26, 2026  
**Objetivo:** Transformar el proyecto para incluir Ecommerce, eliminar código de reuniones, optimizar arquitectura y globalizar el diseño

---

## ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Stack Tecnológico Actual](#stack-tecnológico-actual)
3. [Código a Eliminar - Sistema de Reuniones](#código-a-eliminar---sistema-de-reuniones)
4. [Optimización de Dependencias](#optimización-de-dependencias)
5. [Reestructuración de Carpetas](#reestructuración-de-carpetas)
6. [Sistema de Diseño Global](#sistema-de-diseño-global)
7. [Preparación para Ecommerce](#preparación-para-ecommerce)
8. [Plan de Acción](#plan-de-acción)
9. [Comandos y Scripts](#comandos-y-scripts)

---

## RESUMEN EJECUTIVO

### Situación Actual

El proyecto es una **aplicación Next.js 15 completa** con:
- ✅ 33 rutas activas
- ✅ 175+ componentes React
- ✅ Sistema de diseño robusto (Tailwind + shadcn/ui)
- ✅ Autenticación con Supabase
- ✅ Dashboard de proyectos
- ⚠️ **Sistema completo de reuniones con Google Calendar** (a eliminar)
- ⚠️ Código duplicado y archivos sin uso
- ⚠️ Dependencias desactualizadas

### Objetivos de la Reestructuración

1. **Eliminar** todo el código relacionado con reuniones/automatización
2. **Optimizar** dependencias y usar exclusivamente pnpm
3. **Globalizar** el sistema de diseño
4. **Preparar** arquitectura para Ecommerce
5. **Documentar** la estructura mejorada
6. **Limpiar** archivos sin uso

---

## STACK TECNOLÓGICO ACTUAL

### Core Framework
```json
{
  "next": "15.5.7",
  "react": "19.2.1",
  "react-dom": "19.2.1",
  "typescript": "5.9.3"
}
```

### Backend & Database
```json
{
  "@supabase/supabase-js": "2.86.2",
  "@supabase/ssr": "0.6.1",
  "@supabase/auth-helpers-nextjs": "0.10.0"
}
```

### Styling & UI
```json
{
  "tailwindcss": "3.4.18",
  "tailwindcss-animate": "1.0.7",
  "@tailwindcss/typography": "0.5.19",
  "framer-motion": "11.18.2",
  "gsap": "3.13.0",
  "@gsap/react": "2.1.2",
  "next-themes": "0.4.6"
}
```

### UI Components (shadcn/ui - Radix UI)
- 34 componentes de @radix-ui/*
- Sistema completo de primitivas UI

### Forms & Validation
```json
{
  "react-hook-form": "7.68.0",
  "zod": "3.25.76",
  "@hookform/resolvers": "3.10.0"
}
```

### 3D Graphics
```json
{
  "three": "0.179.1",
  "@react-three/fiber": "9.4.2",
  "@react-three/drei": "10.7.7"
}
```

### Icons
```json
{
  "lucide-react": "0.454.0",
  "@heroicons/react": "2.2.0",
  "react-icons": "5.5.0"
}
```

### Content & MDX
```json
{
  "@mdx-js/loader": "3.1.1",
  "@mdx-js/react": "3.1.1",
  "gray-matter": "4.0.3",
  "react-markdown": "9.1.0",
  "remark-gfm": "4.0.1",
  "rehype-raw": "7.0.0",
  "rehype-slug": "6.0.0",
  "react-syntax-highlighter": "15.6.6"
}
```

### ⚠️ **DEPENDENCIAS A ELIMINAR** (relacionadas con reuniones)
```json
{
  "googleapis": "157.0.0",          // ← Google Calendar API
  "nodemailer": "7.0.11",           // ← Envío de emails de reuniones
  "@types/nodemailer": "7.0.4",
  "date-fns-tz": "3.2.0",           // ← Zonas horarias (evaluar si se usa en otro lugar)
  "open": "10.2.0"                  // ← Abrir URLs OAuth (solo para scripts)
}
```

### Mantenimiento Recomendado
```json
{
  "axios": "1.13.2"                 // ⚠️ Versión vieja, actualizar a latest
}
```

---

## CÓDIGO A ELIMINAR - SISTEMA DE REUNIONES

### 🔴 ALTA PRIORIDAD - Eliminar Inmediatamente

#### APIs de Reuniones (4 endpoints)
```bash
app/api/calendar-availability/route.ts          # 207 líneas - Disponibilidad Google Calendar
app/api/schedule-meeting/route.ts               # 578 líneas - Agendar reunión
app/api/meetings/route.ts                       # 285 líneas - CRUD reuniones
app/api/token-status/route.ts                   # 79 líneas - Estado tokens OAuth
```

#### Servicios de Google Calendar
```bash
lib/google-calendar.ts                          # 264 líneas - Google Calendar API
lib/google-auth.ts                              # 235 líneas - OAuth2 + renovación tokens
lib/supabase-meetings-db.ts                     # 521 líneas - DB reuniones Supabase
lib/server-meetings-db.ts                       # Operaciones servidor
lib/local-meetings-db.ts                        # Fallback JSON local
lib/auto-token-renewal.ts                       # Renovación automática tokens
lib/init-auto-tokens.ts                         # Inicialización tokens
```

#### Páginas de Reuniones
```bash
app/(marketing)/agendar-reunion/                # Página completa agendamiento (656 líneas)
app/(dashboard)/dashboard/meetings/             # Lista de reuniones
app/(dashboard)/dashboard/meetings/[id]/        # Detalle reunión
```

#### Componentes de Reuniones
```bash
components/dashboard/project-meetings.tsx       # Reuniones de proyecto
components/dashboard/jitsi-meeting.tsx          # Integración Jitsi videollamadas
```

#### Scripts OAuth (todos vacíos o de tokens)
```bash
scripts/maintain-tokens.js                      # VACÍO - eliminar
scripts/get-google-auth-url.js                  # VACÍO - eliminar
scripts/exchange-google-code.js                 # VACÍO - eliminar
scripts/refresh-google-auth.js                  # Refresh tokens - eliminar
scripts/update-tokens-from-playground.js        # 63 líneas - eliminar
```

#### Datos y Migraciones
```bash
data/meetings.json                              # Datos locales reuniones
supabase/migrations/002_meeting_tasks_projects.sql  # ⚠️ REVISAR - contiene también proyectos/tareas
```

#### Documentación
```bash
docs/flujos/transcripciones-reuniones.md        # Flujo transcripciones
SETUP_WEBHOOK.md                                # Setup webhooks Supabase
TOKEN_MAINTENANCE.md                            # VACÍO - eliminar
```

#### Scripts en package.json
```json
{
  "check-tokens": "node scripts/maintain-tokens.js",           // ← Eliminar
  "get-auth-url": "node scripts/get-google-auth-url.js",       // ← Eliminar
  "exchange-code": "node scripts/exchange-google-code.js",     // ← Eliminar
  "force-token-check": "curl -X POST http://localhost:3000/api/token-status ..." // ← Eliminar
}
```

### 🟡 MEDIA PRIORIDAD - Revisar y Decidir

#### Archivos Duplicados de Dashboard
```bash
app/(dashboard)/dashboard/page-backup.tsx       # Eliminar (mantener solo page.tsx)
app/(dashboard)/dashboard/page-new.tsx          # Eliminar
app/(dashboard)/dashboard/page-original.tsx     # Eliminar
app/(dashboard)/dashboard/page-simple.tsx       # Eliminar
```

#### Archivos de Test
```bash
test-supabase.js                                # Mover a /tests o eliminar
check-user-exists.js                            # Mover a /tests o eliminar
debug-login.js                                  # VACÍO - eliminar
clear-browser-storage.html                      # Mover a /tests
app/test-dashboard/page.tsx                     # Mover a /tests
```

#### Outputs de Compilación
```bash
tsc_output.txt                                  # Eliminar - agregar *.txt a .gitignore
tsc_output_2.txt                                # Eliminar
tsc_output_3.txt                                # Eliminar
```

#### Lockfiles Duplicados
```bash
package-lock.json.backup                        # Eliminar (usamos pnpm)
```

#### Archivos Vacíos
```bash
lib/token-maintenance.ts                        # VACÍO - eliminar
lib/auto-token-refresh.ts                       # VACÍO - eliminar
```

### ⚠️ CUIDADO - Revisar Dependencias Internas

#### Base de Datos Supabase
```sql
-- Revisar migration 002_meeting_tasks_projects.sql
-- Contiene 3 secciones:
-- 1. meetings (ELIMINAR todas las tablas/políticas relacionadas)
-- 2. tasks (MANTENER si se usa en proyectos)
-- 3. projects (MANTENER)

-- Tablas a eliminar:
DROP TABLE IF EXISTS meetings CASCADE;
DROP TABLE IF EXISTS clients CASCADE;  -- ⚠️ Verificar si se usa para clientes de proyectos

-- Políticas RLS a eliminar:
-- Todas las que contengan "meeting" en el nombre
```

#### Componentes de Dashboard
```bash
# Revisar si estos componentes usan project-meetings.tsx:
components/dashboard/project-header.tsx
components/dashboard/project-timeline.tsx

# Si es así, remover las referencias a reuniones
```

### 📊 RESUMEN DE ELIMINACIÓN

| Categoría | Archivos | Líneas Aprox. |
|-----------|----------|---------------|
| APIs | 4 | 1,149 |
| Servicios | 7 | 1,020+ |
| Páginas | 3 | 800+ |
| Componentes | 2 | 300+ |
| Scripts | 6 | 100+ |
| Docs | 3 | 300+ |
| **TOTAL** | **25+** | **~3,700+** |

**Ahorro estimado:** ~3,700 líneas de código + ~5 dependencias npm

---

## OPTIMIZACIÓN DE DEPENDENCIAS

### 1. Eliminar Dependencias de Reuniones

```bash
pnpm remove googleapis nodemailer @types/nodemailer open
```

### 2. Evaluar date-fns-tz

```bash
# Si solo se usaba para reuniones:
pnpm remove date-fns-tz

# Si se necesita en otro lugar, mantener
```

### 3. Actualizar Dependencias Obsoletas

```bash
# Axios está en versión vieja
pnpm update axios

# Verificar todas las dependencias
pnpm outdated
```

### 4. Limpiar node_modules

```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### 5. Verificar Duplicados

```bash
# Ver si hay duplicados
pnpm list --depth=1 | grep -E "├─|└─" | sort | uniq -d
```

### 6. Agregar Dependencias para Ecommerce (futuro)

```bash
# Stripe para pagos
pnpm add stripe @stripe/stripe-js

# Gestión de carrito
pnpm add zustand  # State management ligero

# Optimización de imágenes
pnpm add sharp  # Next.js ya lo recomienda
```

---

## REESTRUCTURACIÓN DE CARPETAS

### Estructura Actual vs. Propuesta

#### ANTES
```
/app
  /(marketing)
    /agendar-reunion          ← ELIMINAR
    /blog
    /portfolio
    /services
    ...
  /(dashboard)
    /dashboard
      /meetings               ← ELIMINAR
      /projects
      /clients
      /team
  /(auth)
  /api
    /calendar-availability    ← ELIMINAR
    /schedule-meeting         ← ELIMINAR
    /meetings                 ← ELIMINAR
    /token-status            ← ELIMINAR
    /clients
    /contact

/components
  /dashboard
    jitsi-meeting.tsx         ← ELIMINAR
    project-meetings.tsx      ← ELIMINAR
  /home (31 archivos)
  /ui (65 archivos)
  /blog
  /auth
  ...

/lib
  google-calendar.ts          ← ELIMINAR
  google-auth.ts              ← ELIMINAR
  supabase-meetings-db.ts     ← ELIMINAR
  server-meetings-db.ts       ← ELIMINAR
  local-meetings-db.ts        ← ELIMINAR
  supabase/client.ts
  supabase/server.ts
  utils.ts
```

#### DESPUÉS - Nueva Estructura Propuesta

```
/app
  /(marketing)
    /                         # Home
    /about
    /blog
      /[slug]
    /portfolio
    /services
      /dev
      /pm
    /shop                     # 🆕 ECOMMERCE
      /                       # Catálogo
      /[slug]                 # Producto individual
      /cart                   # Carrito
      /checkout               # Checkout
    /tags/[tag]
    /legal
      /cookies
      /privacidad
      /terminos
  
  /(auth)
    /login
    /register
    /auth/callback
  
  /(dashboard)
    /dashboard
      /                       # Overview
      /projects
        /[id]
      /clients
      /team
      /messages
      /orders                 # 🆕 Pedidos ecommerce
        /[id]
  
  /(client-dashboard)
    /client-dashboard
      /projects
      /orders                 # 🆕 Pedidos del cliente
  
  /api
    /clients
    /contact
    /unified-contact
    /test-email
    /products               # 🆕 CRUD productos
    /orders                 # 🆕 CRUD pedidos
    /cart                   # 🆕 Carrito
    /checkout               # 🆕 Procesamiento pago
    /webhooks
      /stripe               # 🆕 Webhooks Stripe

/components
  /ui                       # Sistema de diseño (65 componentes)
    /primitives             # 🆕 Radix UI wrappers
    /composed               # 🆕 Componentes compuestos
    /feedback               # 🆕 Toasts, alerts, etc.
    /forms                  # 🆕 Inputs, selects, etc.
  
  /global                   # Componentes globales
    /layout
      FloatingHeader.tsx
      NavBar.tsx
      FooterSection.tsx
    /providers
      ThemeProvider.tsx
      SessionProvider.tsx
    /error-handling
  
  /features                 # 🆕 Features específicas
    /auth
      LoginForm.tsx
      RegisterForm.tsx
    /blog
      BlogCard.tsx
      MDXContent.tsx
      TableOfContents.tsx
    /shop                   # 🆕 Ecommerce
      ProductCard.tsx
      ProductGrid.tsx
      CartDrawer.tsx
      CheckoutForm.tsx
    /dashboard
      /projects
      /clients
      /team
  
  /home                     # Componentes home (reorganizar)
    /hero
    /sections
    /animations

/lib
  /supabase
    client.ts
    server.ts
    products-db.ts          # 🆕 Productos
    orders-db.ts            # 🆕 Pedidos
    projects-db.ts          # Proyectos (existente)
  
  /services
    stripe.ts               # 🆕 Servicio Stripe
    email.ts                # 🆕 Servicio email general
  
  /utils
    index.ts
    slugify.ts
    validators.ts           # 🆕 Validadores Zod
    formatters.ts           # 🆕 Formateo moneda, fechas
  
  /hooks                    # 🆕 Mover hooks aquí
  /constants                # 🆕 Constantes globales
  /types                    # 🆕 Tipos TypeScript globales

/hooks
  use-auth.tsx
  use-cart.tsx              # 🆕 Hook carrito
  use-checkout.tsx          # 🆕 Hook checkout
  ...

/styles
  /design-system            # 🆕 Sistema de diseño
    variables.css           # Variables CSS
    animations.css          # Animaciones
    typography.css          # Tipografía
    components.css          # Componentes globales
  globals.css               # Imports + overrides

/config                     # 🆕 Configuraciones
  site.ts                   # Metadata, URLs, etc.
  design-tokens.ts          # Tokens de diseño
  navigation.ts             # Estructura navegación

/docs
  /architecture
    ESTRUCTURA.md           # 🆕 Documentación estructura
    SISTEMA_DISEÑO.md       # 🆕 Sistema de diseño
    ECOMMERCE.md            # 🆕 Flujo ecommerce
  /auth
    (existente)

/tests                      # 🆕 Tests organizados
  /unit
  /integration
  /e2e
  /utils
    test-supabase.js        # Mover aquí
    check-user-exists.js    # Mover aquí

/public
  /imagenes
    /blog
    /portfolio
    /products               # 🆕 Imágenes productos
  /icons
  /3d

/supabase
  /migrations
    001_auth_roles_system.sql
    002_projects_tasks.sql  # Renombrar (sin meetings)
    003_products_orders.sql # 🆕 Ecommerce
  /functions
    create-user-profile/
  config.toml
```

### Beneficios de la Nueva Estructura

1. **Separación clara de responsabilidades**
   - `/features` agrupa componentes por dominio
   - `/ui` contiene solo primitivas reutilizables
   - `/global` para componentes cross-app

2. **Escalabilidad**
   - Fácil agregar nuevas features sin mezclar código
   - Sistema de diseño centralizado
   - Configuración separada de lógica

3. **Mantenibilidad**
   - Todo relacionado a una feature está junto
   - Tests organizados por tipo
   - Documentación actualizada

4. **Performance**
   - Mejor tree-shaking
   - Imports más claros
   - Code splitting optimizado

---

## SISTEMA DE DISEÑO GLOBAL

### Objetivo

Crear un **Design System reutilizable** que funcione tanto para la web actual como para el nuevo ecommerce.

### 1. Estructura de Archivos de Diseño

```
/styles/design-system/
  _variables.css          # Variables CSS (colores, spacing, etc.)
  _typography.css         # Tipografía (headings, body, etc.)
  _animations.css         # Keyframes y animaciones
  _components.css         # Componentes globales (buttons, cards)
  _utilities.css          # Clases utilitarias custom
  index.css               # Barrel export

/config/design-tokens.ts  # Tokens en TypeScript
```

### 2. Variables CSS Globales (`_variables.css`)

```css
:root {
  /* ===== COLORES BASE ===== */
  --color-primary: #08a696;
  --color-primary-hover: #06877a;
  --color-primary-light: #e6f7f6;
  
  --color-accent: #1e7d7d;
  --color-highlight: #08a696;
  
  --color-danger: #ff2c10;
  --color-warning: #f26a1b;
  --color-success: #10b981;
  --color-info: #3b82f6;
  
  /* ===== NEUTRALES ===== */
  --color-background: #faf9f7;
  --color-background-secondary: #f5f4f1;
  --color-foreground: #0f0f10;
  
  --color-text-primary: #011c26;
  --color-text-secondary: #025159;
  --color-text-muted: #6b7280;
  
  --color-border: #e5e7eb;
  --color-border-focus: var(--color-primary);
  
  /* ===== SPACING ===== */
  --spacing-xs: 0.25rem;    /* 4px */
  --spacing-sm: 0.5rem;     /* 8px */
  --spacing-md: 1rem;       /* 16px */
  --spacing-lg: 1.5rem;     /* 24px */
  --spacing-xl: 2rem;       /* 32px */
  --spacing-2xl: 3rem;      /* 48px */
  --spacing-3xl: 4rem;      /* 64px */
  
  /* ===== TIPOGRAFÍA ===== */
  --font-family-sans: var(--font-bricolage-grotesque), sans-serif;
  --font-family-mono: ui-monospace, monospace;
  
  --font-size-xs: 0.75rem;      /* 12px */
  --font-size-sm: 0.875rem;     /* 14px */
  --font-size-base: 1rem;       /* 16px */
  --font-size-lg: 1.125rem;     /* 18px */
  --font-size-xl: 1.25rem;      /* 20px */
  --font-size-2xl: 1.5rem;      /* 24px */
  --font-size-3xl: 1.875rem;    /* 30px */
  --font-size-4xl: 2.25rem;     /* 36px */
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* ===== SOMBRAS ===== */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  
  /* ===== RADIOS ===== */
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-full: 9999px;
  
  /* ===== TRANSICIONES ===== */
  --transition-fast: 150ms;
  --transition-base: 200ms;
  --transition-slow: 300ms;
  
  --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* ===== Z-INDEX ===== */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}

[data-theme="dark"] {
  --color-background: #0f0f10;
  --color-background-secondary: #011c26;
  --color-foreground: #ffffff;
  
  --color-text-primary: #ffffff;
  --color-text-secondary: #a0a0a0;
  --color-text-muted: #6b7280;
  
  --color-highlight: #26ffdf;
  
  --color-border: #1f2937;
}
```

### 3. Design Tokens en TypeScript (`/config/design-tokens.ts`)

```typescript
export const designTokens = {
  colors: {
    primary: {
      DEFAULT: '#08a696',
      hover: '#06877a',
      light: '#e6f7f6',
      dark: '#025159',
    },
    accent: {
      DEFAULT: '#1e7d7d',
    },
    semantic: {
      danger: '#ff2c10',
      warning: '#f26a1b',
      success: '#10b981',
      info: '#3b82f6',
    },
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  typography: {
    fontFamily: {
      sans: 'var(--font-bricolage-grotesque), sans-serif',
      mono: 'ui-monospace, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
  
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

export type DesignTokens = typeof designTokens;
```

### 4. Configuración de Sitio (`/config/site.ts`)

```typescript
export const siteConfig = {
  name: 'V1TR0',
  description: 'Desarrollo de software y soluciones digitales',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://v1tr0.com',
  
  author: {
    name: 'V1TR0',
    url: 'https://v1tr0.com',
  },
  
  links: {
    twitter: 'https://twitter.com/v1tr0',
    github: 'https://github.com/v1tr0',
    linkedin: 'https://linkedin.com/company/v1tr0',
  },
  
  navigation: {
    main: [
      { label: 'Inicio', href: '/' },
      { label: 'Servicios', href: '/services' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Blog', href: '/blog' },
      { label: 'Tienda', href: '/shop' },  // 🆕
      { label: 'Contacto', href: '/#contact' },
    ],
    
    footer: {
      company: [
        { label: 'Acerca de', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contacto', href: '/#contact' },
      ],
      legal: [
        { label: 'Privacidad', href: '/privacidad' },
        { label: 'Términos', href: '/terminos' },
        { label: 'Cookies', href: '/cookies' },
      ],
      services: [
        { label: 'Desarrollo', href: '/services/dev' },
        { label: 'Project Management', href: '/services/pm' },
      ],
    },
  },
  
  ecommerce: {
    currency: 'USD',
    locale: 'es-CO',
    taxRate: 0.19,  // IVA Colombia
  },
} as const;

export type SiteConfig = typeof siteConfig;
```

### 5. Actualizar tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";
import { designTokens } from "./config/design-tokens";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: designTokens.colors.primary,
        accent: designTokens.colors.accent,
        ...designTokens.colors.semantic,
        
        // shadcn/ui compatibility
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        border: "var(--color-border)",
      },
      
      spacing: designTokens.spacing,
      
      fontFamily: designTokens.typography.fontFamily,
      fontSize: designTokens.typography.fontSize,
      
      borderRadius: designTokens.borderRadius,
      
      zIndex: designTokens.zIndex,
      
      animation: {
        slideInRight: 'slideInRight 0.8s ease-out',
        slideInLeft: 'slideInLeft 0.8s ease-out 0.2s both',
      },
      
      keyframes: {
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),
  ],
};

export default config;
```

### 6. Documentar Sistema de Diseño

Crear `/docs/architecture/SISTEMA_DISEÑO.md` con:
- Paleta de colores
- Escala tipográfica
- Espaciado
- Componentes UI
- Guías de uso
- Ejemplos

---

## PREPARACIÓN PARA ECOMMERCE

### 1. Esquema de Base de Datos (Supabase)

Crear `/supabase/migrations/003_ecommerce.sql`:

```sql
-- =============================================
-- ECOMMERCE SCHEMA
-- =============================================

-- Tabla de categorías
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),  -- Precio "antes" para descuentos
  cost DECIMAL(10, 2),  -- Costo (privado)
  sku TEXT UNIQUE,
  barcode TEXT,
  
  -- Inventario
  track_inventory BOOLEAN DEFAULT TRUE,
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  
  -- Características
  is_digital BOOLEAN DEFAULT FALSE,
  download_url TEXT,  -- Si es producto digital
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- Estado
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Relación productos-categorías (many-to-many)
CREATE TABLE product_categories (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- Imágenes de productos
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Variantes de productos (tallas, colores, etc.)
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,  -- Ej: "Talla L - Azul"
  sku TEXT UNIQUE,
  price DECIMAL(10, 2),  -- Precio específico (opcional, sino usa precio base)
  stock_quantity INTEGER DEFAULT 0,
  attributes JSONB,  -- {"size": "L", "color": "blue"}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,  -- Número de pedido legible
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Cliente (puede ser guest)
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  
  -- Dirección de envío
  shipping_address JSONB,  -- {street, city, state, zip, country}
  billing_address JSONB,
  
  -- Montos
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  
  -- Estado
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',      -- Pendiente de pago
    'paid',         -- Pagado
    'processing',   -- Procesando
    'shipped',      -- Enviado
    'delivered',    -- Entregado
    'cancelled',    -- Cancelado
    'refunded'      -- Reembolsado
  )),
  
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN (
    'pending',
    'paid',
    'failed',
    'refunded'
  )),
  
  -- Pago
  payment_method TEXT,  -- 'stripe', 'paypal', etc.
  payment_intent_id TEXT,  -- ID de Stripe
  
  -- Notas
  customer_note TEXT,
  internal_note TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- Items de pedido
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  
  -- Snapshot de datos (por si se elimina el producto)
  product_name TEXT NOT NULL,
  product_sku TEXT,
  variant_name TEXT,
  
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Políticas: Todos pueden ver productos activos
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (status = 'active');

-- Políticas: Solo admins pueden gestionar productos
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Políticas: Usuarios pueden ver sus propios pedidos
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (user_id = auth.uid());

-- Políticas: Admins pueden ver todos los pedidos
CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Función para generar número de pedido
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('order_number_seq')::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_number_seq;

-- Trigger para generar order_number automáticamente
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();
```

### 2. Servicios de Ecommerce

#### `/lib/services/stripe.ts`
```typescript
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function createPaymentIntent(amount: number, metadata: Record<string, string>) {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convertir a centavos
    currency: 'usd',
    metadata,
  });
}

export async function createCheckoutSession(params: {
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}) {
  return await stripe.checkout.sessions.create({
    line_items: params.lineItems,
    mode: 'payment',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.customerEmail,
    metadata: params.metadata,
  });
}
```

#### `/lib/supabase/products-db.ts`
```typescript
import { createClient } from './server';

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  status: 'draft' | 'active' | 'archived';
  featured: boolean;
  images?: ProductImage[];
  categories?: Category[];
};

export type ProductImage = {
  id: string;
  url: string;
  alt_text: string | null;
  display_order: number;
};

export class ProductsDB {
  private supabase;

  constructor() {
    this.supabase = createClient();
  }

  async getProducts(filters?: {
    category?: string;
    featured?: boolean;
    status?: string;
  }) {
    let query = this.supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        categories:product_categories(category:categories(*))
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    } else {
      query = query.eq('status', 'active');
    }

    if (filters?.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  async getProductBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        categories:product_categories(category:categories(*)),
        variants:product_variants(*)
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }

  // ... más métodos CRUD
}
```

### 3. Hooks de Carrito

#### `/hooks/use-cart.tsx`
```typescript
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        });
      },
      
      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          ),
        }));
      },
      
      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity }
              : item
          ),
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      get total() {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      
      get itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'v1tr0-cart-storage',
    }
  )
);
```

### 4. Componentes de Ecommerce

Estructura de componentes a crear:

```
/components/features/shop/
  ProductCard.tsx           # Tarjeta de producto
  ProductGrid.tsx           # Grid de productos
  ProductFilters.tsx        # Filtros (categorías, precio, etc.)
  ProductDetails.tsx        # Detalles completos del producto
  ProductImages.tsx         # Galería de imágenes
  VariantSelector.tsx       # Selector de variantes
  AddToCartButton.tsx       # Botón agregar al carrito
  CartDrawer.tsx            # Drawer del carrito
  CartItem.tsx              # Item en el carrito
  CheckoutForm.tsx          # Formulario de checkout
  OrderSummary.tsx          # Resumen de pedido
  PaymentForm.tsx           # Formulario de pago (Stripe)
```

---

## PLAN DE ACCIÓN

### Fase 1: Limpieza y Eliminación (1-2 días)

#### Día 1: Eliminar Código de Reuniones

```bash
# 1. Crear backup
git checkout -b backup/antes-limpieza
git push origin backup/antes-limpieza

# 2. Crear rama de trabajo
git checkout main
git checkout -b refactor/eliminar-reuniones

# 3. Eliminar APIs
rm -rf app/api/calendar-availability
rm -rf app/api/schedule-meeting
rm -rf app/api/meetings
rm -rf app/api/token-status

# 4. Eliminar páginas
rm -rf app/\(marketing\)/agendar-reunion
rm -rf app/\(dashboard\)/dashboard/meetings

# 5. Eliminar servicios
rm lib/google-calendar.ts
rm lib/google-auth.ts
rm lib/supabase-meetings-db.ts
rm lib/server-meetings-db.ts
rm lib/local-meetings-db.ts
rm lib/auto-token-renewal.ts
rm lib/init-auto-tokens.ts
rm lib/token-maintenance.ts
rm lib/auto-token-refresh.ts

# 6. Eliminar componentes
rm components/dashboard/project-meetings.tsx
rm components/dashboard/jitsi-meeting.tsx

# 7. Eliminar scripts
rm scripts/maintain-tokens.js
rm scripts/get-google-auth-url.js
rm scripts/exchange-google-code.js
rm scripts/refresh-google-auth.js
rm scripts/update-tokens-from-playground.js

# 8. Eliminar datos
rm data/meetings.json

# 9. Eliminar docs
rm docs/flujos/transcripciones-reuniones.md
rm SETUP_WEBHOOK.md
rm TOKEN_MAINTENANCE.md

# 10. Eliminar archivos vacíos y test
rm debug-login.js
rm tsc_output*.txt
rm package-lock.json.backup
rm clear-browser-storage.html

# 11. Crear carpeta tests y mover
mkdir -p tests/utils
mv test-supabase.js tests/utils/
mv check-user-exists.js tests/utils/

# 12. Eliminar variantes de dashboard
rm app/\(dashboard\)/dashboard/page-backup.tsx
rm app/\(dashboard\)/dashboard/page-new.tsx
rm app/\(dashboard\)/dashboard/page-original.tsx
rm app/\(dashboard\)/dashboard/page-simple.tsx
```

#### Día 2: Limpiar Dependencias y Base de Datos

```bash
# 1. Eliminar dependencias npm
pnpm remove googleapis nodemailer @types/nodemailer open date-fns-tz

# 2. Actualizar dependencias
pnpm update axios
pnpm update

# 3. Limpiar node_modules
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install

# 4. Actualizar package.json (eliminar scripts)
# Editar manualmente y remover:
# - check-tokens
# - get-auth-url
# - exchange-code
# - force-token-check
```

**Migration de Base de Datos:**

Crear `/supabase/migrations/004_remove_meetings.sql`:

```sql
-- Eliminar tablas de reuniones
DROP TABLE IF EXISTS meetings CASCADE;

-- Solo eliminar clientes si NO se usan en proyectos
-- Verificar primero si hay referencias
SELECT * FROM clients LIMIT 1;

-- Si no se usa, eliminar:
-- DROP TABLE IF EXISTS clients CASCADE;
```

Aplicar:
```bash
# En producción (Vercel/Supabase)
# Aplicar desde Supabase Dashboard > SQL Editor
```

### Fase 2: Reestructuración (2-3 días)

#### Día 3: Nueva Estructura de Carpetas

```bash
# 1. Crear nueva estructura
mkdir -p lib/{services,constants,types}
mkdir -p components/features/{auth,blog,shop,dashboard}
mkdir -p components/global/{layout,providers,error-handling}
mkdir -p components/ui/{primitives,composed,feedback,forms}
mkdir -p styles/design-system
mkdir -p config
mkdir -p docs/architecture

# 2. Mover componentes UI
# (Hacer manualmente o con script)

# 3. Mover hooks
mv hooks/* lib/hooks/
rmdir hooks
```

#### Día 4: Sistema de Diseño

```bash
# 1. Crear archivos de diseño
touch styles/design-system/{_variables,_typography,_animations,_components,_utilities,index}.css
touch config/{design-tokens,site,navigation}.ts

# 2. Refactorizar globals.css
# Dividir en módulos

# 3. Actualizar tailwind.config.ts
# Usar design tokens
```

#### Día 5: Documentación

```bash
# 1. Crear documentación
touch docs/architecture/{ESTRUCTURA,SISTEMA_DISEÑO,ECOMMERCE}.md

# 2. Actualizar README.md

# 3. Documentar APIs
```

### Fase 3: Preparación Ecommerce (3-5 días)

#### Días 6-7: Base de Datos y Servicios

```bash
# 1. Crear migración de ecommerce
touch supabase/migrations/003_ecommerce.sql

# 2. Crear servicios
touch lib/services/{stripe,email}.ts
touch lib/supabase/{products-db,orders-db}.ts

# 3. Aplicar migración
# Desde Supabase Dashboard
```

#### Días 8-9: Componentes de Ecommerce

```bash
# 1. Crear componentes base
mkdir -p components/features/shop
touch components/features/shop/{ProductCard,ProductGrid,ProductFilters,ProductDetails}.tsx

# 2. Crear hooks
touch lib/hooks/{use-cart,use-checkout}.tsx

# 3. Instalar dependencias
pnpm add stripe @stripe/stripe-js zustand
```

#### Día 10: Rutas y Páginas

```bash
# 1. Crear rutas de shop
mkdir -p app/\(marketing\)/shop/{cart,checkout}
touch app/\(marketing\)/shop/page.tsx
touch app/\(marketing\)/shop/\[slug\]/page.tsx
touch app/\(marketing\)/shop/cart/page.tsx
touch app/\(marketing\)/shop/checkout/page.tsx

# 2. Crear APIs
mkdir -p app/api/{products,orders,cart,checkout}
touch app/api/products/route.ts
touch app/api/orders/route.ts
touch app/api/checkout/route.ts
```

### Fase 4: Testing y Deploy (2 días)

#### Día 11: Testing

```bash
# 1. Probar build
pnpm build

# 2. Verificar tipos
pnpm tsc --noEmit

# 3. Lint
pnpm lint

# 4. Test local
pnpm dev
```

#### Día 12: Deploy

```bash
# 1. Commit cambios
git add .
git commit -m "refactor: eliminar sistema de reuniones y preparar ecommerce"

# 2. Push
git push origin refactor/eliminar-reuniones

# 3. Crear PR
gh pr create --title "Reestructuración: Eliminar reuniones y preparar ecommerce" --body "..."

# 4. Merge y deploy
# Vercel deployará automáticamente
```

---

## COMANDOS Y SCRIPTS

### Script de Limpieza Automatizado

Crear `/scripts/cleanup.sh`:

```bash
#!/bin/bash

echo "🧹 Iniciando limpieza del proyecto..."

# Backup
echo "📦 Creando backup..."
git checkout -b backup/antes-limpieza-$(date +%Y%m%d)
git push origin backup/antes-limpieza-$(date +%Y%m%d)
git checkout main
git checkout -b refactor/eliminar-reuniones

# Eliminar archivos
echo "🗑️  Eliminando archivos de reuniones..."
rm -rf app/api/calendar-availability
rm -rf app/api/schedule-meeting
rm -rf app/api/meetings
rm -rf app/api/token-status
rm -rf app/\(marketing\)/agendar-reunion
rm -rf app/\(dashboard\)/dashboard/meetings
rm lib/google-calendar.ts
rm lib/google-auth.ts
rm lib/supabase-meetings-db.ts
rm lib/server-meetings-db.ts
rm lib/local-meetings-db.ts
rm lib/auto-token-renewal.ts
rm lib/init-auto-tokens.ts
rm lib/token-maintenance.ts
rm lib/auto-token-refresh.ts
rm components/dashboard/project-meetings.tsx
rm components/dashboard/jitsi-meeting.tsx
rm scripts/maintain-tokens.js
rm scripts/get-google-auth-url.js
rm scripts/exchange-google-code.js
rm scripts/refresh-google-auth.js
rm scripts/update-tokens-from-playground.js
rm data/meetings.json
rm docs/flujos/transcripciones-reuniones.md
rm SETUP_WEBHOOK.md
rm TOKEN_MAINTENANCE.md

echo "🗑️  Eliminando archivos sin uso..."
rm debug-login.js
rm tsc_output*.txt
rm package-lock.json.backup
rm clear-browser-storage.html
rm app/\(dashboard\)/dashboard/page-backup.tsx
rm app/\(dashboard\)/dashboard/page-new.tsx
rm app/\(dashboard\)/dashboard/page-original.tsx
rm app/\(dashboard\)/dashboard/page-simple.tsx

# Crear carpeta tests
echo "📁 Organizando tests..."
mkdir -p tests/utils
mv test-supabase.js tests/utils/ 2>/dev/null || true
mv check-user-exists.js tests/utils/ 2>/dev/null || true

# Limpiar dependencias
echo "📦 Limpiando dependencias..."
pnpm remove googleapis nodemailer @types/nodemailer open date-fns-tz

echo "✨ Limpieza completada!"
echo "🔄 Ejecuta 'pnpm install' para reinstalar dependencias"
```

### Script de Reestructuración

Crear `/scripts/restructure.sh`:

```bash
#!/bin/bash

echo "🏗️  Iniciando reestructuración..."

# Crear nueva estructura
echo "📁 Creando nueva estructura de carpetas..."
mkdir -p lib/{services,constants,types}
mkdir -p components/features/{auth,blog,shop,dashboard}
mkdir -p components/global/{layout,providers,error-handling}
mkdir -p components/ui/{primitives,composed,feedback,forms}
mkdir -p styles/design-system
mkdir -p config
mkdir -p docs/architecture

# Crear archivos de configuración
echo "⚙️  Creando archivos de configuración..."
touch styles/design-system/{_variables,_typography,_animations,_components,_utilities,index}.css
touch config/{design-tokens,site,navigation}.ts
touch docs/architecture/{ESTRUCTURA,SISTEMA_DISEÑO,ECOMMERCE}.md

echo "✅ Reestructuración completada!"
echo "📝 Ahora debes mover manualmente los componentes a sus nuevas ubicaciones"
```

### Script de Verificación

Crear `/scripts/verify.sh`:

```bash
#!/bin/bash

echo "🔍 Verificando proyecto..."

# Verificar que no existan archivos de reuniones
echo "Verificando archivos eliminados..."
if [ -f "lib/google-calendar.ts" ]; then
  echo "❌ ERROR: lib/google-calendar.ts aún existe"
  exit 1
fi

# Verificar build
echo "🏗️  Verificando build..."
pnpm build

# Verificar tipos
echo "📝 Verificando tipos..."
pnpm tsc --noEmit

# Verificar lint
echo "🔍 Verificando lint..."
pnpm lint

echo "✅ Verificación completada exitosamente!"
```

### Uso de Scripts

```bash
# Dar permisos de ejecución
chmod +x scripts/*.sh

# Ejecutar limpieza
./scripts/cleanup.sh

# Ejecutar reestructuración
./scripts/restructure.sh

# Verificar
./scripts/verify.sh
```

### Actualizar .gitignore

```gitignore
# Agregar estas líneas si no existen

# Build outputs
.next/
out/
build/
dist/

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Testing
coverage/
.nyc_output/
tests/screenshots/
tests/videos/

# TypeScript
*.tsbuildinfo
next-env.d.ts
tsc_output*.txt

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Environment
.env
.env*.local
.env.production

# Vercel
.vercel

# Supabase
**/supabase/.branches
**/supabase/.temp

# Backups
*.backup
package-lock.json.backup
```

---

## CHECKLIST FINAL

### Pre-Limpieza
- [ ] Backup del proyecto (rama `backup/antes-limpieza`)
- [ ] Backup de base de datos Supabase
- [ ] Documentar variables de entorno actuales
- [ ] Revisar si hay código de reuniones en uso actualmente

### Limpieza
- [ ] Eliminar APIs de reuniones (4 endpoints)
- [ ] Eliminar servicios de Google Calendar (7 archivos)
- [ ] Eliminar páginas de reuniones (2 rutas)
- [ ] Eliminar componentes de reuniones (2 componentes)
- [ ] Eliminar scripts OAuth (6 archivos)
- [ ] Eliminar datos locales (1 archivo)
- [ ] Eliminar documentación de reuniones (3 archivos)
- [ ] Eliminar variantes de dashboard (4 archivos)
- [ ] Eliminar archivos vacíos y tests (6+ archivos)
- [ ] Mover archivos de test a `/tests`
- [ ] Limpiar dependencias npm (5 paquetes)
- [ ] Actualizar package.json (eliminar scripts)
- [ ] Limpiar base de datos (DROP tables)
- [ ] Actualizar .gitignore

### Reestructuración
- [ ] Crear nueva estructura de carpetas
- [ ] Mover componentes UI a nuevas ubicaciones
- [ ] Crear archivos de sistema de diseño
- [ ] Crear archivos de configuración
- [ ] Actualizar tailwind.config.ts
- [ ] Refactorizar globals.css
- [ ] Actualizar imports en componentes

### Sistema de Diseño
- [ ] Crear `_variables.css`
- [ ] Crear `_typography.css`
- [ ] Crear `_animations.css`
- [ ] Crear `_components.css`
- [ ] Crear `design-tokens.ts`
- [ ] Crear `site.ts`
- [ ] Documentar sistema de diseño

### Ecommerce
- [ ] Crear migración SQL (003_ecommerce.sql)
- [ ] Aplicar migración en Supabase
- [ ] Crear servicios (Stripe, Products, Orders)
- [ ] Crear hooks (useCart, useCheckout)
- [ ] Crear componentes base (10+ componentes)
- [ ] Crear rutas de shop (4 páginas)
- [ ] Crear APIs de ecommerce (4 endpoints)
- [ ] Instalar dependencias (Stripe, Zustand)

### Testing
- [ ] Build exitoso (`pnpm build`)
- [ ] TypeScript sin errores (`pnpm tsc --noEmit`)
- [ ] Lint sin errores (`pnpm lint`)
- [ ] Dev server funciona (`pnpm dev`)
- [ ] Testing manual de rutas principales
- [ ] Testing de autenticación
- [ ] Testing de dashboard

### Documentación
- [ ] Actualizar README.md
- [ ] Crear ESTRUCTURA.md
- [ ] Crear SISTEMA_DISEÑO.md
- [ ] Crear ECOMMERCE.md
- [ ] Documentar APIs
- [ ] Documentar componentes clave

### Deploy
- [ ] Commit y push
- [ ] Crear Pull Request
- [ ] Review de código
- [ ] Merge a main
- [ ] Deploy en Vercel
- [ ] Verificar en producción
- [ ] Aplicar migraciones en producción

---

## RESUMEN

### Lo que Eliminamos
- ❌ 25+ archivos relacionados con reuniones (~3,700 líneas)
- ❌ 5 dependencias npm
- ❌ 4 endpoints API
- ❌ 2 páginas completas
- ❌ Sistema completo de Google Calendar OAuth

### Lo que Agregamos
- ✅ Sistema de diseño globalizado
- ✅ Estructura de carpetas optimizada
- ✅ Base de datos de ecommerce
- ✅ Configuración centralizada
- ✅ Documentación completa
- ✅ Preparación para productos/pedidos

### Lo que Mantenemos
- ✅ Stack tecnológico (Next.js 15 + React 19 + Supabase)
- ✅ Sistema de autenticación
- ✅ Dashboard de proyectos
- ✅ Blog y portfolio
- ✅ Todos los componentes UI (shadcn/ui)
- ✅ Animaciones (GSAP, Framer Motion)
- ✅ Sistema de temas (dark mode)

### Próximos Pasos Después de la Reestructuración

1. **Implementar Ecommerce:**
   - Crear productos de prueba
   - Integrar Stripe
   - Testing de flujo de compra

2. **Optimizaciones:**
   - Implementar ISR para productos
   - Optimizar imágenes con Sharp
   - Agregar sitemap para SEO

3. **Features Adicionales:**
   - Sistema de reviews
   - Wishlist
   - Cupones de descuento
   - Analytics de productos

---

**Fecha de creación:** Junio 26, 2026  
**Versión:** 1.0  
**Autor:** Diagnóstico automatizado V1TR0
