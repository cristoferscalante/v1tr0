"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Loader2, Pencil, Check, X } from "lucide-react"
import { AnimatedIcon } from "@/components/home/sections/AnimatedIcon"
import { TASK_ICONS, taskIcon } from "@/components/shared/task-icons"

interface TeamMember {
  id: string
  name: string | null
  email: string | null
}

interface Subtask {
  id: string
  name: string
  completed: boolean | null
}

interface Task {
  id: string
  name: string
  icon: string | null
  completed: boolean | null
  assignedTo: string | null
  subtasks: Subtask[]
}

/** Nombre editable en línea, para tareas y subtareas (mismo patrón en ambas). */
function EditableName({
  value,
  completed,
  onSave,
  className,
}: {
  value: string
  completed?: boolean | null
  onSave: (next: string) => Promise<void>
  className?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)

  if (editing) {
    return (
      <span className="flex items-center gap-1 flex-1 min-w-0">
        <Input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              const next = draft.trim()
              if (next && next !== value) {
                setSaving(true)
                await onSave(next)
                setSaving(false)
              }
              setEditing(false)
            }
            if (e.key === "Escape") { setDraft(value); setEditing(false) }
          }}
          className="h-6 text-xs px-1.5"
        />
        <button
          type="button"
          disabled={saving}
          onClick={async () => {
            const next = draft.trim()
            if (next && next !== value) {
              setSaving(true)
              await onSave(next)
              setSaving(false)
            }
            setEditing(false)
          }}
          className="shrink-0 text-[#26FFDF]"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
        </button>
        <button type="button" onClick={() => { setDraft(value); setEditing(false) }} className="shrink-0 text-textSecondary/60">
          <X className="h-3.5 w-3.5" />
        </button>
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1.5 flex-1 min-w-0 group/name">
      <span className={`truncate ${className ?? ""} ${completed ? "text-[#26FFDF] line-through" : "text-textSecondary"}`}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => { setDraft(value); setEditing(true) }}
        className="shrink-0 opacity-0 group-hover/name:opacity-100 text-textSecondary/50 hover:text-[#26FFDF] transition-opacity"
      >
        <Pencil className="h-3 w-3" />
      </button>
    </span>
  )
}

export default function ProjectTaskManager({
  projectId,
  phaseId,
  tasks,
}: {
  projectId: string
  phaseId: string
  tasks: Task[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [team, setTeam] = useState<TeamMember[]>([])
  const [form, setForm] = useState({ name: "", icon: "planning", assignedTo: "" })
  const [addingSubtaskFor, setAddingSubtaskFor] = useState<string | null>(null)
  const [subtaskDraft, setSubtaskDraft] = useState("")

  useEffect(() => {
    if (!open) {return}
    fetch("/api/admin/clients?role=team&pageSize=100")
      .then((res) => res.json())
      .then((data) => setTeam(data.clients ?? []))
      .catch(() => setTeam([]))
  }, [open])

  const taskUrl = (taskId: string) => `/api/admin/projects/${projectId}/phases/${phaseId}/tasks/${taskId}`
  const subtaskBaseUrl = (taskId: string) => `${taskUrl(taskId)}/subtasks`

  const handleToggle = async (task: Task) => {
    try {
      const res = await fetch(taskUrl(task.id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      })
      if (!res.ok) {throw new Error("toggle failed")}
      router.refresh()
    } catch {
      toast.error("No se pudo actualizar la tarea")
    }
  }

  const handleRename = async (taskId: string, name: string) => {
    try {
      const res = await fetch(taskUrl(taskId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) {throw new Error("rename failed")}
      router.refresh()
    } catch {
      toast.error("No se pudo renombrar la tarea")
    }
  }

  const handleDelete = async (taskId: string) => {
    try {
      const res = await fetch(taskUrl(taskId), { method: "DELETE" })
      if (!res.ok) {throw new Error("delete failed")}
      toast.success("Tarea eliminada")
      router.refresh()
    } catch {
      toast.error("No se pudo eliminar la tarea")
    }
  }

  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast.error("Falta el nombre de la tarea")
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/phases/${phaseId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {throw new Error("create failed")}
      toast.success("Tarea creada")
      setForm({ name: "", icon: "planning", assignedTo: "" })
      setOpen(false)
      router.refresh()
    } catch {
      toast.error("No se pudo crear la tarea")
    } finally {
      setSaving(false)
    }
  }

  const handleToggleSubtask = async (taskId: string, subtask: Subtask) => {
    try {
      const res = await fetch(`${subtaskBaseUrl(taskId)}/${subtask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !subtask.completed }),
      })
      if (!res.ok) {throw new Error("toggle failed")}
      router.refresh()
    } catch {
      toast.error("No se pudo actualizar la subtarea")
    }
  }

  const handleRenameSubtask = async (taskId: string, subtaskId: string, name: string) => {
    try {
      const res = await fetch(`${subtaskBaseUrl(taskId)}/${subtaskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) {throw new Error("rename failed")}
      router.refresh()
    } catch {
      toast.error("No se pudo renombrar la subtarea")
    }
  }

  const handleDeleteSubtask = async (taskId: string, subtaskId: string) => {
    try {
      const res = await fetch(`${subtaskBaseUrl(taskId)}/${subtaskId}`, { method: "DELETE" })
      if (!res.ok) {throw new Error("delete failed")}
      router.refresh()
    } catch {
      toast.error("No se pudo eliminar la subtarea")
    }
  }

  const handleCreateSubtask = async (taskId: string) => {
    if (!subtaskDraft.trim()) {return}
    try {
      const res = await fetch(subtaskBaseUrl(taskId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: subtaskDraft.trim() }),
      })
      if (!res.ok) {throw new Error("create failed")}
      setSubtaskDraft("")
      setAddingSubtaskFor(null)
      router.refresh()
    } catch {
      toast.error("No se pudo agregar la subtarea")
    }
  }

  return (
    <div className="mt-2 space-y-1.5">
      {tasks.map((t) => {
        const meta = taskIcon(t.icon)
        const assignee = team.find((m) => m.id === t.assignedTo)
        return (
          <div key={t.id} className="rounded-lg hover:bg-white/5 group/task">
            <div className="flex items-center gap-2.5 text-sm px-2 py-1.5">
              <button
                type="button"
                onClick={() => handleToggle(t)}
                className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                  t.completed
                    ? "bg-[#08A696]/30 border-[#26FFDF] text-[#26FFDF]"
                    : "bg-black/30 border-white/15 text-white/30"
                }`}
                title={t.completed ? "Marcar como pendiente" : "Marcar como completada"}
              >
                <AnimatedIcon kind={meta.kind} icon={meta.icon} active={Boolean(t.completed)} size={12} />
              </button>
              <EditableName value={t.name} completed={t.completed} onSave={(next) => handleRename(t.id, next)} />
              {t.assignedTo && (
                <span className="text-[10px] text-textSecondary/60 shrink-0">
                  {assignee?.name ?? assignee?.email ?? "…"}
                </span>
              )}
              <button
                type="button"
                onClick={() => handleDelete(t.id)}
                className="shrink-0 opacity-0 group-hover/task:opacity-100 text-[#FF6B6B]/70 hover:text-[#FF6B6B] transition-opacity"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Subtareas: desglose editable que hace crecer esa rama en el árbol del cliente. */}
            <div className="ml-8 pl-2 border-l border-white/10 space-y-1 pb-1.5">
              {t.subtasks.map((s) => (
                <div key={s.id} className="flex items-center gap-2 text-xs px-2 py-1 rounded-md hover:bg-white/5 group/sub">
                  <button
                    type="button"
                    onClick={() => handleToggleSubtask(t.id, s)}
                    className={`shrink-0 w-4 h-4 rounded-full border flex items-center justify-center ${
                      s.completed ? "bg-[#08A696]/30 border-[#26FFDF]" : "bg-black/30 border-white/15"
                    }`}
                  >
                    {s.completed && <Check className="h-2.5 w-2.5 text-[#26FFDF]" />}
                  </button>
                  <EditableName
                    value={s.name}
                    completed={s.completed}
                    onSave={(next) => handleRenameSubtask(t.id, s.id, next)}
                    className="text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(t.id, s.id)}
                    className="shrink-0 opacity-0 group-hover/sub:opacity-100 text-[#FF6B6B]/70 hover:text-[#FF6B6B] transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {addingSubtaskFor === t.id ? (
                <div className="flex items-center gap-1.5 px-2">
                  <Input
                    autoFocus
                    value={subtaskDraft}
                    onChange={(e) => setSubtaskDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {handleCreateSubtask(t.id)}
                      if (e.key === "Escape") { setAddingSubtaskFor(null); setSubtaskDraft("") }
                    }}
                    placeholder="Ej: Diseñar UI del carrito"
                    className="h-6 text-xs px-1.5"
                  />
                  <button type="button" onClick={() => handleCreateSubtask(t.id)} className="shrink-0 text-[#26FFDF]">
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => { setAddingSubtaskFor(null); setSubtaskDraft("") }} className="shrink-0 text-textSecondary/60">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => { setAddingSubtaskFor(t.id); setSubtaskDraft("") }}
                  className="flex items-center gap-1 text-[10px] text-textSecondary/60 hover:text-[#26FFDF] px-2 py-0.5 transition-colors"
                >
                  <Plus className="h-3 w-3" /> Agregar subtarea
                </button>
              )}
            </div>
          </div>
        )
      })}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="ghost" className="text-[#26FFDF] hover:bg-[#08A696]/10 h-7 px-2 text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" /> Agregar tarea
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-black border-[#08A696]/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Nueva tarea</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="taskName">Nombre</Label>
              <Input
                id="taskName"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Pasarela de pago"
              />
            </div>
            <div>
              <Label htmlFor="taskAssignee">Asignar a</Label>
              <select
                id="taskAssignee"
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                className="w-full bg-black/40 border border-[#08A696]/20 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="">Sin asignar</option>
                {team.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name ?? m.email}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Ícono</Label>
              <div className="grid grid-cols-8 gap-1.5 max-h-40 overflow-y-auto p-1">
                {TASK_ICONS.map((entry) => {
                  const isSelected = form.icon === entry.key
                  return (
                    <button
                      key={entry.key}
                      type="button"
                      title={entry.label}
                      onClick={() => setForm({ ...form, icon: entry.key })}
                      className={`flex items-center justify-center aspect-square rounded-lg border transition-all ${
                        isSelected
                          ? "bg-[#0d5d5d]/70 border-[#26FFDF]"
                          : "bg-gray-900/50 border-gray-700 hover:border-[#08A696]/60"
                      }`}
                    >
                      <AnimatedIcon
                        kind={entry.kind}
                        icon={entry.icon}
                        active={isSelected}
                        size={14}
                        className={isSelected ? "text-[#26FFDF]" : "text-gray-400"}
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreate} disabled={saving} className="bg-[#08A696] hover:bg-[#08A696]/80">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Crear tarea
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
