-- ============================================================
-- Migración: Vincular Meeting Tasks con Proyectos
-- Fecha: 2024-11-30
-- Descripción: Agrega la relación entre meeting_tasks y projects
-- ============================================================

-- 1. Agregar columna project_id a meeting_tasks
ALTER TABLE meeting_tasks 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;

-- 2. Crear índice para consultas por project_id
CREATE INDEX IF NOT EXISTS idx_meeting_tasks_project_id ON meeting_tasks(project_id);

-- 3. Actualizar RLS para meeting_tasks
ALTER TABLE meeting_tasks ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios autenticados pueden ver todas las meeting_tasks
CREATE POLICY IF NOT EXISTS "Authenticated users can view meeting_tasks" ON meeting_tasks
    FOR SELECT TO authenticated
    USING (true);

-- Política: Usuarios autenticados pueden actualizar meeting_tasks
CREATE POLICY IF NOT EXISTS "Authenticated users can update meeting_tasks" ON meeting_tasks
    FOR UPDATE TO authenticated
    USING (true);

-- 4. Crear tabla de comentarios de tareas (para ambos tipos de tareas)
CREATE TABLE IF NOT EXISTS task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL,
    task_type VARCHAR(20) NOT NULL CHECK (task_type IN ('task', 'meeting_task')),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para task_comments
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_task_type ON task_comments(task_type);
CREATE INDEX IF NOT EXISTS idx_task_comments_user_id ON task_comments(user_id);

-- RLS para task_comments
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Authenticated users can view task_comments" ON task_comments
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY IF NOT EXISTS "Authenticated users can insert task_comments" ON task_comments
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Permisos
GRANT SELECT ON meeting_tasks TO anon;
GRANT ALL PRIVILEGES ON meeting_tasks TO authenticated;

GRANT SELECT ON task_comments TO anon;
GRANT ALL PRIVILEGES ON task_comments TO authenticated;

-- 5. Trigger para updated_at en task_comments
DROP TRIGGER IF EXISTS update_task_comments_updated_at ON task_comments;
CREATE TRIGGER update_task_comments_updated_at
    BEFORE UPDATE ON task_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
