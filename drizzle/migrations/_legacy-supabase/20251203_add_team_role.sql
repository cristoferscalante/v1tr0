-- Agregar el rol 'team' a la base de datos
-- Este rol tendrá permisos similares a admin pero sin editar tareas

-- Primero, verificar que la tabla profiles existe y tiene la columna role
-- Si ya tienes perfiles existentes, esta migración los respetará

-- Opcional: Si quieres asegurarte de que el tipo de dato permite 'team'
-- Puedes verificar si tu columna 'role' es de tipo TEXT o tiene una restricción CHECK

-- Agregar comentario para documentar los roles disponibles
COMMENT ON COLUMN profiles.role IS 'Roles disponibles: admin, client, team. Admin: control total. Team: gestión de proyectos sin editar tareas. Client: visualización limitada.';

-- Crear un índice en la columna role si no existe (para mejorar búsquedas)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Si tienes restricciones CHECK existentes en la columna role, deberás modificarlas
-- Por ejemplo, si tienes algo como CHECK (role IN ('admin', 'client'))
-- Necesitarás DROP y recrear la constraint:

-- Primero, buscar si existe alguna constraint en la columna role
-- Ejecutar este query manualmente para verificar:
-- SELECT conname FROM pg_constraint WHERE conrelid = 'profiles'::regclass AND conname LIKE '%role%';

-- Si existe una constraint, descomentarla y ajustar el nombre:
-- ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
-- ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'client', 'team'));

-- Agregar política RLS para el nuevo rol team (similar a admin)
-- Team puede ver todos los proyectos y tareas
DROP POLICY IF EXISTS "Team can view all projects" ON projects;
CREATE POLICY "Team can view all projects" 
  ON projects FOR SELECT 
  USING (
    auth.role() = 'authenticated' AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'team'
  );

DROP POLICY IF EXISTS "Team can create projects" ON projects;
CREATE POLICY "Team can create projects" 
  ON projects FOR INSERT 
  WITH CHECK (
    auth.role() = 'authenticated' AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'team'
  );

DROP POLICY IF EXISTS "Team can update projects" ON projects;
CREATE POLICY "Team can update projects" 
  ON projects FOR UPDATE 
  USING (
    auth.role() = 'authenticated' AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'team'
  );

-- Team puede VER todas las tareas pero NO editarlas
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

-- Team puede comentar en tareas
DROP POLICY IF EXISTS "Team can create task comments" ON task_comments;
CREATE POLICY "Team can create task comments" 
  ON task_comments FOR INSERT 
  WITH CHECK (
    auth.role() = 'authenticated' AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'team'
  );
