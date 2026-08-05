"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import KanbanCard, { KanbanProject } from "./KanbanCard"

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

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[270px] rounded-2xl border transition-colors duration-200 flex flex-col ${
        isOver
          ? "border-[#26FFDF] bg-[#08A696]/10"
          : "border-[#08A696]/20 bg-[#02505931] backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#08A696]/15">
        <h3 className="text-white text-sm font-semibold">{label}</h3>
        <span className="text-[11px] font-medium text-[#26FFDF] bg-[#08A696]/15 border border-[#08A696]/30 rounded-full px-2 py-0.5">
          {projects.length}
        </span>
      </div>

      <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 p-3 min-h-[120px]">
          {projects.length === 0 ? (
            <p className="text-textSecondary/50 text-xs text-center py-6">Suelta un proyecto aquí</p>
          ) : (
            projects.map((p) => <KanbanCard key={p.id} project={p} />)
          )}
        </div>
      </SortableContext>
    </div>
  )
}
