"use client"

import Link from "next/link"
import { ArrowRight, Calendar, Clock } from "lucide-react"
import { resolveProjectIconMeta, projectCardTone, PROJECT_CARD_TONE_CLASSES } from "@/components/shared/service-type"
import { Pill } from "@/components/shared/panel-ui"
import ProjectPipeline, { type PipelinePhase } from "@/components/client/ProjectPipeline"

interface ProjectIconCardProps {
  id: string
  name: string
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
 * Tarjeta de proyecto: el árbol de avance real (mismo árbol del detalle, en
 * modo no interactivo) es el fondo a toda la tarjeta. En reposo solo se ve
 * el nombre, muy sutil, abajo; al pasar el cursor se revelan los tags, el
 * progreso, las fechas y el acceso al detalle. Toda la tarjeta es un enlace.
 */
export default function ProjectIconCard({
  id,
  name,
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
  const meta = resolveProjectIconMeta({ serviceType, icon })
  // Rojo = recién cotizado, verde = ya en marcha, amarillo = mantenimiento.
  const cardToneClass = PROJECT_CARD_TONE_CLASSES[projectCardTone(status)]

  return (
    <Link href={`/client-dashboard/projects/${id}`} className="relative group h-full block aspect-[3/2]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all duration-300" />
      <div className={`relative h-full rounded-2xl border ${cardToneClass} bg-black/40 backdrop-blur-sm overflow-hidden transition-all duration-300`}>
        {/* Árbol de avance real, a toda la tarjeta, como fondo. */}
        <ProjectPipeline phases={phases} compact interactive={false} fill />

        {/* Velo oscuro para legibilidad: sutil en reposo, más marcado al pasar el cursor. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent group-hover:from-black/95 group-hover:via-black/50 group-hover:to-black/10 transition-colors duration-300" />

        <div className="absolute inset-x-0 bottom-0 p-4">
          <h2 className="font-medium text-white/55 truncate transition-all duration-300 text-xs group-hover:text-sm group-hover:text-white">
            {name}
          </h2>

          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
            <div className="overflow-hidden">
              <div className="flex flex-col gap-3 pt-3">
                <div className="flex items-center flex-wrap gap-2">
                  <Pill tone={statusTone}>{statusLabel}</Pill>
                  <Pill tone="muted" className="!px-2 !py-0.5 !text-[10px]">{meta.label}</Pill>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/60">Progreso</span>
                    <span className="text-[#26FFDF] font-medium">{progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-white/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-[#08A696]" /> {formatDate(startDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[#08A696]" /> {formatDate(endDate)}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-[#26FFDF] shrink-0">
                    Ver <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
