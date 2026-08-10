"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"
import { projectCardTone } from "@/components/shared/service-type"
import KanbanCard, { KanbanProject, TONE_ACCENT_COLOR } from "./KanbanCard"

export default function KanbanColumn({
  status,
  label,
  projects,
}: {
  status: string
  label: string
  projects: KanbanProject[]
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const toneColor = TONE_ACCENT_COLOR[projectCardTone(status)]

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border transition-colors duration-200 flex flex-col ${
        isOver
          ? "border-[#26FFDF] bg-[#08A696]/10"
          : "border-[#08A696]/20 bg-[#02505931] backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#08A696]/15">
        <h3 className="flex items-center gap-1.5 text-white text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: toneColor }} aria-hidden />
          {label}
        </h3>
        <span className="text-[10px] font-medium text-[#26FFDF] bg-[#08A696]/15 border border-[#08A696]/30 rounded-full px-1.5 py-0.5">
          {projects.length}
        </span>
      </div>

      {/* Cuadrícula de 3 columnas: con 1-2 proyectos se ve igual que una
          lista, con más se aglutinan en vez de estirar la columna hacia
          abajo. */}
      <SortableContext items={projects.map((p) => p.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-3 gap-1.5 p-2 min-h-[70px]">
          {projects.length === 0 ? (
            <p className="col-span-3 text-textSecondary/50 text-xs text-center py-4">Suelta un proyecto aquí</p>
          ) : (
            projects.map((p) => <KanbanCard key={p.id} project={p} />)
          )}
        </div>
      </SortableContext>
    </div>
  )
}
