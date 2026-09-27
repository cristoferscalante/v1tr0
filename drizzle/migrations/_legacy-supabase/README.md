# Migraciones de la era Supabase — archivo histórico

Estos 12 archivos **no son reproducibles** sobre Neon y no forman parte de la
cadena de migraciones vigente. Se conservan solo como registro de cómo llegó el
esquema hasta aquí.

## Por qué no se pueden volver a aplicar

Dependen de cosas que Supabase provee y Neon no:

- El esquema `auth` y la tabla `auth.users` de Supabase Auth. El proyecto ahora
  usa NextAuth v5 con DrizzleAdapter: los usuarios viven en `public.users`.
- Row Level Security con `auth.uid()`. La autorización hoy ocurre en la capa de
  aplicación (`lib/auth/require-admin.ts`, `lib/auth/task-access.ts`), no en la
  base.
- Tablas de sistemas ya retirados: `meetings`, `meeting_tasks`, `tasks`.

## Cadena vigente

En `drizzle/migrations/`, en orden:

| Archivo | Qué hace |
|---|---|
| `005_add_email_to_profiles.sql` | Agrega `profiles.email` |
| `20260804_add_service_type_and_kanban_status.sql` | `projects.service_type` y estados del kanban |
| `20260805_project_icon_maintenance_secrets.sql` | Íconos de proyecto y bóveda de credenciales |
| `20260806_project_track_and_task_icon.sql` | `project_phases.track` e íconos de tarea |
| `20260825_task_management_rebuild.sql` | Estado real de tarea, equipo, bitácora, notificaciones, índices |

Para levantar la base desde cero, la referencia es `lib/db/schema.ts` con
`drizzle-kit push`, no reproducir esta carpeta.
