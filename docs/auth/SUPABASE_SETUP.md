# Configuración de Supabase para Autenticación

## 🎯 Pasos de Configuración

### 1. Ejecutar Migraciones Básicas

Las siguientes migraciones se pueden ejecutar desde tu código local:

```bash
# Ya aplicadas:
✅ 000_current_schema.sql
✅ 002_meeting_tasks_projects.sql
✅ 003_auto_extract_tasks_trigger.sql
✅ 004_auto_create_profile_trigger.sql (parcial)
```

### 2. Configurar Trigger de Creación de Perfil (Requiere Dashboard)

⚠️ **IMPORTANTE**: Este paso DEBE hacerse desde el Supabase Dashboard porque requiere permisos de superusuario.

#### Paso a Paso:

1. **Ir a Supabase Dashboard**
   - Abre https://app.supabase.com
   - Selecciona tu proyecto v1tr0
   - Ve a **SQL Editor** (ícono de base de datos en el sidebar)

2. **Ejecutar este SQL**

```sql
-- Función para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, name, avatar)
  VALUES (
    NEW.id,
    'client',
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, profiles.name),
    avatar = COALESCE(EXCLUDED.avatar, profiles.avatar),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

-- Trigger para ejecutar la función al crear un usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

3. **Verificar que se creó correctamente**

```sql
-- Ver el trigger
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Ver la función
SELECT proname, prosrc FROM pg_proc WHERE proname = 'handle_new_user';
```

### 3. Crear Perfiles para Usuarios Existentes

Si ya tienes usuarios registrados sin perfil, ejecuta esto en el SQL Editor:

```sql
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
```

## ✅ Verificación

### Probar que el trigger funciona:

1. Registra un nuevo usuario en tu app
2. Ve a **Table Editor > profiles** en Supabase Dashboard
3. Verifica que se creó automáticamente el perfil con:
   - `id` = ID del usuario
   - `role` = 'client'
   - `name` = nombre del usuario o parte del email

### Si el trigger NO está configurado:

No te preocupes, el código de login ya tiene un **fallback automático** que crea el perfil si no existe:

```typescript
// En app/(auth)/login/page.tsx líneas 90-105
if (profileError) {
  console.error('[LOGIN] Error al obtener perfil:', profileError)
  
  // Si no existe el perfil, crear uno por defecto
  const { error: createError } = await supabase
    .from('profiles')
    .insert([{ 
      id: data.user.id, 
      role: 'client',
      name: data.user.email?.split('@')[0] || 'Usuario'
    }])
  
  // ...
}
```

## 🔐 Políticas RLS Necesarias

Estas políticas ya están en el schema (000_current_schema.sql):

```sql
-- Ver perfil propio
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Insertar perfil propio
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Actualizar perfil propio
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins pueden ver todos
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
```

## 🐛 Troubleshooting

### Problema: "must be owner of relation users"
- **Causa**: Intentas crear un trigger en `auth.users` desde una migración local
- **Solución**: Ejecuta el SQL del trigger manualmente en Supabase Dashboard

### Problema: "Profile not found" al hacer login
- **Causa**: El trigger no está configurado y el fallback falló
- **Solución 1**: Configura el trigger siguiendo el paso 2
- **Solución 2**: Crea el perfil manualmente:
  ```sql
  INSERT INTO public.profiles (id, role, name)
  VALUES ('<user_id>', 'client', 'Nombre Usuario');
  ```

### Problema: "Invalid credentials" con credenciales correctas
- **Causa**: Usuario no confirmó su email
- **Solución**: 
  1. Ve a **Authentication > Users** en Supabase Dashboard
  2. Encuentra el usuario
  3. Haz clic en los 3 puntos > Send confirmation email
  4. O marca manualmente como confirmado

## 📚 Referencias

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Triggers](https://supabase.com/docs/guides/database/postgres/triggers)
