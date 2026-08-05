"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import Link from "next/link"
import { AnimatedIcon } from "@/components/home/sections/AnimatedIcon"
import { resolveProjectIconMeta, projectCardTone } from "@/components/shared/service-type"

export interface KanbanProject {
  id: string
  name: string
  status: string
  serviceType: string
  icon?: string | null
  clientName: string | null
  clientEmail: string | null
  progress?: number
}

// Franja lateral: rojo = recién cotizado, verde = en marcha, amarillo =
// mantenimiento, gris = pausado/cancelado. Va como estilo en línea (no
// clase de Tailwind) para no competir por especificidad con el borde
// completo que ya usan los estados de arrastre/hover.
const TONE_ACCENT_COLOR: Record<string, string> = {
  danger: "#ff2c10",
  success: "#10b981",
  warning: "#f26a1b",
  muted: "rgba(255,255,255,0.2)",
}

export default function KanbanCard({ project }: { project: KanbanProject }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
  })
  const meta = resolveProjectIconMeta(project)
  const accentColor = TONE_ACCENT_COLOR[projectCardTone(project.status)]

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    borderLeftWidth: 4,
    borderLeftColor: accentColor,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-[#02505950] border rounded-xl p-3 transition-colors duration-200 ${
        isDragging ? "border-[#26FFDF]" : "border-[#08A696]/20 hover:border-[#08A696]/60"
      }`}
    >
      <div className="flex items-start gap-2">
        {/* El arrastre vive solo en el asa, para que el resto de la tarjeta siga
            siendo un enlace al detalle del proyecto. */}
        <button
          {...attributes}
          {...listeners}
          aria-label={`Mover ${project.name}`}
          className="cursor-grab active:cursor-grabbing shrink-0 mt-0.5 touch-none"
        >
          <GripVertical className="h-4 w-4 text-[#08A696]/40 group-hover:text-[#08A696] transition-colors" />
        </button>
        <Link href={`/admin/proyectos/${project.id}`} className="min-w-0 flex-1 block">
          <p className="text-white text-sm font-medium leading-snug hover:text-[#26FFDF] transition-colors">
            {project.name}
          </p>
          <p className="text-textSecondary text-xs mt-0.5 truncate">
            {project.clientName ?? project.clientEmail ?? "Sin cliente"}
          </p>
        </Link>
      </div>

      <div className="flex items-center justify-between mt-3 gap-2">
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#08A696]/10 text-[#26FFDF] border border-[#08A696]/40">
          <AnimatedIcon kind={meta.kind} icon={meta.icon} active size={12} />
          {meta.label}
        </span>
        {typeof project.progress === "number" && (
          <span className="text-[10px] text-textSecondary shrink-0">{project.progress}%</span>
        )}
      </div>

      {typeof project.progress === "number" && (
        <div className="mt-2 w-full h-1 bg-[#02505960] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#08A696] to-[#26FFDF] rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
