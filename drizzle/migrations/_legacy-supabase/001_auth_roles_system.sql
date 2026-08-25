-- Sistema de Autenticación con Roles
-- Migración para agregar roles y crear tablas de proyectos y tareas

-- 1. Agregar columna role a la tabla profiles existente
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'admin'));

-- Crear índice para consultas por rol
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Asegurar permisos en profiles
GRANT SELECT ON profiles TO anon;
GRANT ALL PRIVILEGES ON profiles TO authenticated;

-- 2. Crear tabla projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para projects
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- Permisos para projects
GRANT SELECT ON projects TO anon;
GRANT ALL PRIVILEGES ON projects TO authenticated;

-- Habilitar RLS en projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver sus propios proyectos
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (auth.uid() = client_id OR 
                     (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- 3. Crear tabla tasks
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('completada', 'en progreso', 'pendiente')),
    fecha_inicio DATE,
    fecha_final DATE,
    prioridad VARCHAR(20) DEFAULT 'media' CHECK (prioridad IN ('alta', 'media', 'baja')),
    categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('planeacion', 'diseño', 'desarrollo', 'testing', 'despliegue')),
    observaciones TEXT,
    finalizada BOOLEAN DEFAULT FALSE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para tasks
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_categoria ON tasks(categoria);
CREATE INDEX IF NOT EXISTS idx_tasks_estado ON tasks(estado);
CREATE INDEX IF NOT EXISTS idx_tasks_fecha_inicio ON tasks(fecha_inicio);

-- Permisos para tasks
GRANT SELECT ON tasks TO anon;
GRANT ALL PRIVILEGES ON tasks TO authenticated;

-- Habilitar RLS en tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver tareas de sus proyectos
CREATE POLICY "Users can view project tasks" ON tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = tasks.project_id 
            AND (projects.client_id = auth.uid() OR 
                 (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
        )
    );

-- 4. Insertar datos de ejemplo
-- Nota: Estos INSERT solo funcionarán si existen usuarios con estos emails
-- Se ejecutarán de forma condicional

-- Insertar proyecto de ejemplo (solo si existe un cliente)
INSERT INTO projects (name, description, status, client_id) 
SELECT 'Desarrollo Web V1TR0', 'Proyecto de desarrollo web completo', 'active', id
FROM profiles 
WHERE role = 'client' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- Insertar tareas de ejemplo
INSERT INTO tasks (nombre, descripcion, estado, fecha_inicio, fecha_final, prioridad, categoria, observaciones, finalizada, project_id) 
SELECT 
    'Definir arquitectura del sistema',
    'Crear diagrama de arquitectura y definir tecnologías',
    'completada',
    '2024-01-01',
    '2024-01-05',
    'alta',
    'planeacion',
    'Arquitectura aprobada por el cliente',
    true,
    p.id
FROM projects p
WHERE p.name = 'Desarrollo Web V1TR0'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO tasks (nombre, descripcion, estado, fecha_inicio, fecha_final, prioridad, categoria, observaciones, finalizada, project_id) 
SELECT 
    'Diseño de wireframes',
    'Crear wireframes de todas las páginas principales',
    'en progreso',
    '2024-01-06',
    '2024-01-15',
    'alta',
    'diseño',
    'En revisión con cliente',
    false,
    p.id
FROM projects p
WHERE p.name = 'Desarrollo Web V1TR0'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO tasks (nombre, descripcion, estado, fecha_inicio, fecha_final, prioridad, categoria, observaciones, finalizada, project_id) 
SELECT 
    'Desarrollo frontend',
    'Implementar componentes React y páginas principales',
    'pendiente',
    '2024-01-16',
    '2024-02-15',
    'alta',
    'desarrollo',
    'Pendiente aprobación de diseños',
    false,
    p.id
FROM projects p
WHERE p.name = 'Desarrollo Web V1TR0'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO tasks (nombre, descripcion, estado, fecha_inicio, fecha_final, prioridad, categoria, observaciones, finalizada, project_id) 
SELECT 
    'Testing de funcionalidades',
    'Pruebas unitarias y de integración',
    'pendiente',
    '2024-02-16',
    '2024-02-28',
    'media',
    'testing',
    'Incluye testing automatizado',
    false,
    p.id
FROM projects p
WHERE p.name = 'Desarrollo Web V1TR0'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO tasks (nombre, descripcion, estado, fecha_inicio, fecha_final, prioridad, categoria, observaciones, finalizada, project_id) 
SELECT 
    'Despliegue en producción',
    'Configurar servidor y desplegar aplicación',
    'pendiente',
    '2024-03-01',
    '2024-03-05',
    'alta',
    'despliegue',
    'Incluye configuración de dominio',
    false,
    p.id
FROM projects p
WHERE p.name = 'Desarrollo Web V1TR0'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Comentarios finales
-- Esta migración crea la estructura completa para el sistema de autenticación con roles
-- Incluye tablas, índices, políticas RLS y datos de ejemplo
-- Las políticas aseguran que los clientes solo vean sus proyectos y los admins vean todo