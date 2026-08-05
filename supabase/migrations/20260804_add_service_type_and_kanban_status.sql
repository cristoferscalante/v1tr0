-- ============================================================
-- Agrega service_type a projects y normaliza status al vocabulario
-- del Kanban de /admin/proyectos (planning/design/development/testing/
-- completed/paused/cancelled), que ya usa app/client-dashboard/projects.
-- ============================================================

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS service_type text NOT NULL DEFAULT 'other';

-- Los proyectos existentes con el valor legacy 'active' pasan a la primera
-- columna del Kanban ('planning' = Cotizado); no había otros valores en uso
-- fuera de 'active' y 'completed' antes de esta migración.
UPDATE projects SET status = 'planning' WHERE status = 'active' OR status IS NULL;

ALTER TABLE projects
  ALTER COLUMN status SET DEFAULT 'planning';

-- ============================================================
-- Verificación final
-- ============================================================
-- SELECT column_name, column_default FROM information_schema.columns
-- WHERE table_name = 'projects' AND column_name IN ('service_type', 'status');
-- SELECT status, count(*) FROM projects GROUP BY status;
