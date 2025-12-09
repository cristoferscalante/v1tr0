# 📋 Guía de Configuración - Sistema de Clientes

## ✅ Cambios Completados en el Código

### 1. **ClientDialog Component** (`components/dashboard/client-dialog.tsx`)
- ✅ Modal para crear/editar clientes
- ✅ Validación de email único
- ✅ Campos: nombre (requerido), email (requerido)
- ✅ Deshabilita edición de email en clientes existentes
- ✅ Role automático = 'client'

### 2. **Clients Page** (`app/(dashboard)/dashboard/clients/page.tsx`)
- ✅ Integración completa con Supabase
- ✅ Fetch de clientes (role='client')
- ✅ CRUD completo (Crear, Leer, Editar, Eliminar)
- ✅ Estados de carga y vacío
- ✅ Estadísticas actualizadas
- ✅ Diálogo de confirmación para eliminar

### 3. **Login Fallback** (`app/(auth)/login/page.tsx`)
- ✅ Actualizado para incluir `email` al crear perfil manual

### 4. **Migrations**
- ✅ `005_add_email_to_profiles.sql` - Ya ejecutado (campo existe)
- ✅ `006_create_profile_trigger_with_email.sql` - **PENDIENTE DE EJECUTAR**

---

## 🚀 Pasos para Completar la Configuración

### Paso 1: Ejecutar Trigger en Supabase Dashboard

1. Ve a **Supabase Dashboard** → **SQL Editor**
2. Abre el archivo: `supabase/migrations/006_create_profile_trigger_with_email.sql`
3. Copia TODO el contenido
4. Pégalo en el SQL Editor
5. Haz clic en **Run** (▶️)

Este script hará lo siguiente:
- ✅ Creará la función `handle_new_user()` que incluye el email
- ✅ Creará el trigger que se ejecuta al registrarse un usuario
- ✅ Actualizará perfiles existentes con sus emails
- ✅ Mostrará estadísticas de verificación

### Paso 2: Verificar que el Trigger Funciona

Ejecuta este query en el SQL Editor para verificar:

```sql
-- Verificar que el trigger existe
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Verificar perfiles existentes
SELECT 
  id,
  email,
  name,
  role,
  created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 10;
```

### Paso 3: Probar el Flujo Completo

#### A) Crear Cliente desde Dashboard (Admin)
1. Inicia sesión como admin
2. Ve a `/dashboard/clients`
3. Click en **"Nuevo Cliente"**
4. Ingresa:
   - Nombre: `Empresa Test`
   - Email: `test@empresa.com`
5. Click **"Crear Cliente"**
6. ✅ Verifica que aparece en la lista

#### B) Registrar Usuario Nuevo
1. Cierra sesión
2. Ve a `/register`
3. Regístrate con un nuevo email
4. Confirma el email (revisa inbox)
5. Inicia sesión
6. **Como admin**, ve a `/dashboard/clients`
7. ✅ Verifica que el usuario registrado aparece en la lista con role='client'

#### C) Asignar Cliente a Proyecto
1. Ve a `/dashboard/projects`
2. Click en **"Nuevo Proyecto"** o edita uno existente
3. En el dropdown de **"Cliente"**, debes ver:
   - El cliente creado manualmente (`Empresa Test`)
   - El usuario que se registró
4. Selecciona uno y guarda
5. ✅ Verifica que el proyecto muestra el nombre del cliente

---

## 🔍 Verificación de Estado Actual

### Base de Datos
```sql
-- Ver estructura de profiles
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Resultado esperado:
-- ✅ id (uuid, NO)
-- ✅ email (text, YES) 
-- ✅ name (text, YES)
-- ✅ role (text, YES)
-- ✅ avatar (text, YES)
-- ✅ created_at (timestamp, YES)
-- ✅ updated_at (timestamp, YES)
```

### Componentes
- ✅ `components/dashboard/client-dialog.tsx` - Creado
- ✅ `components/dashboard/project-dialog.tsx` - Ya existía, funcional
- ✅ `app/(dashboard)/dashboard/clients/page.tsx` - Actualizado
- ✅ `app/(dashboard)/dashboard/projects/page.tsx` - Ya funcional
- ✅ `app/(auth)/login/page.tsx` - Actualizado con email

---

## 📊 Flujo de Datos Esperado

```
┌─────────────────────────────────────────────────────────┐
│  Usuario se Registra (/register)                       │
│  - Email: usuario@example.com                          │
│  - Password: *******                                   │
│  - Name: Juan Pérez                                    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  Supabase Auth crea usuario en auth.users              │
│  - id: uuid-generado                                   │
│  - email: usuario@example.com                          │
│  - raw_user_meta_data: { name: "Juan Pérez" }         │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼ (TRIGGER: on_auth_user_created)
┌─────────────────────────────────────────────────────────┐
│  handle_new_user() crea perfil en profiles             │
│  - id: uuid-generado (mismo de auth.users)             │
│  - email: usuario@example.com  ⭐ NUEVO                │
│  - name: Juan Pérez                                    │
│  - role: 'client'  ⭐ AUTOMÁTICO                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  Usuario aparece en /dashboard/clients                 │
│  - Puede ser asignado a proyectos                      │
│  - Admin puede editar su nombre                        │
│  - Email NO editable (viene de auth)                   │
└─────────────────────────────────────────────────────────┘
```

---

## ❓ Troubleshooting

### Problema 1: El trigger no se crea
**Error:** `permission denied to create trigger on auth.users`

**Solución:** Solo puedes ejecutar este SQL desde el SQL Editor del Dashboard de Supabase, no desde código o terminal.

---

### Problema 2: Los usuarios registrados no aparecen
**Verificar:**
```sql
-- 1. ¿Existe el trigger?
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 2. ¿Los usuarios tienen perfil?
SELECT 
  au.email,
  p.id,
  p.email as profile_email,
  p.name,
  p.role
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id;
```

**Si faltan perfiles**, ejecuta:
```sql
-- Crear perfiles para usuarios sin perfil
INSERT INTO public.profiles (id, email, role, name)
SELECT 
  au.id,
  au.email,
  'client',
  COALESCE(
    au.raw_user_meta_data->>'name',
    split_part(au.email, '@', 1)
  )
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = au.id
);
```

---

### Problema 3: Error de email duplicado
**Error:** `duplicate key value violates unique constraint "profiles_email_key"`

**Causa:** Intentando crear dos clientes con el mismo email.

**Solución:** Los emails deben ser únicos. El ClientDialog ya valida esto, pero si ocurre:
```sql
-- Ver emails duplicados
SELECT email, COUNT(*) 
FROM profiles 
WHERE email IS NOT NULL 
GROUP BY email 
HAVING COUNT(*) > 1;
```

---

## 🎯 Checklist Final

Antes de considerar completo, verifica:

- [ ] Ejecutar `006_create_profile_trigger_with_email.sql` en Dashboard
- [ ] Verificar que el trigger existe en `information_schema.triggers`
- [ ] Crear un cliente manualmente desde `/dashboard/clients`
- [ ] Registrar un nuevo usuario y verificar que aparece en clientes
- [ ] Asignar ambos tipos de clientes a un proyecto
- [ ] Verificar que el proyecto muestra el nombre del cliente
- [ ] Probar editar un cliente (nombre sí, email no)
- [ ] Probar eliminar un cliente (con confirmación)

---

## 📚 Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `supabase/migrations/006_create_profile_trigger_with_email.sql` | **EJECUTAR EN DASHBOARD** |
| `components/dashboard/client-dialog.tsx` | Formulario de clientes |
| `app/(dashboard)/dashboard/clients/page.tsx` | Lista de clientes |
| `app/(dashboard)/dashboard/projects/page.tsx` | Lista de proyectos |
| `app/(auth)/login/page.tsx` | Login con fallback de perfil |
| `app/(auth)/register/page.tsx` | Registro de usuarios |

---

## 🔗 Próximos Pasos Sugeridos

Una vez que todo funcione:

1. **Agregar filtros en clientes**: Por email, nombre, fecha
2. **Paginación**: Si hay muchos clientes
3. **Búsqueda**: Input para filtrar clientes en tiempo real
4. **Dashboard del cliente**: Vista personalizada en `/client-dashboard`
5. **Notificaciones**: Avisar al cliente cuando se le asigna un proyecto

---

**Última actualización:** 2024-12-03  
**Estado:** Código listo ✅ | Trigger pendiente de ejecutar ⏳
