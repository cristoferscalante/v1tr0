-- ============================================================
-- FIX: Agregar rol 'team' a la restricción de la tabla profiles
-- ============================================================
-- Este script corrige el error: "profiles_role_check" constraint
-- Ejecutar en Supabase SQL Editor

-- 1. Eliminar la restricción antigua que solo permite 'admin' y 'client'
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2. Agregar nueva restricción que incluye 'admin', 'client' y 'team'
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('admin', 'client', 'team'));

-- 3. Agregar comentario para documentar los roles
COMMENT ON COLUMN profiles.role IS 'Roles disponibles: admin (control total), client (visualización limitada), team (gestión de proyectos sin editar tareas)';

-- 4. Crear índice para mejorar búsquedas por rol
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ============================================================
-- Políticas RLS para el rol 'team'
-- ============================================================

-- Team puede ver todos los proyectos
DROP POLICY IF EXISTS "Team can view all projects" ON projects;
CREATE POLICY "Team can view all projects" 
  ON projects FOR SELECT 
  USING (
    auth.role() = 'authenticated' AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'team'
  );

-- Team puede crear proyectos
DROP POLICY IF EXISTS "Team can create projects" ON projects;
CREATE POLICY "Team can create projects" 
  ON projects FOR INSERT 
  WITH CHECK (
    auth.role() = 'authenticated' AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'team'
  );

-- Team puede actualizar proyectos
DROP POLICY IF EXISTS "Team can update projects" ON projects;
CREATE POLICY "Team can update projects" 
  ON projects FOR UPDATE 
  USING (
    auth.role() = 'authenticated' AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'team'
  );

-- Team puede ver todas las tareas
DROP POLICY IF EXISTS "Team can view tasks" ON tasks;
CREATE POLICY "Team can view tasks" 
  ON tasks FOR SELECT 
  USING (
    auth.role() = 'authenticated' AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'team'
  );

-- Team puede ver meeting_tasks
DROP POLICY IF EXISTS "Team can view meeting tasks" ON meeting_tasks;
CREATE POLICY "Team can view meeting tasks" 
  ON meeting_tasks FOR SELECT 
  USING (
    auth.role() = 'authenticated' AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'team'
  );

-- Team puede actualizar meeting_tasks (necesario para asignación)
DROP POLICY IF EXISTS "Team can update meeting tasks" ON meeting_tasks;
CREATE POLICY "Team can update meeting tasks" 
  ON meeting_tasks FOR UPDATE 
  USING (
    auth.role() = 'authenticated' AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'team'
  );

-- Team puede crear comentarios en tareas
DROP POLICY IF EXISTS "Team can create task comments" ON task_comments;
CREATE POLICY "Team can create task comments" 
  ON task_comments FOR INSERT 
  WITH CHECK (
    auth.role() = 'authenticated' AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'team'
  );

-- Team puede ver comentarios
DROP POLICY IF EXISTS "Team can view task comments" ON task_comments;
CREATE POLICY "Team can view task comments" 
  ON task_comments FOR SELECT 
  USING (
    auth.role() = 'authenticated' AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'team'
  );

-- ============================================================
-- Verificación final
-- ============================================================
-- Ejecutar este query después de aplicar la migración para verificar:
-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'profiles'::regclass AND conname LIKE '%role%';
