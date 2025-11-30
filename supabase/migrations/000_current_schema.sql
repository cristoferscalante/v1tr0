-- ============================================================
-- V1TR0 DATABASE SCHEMA - ESTADO ACTUAL
-- Última actualización: 2024-11-30
-- ============================================================
-- Este archivo refleja el estado actual de la base de datos.
-- Actualizar después de cada migración exitosa.
-- ============================================================

-- ============================================================
-- TABLA: profiles
-- Descripción: Perfiles de usuario vinculados a auth.users
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    avatar TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- TABLA: clients
-- Descripción: Información de clientes para reuniones
-- ============================================================
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    company VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- ============================================================
-- TABLA: projects
-- Descripción: Proyectos asociados a clientes
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (
        auth.uid() = client_id OR 
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

-- ============================================================
-- TABLA: tasks
-- Descripción: Tareas asociadas a proyectos
-- ============================================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('completada', 'en progreso', 'pendiente')),
    fecha_inicio DATE,
    fecha_final DATE,
    prioridad VARCHAR(20) DEFAULT 'media' CHECK (prioridad IN ('alta', 'media', 'baja')),
    categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('planeacion', 'diseño', 'desarrollo', 'testing', 'despliegue')),
    observaciones TEXT,
    finalizada BOOLEAN DEFAULT FALSE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_categoria ON tasks(categoria);
CREATE INDEX IF NOT EXISTS idx_tasks_estado ON tasks(estado);
CREATE INDEX IF NOT EXISTS idx_tasks_fecha_inicio ON tasks(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);

-- RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view project tasks" ON tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = tasks.project_id 
            AND (projects.client_id = auth.uid() OR 
                 (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
        )
    );

-- ============================================================
-- TABLA: meetings
-- Descripción: Reuniones programadas con clientes
-- ============================================================
CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME WITHOUT TIME ZONE NOT NULL,
    duration INTEGER DEFAULT 60,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
    meeting_type VARCHAR(100) DEFAULT 'consultation',
    google_calendar_event_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_meetings_client_id ON meetings(client_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(date);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_google_calendar_event_id ON meetings(google_calendar_event_id);

-- ============================================================
-- TABLA: meeting_summaries
-- Descripción: Resúmenes de reuniones con decisiones y seguimientos
-- ============================================================
CREATE TABLE IF NOT EXISTS meeting_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    meeting_date DATE,
    participants JSONB,
    summary TEXT,
    key_decisions JSONB DEFAULT '[]'::jsonb,
    tasks JSONB DEFAULT '[]'::jsonb,
    follow_ups JSONB DEFAULT '[]'::jsonb,
    next_meeting JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_meeting_summaries_meeting_date ON meeting_summaries(meeting_date);

-- ============================================================
-- TABLA: meeting_tasks
-- Descripción: Tareas generadas desde resúmenes de reuniones
-- Actualizado: 2024-11-30 - Agregado project_id para vincular con proyectos
-- ============================================================
CREATE TABLE IF NOT EXISTS meeting_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_summary_id UUID REFERENCES meeting_summaries(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL, -- NUEVO: Vinculación con proyectos
    title TEXT NOT NULL,
    description TEXT,
    assigned_to TEXT,
    priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    due_date DATE,
    category TEXT,
    tags TEXT[],
    estimated_hours INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_meeting_tasks_meeting_summary_id ON meeting_tasks(meeting_summary_id);
CREATE INDEX IF NOT EXISTS idx_meeting_tasks_project_id ON meeting_tasks(project_id); -- NUEVO
CREATE INDEX IF NOT EXISTS idx_meeting_tasks_status ON meeting_tasks(status);
CREATE INDEX IF NOT EXISTS idx_meeting_tasks_due_date ON meeting_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_meeting_tasks_assigned_to ON meeting_tasks(assigned_to);

-- RLS
ALTER TABLE meeting_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view meeting_tasks" ON meeting_tasks
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update meeting_tasks" ON meeting_tasks
    FOR UPDATE TO authenticated USING (true);

-- ============================================================
-- TABLA: task_comments (NUEVA)
-- Descripción: Comentarios en tareas de cualquier tipo
-- ============================================================
CREATE TABLE IF NOT EXISTS task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL,
    task_type VARCHAR(20) NOT NULL CHECK (task_type IN ('task', 'meeting_task')),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_task_type ON task_comments(task_type);
CREATE INDEX IF NOT EXISTS idx_task_comments_user_id ON task_comments(user_id);

-- RLS
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view task_comments" ON task_comments
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert task_comments" ON task_comments
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- PERMISOS GENERALES
-- ============================================================
GRANT SELECT ON profiles TO anon;
GRANT ALL PRIVILEGES ON profiles TO authenticated;

GRANT SELECT ON clients TO anon;
GRANT ALL PRIVILEGES ON clients TO authenticated;

GRANT SELECT ON projects TO anon;
GRANT ALL PRIVILEGES ON projects TO authenticated;

GRANT SELECT ON tasks TO anon;
GRANT ALL PRIVILEGES ON tasks TO authenticated;

GRANT SELECT ON meetings TO anon;
GRANT ALL PRIVILEGES ON meetings TO authenticated;

GRANT SELECT ON meeting_summaries TO anon;
GRANT ALL PRIVILEGES ON meeting_summaries TO authenticated;

GRANT SELECT ON meeting_tasks TO anon;
GRANT ALL PRIVILEGES ON meeting_tasks TO authenticated;

GRANT SELECT ON task_comments TO anon;
GRANT ALL PRIVILEGES ON task_comments TO authenticated;

-- ============================================================
-- TRIGGERS PARA updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN 
        SELECT unnest(ARRAY['profiles', 'clients', 'projects', 'tasks', 'meetings', 'meeting_summaries', 'meeting_tasks', 'task_comments'])
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
            CREATE TRIGGER update_%I_updated_at
                BEFORE UPDATE ON %I
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END;
$$;

-- ============================================================
-- DIAGRAMA DE RELACIONES
-- ============================================================
/*
auth.users
    │
    └──> profiles (1:1)
              │
              ├──> projects (1:N) ──> tasks (1:N)
              │                   └──> meeting_tasks (1:N) [via project_id]
              │
              ├──> tasks.assigned_to (N:1)
              │
              └──> task_comments.user_id (N:1)

clients
    │
    └──> meetings (1:N)

meeting_summaries
    │
    └──> meeting_tasks (1:N) ──> projects (N:1) [opcional]

task_comments
    │
    └──> tasks / meeting_tasks (N:1) [via task_id + task_type]
*/

-- ============================================================
-- HISTORIAL DE MIGRACIONES APLICADAS
-- ============================================================
/*
| Migración                           | Fecha       | Descripción                                    |
|-------------------------------------|-------------|------------------------------------------------|
| 001_auth_roles_system.sql           | 2024-XX-XX  | Sistema de roles, projects y tasks             |
| 002_meeting_tasks_projects.sql      | 2024-11-30  | Vincula meeting_tasks con projects, comments   |
*/
