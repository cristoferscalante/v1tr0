'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, FolderOpen, Settings, LogOut, TrendingUp, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface DashboardStats {
  totalProjects: number
  activeProjects: number
  pendingTasks: number
  overallProgress: number
  upcomingDeadlines: number
}

export default function ClientDashboard() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    pendingTasks: 0,
    overallProgress: 0,
    upcomingDeadlines: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardStats()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)

      // Obtener proyectos del cliente
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, status')
        .eq('client_id', user!.id)

      if (projectsError) { throw projectsError }

      const activeProjects = projects?.filter(p => p.status === 'active').length || 0
      const totalProjects = projects?.length || 0

      // Obtener tareas de los proyectos del cliente
      const projectIds = projects?.map(p => p.id) || []

      let pendingTasksCount = 0
      let completedTasksCount = 0
      let totalTasksCount = 0
      let upcomingCount = 0

      if (projectIds.length > 0) {
        // Obtener meeting_tasks
        const { data: meetingTasks } = await supabase
          .from('meeting_tasks')
          .select('status, due_date')
          .in('project_id', projectIds)

        if (meetingTasks) {
          totalTasksCount += meetingTasks.length
          pendingTasksCount += meetingTasks.filter(t => t.status === 'pending').length
          completedTasksCount += meetingTasks.filter(t => t.status === 'completed').length

          // Contar tareas con vencimiento próximo (próximos 7 días)
          const today = new Date()
          const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
          upcomingCount += meetingTasks.filter(t => {
            if (!t.due_date) { return false }
            const dueDate = new Date(t.due_date)
            return dueDate >= today && dueDate <= nextWeek && t.status !== 'completed'
          }).length
        }

        // Obtener tasks (si existen)
        const { data: tasks } = await supabase
          .from('tasks')
          .select('estado, fecha_final')
          .in('project_id', projectIds)

        if (tasks) {
          totalTasksCount += tasks.length
          pendingTasksCount += tasks.filter(t => t.estado === 'pendiente').length
          completedTasksCount += tasks.filter(t => t.estado === 'completada').length

          // Contar tareas con vencimiento próximo
          const today = new Date()
          const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
          upcomingCount += tasks.filter(t => {
            if (!t.fecha_final) { return false }
            const dueDate = new Date(t.fecha_final)
            return dueDate >= today && dueDate <= nextWeek && t.estado !== 'completada'
          }).length
        }
      }

      // Calcular progreso general
      const overallProgress = totalTasksCount > 0
        ? Math.round((completedTasksCount / totalTasksCount) * 100)
        : 0

      setStats({
        totalProjects,
        activeProjects,
        pendingTasks: pendingTasksCount,
        overallProgress,
        upcomingDeadlines: upcomingCount
      })
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
      toast.error('Error al cargar estadísticas')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 font-bricolage">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12 space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-textPrimary mb-2 bg-gradient-to-r from-[#08A696] to-[#26FFDF] bg-clip-text text-transparent">
            Dashboard del Cliente
          </h1>
          <p className="text-textSecondary text-sm sm:text-base">Bienvenido de vuelta, {user?.email}</p>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="border-[#08A696]/30 text-textPrimary hover:bg-[#08A696]/10 hover:border-[#26FFDF] backdrop-blur-sm transition-all duration-300 w-fit"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </motion.div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="sm:col-span-2 lg:col-span-1"
        >
          <Card className="rounded-2xl border text-textPrimary bg-background/10 border-[#08A696]/20 backdrop-blur-md hover:bg-background/20 transition-all duration-500 cursor-pointer group shadow-lg hover:shadow-[#26FFDF]/10 min-h-[140px]" onClick={() => router.push('/client-dashboard/projects')}>
            <CardHeader className="pb-6 h-full flex items-center">
              <div className="flex items-center space-x-4 w-full">
                <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-[#08A696] to-[#26FFDF] flex-shrink-0 shadow-lg group-hover:shadow-[#26FFDF]/30 transition-all duration-300">
                  <FolderOpen className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-textPrimary group-hover:text-highlight transition-colors text-xl sm:text-2xl font-bold">Proyectos</CardTitle>
                  <CardDescription className="text-textSecondary text-sm sm:text-base mt-1">Ver mis proyectos activos</CardDescription>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#08A696]/20 text-[#26FFDF] border border-[#08A696]/30">
                      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : `${stats.activeProjects} activos`}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="rounded-2xl border text-textPrimary bg-background/10 border-[#08A696]/20 backdrop-blur-md hover:bg-background/20 transition-all duration-500 cursor-pointer group shadow-lg hover:shadow-[#26FFDF]/10 min-h-[140px]">
            <CardHeader className="pb-6 h-full flex items-center">
              <div className="flex items-center space-x-4 w-full">
                <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-[#08A696]/80 to-[#26FFDF]/80 flex-shrink-0 shadow-lg group-hover:shadow-[#26FFDF]/30 transition-all duration-300">
                  <User className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-textPrimary group-hover:text-highlight transition-colors text-xl sm:text-2xl font-bold">Perfil</CardTitle>
                  <CardDescription className="text-textSecondary text-sm sm:text-base mt-1">Gestionar mi información</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="rounded-2xl border text-textPrimary bg-background/10 border-[#08A696]/20 backdrop-blur-md hover:bg-background/20 hover:border-[#26FFDF]/40 transition-all duration-500 cursor-pointer group shadow-lg hover:shadow-[#26FFDF]/10 min-h-[140px]">
            <CardHeader className="pb-6 h-full flex items-center">
              <div className="flex items-center space-x-4 w-full">
                <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-[#08A696]/60 to-[#26FFDF]/60 flex-shrink-0 shadow-lg group-hover:shadow-[#26FFDF]/30 transition-all duration-300">
                  <Settings className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-textPrimary group-hover:text-highlight transition-colors text-xl sm:text-2xl font-bold">Configuración</CardTitle>
                  <CardDescription className="text-textSecondary text-sm sm:text-base mt-1">Ajustes de la cuenta</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <Card className="rounded-2xl border text-textPrimary bg-background/10 border-[#08A696]/20 backdrop-blur-md hover:bg-background/20 transition-all duration-500 group shadow-lg hover:shadow-[#26FFDF]/10 min-h-[120px]">
          <CardContent className="p-4 sm:p-6 h-full flex items-center">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-textSecondary text-sm font-medium">Proyectos Activos</p>
                <p className="text-2xl sm:text-3xl font-bold text-textPrimary group-hover:text-highlight transition-colors">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.activeProjects}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-[#08A696]/20 to-[#26FFDF]/20 group-hover:from-[#08A696]/30 group-hover:to-[#26FFDF]/30 transition-all duration-300">
                <FolderOpen className="h-5 w-5 sm:h-6 sm:w-6 text-[#26FFDF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border text-textPrimary bg-background/10 border-[#08A696]/20 backdrop-blur-md hover:bg-background/20 hover:border-[#26FFDF]/40 transition-all duration-500 group shadow-lg hover:shadow-[#26FFDF]/10 min-h-[120px]">
          <CardContent className="p-4 sm:p-6 h-full flex items-center">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-textSecondary text-sm font-medium">Tareas Pendientes</p>
                <p className="text-2xl sm:text-3xl font-bold text-textPrimary group-hover:text-highlight transition-colors">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.pendingTasks}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-[#08A696]/20 to-[#26FFDF]/20 group-hover:from-[#08A696]/30 group-hover:to-[#26FFDF]/30 transition-all duration-300">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[#26FFDF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border text-textPrimary bg-background/10 border-[#08A696]/20 backdrop-blur-md hover:bg-background/20 hover:border-[#26FFDF]/40 transition-all duration-500 group shadow-lg hover:shadow-[#26FFDF]/10 min-h-[120px]">
          <CardContent className="p-4 sm:p-6 h-full flex items-center">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-textSecondary text-sm font-medium">Progreso General</p>
                <p className="text-2xl sm:text-3xl font-bold text-textPrimary group-hover:text-highlight transition-colors">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `${stats.overallProgress}%`}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-[#08A696]/20 to-[#26FFDF]/20 group-hover:from-[#08A696]/30 group-hover:to-[#26FFDF]/30 transition-all duration-300">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-[#26FFDF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border text-textPrimary bg-background/10 border-[#08A696]/20 backdrop-blur-md hover:bg-background/20 hover:border-[#26FFDF]/40 transition-all duration-500 group shadow-lg hover:shadow-[#26FFDF]/10 min-h-[120px]">
          <CardContent className="p-4 sm:p-6 h-full flex items-center">
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-textSecondary text-sm font-medium">Próximos 7 días</p>
                <p className="text-2xl sm:text-3xl font-bold text-textPrimary group-hover:text-highlight transition-colors">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.upcomingDeadlines}
                </p>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-[#08A696]/20 to-[#26FFDF]/20 group-hover:from-[#08A696]/30 group-hover:to-[#26FFDF]/30 transition-all duration-300">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-[#26FFDF]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}