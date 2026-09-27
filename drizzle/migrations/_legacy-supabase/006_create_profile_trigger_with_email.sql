-- ============================================================
-- Migración: Auto-rellenar email en profiles desde auth.users
-- Fecha: 2024-12-03
-- Descripción: Cuando se inserta un perfil, automáticamente
--              obtiene el email desde auth.users si no se proporciona
-- ============================================================

-- EJECUTAR ESTE SCRIPT COMPLETO EN SUPABASE DASHBOARD > SQL EDITOR

-- 1. Función que rellena el email automáticamente desde auth.users
CREATE OR REPLACE FUNCTION public.auto_fill_profile_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Si no hay email en el perfil, obtenerlo de auth.users
  IF NEW.email IS NULL OR NEW.email = '' THEN
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = NEW.id;
    
    NEW.email := user_email;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 2. Eliminar trigger anterior si existe
DROP TRIGGER IF EXISTS trigger_auto_fill_profile_email ON profiles;

-- 3. Crear el trigger en la tabla profiles (BEFORE INSERT)
CREATE TRIGGER trigger_auto_fill_profile_email
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_fill_profile_email();

-- 4. Actualizar perfiles existentes con el email de auth.users
UPDATE public.profiles p
SET 
  email = au.email,
  updated_at = NOW()
FROM auth.users au
WHERE p.id = au.id
  AND (p.email IS NULL OR p.email = '');

-- 5. Verificar resultados
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as profiles_with_email,
  COUNT(CASE WHEN role = 'client' THEN 1 END) as client_profiles,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_profiles
FROM public.profiles;

-- 6. Comentarios para documentación
COMMENT ON FUNCTION public.handle_new_user() IS 
  'Crea automáticamente un perfil en profiles cuando se registra un usuario en auth.users. Incluye email, role=client por defecto.';

COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 
  'Dispara handle_new_user() después de insertar un usuario en auth.users';
