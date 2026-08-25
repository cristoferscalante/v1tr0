# Skills de Claude Code para este proyecto

Stack: Next.js 15 (App Router) + Drizzle ORM/Neon (Postgres) + NextAuth v5 + Vercel.

## Gestor de paquetes: pnpm (obligatorio)

Este proyecto usa **pnpm**, declarado en `packageManager` de `package.json`.
Nunca uses `npm install` ni `npm i <paquete>`: npm reescribe `node_modules/` con
su propio layout plano y rompe el árbol de enlaces de pnpm, dejando el proyecto
sin arrancar hasta un `pnpm install` de rescate.

- Instalar dependencias: `pnpm install`
- Agregar una: `pnpm add <paquete>` / `pnpm add -D <paquete>`
- Ejecutar binarios: `pnpm exec <bin>` (no `npx`)

Los scripts sí se pueden correr con cualquiera de los dos (`npm run dev` y
`pnpm dev` son equivalentes), porque solo invocan lo que ya está instalado.

Ojo: `.npmrc` tiene `package-manager=pnpm`, que no es una clave válida ni de npm
ni de pnpm — no impone nada y produce el aviso "Unknown project config". Lo que
realmente vale es el campo `packageManager` de `package.json`.

## Pruebas end-to-end

`pnpm test:e2e` (Playwright) cubre el flujo de compra: catálogo, carrito,
checkout, verificación de orden y webhook. Espera un servidor ya levantado en
`localhost:3000`; con `E2E_START_SERVER=1` lo arranca Playwright.

- El login es solo Google OAuth, así que la sesión de prueba se siembra
  directamente en la base (`e2e/seed-session.ts`) y el teardown la borra.
- La salida va a `/tmp` a propósito: dentro del proyecto dispara el watcher de
  Next y recompila en mitad de la corrida.
- No levantes un segundo dev server si ya hay uno: comparten `.next` y se
  corrompen los manifiestos.

- **security-review** (alta): correr antes de cada deploy o al tocar `auth.ts`, rutas `/api`, o la bóveda de credenciales cifrada de clientes (`SECRETS_ENCRYPTION_KEY`).
- **code-review** (alta): usar antes de mergear PRs a `main`.
- **run** (alta): usar para levantar el dev server y verificar cambios de UI/funcionalidad antes de reportarlos como completos.
- **supabase-postgres-best-practices** (media): consultar al escribir u optimizar queries de Drizzle o cambios en `lib/db/schema.ts`. Pese al nombre, es
  asesoría de Postgres genérica y aplica igual sobre Neon — este proyecto ya no usa Supabase.
- **dataviz** (media): usar si se agregan gráficos o paneles al dashboard de cliente/admin.

## Skills instaladas localmente

`.claude/skills/` está en `.gitignore`: son herramientas de terceros, no código
del producto. Para instalar `diagram-design` (diagramas editoriales en HTML+SVG,
y la gramática visual que siguen los tableros de tareas):

```bash
git clone --depth 1 https://github.com/cathrynlavery/diagram-design.git /tmp/dd \
  && mkdir -p .claude/skills && cp -r /tmp/dd/skills/diagram-design .claude/skills/
```

`codebase-memory` no está indexado para este proyecto (se usa otra herramienta externa para ese propósito).
