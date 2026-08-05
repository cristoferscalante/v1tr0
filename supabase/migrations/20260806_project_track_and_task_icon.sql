-- ============================================================
-- Rama (track) por fase y ícono elegido a mano por tarea, para el árbol
-- de habilidades de 3 caminos del cliente.
-- ============================================================

ALTER TABLE project_phases
  ADD COLUMN IF NOT EXISTS track text NOT NULL DEFAULT 'development';

ALTER TABLE phase_tasks
  ADD COLUMN IF NOT EXISTS icon text;

-- ============================================================
-- Verificación
-- ============================================================
-- SELECT column_name FROM information_schema.columns WHERE table_name='project_phases' AND column_name='track';
-- SELECT column_name FROM information_schema.columns WHERE table_name='phase_tasks' AND column_name='icon';
