"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { CalendarClock, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { TASK_PRIORITY_META, TASK_STATUS_META, taskRef } from "@/components/shared/task-status"
import type { BoardMember, BoardTask } from "./types"

function ownerLabel(task: BoardTask, members: BoardMember[]) {
  if (!task.assignedTo) {return "sin asignar"}
  const m = members.find((x) => x.profileId === task.assignedTo)
  const name = m?.name ?? m?.email ?? "asignada"
  // Solo el primer nombre: la sublínea es una etiqueta, no una ficha.
  return name.split(/[\s@]/)[0]!.toLowerCase()
}

export function TaskCardBody({
  task,
  members,
  phaseName,
  dragging,
}: {
  task: BoardTask
  members: BoardMember[]
  phaseName?: string
  dragging?: boolean
}) {
  const status = TASK_STATUS_META[task.status]
  const priority = TASK_PRIORITY_META[task.priority]
  const overdue =
    task.dueDate && task.status !== "done" && new Date(task.dueDate).getTime() < Date.now()

  return (
    <div
      className={cn(
        // rx=6 y sin sombra, según la gramática del tipo kanban: la tarjeta se
        // distingue por relleno y borde, no por elevación.
        "rounded-md border px-3 py-2.5 transition-colors",
        status.card,
        // El bloqueo lleva además una barra al borde izquierdo: es la señal
        // que tiene que saltar al ojo al barrer el tablero.
        task.status === "blocked" && "border-l-4 border-l-amber-400",
        dragging && "opacity-40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-semibold leading-snug text-white/90">{task.name}</p>
        <span
          className={cn(
            // Rectángulo, nunca píldora: una píldora lee como badge de otro
            // sistema de diseño.
            "shrink-0 rounded-[2px] border px-1.5 py-px font-mono text-[9px] uppercase tracking-wider",
            priority.chip,
          )}
        >
          {priority.label}
        </span>
      </div>

      <p className="mt-1.5 font-mono text-[10px] lowercase tracking-wide text-white/35">
        {taskRef(task.id)} · {ownerLabel(task, members)}
        {phaseName ? ` · ${phaseName.toLowerCase()}` : ""}
      </p>

      {task.dueDate && (
        <p
          className={cn(
            "mt-1 flex items-center gap-1 font-mono text-[10px]",
            overdue ? "text-amber-300" : "text-white/35",
          )}
        >
          <CalendarClock className="h-3 w-3" />
          {new Date(task.dueDate).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}
          {overdue ? " · vencida" : ""}
        </p>
      )}
    </div>
  )
}

export default function TaskCard({
  task,
  members,
  phaseName,
  onOpen,
}: {
  task: BoardTask
  members: BoardMember[]
  phaseName?: string
  onOpen?: (task: BoardTask) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "task", task },
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="group relative"
    >
      <button
        type="button"
        onClick={() => onOpen?.(task)}
        className="block w-full text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#26FFDF] rounded-md"
      >
        <TaskCardBody task={task} members={members} phaseName={phaseName} dragging={isDragging} />
      </button>

      {/* El asa de arrastre es explícita para que el clic en la tarjeta siga
          abriendo el detalle en vez de competir con el drag. */}
      <span
        {...attributes}
        {...listeners}
        aria-label={`Mover ${task.name}`}
        className="absolute right-1 top-1/2 -translate-y-1/2 cursor-grab p-1 text-white/20 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </span>
    </div>
  )
}
