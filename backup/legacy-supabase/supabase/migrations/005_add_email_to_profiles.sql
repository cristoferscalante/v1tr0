-- ============================================================
-- Migración: Agregar campo email a profiles
-- Fecha: 2024-12-03
-- Descripción: Agrega el campo email a la tabla profiles
--              para poder crear clientes desde el dashboard
-- ============================================================

-- Agregar columna email si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'email'
    ) THEN
        ALTER TABLE profiles ADD COLUMN email TEXT UNIQUE;
        
        -- Crear índice para búsquedas rápidas
        CREATE INDEX idx_profiles_email ON profiles(email);
        
        -- Comentario
        COMMENT ON COLUMN profiles.email IS 'Email del usuario/cliente';
    END IF;
END $$;
