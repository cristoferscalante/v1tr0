# Flujo de Transcripciones de Reuniones → Tareas en Supabase

## Diagrama del Flujo

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│  Google Drive       │    │  Download File      │    │  Extract from File  │
│  Trigger            │───▶│                     │───▶│                     │
│  (fileCreated)      │    │  (download: file)   │    │  (Extract Text)     │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
                                                                │
                                                                ▼
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│  Create a row       │    │  Code in JavaScript │    │  Message a Model    │
│  (Supabase)         │◀───│  (Transform Data)   │◀───│  (AI Processing)    │
│                     │    │                     │    │  (message: text)    │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

## Descripción de Cada Paso

### 1. Google Drive Trigger (fileCreated)
- **Evento**: Se activa cuando se crea un nuevo archivo en la carpeta configurada de Google Drive
- **Entrada**: Archivo de transcripción de reunión (formato texto o audio transcrito)
- **Salida**: Metadatos del archivo (ID, nombre, tipo)

### 2. Download File
- **Acción**: Descarga el contenido del archivo detectado
- **Entrada**: ID del archivo de Google Drive
- **Salida**: Contenido binario/texto del archivo

### 3. Extract from File
- **Acción**: Extrae el texto plano del archivo descargado
- **Entrada**: Archivo descargado
- **Salida**: Texto plano de la transcripción

### 4. Message a Model (AI - OpenAI/Claude)
- **Acción**: Procesa la transcripción con IA para extraer información estructurada
- **Prompt sugerido**: 
  ```
  Analiza la siguiente transcripción de reunión y extrae:
  1. Título de la reunión
  2. Fecha
  3. Participantes
  4. Resumen ejecutivo
  5. Decisiones clave tomadas
  6. Tareas asignadas (con responsable, descripción, prioridad, fecha límite)
  7. Seguimientos pendientes
  8. Próxima reunión (si se menciona)
  
  Devuelve la información en formato JSON estructurado.
  ```
- **Salida**: JSON estructurado con la información extraída

### 5. Code in JavaScript
- **Acción**: Transforma el JSON de la IA al formato esperado por las tablas de Supabase
- **Código ejemplo**:
  ```javascript
  const aiResponse = JSON.parse($input.item.json.message);
  
  // Estructura para meeting_summaries
  const meetingSummary = {
    title: aiResponse.titulo,
    meeting_date: aiResponse.fecha,
    participants: JSON.stringify(aiResponse.participantes),
    summary: aiResponse.resumen,
    key_decisions: JSON.stringify(aiResponse.decisiones),
    tasks: JSON.stringify(aiResponse.tareas),
    follow_ups: JSON.stringify(aiResponse.seguimientos),
    next_meeting: JSON.stringify(aiResponse.proximaReunion),
    metadata: JSON.stringify({ source: 'google_drive_automation' })
  };
  
  // Estructura para meeting_tasks (una por cada tarea)
  const tasks = aiResponse.tareas.map(t => ({
    title: t.titulo,
    description: t.descripcion,
    assigned_to: t.responsable,
    priority: t.prioridad, // 'high', 'medium', 'low'
    status: 'pending',
    due_date: t.fechaLimite,
    category: t.categoria || 'general',
    tags: t.etiquetas || [],
    estimated_hours: t.horasEstimadas
  }));
  
  return { meetingSummary, tasks };
  ```

### 6. Create a Row (Supabase)
- **Acción**: Inserta los datos en las tablas de Supabase
- **Tablas destino**:
  - `meeting_summaries`: Resumen general de la reunión
  - `meeting_tasks`: Tareas individuales extraídas (relacionadas con meeting_summary_id)

## Tablas de Supabase Involucradas

### meeting_summaries
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| title | TEXT | Título de la reunión |
| meeting_date | DATE | Fecha de la reunión |
| participants | JSONB | Lista de participantes |
| summary | TEXT | Resumen ejecutivo |
| key_decisions | JSONB | Decisiones tomadas |
| tasks | JSONB | Tareas en formato JSON (respaldo) |
| follow_ups | JSONB | Seguimientos pendientes |
| next_meeting | JSONB | Info de próxima reunión |
| metadata | JSONB | Metadatos adicionales |

### meeting_tasks
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| meeting_summary_id | UUID | FK a meeting_summaries |
| title | TEXT | Título de la tarea |
| description | TEXT | Descripción detallada |
| assigned_to | TEXT | Persona asignada |
| priority | TEXT | 'high', 'medium', 'low' |
| status | TEXT | 'pending', 'in_progress', 'completed' |
| due_date | DATE | Fecha límite |
| category | TEXT | Categoría de la tarea |
| tags | TEXT[] | Etiquetas |
| estimated_hours | INTEGER | Horas estimadas |

## Estado Actual
- ✅ Flujo configurado y funcionando
- ✅ Datos guardándose en Supabase
- ⏳ **Pendiente**: Conectar UI del dashboard para gestionar tareas

## Próximos Pasos (UI Dashboard)

### 1. Sistema de Notificaciones (Campana)
- Mostrar contador de tareas nuevas sin asignar a proyecto
- Dropdown con lista de tareas pendientes de asignación
- Selector de proyecto para asignar cada tarea

### 2. Vista de Proyecto con Tareas
- Cards de tareas en vista Kanban o lista
- Filtros por estado, prioridad, responsable
- Comentarios en cada tarea
- Actualización de estado (no eliminar)
- Historial de cambios

### 3. Relación Tareas ↔ Proyectos
- Campo `project_id` en `meeting_tasks` para vincular
- UI para asignar tareas huérfanas a proyectos existentes
