"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Trash2, Loader2 } from "lucide-react"
import { PROJECT_TRACKS } from "@/lib/db/schema"
import { TRACK_LABELS } from "@/components/shared/project-tree"

interface Phase {
  id: string
  name: string
  description: string | null
  track: string
  status: string
  startDate: string | Date | null
  endDate: string | Date | null
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pendiente" },
  { value: "active", label: "Activa" },
  { value: "in_progress", label: "En progreso" },
  { value: "completed", label: "Completada" },
  { value: "cancelled", label: "Cancelada" },
]

const inputClass = "bg-black/40 border-[#08A696]/20 text-white placeholder:text-white/30 focus-visible:ring-[#26FFDF]/50"
const selectClass =
  "w-full bg-black/40 border border-[#08A696]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#26FFDF] transition-colors"

function toDateInputValue(value: string | Date | null): string {
  if (!value) {return ""}
  const d = typeof value === "string" ? new Date(value) : value
  if (isNaN(d.getTime())) {return ""}
  return d.toISOString().slice(0, 10)
}

/** Un solo componente para crear y editar fases: si llega `phase`, edita esa
 *  fase; si no, crea una nueva. Ambos formularios comparten los mismos
 *  campos, así que separarlos en dos componentes solo duplicaría el JSX.
 *  Controlado desde afuera (sin gatillo propio) — vive dentro del tablero,
 *  que decide cuándo abrirlo (nodo de fase o botón "+ Fase" del canvas). */
export default function PhaseEditDialog({
  projectId,
  phase,
  existingTracks = [],
  open,
  onOpenChange,
}: {
  projectId: string
  phase?: Phase
  /** Caminos ya usados en este proyecto — se suman a los 4 predefinidos como
   *  sugerencias, pero el campo acepta cualquier texto (no es una lista cerrada). */
  existingTracks?: string[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: phase?.name ?? "",
    description: phase?.description ?? "",
    track: phase?.track ?? "development",
    status: phase?.status ?? "pending",
    startDate: toDateInputValue(phase?.startDate ?? null),
    endDate: toDateInputValue(phase?.endDate ?? null),
  })
  const trackSuggestions = Array.from(new Set([...PROJECT_TRACKS, ...existingTracks]))

  const isEdit = Boolean(phase)
  const url = isEdit ? `/api/admin/projects/${projectId}/phases/${phase!.id}` : `/api/admin/projects/${projectId}/phases`

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Falta el nombre de la fase")
      return
    }
    setSaving(true)
    try {
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          track: form.track,
          status: form.status,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
        }),
      })
      if (!res.ok) {throw new Error("save failed")}
      toast.success(isEdit ? "Fase actualizada" : "Fase creada")
      onOpenChange(false)
      router.refresh()
    } catch {
      toast.error(isEdit ? "No se pudo guardar la fase" : "No se pudo crear la fase")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!phase) {return}
    if (!window.confirm(`¿Eliminar la fase "${phase.name}"? También se eliminan sus tareas y subtareas.`)) {return}
    try {
      const res = await fetch(url, { method: "DELETE" })
      if (!res.ok) {throw new Error("delete failed")}
      toast.success("Fase eliminada")
      onOpenChange(false)
      router.refresh()
    } catch {
      toast.error("No se pudo eliminar la fase")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-[#08A696]/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">{isEdit ? "Editar fase" : "Nueva fase"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="phaseName">Nombre</Label>
            <Input
              id="phaseName"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej: Diseño de interfaz"
              className={inputClass}
            />
          </div>
          <div>
            <Label htmlFor="phaseDescription">Descripción</Label>
            <Textarea
              id="phaseDescription"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="phaseTrack">Camino</Label>
              <Input
                id="phaseTrack"
                list="phaseTrackSuggestions"
                value={form.track}
                onChange={(e) => setForm({ ...form, track: e.target.value })}
                placeholder="Ej: Marketing"
                className={inputClass}
              />
              <datalist id="phaseTrackSuggestions">
                {trackSuggestions.map((track) => (
                  <option key={track} value={track}>
                    {TRACK_LABELS[track] ?? track}
                  </option>
                ))}
              </datalist>
              <p className="mt-1 text-[11px] text-textSecondary/50">
                Agrupa fases en la misma rama del árbol. Escribe uno nuevo o elige uno existente.
              </p>
            </div>
            <div>
              <Label htmlFor="phaseStatus">Estado</Label>
              <select id="phaseStatus" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={selectClass}>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="phaseStart">Inicio</Label>
              <Input
                id="phaseStart"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>
            <div>
              <Label htmlFor="phaseEnd">Fin</Label>
              <Input
                id="phaseEnd"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>
          </div>
        </div>
        <DialogFooter className={isEdit ? "flex items-center justify-between sm:justify-between" : undefined}>
          {isEdit && (
            <Button type="button" variant="ghost" onClick={handleDelete} className="text-[#FF6B6B] hover:bg-[#FF6B6B]/10 hover:text-[#FF6B6B]">
              <Trash2 className="h-4 w-4 mr-2" /> Eliminar fase
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving} className="bg-[#08A696] hover:bg-[#08A696]/80">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isEdit ? "Guardar" : "Crear fase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
