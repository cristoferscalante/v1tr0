# Instrucciones para agentes de IA — v1tr0-web

Contexto accionable para editar, implementar o revisar funcionalidades en este
proyecto. Mantener este archivo alineado con `CLAUDE.md`.

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS + Radix UI.
- **Base de datos**: Neon (Postgres) vía **Drizzle ORM**. Esquema en `lib/db/schema.ts`,
  cliente en `lib/db/index.ts`, migraciones SQL en `drizzle/migrations/`.
- **Autenticación**: **NextAuth v5** (`auth.ts`) con DrizzleAdapter y estrategia de
  base de datos. El único proveedor es Google OAuth.
- **Despliegue**: Vercel.

> Este proyecto **ya no usa Supabase**. Si encuentras referencias a
> `@supabase/supabase-js`, `auth.users`, políticas RLS o `NEXT_PUBLIC_SUPABASE_*`,
> son restos históricos: no los tomes como patrón a seguir.

## Gestor de paquetes: pnpm (obligatorio)

Declarado en `packageManager` de `package.json`. Nunca `npm install`: npm rehace
`node_modules/` con su layout plano y rompe el árbol de enlaces de pnpm.

- Instalar: `pnpm install` · Agregar: `pnpm add <paquete>` · Binarios: `pnpm exec <bin>`
- Los scripts sí corren con cualquiera (`npm run dev` ≡ `pnpm dev`).

## Arquitectura de rutas

`app/` usa grupos entre paréntesis para acotar layouts y providers — preservarlos
al agregar rutas:

- `app/(marketing)/` — sitio público (tienda, servicios, blog, ubicaciones).
- `app/(admin)/admin/` — panel del equipo. Rol `admin` o `team`.
- `app/client-dashboard/` — portal del cliente. Rol `client`.
- `app/(auth)/` — login y registro.
- `app/api/` — route handlers.

`middleware.ts` protege `/admin/*` y `/client-dashboard/*` en el servidor y
redirige `/dashboard/*` → `/admin/*` (el panel viejo ya no existe).

## Autorización

- Rutas de equipo: `requireAdminSession()` de `lib/auth/require-admin.ts`, que
  lanza `AdminAuthError` — captúralo y devuelve `error.response`.
- Rutas de cliente: `auth()` y filtrar **siempre** por `session.user.id` contra
  `projects.clientId`. Ver `app/api/projects/[id]/details/route.ts`.
- Acceso compartido cliente/equipo a una tarea: `resolveTaskAccess()` de
  `lib/auth/task-access.ts`.

## Gestión de tareas

- `phaseTasks.status` (`todo`/`in_progress`/`blocked`/`done`) es la fuente de
  verdad; `completed` es su espejo, mantenido por la API. No escribir `completed`
  a mano.
- Toda mutación relevante registra bitácora con `logActivity()` y avisa con
  `notify()` (`lib/activity/`). Ambas son best-effort: no interrumpen la mutación.

## Convenciones

- Los paneles son solo tema oscuro por decisión de producto. Primitivas
  compartidas en `components/shared/panel-ui.tsx`; vocabulario de estados en
  `components/shared/task-status.ts`.
- ESLint exige llaves en todo `if` (`curly`) y `===` (`eqeqeq`).
- Comentarios en español, explicando **por qué**, no qué.
- Contenido del blog en `content/blog/` (MDX, procesado por `lib/mdx.ts`).

## Pruebas

`pnpm test:e2e` (Playwright) cubre el flujo de compra. Espera un servidor en
`localhost:3000`; con `E2E_START_SERVER=1` lo arranca Playwright. La sesión de
prueba se siembra en la base (`e2e/seed-session.ts`) porque el login es solo
Google OAuth. No levantes un segundo dev server: comparten `.next`.
