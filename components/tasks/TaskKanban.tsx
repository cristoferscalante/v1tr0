"use client"

import { useMemo, useState } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  KANBAN_COLUMNS,
  TASK_STATUS_META,
  type TaskStatus,
} from "@/components/shared/task-status"
import TaskCard, { TaskCardBody } from "./TaskCard"
import type { BoardMember, BoardPhase, BoardTask, TaskMove } from "./types"

function Column({
  status,
  tasks,
  members,
  phases,
  onOpen,
}: {
  status: TaskStatus
  tasks: BoardTask[]
  members: BoardMember[]
  phases: BoardPhase[]
  onOpen?: (task: BoardTask) => void
}) {
  const meta = TASK_STATUS_META[status]
  const { setNodeRef, isOver } = useDroppable({ id: `col:${status}`, data: { type: "column", status } })
  const overLimit = meta.wipLimit !== null && tasks.length > meta.wipLimit

  return (
    <div
      ref={setNodeRef}
      className={cn(
        // Sin borde de columna: solo un relleno tenue, como en la referencia.
        "flex min-w-[240px] flex-1 flex-col rounded-lg bg-white/[0.02] p-3 transition-colors",
        isOver && "bg-[#08A696]/[0.06]",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
          <h3 className="text-xs font-semibold uppercase tracking-wide text-white/70">
            {meta.label}
          </h3>
        </div>
        <span
          className={cn(
            "rounded-[2px] border px-1.5 py-px font-mono text-[9px]",
            // El chip se pone en acento solo cuando la columna se pasa de su
            // límite: es la mitad del sentido de tener un límite WIP.
            overLimit
              ? "border-amber-400 text-amber-300"
              : "border-white/15 text-white/40",
          )}
        >
          {meta.wipLimit === null ? tasks.length : `${tasks.length}/${meta.wipLimit}`}
        </span>
      </div>

      {/* Regla fina bajo la banda de encabezado, a todo el ancho */}
      <div className="mt-2 h-px w-full bg-white/10" />

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="mt-3 flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              members={members}
              phaseName={phases.find((p) => p.id === task.phaseId)?.name}
              onOpen={onOpen}
            />
          ))}
          {tasks.length === 0 && (
            <p className="py-6 text-center font-mono text-[10px] text-white/20">vacía</p>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export default function TaskKanban({
  projectId,
  initialTasks,
  phases,
  members,
  onOpenTask,
}: {
  projectId: string
  initialTasks: BoardTask[]
  phases: BoardPhase[]
  members: BoardMember[]
  onOpenTask?: (task: BoardTask) => void
}) {
  const [tasks, setTasks] = useState(initialTasks)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [phaseFilter, setPhaseFilter] = useState("all")
  const [ownerFilter, setOwnerFilter] = useState("all")

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    // En táctil el arrastre por distancia pelea con el scroll de la página,
    // igual que en el tablero de proyectos: se activa por pulsación sostenida.
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  )

  const visible = useMemo(
    () =>
      tasks.filter((t) => {
        if (phaseFilter !== "all" && t.phaseId !== phaseFilter) {return false}
        if (ownerFilter === "unassigned" && t.assignedTo) {return false}
        if (ownerFilter !== "all" && ownerFilter !== "unassigned" && t.assignedTo !== ownerFilter) {
          return false
        }
        return true
      }),
    [tasks, phaseFilter, ownerFilter],
  )

  const byStatus = useMemo(() => {
    const map = new Map<TaskStatus, BoardTask[]>(KANBAN_COLUMNS.map((s) => [s, []]))
    for (const t of visible) {map.get(t.status)?.push(t)}
    for (const list of map.values()) {list.sort((a, b) => a.order - b.order)}
    return map
  }, [visible])

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) ?? null : null

  function resolveTargetStatus(overId: string): TaskStatus | null {
    if (overId.startsWith("col:")) {return overId.slice(4) as TaskStatus}
    return tasks.find((t) => t.id === overId)?.status ?? null
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null)
    const { active, over } = event
    if (!over) {return}

    const moved = tasks.find((t) => t.id === active.id)
    if (!moved) {return}

    const target = resolveTargetStatus(String(over.id))
    if (!target) {return}

    const overTask = tasks.find((t) => t.id === over.id)
    const destination = (byStatus.get(target) ?? []).filter((t) => t.id !== moved.id)
    const insertAt = overTask ? destination.findIndex((t) => t.id === overTask.id) : destination.length
    const index = insertAt === -1 ? destination.length : insertAt

    if (target === moved.status && destination[index]?.id === moved.id) {return}

    destination.splice(index, 0, { ...moved, status: target })

    // Se renumera la columna destino completa: mandar solo la tarjeta movida
    // deja huecos y empates en `order` que reordenan el tablero solo.
    const moves: TaskMove[] = destination.map((t, i) => ({
      taskId: t.id,
      phaseId: t.phaseId,
      status: target,
      order: i,
    }))

    const previous = tasks
    setTasks((current) =>
      current.map((t) => {
        const m = moves.find((x) => x.taskId === t.id)
        return m ? { ...t, status: m.status, order: m.order } : t
      }),
    )

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/tasks/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moves }),
      })
      if (!res.ok) {throw new Error((await res.json()).error ?? "Error al mover la tarea")}
    } catch (e) {
      // El tablero ya se pintó con el movimiento; si el servidor lo rechaza
      // hay que devolverlo a como estaba o la UI miente.
      setTasks(previous)
      toast.error(e instanceof Error ? e.message : "No se pudo mover la tarea")
    }
  }

  const selectClass =
    "bg-[#232629] border border-[#08A696]/20 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#26FFDF] transition-colors"

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)} className={selectClass}>
          <option value="all">Todas las fases</option>
          {/* El número no decora: las fases llevan `order` en la base, así que
              dice en qué punto del proyecto cae cada una. */}
          {phases.map((p, i) => (
            <option key={p.id} value={p.id}>
              [{String(i + 1).padStart(2, "0")}] {p.name}
            </option>
          ))}
        </select>
        <select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)} className={selectClass}>
          <option value="all">Todo el equipo</option>
          <option value="unassigned">Sin asignar</option>
          {members.map((m) => (
            <option key={m.profileId} value={m.profileId}>{m.name ?? m.email}</option>
          ))}
        </select>
        <span className="ml-auto font-mono text-[10px] text-white/30">
          {visible.length} de {tasks.length} tarea(s)
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(e: DragStartEvent) => setActiveId(String(e.active.id))}
        onDragCancel={() => setActiveId(null)}
        onDragEnd={handleDragEnd}
      >
        {/* Columnas de ancho igual con canaleta amplia, sin conectores: un
            tablero muestra estado, no flujo. */}
        <div className="flex gap-8 overflow-x-auto pb-2">
          {KANBAN_COLUMNS.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={byStatus.get(status) ?? []}
              members={members}
              phases={phases}
              onOpen={onOpenTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="w-[240px] rotate-1">
              <TaskCardBody task={activeTask} members={members} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
