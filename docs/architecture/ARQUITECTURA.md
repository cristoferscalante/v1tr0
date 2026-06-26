# Arquitectura del Proyecto V1TR0

**Última actualización:** Junio 26, 2026  
**Versión:** 2.0  
**Stack:** Next.js 15 + React 19 + TypeScript 5 + Supabase

---

## Tabla de Contenidos

1. [Estructura de Carpetas](#estructura-de-carpetas)
2. [Sistema de Diseño](#sistema-de-diseño)
3. [Configuración Global](#configuración-global)
4. [Convenciones de Código](#convenciones-de-código)
5. [Flujo de Datos](#flujo-de-datos)

---

## Estructura de Carpetas

```
v1tr0-web/
├── app/                          # App Router de Next.js 15
│   ├── (marketing)/             # Grupo de rutas públicas
│   │   ├── /                    # Home
│   │   ├── /about               # Acerca de
│   │   ├── /blog                # Blog
│   │   ├── /portfolio           # Portfolio
│   │   ├── /services            # Servicios
│   │   └── /shop                # 🆕 Ecommerce (futuro)
│   ├── (auth)/                  # Grupo de autenticación
│   │   ├── /login
│   │   └── /register
│   ├── (dashboard)/             # Dashboard de admin
│   │   └── /dashboard           # Panel principal
│   ├── /client-dashboard        # Dashboard de clientes
│   └── /api                     # API Routes
│
├── components/                   # Componentes React
│   ├── ui/                      # Componentes UI (shadcn/ui)
│   ├── home/                    # Componentes específicos de home
│   ├── blog/                    # Componentes de blog
│   ├── dashboard/               # Componentes de dashboard
│   ├── global/                  # Componentes globales
│   └── 3d/                      # Componentes 3D
│
├── config/                       # 🆕 Configuración global
│   ├── design-tokens.ts         # Tokens de diseño
│   └── site.ts                  # Configuración del sitio
│
├── lib/                          # Librerías y utilidades
│   ├── supabase/                # Cliente Supabase
│   ├── services/                # 🆕 Servicios (futuro)
│   ├── constants/               # 🆕 Constantes
│   ├── types/                   # 🆕 Tipos TypeScript
│   └── utils/                   # Utilidades
│
├── hooks/                        # React Hooks personalizados
│
├── styles/                       # Estilos globales
│   ├── design-system/           # 🆕 Sistema de diseño modular
│   │   ├── _variables.css       # Variables CSS
│   │   ├── _typography.css      # Tipografía
│   │   ├── _animations.css      # Animaciones
│   │   └── index.css            # Barrel export
│   └── globals.css              # Importaciones y overrides
│
├── public/                       # Assets estáticos
│   └── imagenes/                # Imágenes
│
├── supabase/                     # Configuración Supabase
│   ├── migrations/              # Migraciones SQL
│   └── functions/               # Edge Functions
│
├── docs/                         # 🆕 Documentación
│   └── architecture/            # Documentación de arquitectura
│
├── tests/                        # 🆕 Tests
│   └── utils/                   # Utilidades de testing
│
├── scripts/                      # Scripts de mantenimiento
│
├── tailwind.config.ts           # Configuración Tailwind (con design tokens)
├── next.config.js               # Configuración Next.js
├── tsconfig.json                # Configuración TypeScript
└── package.json                 # Dependencias
```

---

## Sistema de Diseño

### Filosofía

El sistema de diseño V1TR0 está construido sobre tres pilares:

1. **Modularidad:** Separación clara entre variables, tipografía y animaciones
2. **Consistencia:** Uso de design tokens para valores reutilizables
3. **Escalabilidad:** Fácil de extender y mantener

### Estructura del Sistema

```
styles/design-system/
├── _variables.css      # Variables CSS (colores, spacing, etc.)
├── _typography.css     # Estilos de tipografía
├── _animations.css     # Keyframes y animaciones
└── index.css           # Importaciones
```

### Design Tokens (`config/design-tokens.ts`)

Los design tokens son la fuente única de verdad para valores de diseño:

```typescript
import { designTokens } from '@/config/design-tokens';

// Uso en código
const primaryColor = designTokens.colors.primary.DEFAULT; // '#08a696'
const spacing = designTokens.spacing.md; // '1rem'
```

### Variables CSS

Las variables CSS están sincronizadas con los design tokens:

```css
/* Modo claro */
--color-primary: #08a696;
--spacing-md: 1rem;
--font-size-lg: 1.125rem;

/* Modo oscuro */
.dark {
  --color-primary: #08a696;
  --color-highlight: #26ffdf;
}
```

### Tailwind CSS

Tailwind consume los design tokens automáticamente:

```tsx
<div className="text-primary bg-background p-md rounded-lg">
  Contenido
</div>
```

---

## Configuración Global

### Site Config (`config/site.ts`)

Configuración centralizada del sitio:

```typescript
import { siteConfig } from '@/config/site';

// Uso
console.log(siteConfig.name); // 'V1TR0'
console.log(siteConfig.navigation.main); // Array de navegación

// Helpers
import { getPageTitle, formatCurrency } from '@/config/site';

const title = getPageTitle('Blog'); // 'Blog | V1TR0'
const price = formatCurrency(100); // '$100.00'
```

### Configuración Disponible

- `name`, `title`, `description`
- `metadata` (keywords, SEO)
- `company` (información legal)
- `social` (redes sociales)
- `navigation` (menús)
- `ecommerce` (configuración de tienda)
- `features` (feature flags)
- `seo` (OpenGraph, Twitter)

---

## Convenciones de Código

### Nombres de Archivos

- **Componentes:** PascalCase (`UserProfile.tsx`)
- **Utilidades:** camelCase (`formatDate.ts`)
- **Hooks:** camelCase con prefijo `use` (`useAuth.tsx`)
- **Tipos:** PascalCase (`UserData.ts`)
- **CSS Modules:** kebab-case (`button.module.css`)

### Estructura de Componentes

```tsx
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { User } from '@/lib/types';

// 2. Types/Interfaces
interface UserCardProps {
  user: User;
  onEdit?: () => void;
}

// 3. Componente
export function UserCard({ user, onEdit }: UserCardProps) {
  // 3.1 Hooks
  const [isEditing, setIsEditing] = useState(false);
  
  // 3.2 Handlers
  const handleEdit = () => {
    setIsEditing(true);
    onEdit?.();
  };
  
  // 3.3 Render
  return (
    <div className="p-4 rounded-lg border">
      <h3>{user.name}</h3>
      <Button onClick={handleEdit}>Edit</Button>
    </div>
  );
}
```

### Imports

Usar alias de TypeScript:

```typescript
// ✅ Bien
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { formatDate } from '@/lib/utils';

// ❌ Evitar
import { Button } from '../../../components/ui/button';
```

### Estilos

Prioridad de estilos:

1. **Tailwind CSS:** Primera opción
2. **Variables CSS:** Para valores dinámicos
3. **CSS Modules:** Solo para casos específicos

```tsx
// ✅ Bien - Tailwind
<div className="bg-primary text-white p-4 rounded-lg">

// ✅ Bien - Variables CSS
<div style={{ color: 'var(--color-primary)' }}>

// ⚠️ Usar solo si es necesario - CSS Modules
import styles from './button.module.css';
<div className={styles.button}>
```

---

## Flujo de Datos

### Autenticación (Supabase)

```
Usuario → Formulario Login → /api/auth → Supabase Auth
                                            ↓
                                      Session Cookie
                                            ↓
                                    Middleware (verificación)
                                            ↓
                                      Página Protegida
```

### Server Components vs Client Components

**Server Components (por defecto):**
- Acceso directo a base de datos
- No necesitan `'use client'`
- Mejor performance

**Client Components (cuando sea necesario):**
- Interactividad (useState, useEffect)
- Event handlers
- Browser APIs

```tsx
// Server Component (por defecto)
async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  return <article>{post.content}</article>;
}

// Client Component
'use client';
function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### API Routes

```
Cliente → /api/products
              ↓
         route.ts (POST)
              ↓
         Validación (Zod)
              ↓
         Supabase Query
              ↓
         Respuesta JSON
```

---

## Mejores Prácticas

### Performance

1. **Usar Server Components por defecto**
2. **Lazy loading para componentes pesados**
3. **Optimizar imágenes con Next.js Image**
4. **Código splitting automático**

### Accesibilidad

1. **Usar componentes semánticos de shadcn/ui**
2. **Agregar aria-labels**
3. **Navegación por teclado**
4. **Contraste de colores (WCAG AA)**

### SEO

1. **Metadata en cada página**
2. **Estructura semántica (h1, h2, etc.)**
3. **URLs descriptivas**
4. **Sitemap automático**

---

## Próximos Pasos

1. **Migrar componentes:** Reorganizar componentes UI en subcarpetas lógicas
2. **Ecommerce:** Implementar rutas y componentes de tienda
3. **Testing:** Agregar tests unitarios y e2e
4. **Documentación:** Documentar componentes principales

---

**Mantenido por:** Equipo V1TR0  
**Última revisión:** Junio 26, 2026
