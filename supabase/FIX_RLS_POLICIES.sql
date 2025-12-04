-- ============================================================
-- FIX: Políticas RLS sin recursión infinita + meeting_summaries
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- Fecha: 2024-12-03
-- ============================================================

-- ============================================================
-- 1. FIX: Políticas de profiles (sin recursión)
-- ============================================================

-- Eliminar TODAS las políticas existentes de profiles
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'profiles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', policy_record.policyname);
    END LOOP;
END $$;

-- Crear políticas nuevas sin recursión
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Verificar que RLS está habilitado
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. FIX: Habilitar RLS en clients
-- ============================================================

-- Eliminar todas las políticas existentes de clients
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'clients'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON clients', policy_record.policyname);
    END LOOP;
END $$;

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view clients" ON clients
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert clients" ON clients
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update clients" ON clients
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete clients" ON clients
    FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 3. FIX: Habilitar RLS en meetings
-- ============================================================

-- Eliminar todas las políticas existentes de meetings
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'meetings'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON meetings', policy_record.policyname);
    END LOOP;
END $$;

ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view meetings" ON meetings
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert meetings" ON meetings
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update meetings" ON meetings
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete meetings" ON meetings
    FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 4. FIX: Habilitar RLS en meeting_summaries
-- ============================================================

-- Eliminar todas las políticas existentes de meeting_summaries
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'meeting_summaries'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON meeting_summaries', policy_record.policyname);
    END LOOP;
END $$;

ALTER TABLE meeting_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view meeting_summaries" ON meeting_summaries
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert meeting_summaries" ON meeting_summaries
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update meeting_summaries" ON meeting_summaries
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete meeting_summaries" ON meeting_summaries
    FOR DELETE TO authenticated USING (true);
