-- ============================================================
-- V1TR0 DATABASE - FULL SCHEMA BACKUP
-- Generado: Julio 2026
-- Proyecto: ykrsxgpaxhtjsuebadnj.supabase.co
-- ============================================================
-- Este archivo consolida TODAS las migraciones en orden.
-- Para restaurar en un proyecto nuevo:
--   psql $CONNECTION_STRING < full_schema_dump.sql
-- O desde Supabase Dashboard > SQL Editor > pegar y ejecutar.
-- ============================================================

-- ============================================================
-- MIGRACIÓN: 000_current_schema.sql (schema base)
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT UNIQUE,
    avatar TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    company VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view clients" ON clients;
CREATE POLICY "Authenticated users can view clients" ON clients
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert clients" ON clients;
CREATE POLICY "Authenticated users can insert clients" ON clients
    FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update clients" ON clients;
CREATE POLICY "Authenticated users can update clients" ON clients
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete clients" ON clients;
CREATE POLICY "Authenticated users can delete clients" ON clients
    FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own projects" ON projects;
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (
        auth.uid() = client_id OR 
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

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

CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_categoria ON tasks(categoria);
CREATE INDEX IF NOT EXISTS idx_tasks_estado ON tasks(estado);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view project tasks" ON tasks;
CREATE POLICY "Users can view project tasks" ON tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = tasks.project_id 
            AND (projects.client_id = auth.uid() OR 
                 (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
        )
    );

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

CREATE INDEX IF NOT EXISTS idx_meetings_client_id ON meetings(client_id);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(date);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_google_calendar_event_id ON meetings(google_calendar_event_id);

ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view meetings" ON meetings;
CREATE POLICY "Authenticated users can view meetings" ON meetings
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert meetings" ON meetings;
CREATE POLICY "Authenticated users can insert meetings" ON meetings
    FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update meetings" ON meetings;
CREATE POLICY "Authenticated users can update meetings" ON meetings
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete meetings" ON meetings;
CREATE POLICY "Authenticated users can delete meetings" ON meetings
    FOR DELETE TO authenticated USING (true);

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

CREATE INDEX IF NOT EXISTS idx_meeting_summaries_meeting_date ON meeting_summaries(meeting_date);

ALTER TABLE meeting_summaries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view meeting_summaries" ON meeting_summaries;
CREATE POLICY "Authenticated users can view meeting_summaries" ON meeting_summaries
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert meeting_summaries" ON meeting_summaries;
CREATE POLICY "Authenticated users can insert meeting_summaries" ON meeting_summaries
    FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update meeting_summaries" ON meeting_summaries;
CREATE POLICY "Authenticated users can update meeting_summaries" ON meeting_summaries
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete meeting_summaries" ON meeting_summaries;
CREATE POLICY "Authenticated users can delete meeting_summaries" ON meeting_summaries
    FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS meeting_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_summary_id UUID REFERENCES meeting_summaries(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
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

CREATE INDEX IF NOT EXISTS idx_meeting_tasks_meeting_summary_id ON meeting_tasks(meeting_summary_id);
CREATE INDEX IF NOT EXISTS idx_meeting_tasks_project_id ON meeting_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_meeting_tasks_status ON meeting_tasks(status);

ALTER TABLE meeting_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view meeting_tasks" ON meeting_tasks;
CREATE POLICY "Authenticated users can view meeting_tasks" ON meeting_tasks
    FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL,
    task_type VARCHAR(20) NOT NULL CHECK (task_type IN ('task', 'meeting_task')),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_task_type ON task_comments(task_type);
CREATE INDEX IF NOT EXISTS idx_task_comments_user_id ON task_comments(user_id);

ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can view task_comments" ON task_comments;
CREATE POLICY "Authenticated users can view task_comments" ON task_comments
    FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert task_comments" ON task_comments;
CREATE POLICY "Authenticated users can insert task_comments" ON task_comments
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Permisos
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

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
-- MIGRACIÓN: 005_add_email_to_profiles.sql
-- ============================================================
-- Ya incluida en el CREATE TABLE de profiles arriba

-- ============================================================
-- MIGRACIÓN: 006_create_profile_trigger_with_email.sql
-- ============================================================
-- (auto-fill email en profile, aplicado en schema arriba)

-- ============================================================
-- TRIGGER: Auto-crear perfil al registrarse
-- Ejecutar en Supabase Dashboard > SQL Editor
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, name, email, avatar)
  VALUES (
    NEW.id,
    'client',
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, profiles.name),
    email = COALESCE(EXCLUDED.email, profiles.email),
    avatar = COALESCE(EXCLUDED.avatar, profiles.avatar),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill profiles para usuarios existentes sin perfil
INSERT INTO public.profiles (id, role, name, email)
SELECT 
  au.id,
  'client',
  COALESCE(
    au.raw_user_meta_data->>'name',
    au.raw_user_meta_data->>'full_name',
    split_part(au.email, '@', 1),
    'Usuario'
  ),
  au.email
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- MIGRACIÓN: Migraciones posteriores con role 'team'
-- ============================================================

-- Agregar role 'team' al CHECK constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('client', 'admin', 'team'));

-- ============================================================
-- Fin del schema
-- ============================================================
