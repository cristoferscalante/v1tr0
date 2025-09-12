'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, CheckCircle, Circle } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { TaskCard } from '@/components/ui/task-card'
import { TimelineFilters, FilterState } from '@/components/ui/timeline-filters'
import BackgroundAnimation from '@/components/home/animations/BackgroundAnimation'
import { ProjectChatbot } from '@/components/ui/project-chatbot'

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

interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  priority: 'low' | 'medium' | 'high'
  stage: 'planning' | 'design' | 'development' | 'testing' | 'deployment'
  assigned_to?: string
  due_date: string
  project_id: string
  progress?: number
  created_at: string
  updated_at: string
}

const stageConfig = {
  planning: {
    title: 'Planeación',
    description: 'Definición de requisitos y planificación del proyecto',
    color: 'from-blue-500 to-blue-600',
    icon: Circle
  },
  design: {
    title: 'Diseño',
    description: 'Creación de mockups, wireframes y diseño visual',
    color: 'from-purple-500 to-purple-600',
    icon: Circle
  },
  development: {
    title: 'Desarrollo',
    description: 'Implementación del código y funcionalidades',
    color: 'from-orange-500 to-orange-600',
    icon: Circle
  },
  testing: {
    title: 'Testing',
    description: 'Pruebas de calidad y corrección de errores',
    color: 'from-yellow-500 to-yellow-600',
    icon: Circle
  },
  deployment: {
    title: 'Despliegue',
    description: 'Puesta en producción y entrega final',
    color: 'from-green-500 to-green-600',
    icon: CheckCircle
  }
}

// Tareas de ejemplo para cada etapa
const exampleTasks: Record<string, Task[]> = {
  planning: [
    {
      id: 'example-planning-1',
      title: 'Análisis de Requisitos',
      description: 'Definir y documentar todos los requisitos funcionales y no funcionales del proyecto',
      status: 'completed',
      priority: 'high',
      stage: 'planning',
      due_date: '2025-09-15',
      project_id: '',
      progress: 100,
      created_at: '2025-09-01',
      updated_at: '2025-09-15'
    },
    {
      id: 'example-planning-2',
      title: 'Planificación de Arquitectura',
      description: 'Diseñar la arquitectura técnica y definir tecnologías a utilizar',
      status: 'in_progress',
      priority: 'high',
      stage: 'planning',
      due_date: '2025-09-25',
      project_id: '',
      progress: 75,
      created_at: '2025-09-10',
      updated_at: '2025-09-20'
    }
  ],
  design: [
    {
      id: 'example-design-1',
      title: 'Wireframes de UI',
      description: 'Crear wireframes detallados para todas las pantallas principales',
      status: 'pending',
      priority: 'medium',
      stage: 'design',
      due_date: '2025-10-05',
      project_id: '',
      created_at: '2025-09-25',
      updated_at: '2025-09-25'
    },
    {
      id: 'example-design-2',
      title: 'Diseño Visual',
      description: 'Desarrollar la identidad visual y paleta de colores del proyecto',
      status: 'pending',
      priority: 'medium',
      stage: 'design',
      due_date: '2025-10-15',
      project_id: '',
      created_at: '2025-09-28',
      updated_at: '2025-09-28'
    }
  ],
  development: [
    {
      id: 'example-dev-1',
      title: 'Configuración del Entorno',
      description: 'Configurar el entorno de desarrollo y herramientas necesarias',
      status: 'pending',
      priority: 'high',
      stage: 'development',
      due_date: '2025-11-10',
      project_id: '',
      created_at: '2025-10-20',
      updated_at: '2025-10-20'
    },
    {
      id: 'example-dev-2',
      title: 'Desarrollo del Backend',
      description: 'Implementar APIs y lógica de negocio del servidor',
      status: 'pending',
      priority: 'high',
      stage: 'development',
      due_date: '2025-12-15',
      project_id: '',
      created_at: '2025-11-01',
      updated_at: '2025-11-01'
    }
  ],
  testing: [
    {
      id: 'example-test-1',
      title: 'Pruebas Unitarias',
      description: 'Escribir y ejecutar pruebas unitarias para componentes críticos',
      status: 'pending',
      priority: 'medium',
      stage: 'testing',
      due_date: '2026-01-10',
      project_id: '',
      created_at: '2025-12-20',
      updated_at: '2025-12-20'
    },
    {
      id: 'example-test-2',
      title: 'Pruebas de Integración',
      description: 'Verificar la correcta integración entre todos los módulos',
      status: 'pending',
      priority: 'high',
      stage: 'testing',
      due_date: '2026-01-20',
      project_id: '',
      created_at: '2025-12-25',
      updated_at: '2025-12-25'
    }
  ],
  deployment: [
    {
      id: 'example-deploy-1',
      title: 'Configuración del Servidor',
      description: 'Configurar el servidor de producción y dominio',
      status: 'pending',
      priority: 'high',
      stage: 'deployment',
      due_date: '2026-02-10',
      project_id: '',
      created_at: '2026-01-25',
      updated_at: '2026-01-25'
    },
    {
      id: 'example-deploy-2',
      title: 'Despliegue Final',
      description: 'Realizar el despliegue final y verificar funcionamiento',
      status: 'pending',
      priority: 'high',
      stage: 'deployment',
      due_date: '2026-02-20',
      project_id: '',
      created_at: '2026-02-05',
      updated_at: '2026-02-05'
    }
  ]
}



export default function ProjectTimelinePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const projectId = params?.id as string

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      if (!user || !projectId) {
        return
      }

      try {
        // Fetch project
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .eq('client_id', user.id)
          .single()

        if (projectError) {
        console.error('Error fetching project:', projectError)
        toast.error('Proyecto no encontrado')
        router.push('/client-dashboard/projects')
        return
      }

        setProject(projectData)

        // Fetch tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: true })

        if (tasksError) {
        console.error('Error fetching tasks:', tasksError)
        toast.error('Error al cargar las tareas')
        return
      }

        setTasks(tasksData || [])
        setFilteredTasks(tasksData || [])
      } catch (error) {
        console.error('Error:', error)
        toast.error('Error al cargar el proyecto')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjectAndTasks()
  }, [user, projectId, router])

  const getTasksByStage = (stage: string) => {
    const realTasks = filteredTasks.filter(task => task.stage === stage)
    // Si no hay tareas reales, mostrar tareas de ejemplo
    if (realTasks.length === 0 && exampleTasks[stage]) {
      return exampleTasks[stage]
    }
    return realTasks
  }

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...tasks]

    // Filter by status
    if (filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status.includes(task.status))
    }

    // Filter by priority
    if (filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority.includes(task.priority))
    }

    // Filter by stage
    if (filters.stage.length > 0) {
      filtered = filtered.filter(task => filters.stage.includes(task.stage))
    }

    // Filter by search
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
      )
    }

    setFilteredTasks(filtered)
  }

  const getTaskCounts = () => {
    const byStatus = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const byStage = tasks.reduce((acc, task) => {
      acc[task.stage] = (acc[task.stage] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: tasks.length,
      byStatus,
      byPriority,
      byStage
    }
  }

  const getStageProgress = (stage: string) => {
    const stageTasks = getTasksByStage(stage)
    if (!stageTasks || stageTasks.length === 0) {
      return 0
    }
    const completedTasks = stageTasks.filter(task => task.status === 'completed')
    return Math.round((completedTasks.length / stageTasks.length) * 100)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 font-bricolage">
        <div className="flex items-center justify-center h-64">
          <div className="text-textSecondary">Cargando proyecto...</div>
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
    <div className="min-h-screen p-4 sm:p-6 font-bricolage relative">
      <BackgroundAnimation />
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link href="/client-dashboard/projects">
            <Button variant="outline" size="sm" className="border-[#08A696]/30 text-textPrimary hover:bg-[#08A696]/10 hover:border-[#26FFDF] backdrop-blur-sm transition-all duration-300 w-fit">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-textPrimary bg-gradient-to-r from-[#08A696] to-[#26FFDF] bg-clip-text text-transparent">{project.name}</h1>
            <p className="text-textSecondary text-sm sm:text-base">{project.description}</p>
          </div>
        </div>
      </div>



      {/* Filters */}
      <div className="mb-6 sm:mb-8">
        <TimelineFilters 
          onFilterChange={handleFilterChange}
          taskCounts={getTaskCounts()}
        />
      </div>

      {/* Timeline */}
      <div className="space-y-6 sm:space-y-8">
        <h2 className="text-xl sm:text-2xl font-bold text-textPrimary bg-gradient-to-r from-[#08A696] to-[#26FFDF] bg-clip-text text-transparent mb-4 sm:mb-6">Timeline del Proyecto</h2>
        
        {Object.entries(stageConfig).map(([stageKey, stage], index) => {
          const stageTasks = getTasksByStage(stageKey)
          const stageProgress = getStageProgress(stageKey)
          const isCompleted = stageProgress === 100
          const hasStarted = stageTasks && stageTasks.some(task => task.status !== 'pending')
          
          return (
            <div key={stageKey} className="relative">
              {/* Timeline Line - Hidden on mobile for cleaner look */}
              {index < Object.keys(stageConfig).length - 1 && (
                <div className="absolute left-5 sm:left-6 top-14 sm:top-16 w-0.5 h-20 sm:h-24 bg-[#08A696]/30 hidden sm:block" />
              )}
              
              {/* Stage Card */}
              <div className="flex items-start space-x-3 sm:space-x-4">
                {/* Stage Icon */}
                <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r ${stage.color} flex items-center justify-center ${isCompleted ? 'ring-2 ring-green-400' : hasStarted ? 'ring-2 ring-blue-400' : ''}`}>
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  ) : (
                    <Circle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  )}
                </div>
                
                {/* Stage Content */}
                <div className="flex-1 min-w-0">
                  <Card className="bg-background/10 border-[#08A696]/20 backdrop-blur-md hover:bg-background/20 hover:border-[#26FFDF]/40 transition-all duration-500 group shadow-lg hover:shadow-[#26FFDF]/10 rounded-2xl">
                    <CardHeader className="pb-3 sm:pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-textPrimary group-hover:text-highlight transition-colors text-lg sm:text-xl">{stage.title}</CardTitle>
                          <CardDescription className="text-textSecondary text-sm sm:text-base">
                            {stage.description}
                          </CardDescription>
                        </div>
                        <div className="flex items-center justify-between sm:flex-col sm:text-right space-x-4 sm:space-x-0">
                          <div className="text-sm font-medium text-[#26FFDF]">{stageProgress}%</div>
                          <div className="text-xs text-textSecondary">{stageTasks?.length || 0} tareas</div>
                        </div>
                      </div>
                      {stageTasks && stageTasks.length > 0 && (
                        <Progress value={stageProgress} className="h-2 mt-3" />
                      )}
                    </CardHeader>
                    
                    {/* Tasks */}
                    {stageTasks && stageTasks.length > 0 && (
                      <CardContent className="space-y-3 sm:space-y-4">
                        <div className="grid gap-3 sm:gap-4">
                          {stageTasks.map((task) => (
                            <TaskCard 
                              key={task.id} 
                              task={task} 
                              showProgress={task.status === 'in_progress'}
                              compact={false}
                            />
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      </div>

      {/* Chatbot */}
      <ProjectChatbot
        projectData={{
          id: project.id,
          name: project.name,
          status: project.status,
          progress: project.progress || 0,
          tasks: filteredTasks,
          stage: project.status || 'planning'
        }}
      />
    </div>
  )
}