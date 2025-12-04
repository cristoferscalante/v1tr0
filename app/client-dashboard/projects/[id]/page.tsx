'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ProjectTasks } from '@/components/dashboard/project-tasks'

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



export default function ProjectTimelinePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const projectId = params?.id as string

  useEffect(() => {
    const fetchProject = async () => {
      if (!user || !projectId) {
        console.log('[ClientProjectDetail] Falta user o projectId:', { user: !!user, projectId })
        return
      }

      console.log('[ClientProjectDetail] Cargando proyecto:', projectId, 'para user.id:', user.id)
      
      try {
        // Fetch project
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .eq('client_id', user.id)
          .single()

        if (projectError) {
          console.error('[ClientProjectDetail] Error fetching project:', projectError)
          console.error('[ClientProjectDetail] Query was: id =', projectId, 'AND client_id =', user.id)
          toast.error('Proyecto no encontrado o no tienes acceso')
          router.push('/client-dashboard/projects')
          return
        }

        console.log('[ClientProjectDetail] Proyecto obtenido:', projectData)
        setProject(projectData)
      } catch (error) {
        console.error('Error:', error)
        toast.error('Error al cargar el proyecto')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [user, projectId, router])

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 font-bricolage">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#26FFDF]" />
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen p-6 font-bricolage">
        <div className="text-center py-12">
          <div className="text-textSecondary mb-4">Proyecto no encontrado</div>
          <Link href="/client-dashboard/projects">
            <Button variant="outline" className="border-[#08A696]/30 text-textPrimary hover:bg-[#08A696]/10 hover:border-[#26FFDF] backdrop-blur-sm transition-all duration-300">
              Volver a Proyectos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 font-bricolage">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0 p-6 rounded-2xl bg-background/10 backdrop-blur-sm border border-[#08A696]/20">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link href="/client-dashboard/projects">
            <Button variant="outline" size="sm" className="border-[#08A696]/30 text-textPrimary hover:bg-[#08A696]/10 hover:border-[#26FFDF] backdrop-blur-sm transition-all duration-300 w-fit">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#08A696] to-[#26FFDF] bg-clip-text text-transparent">{project.name}</h1>
            <p className="text-textSecondary text-sm sm:text-base mt-1">{project.description}</p>
          </div>
        </div>
      </div>

      {/* Project Tasks Component */}
      <ProjectTasks projectId={projectId} />
    </div>
  )
}