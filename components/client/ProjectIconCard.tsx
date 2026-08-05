"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { AnimatedIcon } from "@/components/home/sections/AnimatedIcon"
import { resolveProjectIconMeta, projectCardTone, PROJECT_CARD_TONE_CLASSES } from "@/components/shared/service-type"
import { Pill } from "@/components/shared/panel-ui"
import ProjectPipeline, { type PipelinePhase } from "@/components/client/ProjectPipeline"

interface ProjectIconCardProps {
  id: string
  name: string
  description: string
  status: string
  serviceType: string
  icon?: string | null | undefined
  progress: number
  startDate: string
  endDate: string
  statusTone: "default" | "success" | "warning" | "danger"
  statusLabel: string
  phases: PipelinePhase[]
}

function formatDate(value: string) {
  if (!value) {return "—"}
  const d = new Date(value)
  return isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" })
}

/**
 * Tarjeta "tile": el ícono animado en loop hace de imagen. Al tocarla se
 * revela el nombre y la descripción sobre un fondo oscurecido con blur,
 * con un enlace explícito al detalle del proyecto.
 */
export default function ProjectIconCard({
  id,
  name,
  description,
  status,
  serviceType,
  icon,
  progress,
  startDate,
  endDate,
  statusTone,
  statusLabel,
  phases,
}: ProjectIconCardProps) {
  const [revealed, setRevealed] = useState(false)
  const meta = resolveProjectIconMeta({ serviceType, icon })
  // Rojo = recién cotizado, verde = ya en marcha, amarillo = mantenimiento.
  const cardToneClass = PROJECT_CARD_TONE_CLASSES[projectCardTone(status)]

  return (
    <div className="relative group h-full">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all duration-300" />
      <div className={`relative h-full flex flex-col rounded-2xl border ${cardToneClass} bg-[#02505931] backdrop-blur-sm overflow-hidden transition-all duration-300`}>
        {/* "Imagen": ícono animado grande + overlay revelable al click/tap */}
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          aria-expanded={revealed}
          aria-label={revealed ? `Ocultar detalle de ${name}` : `Ver detalle de ${name}`}
          className="relative w-full aspect-video overflow-hidden text-left cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#08A696]/20 via-[#02505960] to-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatedIcon kind={meta.kind} icon={meta.icon} active size={56} className="text-[#26FFDF]/80" />
          </div>

          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 flex flex-col justify-center p-4 bg-black/65 backdrop-blur-sm"
              >
                <h3 className="text-white font-bold text-base leading-snug line-clamp-2">{name}</h3>
                <p className="text-[#e6f7f6]/80 text-xs mt-1.5 line-clamp-3">
                  {description || "Sin descripción"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/50 text-[#e6f7f6]/80 backdrop-blur-sm">
            {revealed ? "Toca para ocultar" : "Toca para ver"}
          </span>
        </button>

        <div className="flex-1 flex flex-col p-5">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h2 className="text-white font-bold text-lg leading-snug truncate">{name}</h2>
            <Pill tone={statusTone}>{statusLabel}</Pill>
          </div>
          <p className="text-textSecondary text-[11px] mb-4">{meta.label}</p>

          <div className="mb-5">
            <ProjectPipeline phases={phases} compact />
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-xs">
              <span className="text-textSecondary">Progreso</span>
              <span className="text-[#26FFDF] font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-[#02505960] rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-[#08A696]/15 flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-textSecondary">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-[#08A696]" /> {formatDate(startDate)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-[#08A696]" /> {formatDate(endDate)}
              </span>
            </div>
            <Link
              href={`/client-dashboard/projects/${id}`}
              className="flex items-center gap-1 text-xs font-medium text-[#26FFDF] hover:gap-1.5 transition-all shrink-0"
            >
              Ver <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
