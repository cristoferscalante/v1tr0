# Guía de Depuración de Autenticación

## Problema Reportado
El inicio de sesión no funciona correctamente.

## Logs a Revisar

Cuando intentes iniciar sesión, revisa la consola del navegador para estos mensajes:

```
[LOGIN] Intentando iniciar sesión con email: ...
[LOGIN] Respuesta de Supabase: { hasData, hasUser, hasSession, error }
[LOGIN] Login exitoso, obteniendo perfil de usuario...
[LOGIN] Rol del usuario: ...
```

## Errores Comunes y Soluciones

### 1. "Invalid login credentials"
**Causa**: Email o contraseña incorrectos
**Solución**: 
- Verifica que el email esté bien escrito
- Asegúrate de que la contraseña sea correcta
- Verifica que el usuario existe en Supabase Auth

### 2. "Email not confirmed"
**Causa**: El usuario no ha confirmado su email
**Solución**: 
- Revisa el email de confirmación en la bandeja de entrada
- Si no llegó, usa la opción de reenviar email de confirmación

### 3. Error al obtener perfil
**Causa**: No existe un registro en la tabla `profiles` para el usuario
**Solución**: El sistema ahora crea automáticamente un perfil con rol "client" si no existe

## Verificaciones en Supabase

### 1. Verificar que el usuario existe
```sql
SELECT * FROM auth.users WHERE email = 'tu@email.com';
```

### 2. Verificar el perfil del usuario
```sql
SELECT * FROM public.profiles WHERE id = '<user_id>';
```

### 3. Verificar políticas RLS
```sql
-- Ver políticas de la tabla profiles
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

### 4. Crear perfil manualmente si es necesario
```sql
INSERT INTO public.profiles (id, role, name)
VALUES ('<user_id>', 'client', 'Nombre del Usuario')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  name = EXCLUDED.name;
```

## Configuración de Supabase Requerida

### Variables de Entorno (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### Políticas RLS Necesarias

La tabla `profiles` debe tener estas políticas:

1. **Lectura**: Los usuarios pueden ver su propio perfil
```sql
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
```

2. **Inserción**: Los usuarios pueden crear su propio perfil
```sql
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Trigger para Crear Perfil Automáticamente

Si quieres que el perfil se cree automáticamente al registrarse:

```sql
-- Función para crear perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, name)
  VALUES (
    NEW.id,
    'client',
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger al crear usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Pasos para Depurar

1. **Abrir DevTools** (F12) en el navegador
2. **Ir a la pestaña Console**
3. **Intentar iniciar sesión**
4. **Revisar los logs** que empiezan con `[LOGIN]`
5. **Copiar el error completo** si hay alguno
6. **Verificar en Supabase Dashboard**:
   - Authentication > Users
   - Table Editor > profiles
   - Database > Policies

## Mensajes de Error Traducidos

El sistema ahora muestra mensajes en español para todos los errores de autenticación:

- ✅ Credenciales incorrectas
- ✅ Correo no verificado
- ✅ Usuario no encontrado
- ✅ Contraseña débil
- ✅ Email ya registrado
- ✅ Sesión expirada
- ✅ Error de conexión
- ✅ Y más...

## Contacto

Si el problema persiste después de estas verificaciones, proporciona:
1. Los logs de la consola (mensajes [LOGIN])
2. El error específico que aparece
3. Captura de pantalla del error si es posible
