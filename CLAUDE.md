# Skills de Claude Code para este proyecto

Stack: Next.js 15 (App Router) + Drizzle ORM/Neon (Postgres) + NextAuth v5 + Vercel.

- **security-review** (alta): correr antes de cada deploy o al tocar `auth.ts`, rutas `/api`, o la bóveda de credenciales cifrada de clientes (`SECRETS_ENCRYPTION_KEY`).
- **code-review** (alta): usar antes de mergear PRs a `main`.
- **run** (alta): usar para levantar el dev server y verificar cambios de UI/funcionalidad antes de reportarlos como completos.
- **supabase-postgres-best-practices** (media): consultar al escribir u optimizar queries de Drizzle o cambios en `lib/db/schema.ts`.
- **dataviz** (media): usar si se agregan gráficos o paneles al dashboard de cliente/admin.

`codebase-memory` no está indexado para este proyecto (se usa otra herramienta externa para ese propósito).
