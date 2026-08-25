-- ============================================================
-- Reconstrucción del sistema de gestión de tareas, equipo y trazabilidad.
--
-- 1. `phase_tasks` pasa de un booleano `completed` a un estado real
--    (todo/in_progress/blocked/done) + prioridad + orden + estimación.
--    `completed` se conserva como espejo de `status = 'done'` porque el árbol
--    del cliente y los cálculos de progreso ya lo leen en todas partes.
-- 2. Se elimina la tabla `tasks` (deprecada, sin consumidores) y la
--    `task_comments` legacy que colgaba de ella y de `auth.users`.
-- 3. Nuevas tablas: project_members, task_comments, activity_log, notifications.
-- 4. Índices sobre las claves foráneas por las que realmente se filtra.
-- ============================================================

-- ------------------------------------------------------------
-- 1. phase_tasks: estado real de tarea
-- ------------------------------------------------------------
ALTER TABLE public.phase_tasks
  ADD COLUMN IF NOT EXISTS status          text NOT NULL DEFAULT 'todo',
  ADD COLUMN IF NOT EXISTS priority        text NOT NULL DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS "order"         integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS estimated_hours numeric(6,2),
  ADD COLUMN IF NOT EXISTS completed_at    timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at      timestamptz DEFAULT now();

-- Backfill: las tareas ya marcadas como completas arrancan en 'done'.
UPDATE public.phase_tasks
   SET status = 'done',
       completed_at = COALESCE(completed_at, created_at, now())
 WHERE completed IS TRUE
   AND status <> 'done';

-- Orden inicial estable dentro de cada fase (por fecha de creación), para que
-- el kanban no arranque con todas las tarjetas en order = 0.
WITH numerada AS (
  SELECT id, row_number() OVER (PARTITION BY phase_id ORDER BY created_at, id) - 1 AS pos
    FROM public.phase_tasks
)
UPDATE public.phase_tasks t
   SET "order" = n.pos
  FROM numerada n
 WHERE t.id = n.id
   AND t."order" = 0;

ALTER TABLE public.phase_tasks DROP CONSTRAINT IF EXISTS phase_tasks_status_check;
ALTER TABLE public.phase_tasks
  ADD CONSTRAINT phase_tasks_status_check
  CHECK (status IN ('todo', 'in_progress', 'blocked', 'done'));

ALTER TABLE public.phase_tasks DROP CONSTRAINT IF EXISTS phase_tasks_priority_check;
ALTER TABLE public.phase_tasks
  ADD CONSTRAINT phase_tasks_priority_check
  CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

-- ------------------------------------------------------------
-- 2. Baja del sistema legacy
-- ------------------------------------------------------------
-- `task_comments` legacy referenciaba auth.users y public.tasks; se rehace
-- más abajo contra phase_tasks + profiles. CASCADE arrastra sus políticas RLS.
-- El CASCADE se lleva el trigger `task_comments_updated_at` junto con la tabla.
-- No se suelta el trigger por separado: `DROP TRIGGER IF EXISTS ... ON tabla`
-- falla si la tabla ya no existe.
DROP TABLE IF EXISTS public.task_comments CASCADE;
DROP FUNCTION IF EXISTS public.update_task_comments_updated_at() CASCADE;

-- El trigger legacy que extraía tareas vivía sobre public.meetings, tabla que
-- ya no existe. No se intenta soltarlo: `DROP TRIGGER IF EXISTS ... ON tabla`
-- falla si la TABLA no existe (el IF EXISTS solo cubre el trigger), y de todos
-- modos el CASCADE de abajo se lleva cualquier objeto que aún dependiera de
-- public.tasks.
DROP TABLE IF EXISTS public.tasks CASCADE;

-- ------------------------------------------------------------
-- 3. Equipo por proyecto
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_members (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id)  ON DELETE CASCADE,
  profile_id text NOT NULL REFERENCES public.profiles(id)  ON DELETE CASCADE,
  role       text NOT NULL DEFAULT 'developer',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT project_members_role_check
    CHECK (role IN ('lead', 'developer', 'designer', 'qa', 'observer')),
  CONSTRAINT project_members_unique UNIQUE (project_id, profile_id)
);

-- ------------------------------------------------------------
-- 4. Comentarios por tarea
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.task_comments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id           uuid NOT NULL REFERENCES public.phase_tasks(id) ON DELETE CASCADE,
  author_id         text NOT NULL REFERENCES public.profiles(id)    ON DELETE CASCADE,
  body              text NOT NULL,
  visible_to_client boolean NOT NULL DEFAULT true,
  created_at        timestamptz DEFAULT now()
);

-- ------------------------------------------------------------
-- 5. Bitácora append-only
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_log (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id        uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  actor_id          text REFERENCES public.profiles(id) ON DELETE SET NULL,
  action            text NOT NULL,
  entity_type       text,
  entity_id         text,
  summary           text NOT NULL,
  meta              jsonb DEFAULT '{}'::jsonb,
  visible_to_client boolean NOT NULL DEFAULT false,
  created_at        timestamptz DEFAULT now()
);

-- ------------------------------------------------------------
-- 6. Notificaciones
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  title      text NOT NULL,
  body       text,
  href       text,
  read_at    timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ------------------------------------------------------------
-- 7. Índices
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS phase_tasks_phase_order_idx
  ON public.phase_tasks (phase_id, "order");
CREATE INDEX IF NOT EXISTS phase_tasks_assigned_status_idx
  ON public.phase_tasks (assigned_to, status);
CREATE INDEX IF NOT EXISTS phase_task_subtasks_task_order_idx
  ON public.phase_task_subtasks (task_id, "order");
CREATE INDEX IF NOT EXISTS project_phases_project_order_idx
  ON public.project_phases (project_id, "order");
CREATE INDEX IF NOT EXISTS projects_client_idx
  ON public.projects (client_id);
CREATE INDEX IF NOT EXISTS project_members_project_idx
  ON public.project_members (project_id);
CREATE INDEX IF NOT EXISTS project_members_profile_idx
  ON public.project_members (profile_id);
CREATE INDEX IF NOT EXISTS task_comments_task_created_idx
  ON public.task_comments (task_id, created_at);
CREATE INDEX IF NOT EXISTS activity_log_project_created_idx
  ON public.activity_log (project_id, created_at);
CREATE INDEX IF NOT EXISTS activity_log_actor_idx
  ON public.activity_log (actor_id);
CREATE INDEX IF NOT EXISTS notifications_profile_created_idx
  ON public.notifications (profile_id, created_at);
-- Parcial: el badge del sidebar solo cuenta las no leídas.
CREATE INDEX IF NOT EXISTS notifications_unread_idx
  ON public.notifications (profile_id) WHERE read_at IS NULL;

-- ============================================================
-- Verificación
-- ============================================================
-- SELECT status, priority, count(*) FROM phase_tasks GROUP BY 1,2;
-- SELECT to_regclass('public.tasks');          -- debe dar NULL
-- SELECT to_regclass('public.project_members');-- debe dar project_members
