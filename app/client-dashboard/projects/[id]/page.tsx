'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import TaskTreeBoard from '@/components/client/TaskTreeBoard'
import type { FeedType } from '@/components/shared/project-tree'

interface Phase {
  id: string; name: string; description: string | null
  order: number; status: string; track: string; startDate: string | null; endDate: string | null
  tasks: { id: string; name: string; icon: string | null; completed: boolean }[]
}

interface Suggestion {
  id: string; title: string; description: string | null
  status: string; createdAt: string
}

interface BugReport {
  id: string; title: string; description: string | null
  severity: string; status: string; createdAt: string
}

interface MeetingRequest {
  id: string; title: string; description: string | null
  preferredDate: string | null; status: string; createdAt: string
}

interface ProjectDetail {
  id: string; name: string; description: string | null
  status: string; images: string[]; progress: number
  phases: Phase[]
  suggestions: Suggestion[]; bugs: BugReport[]
  meetings: MeetingRequest[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="relative group h-full">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all duration-300" />
      <div className={`relative bg-[#02505931] backdrop-blur-sm rounded-2xl border border-[#08A696]/20 transition-all duration-300 h-full ${className}`}>
        {children}
      </div>
    </div>
  )
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  planning: { label: 'Planeación', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
  design: { label: 'Diseño', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
  development: { label: 'Desarrollo', color: 'text-[#26FFDF]', bg: 'bg-[#08A696]/10 border-[#08A696]/30' },
  testing: { label: 'Pruebas', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30' },
  completed: { label: 'Completado', color: 'text-[#26FFDF]', bg: 'bg-[#08A696]/10 border-[#08A696]/30' },
  maintenance: { label: 'Mantenimiento', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30' },
  paused: { label: 'Pausado', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
  cancelled: { label: 'Cancelado', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' },
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProject = useCallback(async () => {
    const { id } = await params
    try {
      setLoading(true)
      const res = await fetch(`/api/projects/${id}/details`)
      if (!res.ok) { router.push('/client-dashboard/projects'); return }
      setProject(await res.json())
    } catch { router.push('/client-dashboard/projects') }
    finally { setLoading(false) }
  }, [params, router])

  useEffect(() => { fetchProject() }, [fetchProject])

  if (loading) {return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="absolute inset-0 bg-gradient-to-r from-[#08A696] to-[#26FFDF] rounded-full blur-xl opacity-30 animate-pulse" />
        <Loader2 className="h-10 w-10 animate-spin text-[#26FFDF]" />
        <p className="text-textSecondary font-bricolage text-sm">Cargando proyecto...</p>
      </div>
    </div>
  )}

  if (!project) {return null}

  const feeds: Record<FeedType, { id: string; title: string; status: string; severity?: string }[]> = {
    suggestions: project.suggestions.map((s) => ({ id: s.id, title: s.title, status: s.status })),
    bugs: project.bugs.map((b) => ({ id: b.id, title: b.title, status: b.status, severity: b.severity })),
    meetings: project.meetings.map((m) => ({ id: m.id, title: m.title, status: m.status })),
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible"
      className="h-screen flex flex-col p-4 sm:p-6 lg:p-8 pb-12 font-bricolage max-w-[1680px] mx-auto"
    >
      {/* Back */}
      <button onClick={() => router.push('/client-dashboard/projects')}
        className="shrink-0 mb-4 flex items-center gap-2 text-textSecondary hover:text-[#26FFDF] transition-colors text-sm"
      ><ArrowLeft className="h-4 w-4" /> Volver a proyectos</button>

      {/* Tablero único: tareas de desarrollo + sugerencias + fallos + reuniones,
          todo como nodos del mismo árbol en vez de pestañas separadas. El
          nombre/estado del proyecto y el progreso general viven como
          overlays delgados dentro del propio tablero. Ocupa todo el alto
          restante hasta pb-12, alineado con el botón flotante de WhatsApp. */}
      <motion.div variants={itemVariants} className="flex-1 min-h-0">
        <GlassCard className="p-4 sm:p-6 flex flex-col">
          <p className="shrink-0 text-textSecondary text-xs mb-3">
            Pasa el cursor o toca un nodo para ver el detalle. Usa el + de cada rama para agregar sugerencias, reportes o reuniones.
          </p>
          <div className="flex-1 min-h-0">
            <TaskTreeBoard
              projectId={project.id}
              projectName={project.name}
              phases={project.phases}
              feeds={feeds}
              progress={project.progress}
              statusLabel={statusConfig[project.status]?.label ?? project.status}
              statusColorClass={statusConfig[project.status]?.color ?? 'text-[#26FFDF]'}
              onChanged={fetchProject}
            />
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
