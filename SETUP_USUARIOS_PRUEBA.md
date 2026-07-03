# Configuración de Usuarios de Prueba - V1TR0

## 📋 Resumen

Este documento explica cómo crear usuarios de prueba en Supabase para probar el sistema de autenticación de V1TR0.

---

## 🔐 Credenciales de Supabase

**URL del Proyecto:** `https://ykrsxgpaxhtjsuebadnj.supabase.co`

**Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcnN4Z3BheGh0anN1ZWJhZG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMzM5MTgsImV4cCI6MjA2MDkwOTkxOH0.QtXlQ8Ikc7s7SzGbW0KJxJEP9Jz_cHMyp6SYw7lSG0E`

---

## 👥 Usuarios Recomendados para Crear

### 1. Usuario Administrador

```
Email: admin@v1tr0.com
Password: V1tr0Admin2024!
Rol: admin
```

### 2. Usuario Cliente

```
Email: cliente@v1tr0.com  
Password: V1tr0Client2024!
Rol: client
```

### 3. Usuario de Equipo (Team)

```
Email: team@v1tr0.com
Password: V1tr0Team2024!
Rol: team
```

---

## 🛠️ Pasos para Crear Usuarios en Supabase

### Opción A: Usar el Dashboard de Supabase (Recomendado)

1. **Ir al Dashboard de Authentication:**
   ```
   https://supabase.com/dashboard/project/ykrsxgpaxhtjsuebadnj/auth/users
   ```

2. **Click en "Add User" → "Create new user"**

3. **Llenar el formulario:**
   - Email: `admin@v1tr0.com`
   - Password: `V1tr0Admin2024!`
   - ✅ Auto Confirm User

4. **Click en "Create user"**

5. **Crear el perfil del usuario:**
   - Ir a Table Editor → `profiles`
   - Click "Insert" → "Insert row"
   - Llenar:
     ```
     id: [copiar el UUID del usuario creado]
     email: admin@v1tr0.com
     name: Administrador V1TR0
     role: admin
     ```

6. **Repetir para cliente y team**

---

### Opción B: Usar SQL (Avanzado)

1. **Ir al SQL Editor:**
   ```
   https://supabase.com/dashboard/project/ykrsxgpaxhtjsuebadnj/sql/new
   ```

2. **Ejecutar el siguiente script SQL:**

```sql
-- Crear usuario admin y su perfil
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Crear usuario en auth.users (requiere service_role)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@v1tr0.com',
    crypt('V1tr0Admin2024!', gen_salt('bf')),
    now(),
    now(),
    now(),
    now()
  ) RETURNING id INTO admin_user_id;

  -- Crear perfil
  INSERT INTO public.profiles (id, email, name, role, created_at, updated_at)
  VALUES (admin_user_id, 'admin@v1tr0.com', 'Administrador V1TR0', 'admin', now(), now());
END $$;

-- Crear usuario cliente y su perfil
DO $$
DECLARE
  client_user_id uuid;
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'cliente@v1tr0.com',
    crypt('V1tr0Client2024!', gen_salt('bf')),
    now(),
    now(),
    now(),
    now()
  ) RETURNING id INTO client_user_id;

  INSERT INTO public.profiles (id, email, name, role, created_at, updated_at)
  VALUES (client_user_id, 'cliente@v1tr0.com', 'Cliente de Prueba', 'client', now(), now());
END $$;

-- Crear usuario team y su perfil
DO $$
DECLARE
  team_user_id uuid;
BEGIN
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    created_at,
    updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'team@v1tr0.com',
    crypt('V1tr0Team2024!', gen_salt('bf')),
    now(),
    now(),
    now(),
    now()
  ) RETURNING id INTO team_user_id;

  INSERT INTO public.profiles (id, email, name, role, created_at, updated_at)
  VALUES (team_user_id, 'team@v1tr0.com', 'Miembro del Equipo', 'team', now(), now());
END $$;
```

---

## 🔄 Flujo de Autenticación Configurado

### 1. Login Principal (`/login`)

```
┌─────────────────────────────────────┐
│     Usuario ingresa credenciales   │
│                                     │
│  Email: admin@v1tr0.com             │
│  Password: V1tr0Admin2024!          │
└──────────────┬──────────────────────┘
               │
               ├─ Supabase verifica
               │
               └─ Obtiene rol de tabla profiles
                  │
                  ├─ admin/team → /admin
                  └─ client → /client-dashboard
```

### 2. Registro (`/register`)

```
┌─────────────────────────────────────┐
│     Usuario se registra             │
│                                     │
│  Nombre completo                    │
│  Email                              │
│  Password                           │
└──────────────┬──────────────────────┘
               │
               ├─ Supabase crea usuario
               │
               ├─ Crea perfil con rol 'client'
               │
               └─ Email de confirmación
                  │
                  └─ Confirma → Login → /client-dashboard
```

---

## 📦 Estructura de la Base de Datos

### Tabla `auth.users` (Supabase Auth)
```sql
id              uuid PRIMARY KEY
email           text UNIQUE
encrypted_password text
email_confirmed_at timestamp
created_at      timestamp
updated_at      timestamp
```

### Tabla `public.profiles`
```sql
id              uuid PRIMARY KEY REFERENCES auth.users(id)
email           text UNIQUE
name            text
role            text CHECK (role IN ('admin', 'client', 'team'))
created_at      timestamp
updated_at      timestamp
```

---

## ✅ Verificación

### Después de crear los usuarios, verifica:

1. **En Supabase Dashboard:**
   - Ve a Authentication → Users
   - Deberías ver 3 usuarios
   - Todos con email confirmado

2. **En Table Editor:**
   - Ve a `profiles`
   - Deberías ver 3 perfiles
   - Cada uno con su rol correcto

3. **Probar Login:**
   - Ve a `http://localhost:3000/login`
   - Ingresa: `admin@v1tr0.com` / `V1tr0Admin2024!`
   - Debería redirigir a `/admin`

---

## 🚨 Troubleshooting

### Error: "Invalid login credentials"

**Causa:** El usuario no existe o la contraseña es incorrecta.

**Solución:**
1. Verifica que el usuario existe en Supabase Auth
2. Verifica que el email está confirmado
3. Si creaste manualmente, asegúrate de usar la función `crypt()` para el password

### Error: "No se pudo conectar con el servidor"

**Causa:** Variables de entorno incorrectas.

**Solución:**
1. Verifica `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://ykrsxgpaxhtjsuebadnj.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
2. Reinicia el servidor de desarrollo

### El usuario se crea pero no tiene perfil

**Solución:**
1. Ve a Table Editor → `profiles`
2. Inserta manualmente el perfil con el `id` del usuario
3. O activa el trigger de crear perfil automático

---

## 🔧 Configuración Adicional Recomendada

### 1. Trigger para crear perfil automáticamente

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'client'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. RLS (Row Level Security)

```sql
-- Permitir que los usuarios lean su propio perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Permitir que los usuarios actualicen su propio perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Solo admins pueden ver todos los perfiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## 📝 Notas Finales

- Los usuarios de prueba son solo para desarrollo/testing
- En producción, elimina estos usuarios o cambia las contraseñas
- El registro está habilitado para crear nuevos clientes
- Solo admins pueden acceder al panel de administración
- El middleware protege automáticamente las rutas `/admin/*`

---

**Última actualización:** Enero 2025
**Versión:** 1.0.0
