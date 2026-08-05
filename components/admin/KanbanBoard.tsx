"use client"

import { useMemo, useState } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import { toast } from "sonner"
import { Filter } from "lucide-react"
import KanbanColumn from "./KanbanColumn"
import KanbanCard, { KanbanProject } from "./KanbanCard"
import { SERVICE_TYPES, SERVICE_TYPE_META } from "@/components/shared/service-type"

const COLUMNS: { status: string; label: string }[] = [
  { status: "planning", label: "Cotizado" },
  { status: "design", label: "En diseño" },
  { status: "development", label: "En desarrollo" },
  { status: "testing", label: "Revisión" },
  { status: "completed", label: "Entregado" },
  { status: "maintenance", label: "Mantenimiento" },
]

const selectClass =
  "bg-[#02505950] border border-[#08A696]/20 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#26FFDF] transition-colors"

export default function KanbanBoard({ initialProjects }: { initialProjects: KanbanProject[] }) {
  const [projects, setProjects] = useState(initialProjects)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [clientFilter, setClientFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const columnStatuses = new Set(COLUMNS.map((c) => c.status))

  const clientOptions = useMemo(() => {
    const seen = new Map<string, string>()
    for (const p of projects) {
      const name = p.clientName ?? p.clientEmail
      if (name && !seen.has(name)) {seen.set(name, name)}
    }
    return Array.from(seen.keys()).sort()
  }, [projects])

  const visibleProjects = useMemo(
    () =>
      projects.filter((p) => {
        if (serviceFilter !== "all" && p.serviceType !== serviceFilter) {return false}
        if (clientFilter !== "all" && (p.clientName ?? p.clientEmail) !== clientFilter) {return false}
        return true
      }),
    [projects, clientFilter, serviceFilter],
  )

  const activeProject = activeId ? projects.find((p) => p.id === activeId) ?? null : null

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) {return}

    const projectId = String(active.id)
    const project = projects.find((p) => p.id === projectId)
    if (!project) {return}

    let targetStatus: string
    if (columnStatuses.has(String(over.id))) {
      targetStatus = String(over.id)
    } else {
      const overProject = projects.find((p) => p.id === String(over.id))
      if (!overProject) {return}
      targetStatus = overProject.status
    }

    if (targetStatus === project.status) {return}

    const prevProjects = projects
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, status: targetStatus } : p)))

    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      })
      if (!res.ok) {throw new Error("update failed")}
      const label = COLUMNS.find((c) => c.status === targetStatus)?.label ?? targetStatus
      toast.success(`"${project.name}" movido a ${label}`)
    } catch {
      setProjects(prevProjects)
      toast.error("No se pudo actualizar el estado del proyecto")
    }
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-2 text-textSecondary text-sm">
          <Filter className="h-4 w-4" /> Filtrar
        </span>
        <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)} className={selectClass}>
          <option value="all">Todos los clientes</option>
          {clientOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className={selectClass}>
          <option value="all">Todos los servicios</option>
          {SERVICE_TYPES.map((value) => (
            <option key={value} value={value}>
              {SERVICE_TYPE_META[value].label}
            </option>
          ))}
        </select>
        {(clientFilter !== "all" || serviceFilter !== "all") && (
          <button
            onClick={() => {
              setClientFilter("all")
              setServiceFilter("all")
            }}
            className="text-sm text-[#26FFDF] hover:underline"
          >
            Limpiar
          </button>
        )}
        <span className="ml-auto text-textSecondary text-sm">
          {visibleProjects.length} de {projects.length}
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.status}
              status={col.status}
              label={col.label}
              projects={visibleProjects.filter((p) => p.status === col.status)}
            />
          ))}
        </div>

        {/* La tarjeta sigue al cursor mientras se arrastra */}
        <DragOverlay>
          {activeProject ? (
            <div className="rotate-2 opacity-90">
              <KanbanCard project={activeProject} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
