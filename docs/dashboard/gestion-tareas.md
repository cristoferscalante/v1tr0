# Sistema de Gestión de Tareas - Dashboard V1TR0

## Resumen

Sistema completo para gestionar tareas provenientes de transcripciones de reuniones y vincularlas con proyectos existentes.

## Flujo de Datos

```
Transcripción de Reunión
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  Flujo n8n (Google Drive → AI → Supabase)           │
│  Ver: docs/flujos/transcripciones-reuniones.md      │
└─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  Supabase Tables                                     │
│  - meeting_summaries (resúmenes)                     │
│  - meeting_tasks (tareas extraídas)                  │
└─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  Dashboard UI                                        │
│  - TaskNotifications (campana con tareas nuevas)     │
│  - ProjectTasks (cards de tareas en proyecto)        │
└─────────────────────────────────────────────────────┘
```

## Componentes Implementados

### 1. TaskNotifications (`components/dashboard/task-notifications.tsx`)
- **Ubicación**: Header del dashboard (junto a botones de acción)
- **Funcionalidad**:
  - Muestra un ícono de campana con contador de tareas sin asignar
  - Dropdown con lista de tareas pendientes de asignación
  - Selector de proyecto para cada tarea
  - Asignación instantánea con actualización en tiempo real

### 2. ProjectTasks (`components/dashboard/project-tasks.tsx`)
- **Ubicación**: Tab "Tareas" en la página de proyecto individual
- **Funcionalidad**:
  - Muestra estadísticas de progreso (completadas, en progreso, pendientes)
  - Filtros por estado
  - Cards expandibles con:
    - Información de la tarea
    - Cambio de estado (no eliminar)
    - Sistema de comentarios
    - Metadata (fechas, prioridad, categoría)
  - Diferencia visual entre tareas de proyecto y tareas de reuniones

### 3. Servicio de Base de Datos (`lib/supabase-projects-db.ts`)
- **Métodos principales**:
  - `getProjects()`, `getActiveProjects()`, `getProjectById()`
  - `getTasksByProject()`, `createTask()`, `updateTask()`
  - `getMeetingTasks()`, `getUnassignedMeetingTasks()`, `getMeetingTasksByProject()`
  - `assignMeetingTaskToProject()`, `updateMeetingTask()`
  - `getProjectStats()`, `getUnassignedTasksCount()`
  - Suscripciones en tiempo real para cambios

## Migraciones de Base de Datos

### 002_meeting_tasks_projects.sql
- Agrega `project_id` a `meeting_tasks` para vincular con proyectos
- Crea tabla `task_comments` para comentarios en tareas
- Configura RLS y permisos

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `app/(dashboard)/dashboard/page.tsx` | Agregado TaskNotifications en header |
| `app/(dashboard)/dashboard/projects/[id]/page.tsx` | Nuevo tab "Tareas" como default |
| `components/dashboard/task-notifications.tsx` | **NUEVO** - Componente de notificaciones |
| `components/dashboard/project-tasks.tsx` | **NUEVO** - Cards de tareas |
| `components/dashboard/project-tasks-wrapper.tsx` | **NUEVO** - Wrapper para SSR |
| `lib/supabase-projects-db.ts` | **NUEVO** - Servicio de datos |
| `supabase/migrations/002_meeting_tasks_projects.sql` | **NUEVO** - Migración |
| `supabase/migrations/000_current_schema.sql` | Actualizado con nuevos campos |

## Características de las Tareas

### Tareas de Proyecto (tasks)
- Campos en español (nombre, descripcion, estado, prioridad, categoria)
- Estados: pendiente, en progreso, completada
- Categorías: planeacion, diseño, desarrollo, testing, despliegue
- Prioridades: alta, media, baja

### Tareas de Reunión (meeting_tasks)
- Campos en inglés (title, description, status, priority)
- Estados: pending, in_progress, completed, cancelled
- Prioridades: high, medium, low
- Campo adicional: `project_id` (opcional, para vincular)
- Identificador visual: badge "De Reunión" + borde lateral

## Uso

### Para el Admin
1. Ver notificaciones de tareas nuevas en el icono de campana
2. Seleccionar proyecto para asignar cada tarea
3. Ir a proyecto específico > Tab "Tareas"
4. Expandir tarjeta para:
   - Cambiar estado
   - Agregar comentarios
   - Ver detalles completos

### Para ejecutar migración
```sql
-- Ejecutar en Supabase SQL Editor
-- Contenido de: supabase/migrations/002_meeting_tasks_projects.sql
```

## Próximas Mejoras Sugeridas
- [ ] Persistir comentarios en tabla `task_comments`
- [ ] Notificaciones por email de tareas asignadas
- [ ] Vista Kanban arrastrable
- [ ] Filtros avanzados (por responsable, fecha, etc.)
- [ ] Exportar tareas a CSV/Excel
