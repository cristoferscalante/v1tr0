import type { TaskPriority, TaskStatus } from "@/components/shared/task-status"

export interface BoardTask {
  id: string
  phaseId: string
  name: string
  description?: string | null
  icon?: string | null
  status: TaskStatus
  priority: TaskPriority
  order: number
  assignedTo?: string | null
  dueDate?: string | null
}

export interface BoardPhase {
  id: string
  name: string
}

export interface BoardMember {
  profileId: string
  name: string | null
  email: string | null
}

/** Un movimiento del tablero, tal como lo espera PATCH .../tasks/reorder. */
export interface TaskMove {
  taskId: string
  phaseId: string
  status: TaskStatus
  order: number
}
