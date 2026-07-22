-- ============================================================
-- Migración: Trigger para crear perfil automáticamente
-- Fecha: 2024-12-03
-- Descripción: Crea automáticamente un perfil en la tabla
--              profiles cuando se registra un nuevo usuario
-- ============================================================

-- 1. Asegurarse de que la tabla profiles tenga las políticas RLS correctas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política: Permitir a todos ver perfiles (sin recursión)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (true);

-- Política: Los usuarios pueden insertar su propio perfil
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Política: Los usuarios pueden actualizar su propio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Nota: Política de admin removida para evitar recursión infinita

-- 2. Función para crear perfil automáticamente
-- NOTA: Esta función debe ser ejecutada manualmente en el SQL Editor de Supabase Dashboard
-- porque requiere permisos de superusuario para crear triggers en auth.users
-- 
-- EJECUTAR ESTO EN SUPABASE DASHBOARD > SQL EDITOR:
-- 
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- SET search_path = public
-- AS $$
-- BEGIN
--   INSERT INTO public.profiles (id, role, name, avatar)
--   VALUES (
--     NEW.id,
--     'client',
--     COALESCE(
--       NEW.raw_user_meta_data->>'name',
--       NEW.raw_user_meta_data->>'full_name',
--       split_part(NEW.email, '@', 1)
--     ),
--     NEW.raw_user_meta_data->>'avatar_url'
--   )
--   ON CONFLICT (id) DO UPDATE SET
--     name = COALESCE(EXCLUDED.name, profiles.name),
--     avatar = COALESCE(EXCLUDED.avatar, profiles.avatar),
--     updated_at = NOW();
--   
--   RETURN NEW;
-- END;
-- $$;
-- 
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION public.handle_new_user();

-- 3. Mientras tanto, el login creará el perfil automáticamente si no existe
-- Ver: app/(auth)/login/page.tsx línea ~90

-- 4. Comentarios para documentación
COMMENT ON TABLE public.profiles IS 
  'Perfiles de usuario. El perfil se crea automáticamente en el login si no existe.';

-- 5. Crear perfiles para usuarios existentes que no tengan uno
INSERT INTO public.profiles (id, role, name)
SELECT 
  au.id,
  'client',
  COALESCE(
    au.raw_user_meta_data->>'name',
    au.raw_user_meta_data->>'full_name',
    split_part(au.email, '@', 1),
    'Usuario'
  )
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- 6. Verificar que los permisos estén configurados
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
