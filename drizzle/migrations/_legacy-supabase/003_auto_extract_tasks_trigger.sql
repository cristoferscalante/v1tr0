-- ============================================================
-- Migración: Trigger para extraer tareas automáticamente
-- Fecha: 2024-11-30
-- Descripción: Cuando se inserta un meeting_summary, extrae
--              las tareas del JSON y las inserta en meeting_tasks
-- ============================================================

-- 0. Primero agregar la columna project_id si no existe
ALTER TABLE meeting_tasks 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;

-- Crear índice para project_id
CREATE INDEX IF NOT EXISTS idx_meeting_tasks_project_id ON meeting_tasks(project_id);

-- 1. Función que extrae las tareas del JSON y las inserta en meeting_tasks
CREATE OR REPLACE FUNCTION extract_tasks_from_meeting_summary()
RETURNS TRIGGER AS $$
DECLARE
  task_record JSONB;
  tasks_array JSONB;
BEGIN
  -- Verificar si hay tareas en el JSON
  IF NEW.tasks IS NULL OR NEW.tasks::text = '[]' OR NEW.tasks::text = '' THEN
    RETURN NEW;
  END IF;

  -- Convertir el campo tasks a JSONB
  BEGIN
    tasks_array := NEW.tasks::jsonb;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error parsing tasks JSON: %', SQLERRM;
    RETURN NEW;
  END;

  -- Iterar sobre cada tarea en el array
  FOR task_record IN SELECT * FROM jsonb_array_elements(tasks_array)
  LOOP
    -- Insertar cada tarea en meeting_tasks
    INSERT INTO meeting_tasks (
      meeting_summary_id,
      title,
      description,
      assigned_to,
      priority,
      status,
      due_date,
      category,
      tags,
      estimated_hours,
      project_id
    ) VALUES (
      NEW.id,
      COALESCE(task_record->>'title', 'Sin título'),
      task_record->>'description',
      task_record->>'assigned_to',
      COALESCE(task_record->>'priority', 'medium'),
      COALESCE(task_record->>'status', 'pending'),
      CASE 
        WHEN task_record->>'due_date' IS NOT NULL AND task_record->>'due_date' != 'null'
        THEN (task_record->>'due_date')::date 
        ELSE NULL 
      END,
      COALESCE(task_record->>'category', 'other'),
      CASE 
        WHEN task_record->'tags' IS NOT NULL AND jsonb_typeof(task_record->'tags') = 'array'
        THEN ARRAY(SELECT jsonb_array_elements_text(task_record->'tags'))
        ELSE ARRAY[]::text[]
      END,
      CASE 
        WHEN task_record->>'estimated_hours' IS NOT NULL AND task_record->>'estimated_hours' != 'null'
        THEN (task_record->>'estimated_hours')::integer 
        ELSE NULL 
      END,
      NULL
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Crear el trigger en meeting_summaries
DROP TRIGGER IF EXISTS trigger_extract_tasks ON meeting_summaries;

CREATE TRIGGER trigger_extract_tasks
  AFTER INSERT ON meeting_summaries
  FOR EACH ROW
  EXECUTE FUNCTION extract_tasks_from_meeting_summary();

-- 3. Migrar tareas existentes (de los meeting_summaries que ya existen)
-- Esto solo inserta tareas que no existan ya en meeting_tasks
DO $$
DECLARE
  ms_record RECORD;
  task_record JSONB;
  tasks_array JSONB;
BEGIN
  FOR ms_record IN 
    SELECT id, tasks 
    FROM meeting_summaries 
    WHERE tasks IS NOT NULL 
      AND tasks::text != '[]' 
      AND tasks::text != ''
      AND length(tasks::text) > 2
  LOOP
    BEGIN
      tasks_array := ms_record.tasks::jsonb;
      
      FOR task_record IN SELECT * FROM jsonb_array_elements(tasks_array)
      LOOP
        -- Verificar si la tarea ya existe
        IF NOT EXISTS (
          SELECT 1 FROM meeting_tasks 
          WHERE meeting_summary_id = ms_record.id 
          AND title = COALESCE(task_record->>'title', 'Sin título')
        ) THEN
          INSERT INTO meeting_tasks (
            meeting_summary_id,
            title,
            description,
            assigned_to,
            priority,
            status,
            due_date,
            category,
            tags,
            estimated_hours,
            project_id
          ) VALUES (
            ms_record.id,
            COALESCE(task_record->>'title', 'Sin título'),
            task_record->>'description',
            task_record->>'assigned_to',
            COALESCE(task_record->>'priority', 'medium'),
            COALESCE(task_record->>'status', 'pending'),
            CASE 
              WHEN task_record->>'due_date' IS NOT NULL AND task_record->>'due_date' != 'null'
              THEN (task_record->>'due_date')::date 
              ELSE NULL 
            END,
            COALESCE(task_record->>'category', 'other'),
            CASE 
              WHEN task_record->'tags' IS NOT NULL AND jsonb_typeof(task_record->'tags') = 'array'
              THEN ARRAY(SELECT jsonb_array_elements_text(task_record->'tags'))
              ELSE ARRAY[]::text[]
            END,
            CASE 
              WHEN task_record->>'estimated_hours' IS NOT NULL AND task_record->>'estimated_hours' != 'null'
              THEN (task_record->>'estimated_hours')::integer 
              ELSE NULL 
            END,
            NULL
          );
        END IF;
      END LOOP;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error processing meeting_summary %: %', ms_record.id, SQLERRM;
    END;
  END LOOP;
END;
$$;

-- 4. Comentarios
COMMENT ON FUNCTION extract_tasks_from_meeting_summary() IS 
  'Extrae automáticamente las tareas del JSON de meeting_summaries y las inserta en meeting_tasks';

COMMENT ON TRIGGER trigger_extract_tasks ON meeting_summaries IS 
  'Se ejecuta después de insertar un meeting_summary para extraer las tareas';
