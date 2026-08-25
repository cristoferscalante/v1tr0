"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_META,
  TASK_STATUSES,
  TASK_STATUS_META,
  taskRef,
  type TaskPriority,
  type TaskStatus,
} from "@/components/shared/task-status"
import TaskComments from "./TaskComments"
import type { BoardMember, BoardPhase, BoardTask } from "./types"

const controlClass =
  "w-full bg-[#232629] border border-[#08A696]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#26FFDF] transition-colors"

/**
 * Detalle de una tarea: estado, prioridad, responsable, fecha y su hilo de
 * comentarios. Es el único lugar donde se editan esos campos desde el tablero
 * (arrastrar solo cambia estado y posición).
 */
export default function TaskDetailDrawer({
  projectId,
  task,
  phases,
  members,
  onClose,
  onSaved,
}: {
  projectId: string
  task: BoardTask
  phases: BoardPhase[]
  members: BoardMember[]
  onClose: () => void
  onSaved: (task: BoardTask) => void
}) {
  const [status, setStatus] = useState<TaskStatus>(task.status)
  const [priority, setPriority] = useState<TaskPriority>(task.priority)
  const [assignedTo, setAssignedTo] = useState(task.assignedTo ?? "")
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.slice(0, 10) : "")
  const [saving, setSaving] = useState(false)

  const dirty =
    status !== task.status ||
    priority !== task.priority ||
    (assignedTo || null) !== (task.assignedTo ?? null) ||
    (dueDate || null) !== (task.dueDate ? task.dueDate.slice(0, 10) : null)

  async function save() {
    setSaving(true)
    try {
      const res = await fetch(
        `/api/admin/projects/${projectId}/phases/${task.phaseId}/tasks/${task.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            priority,
            assignedTo: assignedTo || null,
            dueDate: dueDate || null,
          }),
        },
      )
      const data = await res.json()
      if (!res.ok) {throw new Error(data.error ?? "No se pudo guardar")}

      onSaved({
        ...task,
        status,
        priority,
        assignedTo: assignedTo || null,
        dueDate: data.dueDate ?? null,
      })
      toast.success("Tarea actualizada")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo guardar")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />

      <aside className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-[#08A696]/20 bg-[#031f24f5] p-5 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/30">
              {taskRef(task.id)} · {phases.find((p) => p.id === task.phaseId)?.name ?? "sin fase"}
            </p>
            <h2 className="mt-1 text-lg font-semibold leading-tight text-white">{task.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {task.description && (
          <p className="mt-3 whitespace-pre-wrap text-[13px] leading-relaxed text-white/60">
            {task.description}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">Estado</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className={controlClass}>
              {TASK_STATUSES.map((s) => (
                <option key={s} value={s}>{TASK_STATUS_META[s].label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">Prioridad</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className={controlClass}
            >
              {TASK_PRIORITIES.map((p) => (
                <option key={p} value={p}>{TASK_PRIORITY_META[p].label}</option>
              ))}
            </select>
          </label>

          <label className="col-span-2 space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">Responsable</span>
            <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className={controlClass}>
              <option value="">Sin asignar</option>
              {members.map((m) => (
                <option key={m.profileId} value={m.profileId}>{m.name ?? m.email}</option>
              ))}
            </select>
            {members.length === 0 && (
              // Sin equipo en el proyecto no hay a quién asignar: se dice
              // dónde se arregla en vez de dejar un selector vacío y mudo.
              <span className="block font-mono text-[10px] text-amber-300/80">
                agrega gente en la pestaña Equipo para poder asignar
              </span>
            )}
          </label>

          <label className="col-span-2 space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/35">Fecha límite</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={cn(controlClass, "[color-scheme:dark]")}
            />
          </label>
        </div>

        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-[#08A696]/40 bg-[#232629] px-4 py-2 text-sm font-medium text-[#26FFDF] transition-colors hover:border-[#26FFDF] disabled:opacity-40"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Guardar cambios
        </button>

        <div className="mt-6 border-t border-white/10 pt-4">
          <h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-white/35">
            Conversación
          </h3>
          <TaskComments taskId={task.id} canWriteInternal />
        </div>
      </aside>
    </div>
  )
}
