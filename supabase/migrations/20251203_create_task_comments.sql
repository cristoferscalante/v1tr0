-- Crear tabla de comentarios de tareas
CREATE TABLE IF NOT EXISTS public.task_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS task_comments_task_id_idx ON public.task_comments(task_id);
CREATE INDEX IF NOT EXISTS task_comments_user_id_idx ON public.task_comments(user_id);
CREATE INDEX IF NOT EXISTS task_comments_created_at_idx ON public.task_comments(created_at DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios autenticados pueden leer todos los comentarios
CREATE POLICY "Usuarios autenticados pueden leer comentarios"
  ON public.task_comments
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Los usuarios autenticados pueden crear comentarios
CREATE POLICY "Usuarios autenticados pueden crear comentarios"
  ON public.task_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden editar sus propios comentarios
CREATE POLICY "Usuarios pueden editar sus comentarios"
  ON public.task_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden eliminar sus propios comentarios
CREATE POLICY "Usuarios pueden eliminar sus comentarios"
  ON public.task_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_task_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER task_comments_updated_at
  BEFORE UPDATE ON public.task_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_task_comments_updated_at();
