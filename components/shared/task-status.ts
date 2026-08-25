import { TASK_PRIORITIES, TASK_STATUSES, type TaskPriority, type TaskStatus } from "@/lib/db/schema"

export { TASK_PRIORITIES, TASK_STATUSES }
export type { TaskPriority, TaskStatus }

/**
 * Vocabulario visual de las tareas, siguiendo la gramática kanban de la skill
 * `diagram-design`: un tablero es un censo de estados, no un flujo, así que no
 * lleva conectores; el acento se reserva para lo que hay que mirar primero
 * (aquí, lo bloqueado y lo que se pasa del límite WIP).
 */

export const TASK_STATUS_META: Record<
  TaskStatus,
  {
    label: string
    /** Límite de trabajo en curso. `null` en la cola de entrada y en la
     *  columna terminal: acumular pendientes o terminados no cuesta nada. */
    wipLimit: number | null
    card: string
    dot: string
  }
> = {
  todo: {
    label: "Por hacer",
    wipLimit: null,
    card: "border-white/10 bg-white/[0.02]",
    dot: "bg-white/25",
  },
  in_progress: {
    label: "En progreso",
    wipLimit: 3,
    card: "border-[#08A696]/35 bg-[#02505931]",
    dot: "bg-[#08A696]",
  },
  blocked: {
    label: "Bloqueada",
    wipLimit: 2,
    // Único estado con acento cálido y borde punteado: es la señal focal del
    // tablero. Si todo lleva acento, el acento deja de significar algo.
    card: "border-dashed border-amber-400/70 bg-amber-400/[0.06]",
    dot: "bg-amber-400",
  },
  done: {
    label: "Terminada",
    wipLimit: null,
    card: "border-white/[0.07] bg-white/[0.04]",
    dot: "bg-white/20",
  },
}

export const TASK_PRIORITY_META: Record<TaskPriority, { label: string; chip: string }> = {
  low: { label: "Baja", chip: "text-white/40 border-white/15" },
  medium: { label: "Media", chip: "text-white/60 border-white/20" },
  high: { label: "Alta", chip: "text-[#26FFDE] border-[#08A696]/50" },
  urgent: { label: "Urgente", chip: "text-amber-300 border-amber-400/60" },
}

/** Orden en que se pintan las columnas del tablero. */
export const KANBAN_COLUMNS: TaskStatus[] = ["todo", "in_progress", "blocked", "done"]

export function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && (TASK_STATUSES as readonly string[]).includes(value)
}

/**
 * Etiqueta corta y estable para una tarea, al estilo `AVA-214` de la
 * referencia: los primeros 4 caracteres del uuid, en mayúsculas. No es un
 * identificador de negocio, solo un ancla visual para hablar de la tarjeta.
 */
export function taskRef(id: string) {
  return id.replace(/-/g, "").slice(0, 4).toUpperCase()
}
