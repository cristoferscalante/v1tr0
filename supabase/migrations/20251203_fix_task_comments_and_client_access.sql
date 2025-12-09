-- ============================================================
-- PARTE 1: Arreglar tabla task_comments con referencias correctas
-- ============================================================

-- Eliminar tabla existente si tiene problemas
DROP TABLE IF EXISTS public.task_comments CASCADE;

-- Recrear tabla con referencias correctas a ambas tablas de tareas
CREATE TABLE public.task_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID,  -- Referencia a tasks (puede ser null)
  meeting_task_id UUID,  -- Referencia a meeting_tasks (puede ser null)
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT task_comments_task_check CHECK (
    (task_id IS NOT NULL AND meeting_task_id IS NULL) OR
    (task_id IS NULL AND meeting_task_id IS NOT NULL)
  )
);

-- Agregar foreign keys si las tablas existen
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tasks') THEN
    ALTER TABLE public.task_comments 
    ADD CONSTRAINT task_comments_task_id_fkey 
    FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'meeting_tasks') THEN
    ALTER TABLE public.task_comments 
    ADD CONSTRAINT task_comments_meeting_task_id_fkey 
    FOREIGN KEY (meeting_task_id) REFERENCES public.meeting_tasks(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Índices para mejorar rendimiento
CREATE INDEX task_comments_task_id_idx ON public.task_comments(task_id) WHERE task_id IS NOT NULL;
CREATE INDEX task_comments_meeting_task_id_idx ON public.task_comments(meeting_task_id) WHERE meeting_task_id IS NOT NULL;
CREATE INDEX task_comments_user_id_idx ON public.task_comments(user_id);
CREATE INDEX task_comments_created_at_idx ON public.task_comments(created_at DESC);

-- Habilitar RLS
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para task_comments
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer comentarios" ON public.task_comments;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear comentarios" ON public.task_comments;
DROP POLICY IF EXISTS "Usuarios pueden editar sus comentarios" ON public.task_comments;
DROP POLICY IF EXISTS "Usuarios pueden eliminar sus comentarios" ON public.task_comments;

-- Los usuarios pueden leer comentarios de proyectos donde tienen acceso
CREATE POLICY "Usuarios pueden leer comentarios de sus proyectos"
  ON public.task_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (
        profiles.role = 'admin' OR 
        profiles.role = 'team' OR
        -- Cliente puede ver comentarios de sus proyectos
        (profiles.role = 'client' AND (
          -- Comentarios de tasks del cliente
          (task_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.tasks t
            JOIN public.projects p ON t.project_id = p.id
            WHERE t.id = task_id AND p.client_id = profiles.id
          )) OR
          -- Comentarios de meeting_tasks del cliente
          (meeting_task_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.meeting_tasks mt
            JOIN public.projects p ON mt.project_id = p.id
            WHERE mt.id = meeting_task_id AND p.client_id = profiles.id
          ))
        ))
      )
    )
  );

-- Los usuarios autenticados pueden crear comentarios
CREATE POLICY "Usuarios autenticados pueden crear comentarios"
  ON public.task_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden editar sus propios comentarios
CREATE POLICY "Usuarios pueden editar sus comentarios"
  ON public.task_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden eliminar sus propios comentarios
CREATE POLICY "Usuarios pueden eliminar sus comentarios"
  ON public.task_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_task_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS task_comments_updated_at ON public.task_comments;
CREATE TRIGGER task_comments_updated_at
  BEFORE UPDATE ON public.task_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_task_comments_updated_at();


-- ============================================================
-- PARTE 2: Actualizar políticas RLS de projects para clientes
-- ============================================================

-- Eliminar TODAS las políticas existentes de projects
DROP POLICY IF EXISTS "Admins pueden ver todos los proyectos" ON public.projects;
DROP POLICY IF EXISTS "Clientes pueden ver sus proyectos" ON public.projects;
DROP POLICY IF EXISTS "Team pueden ver proyectos asignados" ON public.projects;
DROP POLICY IF EXISTS "Usuarios pueden leer proyectos" ON public.projects;
DROP POLICY IF EXISTS "Admin puede actualizar proyectos" ON public.projects;
DROP POLICY IF EXISTS "Admin puede eliminar proyectos" ON public.projects;
DROP POLICY IF EXISTS "Admin puede insertar proyectos" ON public.projects;
DROP POLICY IF EXISTS "Team can create projects" ON public.projects;
DROP POLICY IF EXISTS "Team can update projects" ON public.projects;
DROP POLICY IF EXISTS "Team can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Usuarios pueden leer proyectos según rol" ON public.projects;

-- Política de lectura mejorada para projects
CREATE POLICY "Usuarios pueden leer proyectos según rol"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (
        profiles.role = 'admin' OR  -- Admin ve todo
        (profiles.role = 'client' AND projects.client_id = profiles.id) OR  -- Cliente ve sus proyectos
        (profiles.role = 'team')  -- Team ve todos los proyectos
      )
    )
  );

-- Políticas de escritura (solo admin)
CREATE POLICY "Admin puede insertar proyectos"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin puede actualizar proyectos"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin puede eliminar proyectos"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );


-- ============================================================
-- PARTE 3: Actualizar políticas RLS de tasks para clientes
-- ============================================================

-- Verificar si la tabla tasks existe
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tasks') THEN
    -- Eliminar TODAS las políticas existentes
    DROP POLICY IF EXISTS "Usuarios pueden leer tareas" ON public.tasks;
    DROP POLICY IF EXISTS "Admin puede gestionar tareas" ON public.tasks;
    DROP POLICY IF EXISTS "Team puede ver tareas asignadas" ON public.tasks;
    DROP POLICY IF EXISTS "Admin puede eliminar tareas" ON public.tasks;
    DROP POLICY IF EXISTS "Admin y Team pueden actualizar tareas" ON public.tasks;
    DROP POLICY IF EXISTS "Admin y Team pueden insertar tareas" ON public.tasks;
    DROP POLICY IF EXISTS "Team can view tasks" ON public.tasks;
    DROP POLICY IF EXISTS "Users can view project tasks" ON public.tasks;
    DROP POLICY IF EXISTS "Usuarios pueden leer tareas según rol" ON public.tasks;
    
    -- Política de lectura mejorada
    CREATE POLICY "Usuarios pueden leer tareas según rol"
      ON public.tasks
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
          AND (
            profiles.role = 'admin' OR  -- Admin ve todas
            profiles.role = 'team' OR   -- Team ve todas
            -- Cliente ve tareas de sus proyectos
            (profiles.role = 'client' AND EXISTS (
              SELECT 1 FROM public.projects p
              WHERE p.id = tasks.project_id AND p.client_id = profiles.id
            ))
          )
        )
      );
    
    -- Políticas de escritura (admin y team)
    CREATE POLICY "Admin y Team pueden insertar tareas"
      ON public.tasks
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() 
          AND profiles.role IN ('admin', 'team')
        )
      );
    
    CREATE POLICY "Admin y Team pueden actualizar tareas"
      ON public.tasks
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() 
          AND profiles.role IN ('admin', 'team')
        )
      );
    
    CREATE POLICY "Admin puede eliminar tareas"
      ON public.tasks
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;


-- ============================================================
-- PARTE 4: Actualizar políticas RLS de meeting_tasks para clientes
-- ============================================================

DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'meeting_tasks') THEN
    -- Eliminar TODAS las políticas existentes
    DROP POLICY IF EXISTS "Usuarios pueden leer meeting_tasks" ON public.meeting_tasks;
    DROP POLICY IF EXISTS "Admin puede gestionar meeting_tasks" ON public.meeting_tasks;
    DROP POLICY IF EXISTS "Admin puede eliminar meeting_tasks" ON public.meeting_tasks;
    DROP POLICY IF EXISTS "Admin y Team pueden actualizar meeting_tasks" ON public.meeting_tasks;
    DROP POLICY IF EXISTS "Admin y Team pueden insertar meeting_tasks" ON public.meeting_tasks;
    DROP POLICY IF EXISTS "Authenticated users can update meeting_tasks" ON public.meeting_tasks;
    DROP POLICY IF EXISTS "Authenticated users can view meeting_tasks" ON public.meeting_tasks;
    DROP POLICY IF EXISTS "Team can update meeting tasks" ON public.meeting_tasks;
    DROP POLICY IF EXISTS "Team can view meeting tasks" ON public.meeting_tasks;
    DROP POLICY IF EXISTS "Usuarios pueden leer meeting_tasks según rol" ON public.meeting_tasks;
    
    -- Política de lectura mejorada
    CREATE POLICY "Usuarios pueden leer meeting_tasks según rol"
      ON public.meeting_tasks
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
          AND (
            profiles.role = 'admin' OR  -- Admin ve todas
            profiles.role = 'team' OR   -- Team ve todas
            -- Cliente ve tareas de sus proyectos
            (profiles.role = 'client' AND EXISTS (
              SELECT 1 FROM public.projects p
              WHERE p.id = meeting_tasks.project_id AND p.client_id = profiles.id
            ))
          )
        )
      );
    
    -- Políticas de escritura (admin y team)
    CREATE POLICY "Admin y Team pueden insertar meeting_tasks"
      ON public.meeting_tasks
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() 
          AND profiles.role IN ('admin', 'team')
        )
      );
    
    CREATE POLICY "Admin y Team pueden actualizar meeting_tasks"
      ON public.meeting_tasks
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() 
          AND profiles.role IN ('admin', 'team')
        )
      );
    
    CREATE POLICY "Admin puede eliminar meeting_tasks"
      ON public.meeting_tasks
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================

-- Verificar que las políticas están activas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('task_comments', 'projects', 'tasks', 'meeting_tasks')
ORDER BY tablename, policyname;
