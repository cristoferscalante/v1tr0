# 🚀 Guía de Configuración - Database Webhook para Auto-crear Perfiles

## 📋 Prerequisitos

- Tener el CLI de Supabase instalado
- Tener acceso al Dashboard de Supabase
- Proyecto de Supabase activo

---

## Paso 1: Desplegar la Edge Function

### Opción A: Usando Supabase CLI (Recomendado)

1. **Instalar Supabase CLI** (si no lo tienes):
```powershell
npm install -g supabase
```

2. **Login en Supabase**:
```powershell
supabase login
```

3. **Link con tu proyecto**:
```powershell
cd D:\V1tr0\v1tr0\frontend
supabase link --project-ref ykrsxgpaxhtjsuebadnj
```

4. **Desplegar la función**:
```powershell
supabase functions deploy create-user-profile
```

### Opción B: Crear función manualmente en Dashboard

1. Ve a **Supabase Dashboard** → **Edge Functions**
2. Click en **"Create a new function"**
3. Nombre: `create-user-profile`
4. Copia y pega el contenido de `supabase/functions/create-user-profile/index.ts`
5. Click en **"Deploy"**

---

## Paso 2: Configurar el Database Webhook

Ahora que tienes la función desplegada, configura el webhook:

### En Supabase Dashboard:

1. **Ve a** → **Database** → **Webhooks**
2. **Click en** "Create a new webhook"
3. **Configura los siguientes campos**:

   **General:**
   - **Name:** `auto-create-profile`
   - (Sin espacios ni caracteres especiales)

   **Conditions to fire webhook:**
   - **Table:** `auth.users` (buscar en el dropdown)
   - **Events:** ✅ Marcar solo **INSERT**
   
   **Webhook configuration:**
   - **Type of webhook:** HTTP Request
   - **Method:** POST
   - **URL:** `https://ykrsxgpaxhtjsuebadnj.supabase.co/functions/v1/create-user-profile`
   
   **HTTP Headers (Importante):**
   - Click en "Add header"
   - Key: `Authorization`
   - Value: `Bearer YOUR_ANON_KEY`
     - Reemplazar `YOUR_ANON_KEY` con tu anon key:
     - `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcnN4Z3BheGh0anN1ZWJhZG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMzM5MTgsImV4cCI6MjA2MDkwOTkxOH0.QtXlQ8Ikc7s7SzGbW0KJxJEP9Jz_cHMyp6SYw7lSG0E`

4. **Click en "Create webhook"**

---

## Paso 3: Verificar que Funciona

### Prueba 1: Ver logs de la función

```powershell
# Ver logs en tiempo real
supabase functions logs create-user-profile --project-ref ykrsxgpaxhtjsuebadnj
```

O en el Dashboard:
1. Ve a **Edge Functions** → `create-user-profile`
2. Tab **"Logs"**

### Prueba 2: Registrar un usuario de prueba

1. Ve a `/register` en tu app
2. Registra un nuevo usuario con:
   - Email: `test-webhook@example.com`
   - Password: `Test1234!`
   - Nombre: `Usuario de Prueba`
3. Confirma el email

### Prueba 3: Verificar en la base de datos

```sql
-- Ver el usuario en auth.users
SELECT id, email, created_at, raw_user_meta_data
FROM auth.users
WHERE email = 'test-webhook@example.com';

-- Ver el perfil creado automáticamente
SELECT id, email, name, role, created_at
FROM profiles
WHERE email = 'test-webhook@example.com';
```

**Resultado esperado:**
- ✅ El usuario existe en `auth.users`
- ✅ El perfil existe en `profiles` con:
  - Mismo `id` que el usuario
  - Email copiado
  - Role = `client`
  - Nombre del metadata o del email

---

## Paso 4: Actualizar perfiles existentes

Si ya tienes usuarios sin perfil o sin email, ejecuta en SQL Editor:

```sql
-- Crear perfiles para usuarios sin perfil
INSERT INTO public.profiles (id, email, role, name)
SELECT 
  au.id,
  au.email,
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

-- Actualizar perfiles existentes con email
UPDATE public.profiles p
SET 
  email = au.email,
  updated_at = NOW()
FROM auth.users au
WHERE p.id = au.id
  AND (p.email IS NULL OR p.email = '');

-- Verificar resultados
SELECT 
  COUNT(*) as total_users,
  COUNT(p.id) as users_with_profile,
  COUNT(CASE WHEN p.email IS NOT NULL THEN 1 END) as profiles_with_email
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id;
```

---

## 🔍 Troubleshooting

### Problema 1: La función no se despliega
**Error:** `Function deployment failed`

**Solución:**
```powershell
# Verificar que estás en el directorio correcto
cd D:\V1tr0\v1tr0\frontend

# Verificar que el archivo existe
ls supabase\functions\create-user-profile\index.ts

# Intentar nuevamente
supabase functions deploy create-user-profile --project-ref ykrsxgpaxhtjsuebadnj
```

---

### Problema 2: El webhook no se ejecuta
**Verificar:**
1. En Dashboard → Database → Webhooks, el webhook debe estar **Enabled** (switch verde)
2. En Edge Functions → Logs, ver si hay errores
3. Verificar la URL del webhook: `https://ykrsxgpaxhtjsuebadnj.supabase.co/functions/v1/create-user-profile`

---

### Problema 3: Error 401 Unauthorized
**Causa:** Falta el header de Authorization o la anon key es incorrecta

**Solución:**
1. Ve a Dashboard → Project Settings → API
2. Copia el "anon public" key
3. Actualiza el webhook con el header:
   - Key: `Authorization`
   - Value: `Bearer TU_ANON_KEY`

---

### Problema 4: El perfil no se crea
**Verificar logs de la función:**
```powershell
supabase functions logs create-user-profile --project-ref ykrsxgpaxhtjsuebadnj
```

**Buscar en logs:**
- `📥 Webhook recibido:` - El webhook llegó
- `👤 Creando perfil para:` - Se intentó crear el perfil
- `✅ Perfil creado exitosamente:` - Todo OK
- `❌ Error al crear perfil:` - Hubo un error

---

## 🎯 Verificación Final

Ejecuta esta query para ver el estado completo:

```sql
SELECT 
  au.id,
  au.email as auth_email,
  au.created_at as registered_at,
  p.id as profile_id,
  p.email as profile_email,
  p.name,
  p.role,
  p.created_at as profile_created_at,
  CASE 
    WHEN p.id IS NULL THEN '❌ Sin perfil'
    WHEN p.email IS NULL THEN '⚠️ Sin email'
    ELSE '✅ Completo'
  END as status
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC
LIMIT 20;
```

**Checklist Final:**
- [ ] Edge Function desplegada
- [ ] Webhook creado y habilitado
- [ ] Header Authorization configurado
- [ ] Usuario de prueba registrado
- [ ] Perfil creado automáticamente
- [ ] Email copiado correctamente
- [ ] Role = 'client' asignado

---

## 📚 Comandos Útiles

```powershell
# Ver funciones desplegadas
supabase functions list --project-ref ykrsxgpaxhtjsuebadnj

# Ver logs en tiempo real
supabase functions logs create-user-profile --project-ref ykrsxgpaxhtjsuebadnj --follow

# Eliminar función (si necesitas redesplegar)
supabase functions delete create-user-profile --project-ref ykrsxgpaxhtjsuebadnj

# Redesplegar después de cambios
supabase functions deploy create-user-profile --project-ref ykrsxgpaxhtjsuebadnj
```

---

**Última actualización:** 2024-12-03  
**Método:** Database Webhook + Edge Function  
**Estado:** Listo para desplegar 🚀
