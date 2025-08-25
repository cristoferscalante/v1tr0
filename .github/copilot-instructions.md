## Copilot / AI agent quick guide — v1tr0

Purpose: give an AI coding agent immediate, actionable context to edit, implement, or review features in this Next.js + Supabase repo.

- Repo type: Next.js (app router), TypeScript, Tailwind CSS, client & server components pattern.
- Key folders: `app/` (routes + layouts), `components/` (UI), `lib/` (clients/util), `hooks/` (custom hooks), `public/`, `styles/`.

Quick commands (from `package.json`):
- Start dev server: `npm run dev` (also works with `pnpm dev` / `yarn dev`).
- Build: `npm run build`.
- Lint: `npm run lint`.

Important integration points
- Supabase: central auth/data integration.
  - Client: `lib/supabase/client.ts` — exports `supabase` and `getSupabaseClient`. Use this for client-side code.
  - Server/SSR: `middleware.ts` uses `@supabase/ssr` and `createServerClient` for protecting routes and reading sessions in middleware.
  - Auth helper/hook: `hooks/use-auth.tsx` is the primary client-side auth state manager used across UI (components import `useAuth`).
  - See `AUTH_README.md` for DB setup (`supabase-setup.sql`) and env var names: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

Project-specific patterns & conventions (do not change unless necessary)
- Route groups: the `app/` tree uses Next’s folder grouping with parenthesis like `(auth)`, `(dashboard)`, `(marketing)` to scope layouts and providers — preserve those folders when adding routes.
- Providers: global providers are wired in `app/providers.tsx` and `app/layout-with-providers.tsx`; add context/providers there so they wrap pages consistently.
- Auth flow:
  - Client sign-in / sign-up flows live under `app/(auth)/login` and `app/(auth)/register`.
  - OAuth callback route: `app/auth/callback/page.tsx` uses `lib/supabase/client.ts` to read session.
  - Middleware (`middleware.ts`) protects dashboard/admin routes by reading the Supabase session and loading `profiles` from the DB.
- Hooks & state: prefer `hooks/*` utilities (for example `use-auth.tsx`, `use-websocket.tsx`) rather than creating ad-hoc global state.
- Styling: Tailwind + `globals.css`; configuration in `tailwind.config.ts`. Follow existing utility classes and `class-variance-authority` patterns already in components.

Integration & external libs to watch out for
- Real-time / websockets: `socket.io-client` is used (check `hooks/use-websocket.tsx`).
- 3D / canvas: `@react-three/fiber` and `@react-three/drei` (see `components/3d/` and `public/3d/` resources).
- Video/meeting: there are Jitsi components under `components/client/jitsi-meeting.tsx` — be careful modifying global CSS or script injection.

Where to look first when implementing a change
- If the change touches authentication or session data: read `lib/supabase/client.ts`, `hooks/use-auth.tsx`, `middleware.ts`, and `AUTH_README.md`.
- If the change affects page layout or providers: read `app/layout.tsx`, `app/layout-with-providers.tsx`, and `app/providers.tsx`.
- For UI components: inspect `components/` subfolders that mirror sections (e.g., `components/dashboard`, `components/home`, `components/about`).

Small examples (contextual snippets)
- To initialize the server Supabase client: `createServerClient(supabaseUrl, supabaseAnonKey, { req, res, cookieOptions })` (see `middleware.ts`).
- To access client session in hooks: `supabase.auth.getSession()` and `supabase.auth.onAuthStateChange(...)` (see `hooks/use-auth.tsx`).

Notes & constraints
- This repo uses Next’s app router — be mindful of server vs client components. When you need browser-only APIs, mark files with `"use client"` and keep effects/hooks there.
- No automated tests were found in the repo root; add tests only after checking preferred testing stack (none declared in `package.json`).
- Env vars are required for Supabase — local development needs a `.env.local` with values from `AUTH_README.md` or the Supabase project.

When editing: prefer small, local changes with existing patterns. Point reviewers to the same files referenced here for context.

If anything here is unclear or you want this shortened/expanded with code pointers, tell me which section to iterate on.
