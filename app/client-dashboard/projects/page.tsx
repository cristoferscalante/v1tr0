'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Clock, ExternalLink, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Project {
  id: string
  name: string
  description: string
  status: string
  progress: number
  start_date: string
  end_date: string
}

const statusBadge: Record<string, { color: string; label: string }> = {
  planning: { color: 'bg-[#08A696]/20 text-[#26FFDF] border-[#08A696]/30', label: 'Planeación' },
  design: { color: 'bg-[#08A696]/30 text-[#26FFDF] border-[#08A696]/40', label: 'Diseño' },
  development: { color: 'bg-[#08A696]/40 text-[#26FFDF] border-[#08A696]/50', label: 'Desarrollo' },
  testing: { color: 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]/30', label: 'Testing' },
  active: { color: 'bg-[#08A696]/20 text-[#26FFDF] border-[#08A696]/30', label: 'Activo' },
  completed: { color: 'bg-[#00D084]/20 text-[#00D084] border-[#00D084]/30', label: 'Completado' },
  cancelled: { color: 'bg-[#FF6B6B]/20 text-[#FF6B6B] border-[#FF6B6B]/30', label: 'Cancelado' },
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
        if (res.ok) setProjects(await res.json())
      } catch {
        // silent
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [user])

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 font-bricolage">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#26FFDF]" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 font-bricolage">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12 space-y-4 sm:space-y-0 p-6 rounded-2xl bg-background/10 backdrop-blur-sm border border-[#08A696]/20"
      >
        <div className="flex items-center space-x-4">
          <Link href="/client-dashboard">
            <Button variant="outline" size="sm" className="border-[#08A696]/30 text-textPrimary hover:bg-[#08A696]/10 hover:border-[#26FFDF] backdrop-blur-sm transition-all duration-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-textPrimary bg-gradient-to-r from-[#08A696] to-[#26FFDF] bg-clip-text text-transparent">Mis Proyectos</h1>
            <p className="text-textSecondary text-sm sm:text-base">Gestiona y monitorea el progreso de tus proyectos</p>
          </div>
        </div>
      </motion.div>

      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12 rounded-2xl bg-background/10 backdrop-blur-sm border border-[#08A696]/20"
        >
          <div className="text-textSecondary mb-4">No tienes proyectos asignados aún</div>
          <p className="text-sm text-textSecondary/70">Los proyectos aparecerán aquí una vez que sean creados por el equipo</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => {
            const sb = statusBadge[project.status] ?? { color: 'bg-[#08A696]/20 text-[#26FFDF] border-[#08A696]/30', label: project.status }
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/client-dashboard/projects/${project.id}`}>
                  <Card className="bg-background/10 border-[#08A696]/20 backdrop-blur-md hover:bg-background/20 hover:border-[#26FFDF]/40 transition-all duration-500 cursor-pointer group shadow-lg hover:shadow-[#26FFDF]/10 h-full rounded-2xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-textPrimary group-hover:text-highlight transition-colors text-lg sm:text-xl truncate font-bold">
                            {project.name}
                          </CardTitle>
                          <CardDescription className="text-textSecondary mt-1 text-sm sm:text-base line-clamp-2">
                            {project.description}
                          </CardDescription>
                        </div>
                        <ExternalLink className="h-4 w-4 text-textSecondary group-hover:text-highlight transition-colors flex-shrink-0 ml-2" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge className={`${sb.color} text-xs backdrop-blur-sm`}>{sb.label}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-textSecondary">Progreso</span>
                          <span className="text-highlight font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-background/30 rounded-full h-2 backdrop-blur-sm">
                          <div
                            className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] h-2 rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-xs sm:text-sm text-textSecondary">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-[#08A696]" />
                          <span className="truncate">Inicio: {formatDate(project.start_date)}</span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-textSecondary">
                          <Clock className="h-4 w-4 mr-2 flex-shrink-0 text-[#08A696]" />
                          <span className="truncate">Entrega: {formatDate(project.end_date)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}