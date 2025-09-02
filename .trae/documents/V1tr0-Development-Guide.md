# V1tr0 - Guía de Desarrollo

## 1. Introducción

Esta guía proporciona las mejores prácticas, convenciones y flujos de trabajo para el desarrollo del proyecto V1tr0. Está dirigida a desarrolladores que trabajarán en el mantenimiento y evolución de la plataforma.

## 2. Estructura del Proyecto

### 2.1 Organización de Directorios

```
frontend/
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # Grupo de rutas - Autenticación
│   │   ├── login/         # Página de login
│   │   ├── register/      # Página de registro
│   │   └── layout.tsx     # Layout específico de auth
│   ├── (dashboard)/       # Grupo de rutas - Dashboard
│   │   ├── dashboard/     # Páginas del dashboard
│   │   └── layout.tsx     # Layout del dashboard
│   ├── (marketing)/       # Grupo de rutas - Marketing
│   │   ├── about/         # Página sobre nosotros
│   │   ├── blog/          # Blog corporativo
│   │   ├── services/      # Páginas de servicios
│   │   ├── portfolio/     # Portafolio
│   │   ├── page.tsx       # Página de inicio
│   │   └── layout.tsx     # Layout de marketing
│   ├── api/               # API Routes
│   │   ├── meetings/      # Endpoints de reuniones
│   │   ├── contact/       # Endpoints de contacto
│   │   └── auth/          # Endpoints de autenticación
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout raíz
│   └── providers.tsx      # Providers globales
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── home/             # Componentes específicos del home
│   ├── blog/             # Componentes del blog
│   ├── auth/             # Componentes de autenticación
│   ├── global/           # Componentes globales
│   └── [feature]/        # Componentes por feature
├── hooks/                # Custom React hooks
├── lib/                  # Utilidades y configuraciones
│   ├── supabase/         # Cliente y utilidades de Supabase
│   ├── auth/             # Lógica de autenticación
│   ├── utils/            # Funciones utilitarias
│   └── validations/      # Esquemas de validación Zod
├── types/                # Definiciones de tipos TypeScript
├── content/              # Contenido MDX (blog)
├── public/               # Assets estáticos
└── styles/               # Estilos adicionales
```

### 2.2 Convenciones de Nomenclatura

**Archivos y Directorios:**
- Componentes: `PascalCase.tsx` (ej: `UserProfile.tsx`)
- Páginas: `kebab-case` para directorios, `page.tsx` para archivos
- Hooks: `use-kebab-case.tsx` (ej: `use-auth.tsx`)
- Utilidades: `kebab-case.ts` (ej: `format-date.ts`)
- Tipos: `kebab-case.types.ts` (ej: `user.types.ts`)

**Variables y Funciones:**
- Variables: `camelCase`
- Funciones: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`
- Componentes: `PascalCase`
- Interfaces/Types: `PascalCase`

## 3. Convenciones de Código

### 3.1 Componentes React

**Estructura de Componente:**
```typescript
'use client'; // Solo si es necesario

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { ComponentProps } from './types';

interface Props extends ComponentProps {
  title: string;
  description?: string;
  className?: string;
}

export function ComponentName({ 
  title, 
  description, 
  className,
  ...props 
}: Props) {
  const [state, setState] = useState<string>('');

  useEffect(() => {
    // Efectos aquí
  }, []);

  return (
    <div className={cn('base-classes', className)} {...props}>
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

// Export por defecto solo si es necesario
export default ComponentName;
```

**Mejores Prácticas:**
- Usar Server Components por defecto
- Añadir `'use client'` solo cuando sea necesario
- Extraer lógica compleja a custom hooks
- Usar TypeScript estricto
- Implementar error boundaries cuando sea apropiado

### 3.2 Custom Hooks

**Estructura de Hook:**
```typescript
import { useState, useEffect, useCallback } from 'react';
import type { HookReturn, HookOptions } from './types';

export function useCustomHook(options: HookOptions): HookReturn {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall(options);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
```

### 3.3 API Routes

**Estructura de API Route:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';
import { validateRequest } from '@/lib/auth/validate';

// Esquema de validación
const requestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    
    // Lógica de la API
    const { data, error } = await supabase
      .from('table')
      .select('*')
      .range((+page - 1) * 10, +page * 10 - 1);

    if (error) throw error;

    return NextResponse.json({ data, success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validar autenticación si es necesario
    const user = await validateRequest(request);
    
    const body = await request.json();
    const validatedData = requestSchema.parse(body);

    // Lógica de creación
    const { data, error } = await supabase
      .from('table')
      .insert(validatedData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data, success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation Error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

## 4. Gestión del Estado

### 4.1 Estado Local

**Para estado simple:**
```typescript
const [count, setCount] = useState(0);
const [user, setUser] = useState<User | null>(null);
```

**Para estado complejo:**
```typescript
const [state, dispatch] = useReducer(reducer, initialState);
```

### 4.2 Estado Global

**Context API para estado compartido:**
```typescript
// contexts/auth-context.tsx
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Lógica de autenticación

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### 4.3 Estado del Servidor

**Para datos del servidor, usar SWR o React Query:**
```typescript
import useSWR from 'swr';

function useUsers() {
  const { data, error, mutate } = useSWR('/api/users', fetcher);

  return {
    users: data,
    loading: !error && !data,
    error,
    mutate,
  };
}
```

## 5. Estilos y UI

### 5.1 Tailwind CSS

**Convenciones de clases:**
```typescript
// Usar cn() para combinar clases
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

**Responsive Design:**
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card className="p-6 hover:shadow-lg transition-shadow">
    {/* Contenido */}
  </Card>
</div>
```

### 5.2 Componentes UI

**Usar shadcn/ui como base:**
```bash
# Añadir nuevos componentes
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
```

**Personalizar componentes:**
```typescript
// components/ui/custom-button.tsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
}

export function CustomButton({ 
  loading, 
  children, 
  className, 
  ...props 
}: CustomButtonProps) {
  return (
    <Button 
      className={cn('relative', className)} 
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {children}
    </Button>
  );
}
```

## 6. Manejo de Datos

### 6.1 Supabase

**Cliente de Supabase:**
```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const supabase = createClientComponentClient();
```

**Operaciones CRUD:**
```typescript
// lib/supabase/meetings.ts
export async function getMeetings(filters?: MeetingFilters) {
  let query = supabase
    .from('meetings')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.date) {
    query = query.eq('date', filters.date);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function createMeeting(meeting: CreateMeetingData) {
  const { data, error } = await supabase
    .from('meetings')
    .insert(meeting)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

### 6.2 Validación con Zod

**Esquemas de validación:**
```typescript
// lib/validations/meeting.ts
import { z } from 'zod';

export const createMeetingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  clientName: z.string().min(1, 'Name is required'),
  clientEmail: z.string().email('Invalid email'),
  clientPhone: z.string().optional(),
  service: z.string().min(1, 'Service is required'),
  message: z.string().optional(),
});

export type CreateMeetingData = z.infer<typeof createMeetingSchema>;
```

## 7. Testing

### 7.1 Tests Unitarios

**Configuración con Vitest:**
```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 7.2 Tests de Integración

**Testing de API Routes:**
```typescript
// __tests__/api/meetings.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/meetings/route';

describe('/api/meetings', () => {
  beforeEach(() => {
    // Setup de test
  });

  it('GET returns meetings list', async () => {
    const { req, res } = createMocks({ method: 'GET' });
    
    await handler(req, res);
    
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
  });
});
```

## 8. Performance y Optimización

### 8.1 Optimización de Componentes

**Lazy Loading:**
```typescript
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Skeleton className="h-32 w-full" />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

**Memoización:**
```typescript
import { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ 
  data, 
  onUpdate 
}: Props) {
  const processedData = useMemo(() => {
    return data.map(item => expensiveOperation(item));
  }, [data]);

  const handleUpdate = useCallback((id: string) => {
    onUpdate(id);
  }, [onUpdate]);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} data={item} onUpdate={handleUpdate} />
      ))}
    </div>
  );
});
```

### 8.2 Optimización de Imágenes

**Next.js Image:**
```typescript
import Image from 'next/image';

function OptimizedImage() {
  return (
    <Image
      src="/hero-image.jpg"
      alt="Hero image"
      width={800}
      height={600}
      priority // Para imágenes above-the-fold
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
}
```

## 9. SEO y Metadata

### 9.1 Metadata Dinámica

**En páginas:**
```typescript
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}
```

### 9.2 Structured Data

**JSON-LD:**
```typescript
function BlogPostStructuredData({ post }: { post: BlogPost }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.publishedDate,
    dateModified: post.updatedDate,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
```

## 10. Seguridad

### 10.1 Validación de Entrada

**Siempre validar en el servidor:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar con Zod
    const validatedData = createMeetingSchema.parse(body);
    
    // Sanitizar datos si es necesario
    const sanitizedData = {
      ...validatedData,
      clientName: sanitizeHtml(validatedData.clientName),
      message: sanitizeHtml(validatedData.message || ''),
    };

    // Procesar datos validados
    const result = await createMeeting(sanitizedData);
    
    return NextResponse.json({ data: result, success: true });
  } catch (error) {
    // Manejo de errores
  }
}
```

### 10.2 Autenticación y Autorización

**Middleware de autenticación:**
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Proteger rutas del dashboard
  if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

## 11. Deployment y CI/CD

### 11.1 Build y Deploy

**Scripts de package.json:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "analyze": "ANALYZE=true npm run build"
  }
}
```

### 11.2 Variables de Entorno

**Por ambiente:**
```bash
# .env.local (desarrollo)
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# .env.production (producción)
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://v1tr0.com
```

## 12. Monitoreo y Debugging

### 12.1 Logging

**Configurar logging estructurado:**
```typescript
// lib/logger.ts
const logger = {
  info: (message: string, meta?: object) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta }));
  },
  error: (message: string, error?: Error, meta?: object) => {
    console.error(JSON.stringify({ 
      level: 'error', 
      message, 
      error: error?.message,
      stack: error?.stack,
      ...meta 
    }));
  },
};

export { logger };
```

### 12.2 Error Boundaries

**Componente Error Boundary:**
```typescript
'use client';

import { Component, ReactNode } from 'react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    logger.error('Error Boundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center">
          <h2>Algo salió mal</h2>
          <p>Por favor, recarga la página</p>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

**Esta guía debe ser actualizada regularmente conforme evolucione el proyecto y las mejores prácticas del ecosistema React/Next.js.**

**Última actualización:** Enero 2025  
**Versión:** 1.0