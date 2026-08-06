'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { FolderOpen, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import ProjectIconCard from '@/components/client/ProjectIconCard'
import type { PipelinePhase } from '@/components/client/ProjectPipeline'
import { PanelPage, SectionHeading, EmptyState } from '@/components/shared/panel-ui'

interface Project {
  id: string
  name: string
  description: string
  status: string
  serviceType: string
  icon?: string | null
  progress: number
  start_date: string
  end_date: string
  phases: PipelinePhase[]
}

type Tone = 'default' | 'success' | 'warning' | 'danger'

const statusTone: Record<string, { tone: Tone; label: string }> = {
  planning: { tone: 'danger', label: 'Cotizado' },
  design: { tone: 'default', label: 'Diseño' },
  development: { tone: 'default', label: 'Desarrollo' },
  testing: { tone: 'warning', label: 'Revisión' },
  completed: { tone: 'success', label: 'Entregado' },
  maintenance: { tone: 'warning', label: 'Mantenimiento' },
  paused: { tone: 'warning', label: 'Pausado' },
  cancelled: { tone: 'danger', label: 'Cancelado' },
}

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) { setIsLoading(false); return }
      try {
        const res = await fetch('/api/client-projects')
        if (res.ok) {setProjects(await res.json())}
      } catch {
        // silent
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#26FFDF]" />
      </div>
    )
  }

  return (
    <PanelPage>
      <SectionHeading
        badge="Seguimiento"
        title="Mis Proyectos"
        subtitle="Toca el ícono de cada tarjeta para ver el detalle"
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          message="No tienes proyectos asignados aún"
          hint="Aparecerán aquí en cuanto el equipo cree el primero"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const s = statusTone[project.status] ?? { tone: 'default' as Tone, label: project.status }
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="h-full"
              >
                <ProjectIconCard
                  id={project.id}
                  name={project.name}
                  status={project.status}
                  serviceType={project.serviceType}
                  icon={project.icon}
                  progress={project.progress}
                  startDate={project.start_date}
                  endDate={project.end_date}
                  statusTone={s.tone}
                  statusLabel={s.label}
                  phases={project.phases}
                />
              </motion.div>
            )
          })}
        </div>
      )}
    </PanelPage>
  )
}
