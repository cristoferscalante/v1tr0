## Copilot / AI agent quick guide — v1tr0## Copilot / AI agent quick guide — v1tr0## Copilot / AI agent quick guide — v1tr0



Purpose: give an AI coding agent immediate, actionable context to edit, implement, or review features in this Next.js + Supabase business application.



- Repo type: Next.js 15 (app router), TypeScript, Tailwind CSS, Radix UI components with 3D elements.Purpose: give an AI coding agent immediate, actionable context to edit, implement, or review features in this Next.js + Supabase business application.Purpose: give a## Key Code Patterns

- Key folders: `app/` (routes + layouts), `components/` (UI + 3D), `lib/` (services/clients), `hooks/` (state management), `content/` (MDX blog).



Quick commands (from `package.json`):

- Start dev server: `pnpm dev`.- Repo type: Next.js 15 (app router), TypeScript, Tailwind CSS, Radix UI components with 3D elements.**Supabase Meeting Data Access**:

- Build: `pnpm build`.

- Lint: `pnpm lint`.- Key folders: `app/` (routes + layouts), `components/` (UI + 3D), `lib/` (services/clients), `hooks/` (state management), `content/` (MDX blog).```typescript



## Core Architecture & Business Logicimport { supabaseMeetingsDB } from '@/lib/supabase-meetings-db'



**Meeting & Calendar System**: Primary business feature for scheduling client meetings.Quick commands (from `package.json`):const meetings = await supabaseMeetingsDB.getMeetings()

- Data layer: `lib/supabase-meetings-db.ts` handles Supabase + Google Calendar sync.

- API routes: `app/api/meetings/`, `app/api/calendar-availability/`, `app/api/schedule-meeting/`.- Start dev server: `npm run dev` (supports pnpm/yarn).```

- Key types: `Meeting`, `Client`, `ClientInput` with Google Calendar integration.

- Real-time updates via `hooks/use-websocket.tsx` with Socket.io client.- Build: `npm run build`.



**Auth & Data Integration**:- Lint: `npm run lint`.**Auth State in Components**:

- Client: `lib/supabase/client.ts` exports `supabase` with enhanced session persistence.

- Auth provider: `hooks/use-auth.tsx` wraps entire app via `app/providers.tsx`.```typescript

- Middleware: Currently minimal (`middleware.ts`) — auth protection moved to hook level.

- Required env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, plus Google Calendar vars.## Core Architecture & Business Logicimport { useAuth } from '@/hooks/use-auth'



## Project-Specific Conventions (Preserve When Editing)const { user, session, loading } = useAuth()



**Route Groups**: `app/` uses parentheses grouping - `(auth)`, `(dashboard)`, `(marketing)`, `client-dashboard/`**Meeting & Calendar System**: Primary business feature for scheduling client meetings.```

**Auth Flow**: Login/register in `(auth)/`, OAuth callback in `auth/callback/`, session management via hooks

**Component Organization**: UI components mirror app sections (`components/dashboard/`, `components/home/`)  - Data layer: `lib/supabase-meetings-db.ts` handles Supabase + Google Calendar sync.

**Styling**: Tailwind + `globals.css`, `class-variance-authority` for component variants

**State**: Custom hooks only (`use-auth.tsx`, `use-websocket.tsx`) - no external state libs- API routes: `app/api/meetings/`, `app/api/calendar-availability/`, `app/api/schedule-meeting/`.**WebSocket Real-time Updates**:



## Integration & External Dependencies- Key types: `Meeting`, `Client`, `ClientInput` with Google Calendar integration.```typescript



**Real-time Communication**: - Real-time updates via `hooks/use-websocket.tsx` with Socket.io client.import { useWebSocket } from '@/hooks/use-websocket'

- WebSocket: `socket.io-client` via `hooks/use-websocket.tsx` with auth integration.

- Google Calendar: `lib/google-calendar.ts` handles OAuth2 + event sync with meetings.const { socket, connected } = useWebSocket()



**3D & Animation Stack**:**Auth & Data Integration**:```

- Three.js via `@react-three/fiber` and `@react-three/drei` in `components/3d/`.

- GSAP for complex animations with React integration via `@gsap/react`.- Client: `lib/supabase/client.ts` exports `supabase` with enhanced session persistence.

- Example: `components/3d/V1tr0Logo3D.tsx` shows glass morphism + camera views pattern.

- Auth provider: `hooks/use-auth.tsx` wraps entire app via `app/providers.tsx`.## Development Notes

**Content & Blog System**:

- MDX processing via `lib/mdx.ts` with gray-matter frontmatter parsing.- Middleware: Currently minimal (`middleware.ts`) — auth protection moved to hook level.

- Blog content in `content/blog/` directory with reading time calculation.

- Video/meeting: Jitsi components under `components/client/jitsi-meeting.tsx` — be careful modifying global CSS.- Required env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, plus Google Calendar vars.- **Next.js 15 + App Router**: Server vs client components critical. Use `"use client"` for browser APIs.



## Where to Look First- **No Testing Framework**: Add tests only after confirming preferred stack.



**Meeting/Calendar Features**: `lib/supabase-meetings-db.ts`, `app/api/meetings/`, `hooks/use-websocket.tsx`## Project-Specific Conventions (Preserve When Editing)- **Environment Setup**: Requires `.env.local` with Supabase + Google Calendar credentials.

**Authentication Changes**: `lib/supabase/client.ts`, `hooks/use-auth.tsx`, `app/providers.tsx`

**Layout/Provider Updates**: `app/layout-with-providers.tsx`, `app/providers.tsx`- **Middleware**: Currently minimal auth protection - most auth logic in hooks.ing agent immediate, actionable context to edit, implement, or review features in this Next.js + Supabase business application.

**3D/Animation Work**: `components/3d/`, `hooks/use-gsap-*.tsx`, check Three.js imports

**Blog/Content**: `lib/mdx.ts`, `content/blog/`, `app/(marketing)/blog/`**Route Groups**: `app/` uses parentheses grouping - `(auth)`, `(dashboard)`, `(marketing)`, `client-dashboard/`



## Key Code Patterns**Auth Flow**: Login/register in `(auth)/`, OAuth callback in `auth/callback/`, session management via hooks- Repo type: Next.js 15 (app router), TypeScript, Tailwind CSS, Radix UI components with 3D elements.



**Supabase Meeting Data Access**:**Component Organization**: UI components mirror app sections (`components/dashboard/`, `components/home/`)  - Key folders: `app/` (routes + layouts), `components/` (UI + 3D), `lib/` (services/clients), `hooks/` (state management), `content/` (MDX blog).

```typescript

import { supabaseMeetingsDB } from '@/lib/supabase-meetings-db'**Styling**: Tailwind + `globals.css`, `class-variance-authority` for component variants

const meetings = await supabaseMeetingsDB.getMeetings()

```**State**: Custom hooks only (`use-auth.tsx`, `use-websocket.tsx`) - no external state libsQuick commands (from `package.json`):



**Auth State in Components**:- Start dev server: `npm run dev` (supports pnpm/yarn).

```typescript

import { useAuth } from '@/hooks/use-auth'## Integration & External Dependencies- Build: `npm run build`.

const { user, session, loading } = useAuth()

```- Lint: `npm run lint`.



**WebSocket Real-time Updates**:**Real-time Communication**: 

```typescript

import { useWebSocket } from '@/hooks/use-websocket'- WebSocket: `socket.io-client` via `hooks/use-websocket.tsx` with auth integration.## Core Architecture & Business Logic

const { socket, connected } = useWebSocket()

```- Google Calendar: `lib/google-calendar.ts` handles OAuth2 + event sync with meetings.



## Development Notes**Meeting & Calendar System**: Primary business feature for scheduling client meetings.



- **Next.js 15 + App Router**: Server vs client components critical. Use `"use client"` for browser APIs.**3D & Animation Stack**:- Data layer: `lib/supabase-meetings-db.ts` handles Supabase + Google Calendar sync.

- **Package Manager**: This project uses **pnpm exclusively** - no npm or yarn commands.

- **No Testing Framework**: Add tests only after confirming preferred stack.- Three.js via `@react-three/fiber` and `@react-three/drei` in `components/3d/`.- API routes: `app/api/meetings/`, `app/api/calendar-availability/`, `app/api/schedule-meeting/`.

- **Environment Setup**: Requires `.env.local` with Supabase + Google Calendar credentials.

- **Middleware**: Currently minimal auth protection - most auth logic in hooks.- GSAP for complex animations with React integration via `@gsap/react`.- Key types: `Meeting`, `Client`, `ClientInput` with Google Calendar integration.



Small examples (contextual snippets)- Example: `components/3d/V1tr0Logo3D.tsx` shows glass morphism + camera views pattern.- Real-time updates via `hooks/use-websocket.tsx` with Socket.io client.

- To initialize the server Supabase client: `createServerClient(supabaseUrl, supabaseAnonKey, { req, res, cookieOptions })` (see `middleware.ts`).

- To access client session in hooks: `supabase.auth.getSession()` and `supabase.auth.onAuthStateChange(...)` (see `hooks/use-auth.tsx`).



Notes & constraints**Content & Blog System**:**Auth & Data Integration**:

- This repo uses Next's app router — be mindful of server vs client components. When you need browser-only APIs, mark files with `"use client"` and keep effects/hooks there.

- **Always use pnpm**: `pnpm install`, `pnpm dev`, `pnpm build` - never npm or yarn.- MDX processing via `lib/mdx.ts` with gray-matter frontmatter parsing.- Client: `lib/supabase/client.ts` exports `supabase` with enhanced session persistence.

- No automated tests were found in the repo root; add tests only after checking preferred testing stack (none declared in `package.json`).

- Env vars are required for Supabase — local development needs a `.env.local` with values from `AUTH_README.md` or the Supabase project.- Blog content in `content/blog/` directory with reading time calculation.- Auth provider: `hooks/use-auth.tsx` wraps entire app via `app/providers.tsx`.



When editing: prefer small, local changes with existing patterns. Point reviewers to the same files referenced here for context.- Video/meeting: Jitsi components under `components/client/jitsi-meeting.tsx` — be careful modifying global CSS.- Middleware: Currently minimal (`middleware.ts`) — auth protection moved to hook level.



If anything here is unclear or you want this shortened/expanded with code pointers, tell me which section to iterate on.- Required env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, plus Google Calendar vars.

## Where to Look First

## Project-Specific Conventions (Preserve When Editing)

**Meeting/Calendar Features**: `lib/supabase-meetings-db.ts`, `app/api/meetings/`, `hooks/use-websocket.tsx`

**Authentication Changes**: `lib/supabase/client.ts`, `hooks/use-auth.tsx`, `app/providers.tsx`**Route Groups**: `app/` uses parentheses grouping - `(auth)`, `(dashboard)`, `(marketing)`, `client-dashboard/`

**Layout/Provider Updates**: `app/layout-with-providers.tsx`, `app/providers.tsx`**Auth Flow**: Login/register in `(auth)/`, OAuth callback in `auth/callback/`, session management via hooks

**3D/Animation Work**: `components/3d/`, `hooks/use-gsap-*.tsx`, check Three.js imports**Component Organization**: UI components mirror app sections (`components/dashboard/`, `components/home/`)  

**Blog/Content**: `lib/mdx.ts`, `content/blog/`, `app/(marketing)/blog/`**Styling**: Tailwind + `globals.css`, `class-variance-authority` for component variants

**State**: Custom hooks only (`use-auth.tsx`, `use-websocket.tsx`) - no external state libs

## Key Code Patterns

Project-specific patterns & conventions (do not change unless necessary)

**Supabase Meeting Data Access**:- Route groups: the `app/` tree uses Next’s folder grouping with parenthesis like `(auth)`, `(dashboard)`, `(marketing)` to scope layouts and providers — preserve those folders when adding routes.

```typescript- Providers: global providers are wired in `app/providers.tsx` and `app/layout-with-providers.tsx`; add context/providers there so they wrap pages consistently.

import { supabaseMeetingsDB } from '@/lib/supabase-meetings-db'- Auth flow:

const meetings = await supabaseMeetingsDB.getMeetings()  - Client sign-in / sign-up flows live under `app/(auth)/login` and `app/(auth)/register`.

```  - OAuth callback route: `app/auth/callback/page.tsx` uses `lib/supabase/client.ts` to read session.

  - Middleware (`middleware.ts`) protects dashboard/admin routes by reading the Supabase session and loading `profiles` from the DB.

**Auth State in Components**:- Hooks & state: prefer `hooks/*` utilities (for example `use-auth.tsx`, `use-websocket.tsx`) rather than creating ad-hoc global state.

```typescript- Styling: Tailwind + `globals.css`; configuration in `tailwind.config.ts`. Follow existing utility classes and `class-variance-authority` patterns already in components.

import { useAuth } from '@/hooks/use-auth'

const { user, session, loading } = useAuth()## Integration & External Dependencies

```

**Real-time Communication**: 

**WebSocket Real-time Updates**:- WebSocket: `socket.io-client` via `hooks/use-websocket.tsx` with auth integration.

```typescript- Google Calendar: `lib/google-calendar.ts` handles OAuth2 + event sync with meetings.

import { useWebSocket } from '@/hooks/use-websocket'

const { socket, connected } = useWebSocket()**3D & Animation Stack**:

```- Three.js via `@react-three/fiber` and `@react-three/drei` in `components/3d/`.

- GSAP for complex animations with React integration via `@gsap/react`.

## Development Notes- Example: `components/3d/V1tr0Logo3D.tsx` shows glass morphism + camera views pattern.



- **Next.js 15 + App Router**: Server vs client components critical. Use `"use client"` for browser APIs.**Content & Blog System**:

- **No Testing Framework**: Add tests only after confirming preferred stack.- MDX processing via `lib/mdx.ts` with gray-matter frontmatter parsing.

- **Environment Setup**: Requires `.env.local` with Supabase + Google Calendar credentials.- Blog content in `content/blog/` directory with reading time calculation.

- **Middleware**: Currently minimal auth protection - most auth logic in hooks.- Video/meeting: Jitsi components under `components/client/jitsi-meeting.tsx` — be careful modifying global CSS.



Small examples (contextual snippets)## Where to Look First

- To initialize the server Supabase client: `createServerClient(supabaseUrl, supabaseAnonKey, { req, res, cookieOptions })` (see `middleware.ts`).

- To access client session in hooks: `supabase.auth.getSession()` and `supabase.auth.onAuthStateChange(...)` (see `hooks/use-auth.tsx`).**Meeting/Calendar Features**: `lib/supabase-meetings-db.ts`, `app/api/meetings/`, `hooks/use-websocket.tsx`

**Authentication Changes**: `lib/supabase/client.ts`, `hooks/use-auth.tsx`, `app/providers.tsx`

Notes & constraints**Layout/Provider Updates**: `app/layout-with-providers.tsx`, `app/providers.tsx`

- This repo uses Next's app router — be mindful of server vs client components. When you need browser-only APIs, mark files with `"use client"` and keep effects/hooks there.**3D/Animation Work**: `components/3d/`, `hooks/use-gsap-*.tsx`, check Three.js imports

- No automated tests were found in the repo root; add tests only after checking preferred testing stack (none declared in `package.json`).**Blog/Content**: `lib/mdx.ts`, `content/blog/`, `app/(marketing)/blog/`

- Env vars are required for Supabase — local development needs a `.env.local` with values from `AUTH_README.md` or the Supabase project.

Small examples (contextual snippets)

When editing: prefer small, local changes with existing patterns. Point reviewers to the same files referenced here for context.- To initialize the server Supabase client: `createServerClient(supabaseUrl, supabaseAnonKey, { req, res, cookieOptions })` (see `middleware.ts`).

- To access client session in hooks: `supabase.auth.getSession()` and `supabase.auth.onAuthStateChange(...)` (see `hooks/use-auth.tsx`).

If anything here is unclear or you want this shortened/expanded with code pointers, tell me which section to iterate on.
Notes & constraints
- This repo uses Next’s app router — be mindful of server vs client components. When you need browser-only APIs, mark files with `"use client"` and keep effects/hooks there.
- No automated tests were found in the repo root; add tests only after checking preferred testing stack (none declared in `package.json`).
- Env vars are required for Supabase — local development needs a `.env.local` with values from `AUTH_README.md` or the Supabase project.

When editing: prefer small, local changes with existing patterns. Point reviewers to the same files referenced here for context.

If anything here is unclear or you want this shortened/expanded with code pointers, tell me which section to iterate on.
