-- ============================================================
-- Ícono elegido a mano por proyecto, vínculo cotización→proyecto,
-- y bóveda de credenciales cifradas por cliente/proyecto.
-- ============================================================

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS icon text;

ALTER TABLE quotes
  ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES projects(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS client_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  label text NOT NULL,
  value text NOT NULL,
  iv text NOT NULL,
  auth_tag text NOT NULL,
  notes text,
  created_by text REFERENCES profiles(id) ON DELETE SET NULL,
  last_revealed_at timestamptz,
  last_revealed_by text REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS client_secrets_client_id_idx ON client_secrets(client_id);

-- ============================================================
-- Verificación
-- ============================================================
-- SELECT column_name FROM information_schema.columns WHERE table_name='projects' AND column_name='icon';
-- SELECT column_name FROM information_schema.columns WHERE table_name='quotes' AND column_name='project_id';
-- SELECT to_regclass('client_secrets');
