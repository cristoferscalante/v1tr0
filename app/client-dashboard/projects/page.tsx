'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Clock, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface Project {
  id: string
  name: string
  description: string
  status: 'planning' | 'design' | 'development' | 'testing' | 'deployed'
  priority: 'low' | 'medium' | 'high'
  start_date: string
  end_date: string
  progress: number
  client_id: string
}

const statusColors = {
  planning: 'bg-[#08A696]/20 text-[#26FFDF] border-[#08A696]/30',
  design: 'bg-[#08A696]/30 text-[#26FFDF] border-[#08A696]/40',
  development: 'bg-[#08A696]/40 text-[#26FFDF] border-[#08A696]/50',
  testing: 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]/30',
  deployed: 'bg-[#00D084]/20 text-[#00D084] border-[#00D084]/30'
}

const priorityColors = {
  low: 'bg-textSecondary/20 text-textSecondary border-textSecondary/30',
  medium: 'bg-[#FFB800]/20 text-[#FFB800] border-[#FFB800]/30',
  high: 'bg-[#FF6B6B]/20 text-[#FF6B6B] border-[#FF6B6B]/30'
}

const statusLabels = {
  planning: 'Planeación',
  design: 'Diseño',
  development: 'Desarrollo',
  testing: 'Testing',
  deployed: 'Desplegado'
}

const priorityLabels = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta'
}

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // console.log('[ClientProjects] Component mounted, user:', user?.id)

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        // console.log('[ClientProjects] No hay usuario autenticado, esperando...')
        setIsLoading(false)
        return
      }

      // console.log('[ClientProjects] Cargando proyectos para user.id:', user.id)

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('[ClientProjects] Error fetching projects:', error)
          toast.error('Error al cargar los proyectos')
          return
        }

        // console.log('[ClientProjects] Proyectos obtenidos:', data?.length || 0, data)
        setProjects(data || [])
      } catch (error) {
        console.error('Error:', error)
        toast.error('Error al cargar los proyectos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [user])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 font-bricolage">
        <div className="flex items-center justify-center h-64">
          <div className="text-textSecondary">Cargando proyectos...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 font-bricolage">
      {/* Header */}
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
          <div className="rounded-xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-textPrimary bg-gradient-to-r from-[#08A696] to-[#26FFDF] bg-clip-text text-transparent">Mis Proyectos</h1>
            <p className="text-textSecondary text-sm sm:text-base">Gestiona y monitorea el progreso de tus proyectos</p>
          </div>
        </div>
      </motion.div>

      {/* Projects Grid */}
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
          {projects.map((project, index) => (
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
                    {/* Status and Priority */}
                    <div className="flex items-center justify-between gap-2">
                      <Badge className={`${statusColors[project.status]} text-xs flex-shrink-0 backdrop-blur-sm`}>
                        {statusLabels[project.status]}
                      </Badge>
                      <Badge className={`${priorityColors[project.priority]} text-xs flex-shrink-0 backdrop-blur-sm`}>
                        {priorityLabels[project.priority]}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
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

                    {/* Dates */}
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
          ))}
        </div>
      )}
    </div>
  )
}