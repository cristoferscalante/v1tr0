"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
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
  /** projects.images[0] hace de logo/miniatura del proyecto cuando existe —
   *  hoy casi ningún proyecto lo tiene cargado, pero la tarjeta ya está
   *  lista: en cuanto haya una URL acá, reemplaza al ícono automáticamente. */
  images?: string[] | null
  clientName: string | null
  clientEmail: string | null
  progress?: number
}

// Franja de etapa: rojo = recién cotizado, verde = en marcha, amarillo =
// mantenimiento, gris = pausado/cancelado.
export const TONE_ACCENT_COLOR: Record<string, string> = {
  danger: "#ff2c10",
  success: "#10b981",
  warning: "#f26a1b",
  muted: "rgba(255,255,255,0.2)",
}

const RING_SIZE = 56
const RING_STROKE = 3
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

export default function KanbanCard({ project }: { project: KanbanProject }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
  })
  const [hovered, setHovered] = useState(false)
  const meta = resolveProjectIconMeta(project)
  const accentColor = TONE_ACCENT_COLOR[projectCardTone(project.status)]
  const progress = project.progress ?? 0
  const thumbnail = project.images?.[0] ?? null

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative aspect-square rounded-xl border overflow-hidden bg-[#02505950] transition-colors duration-200 ${
        isDragging ? "border-[#26FFDF]" : "border-[#08A696]/20 hover:border-[#08A696]/60"
      }`}
    >
      <span className="absolute top-0 inset-x-0 h-1 z-10" style={{ background: accentColor }} aria-hidden />

      {/* El arrastre vive solo en el asa, para que el resto de la tarjeta siga
          siendo un enlace al detalle del proyecto. */}
      <button
        {...attributes}
        {...listeners}
        aria-label={`Mover ${project.name}`}
        style={{ touchAction: "none" }}
        className="absolute top-2 right-2 z-20 cursor-grab active:cursor-grabbing opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity touch-none"
      >
        <GripVertical className="h-3.5 w-3.5 text-white/80 drop-shadow" />
      </button>

      <Link href={`/admin/proyectos/${project.id}`} className="flex flex-col w-full h-full">
        {/* Miniatura: imagen real si el proyecto tiene una (projects.images),
            si no el ícono de categoría animado dentro de su anillo de
            progreso — el mismo componente queda listo para mostrar logos en
            cuanto existan sin tocar el resto de la tarjeta. */}
        <div className="relative flex-1 min-h-0 flex items-center justify-center">
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
              <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90">
                <circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={RING_RADIUS}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={RING_STROKE}
                />
                <motion.circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={RING_RADIUS}
                  fill="none"
                  stroke={meta.color}
                  strokeWidth={RING_STROKE}
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  initial={{ strokeDashoffset: RING_CIRCUMFERENCE }}
                  animate={{ strokeDashoffset: RING_CIRCUMFERENCE * (1 - progress / 100) }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatedIcon kind={meta.kind} icon={meta.icon} active={hovered} size={24} style={{ color: meta.color }} />
              </div>
            </div>
          )}
          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-black/60 text-textSecondary backdrop-blur-sm">
            {progress}%
          </span>
        </div>

        {/* Título: caption angosto abajo, como pie de una miniatura. */}
        <div className="shrink-0 px-2 py-1.5 bg-black/30 border-t border-white/5">
          <p className="text-white text-[11px] font-medium leading-tight truncate hover:text-[#26FFDF] transition-colors">
            {project.name}
          </p>
        </div>
      </Link>
    </div>
  )
}
