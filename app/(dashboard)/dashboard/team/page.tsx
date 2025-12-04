'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { 
  Users, 
  UserPlus, 
  Code, 
  Palette, 
  Shield, 
  Bug, 
  Server,
  Eye,
  Plus,
  Filter,
  LogOut,
  Loader2,
  Mail,
  Calendar,
  Briefcase,
  X
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: string // 'admin' o 'team' desde la DB
  userRole?: string // rol técnico (Frontend, Backend, etc) - opcional
  status: 'Activo' | 'Inactivo'
  projectsAssigned: number
  availability: 'Disponible' | 'Ocupado'
  avatar: string
  email: string
}

// Datos de ejemplo SI NO hay conexión a DB (fallback)
const fallbackTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Ana García',
    role: 'Frontend Developer',
    status: 'Activo',
    projectsAssigned: 3,
    availability: 'Disponible',
    avatar: '/avatars/ana.jpg',
    email: 'ana.garcia@v1tr0.com'
  },
  {
    id: '2',
    name: 'Carlos López',
    role: 'Backend Developer',
    status: 'Activo',
    projectsAssigned: 2,
    availability: 'Ocupado',
    avatar: '/avatars/carlos.jpg',
    email: 'carlos.lopez@v1tr0.com'
  },
  {
    id: '3',
    name: 'María Silva',
    role: 'UI/UX Designer',
    status: 'Activo',
    projectsAssigned: 4,
    availability: 'Disponible',
    avatar: '/avatars/maria.jpg',
    email: 'maria.silva@v1tr0.com'
  },
  {
    id: '4',
    name: 'Juan Pérez',
    role: 'Project Manager',
    status: 'Activo',
    projectsAssigned: 5,
    availability: 'Ocupado',
    avatar: '/avatars/juan.jpg',
    email: 'juan.perez@v1tr0.com'
  },
  {
    id: '5',
    name: 'Laura Martín',
    role: 'QA Tester',
    status: 'Activo',
    projectsAssigned: 2,
    availability: 'Disponible',
    avatar: '/avatars/laura.jpg',
    email: 'laura.martin@v1tr0.com'
  },
  {
    id: '6',
    name: 'Diego Ruiz',
    role: 'DevOps Engineer',
    status: 'Activo',
    projectsAssigned: 3,
    availability: 'Ocupado',
    avatar: '/avatars/diego.jpg',
    email: 'diego.ruiz@v1tr0.com'
  }
]

const roleFilters = [
  { id: 'all', label: 'Todos', icon: Users },
  { id: 'developer', label: 'Developers', icon: Code },
  { id: 'designer', label: 'Designers', icon: Palette },
  { id: 'manager', label: 'Managers', icon: Shield },
  { id: 'qa', label: 'QA', icon: Bug },
  { id: 'devops', label: 'DevOps', icon: Server }
]

export default function TeamPage() {
  const router = useRouter()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [tasks, setTasks] = useState<any[]>([])
  const [loadingTasks, setLoadingTasks] = useState(false)
  const { signOut, user, userRole } = useAuth()

  // Cargar usuarios team y admin desde Supabase
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true)
        console.log('[TeamPage] Cargando usuarios team y admin...')
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .in('role', ['admin', 'team'])
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('[TeamPage] Error al cargar usuarios:', error)
          toast.error('Error al cargar miembros del equipo')
          setTeamMembers(fallbackTeamMembers) // Usar datos de ejemplo
          return
        }

        console.log('[TeamPage] ✅ Usuarios cargados:', data.length)

        // Obtener conteo de proyectos por usuario (de meeting_tasks)
        const { data: taskData } = await supabase
          .from('meeting_tasks')
          .select('assigned_to')
          .not('assigned_to', 'is', null)

        // Contar proyectos por usuario
        const projectCounts: Record<string, number> = {}
        taskData?.forEach(task => {
          const assignedTo = task.assigned_to?.toLowerCase() || ''
          if (assignedTo) {
            projectCounts[assignedTo] = (projectCounts[assignedTo] || 0) + 1
          }
        })

        console.log('[TeamPage] 📊 Proyectos por usuario:', projectCounts)

        // Transformar datos de Supabase a formato TeamMember
        const members: TeamMember[] = data.map(profile => {
          const userName = (profile.full_name || profile.email?.split('@')[0] || '').toLowerCase()
          const projectCount = projectCounts[userName] || 0

          return {
            id: profile.id,
            name: profile.full_name || profile.email?.split('@')[0] || 'Usuario',
            role: profile.role, // 'admin' o 'team'
            userRole: profile.user_role || (profile.role === 'admin' ? 'Administrador' : 'Miembro del Equipo'),
            status: 'Activo', // Por defecto activo
            projectsAssigned: projectCount,
            availability: projectCount > 3 ? 'Ocupado' : 'Disponible',
            avatar: profile.avatar_url || '',
            email: profile.email || ''
          }
        })

        setTeamMembers(members)
      } catch (error) {
        console.error('[TeamPage] Error inesperado:', error)
        toast.error('Error al cargar datos')
        setTeamMembers(fallbackTeamMembers)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMembers()
  }, [])

  // Fetch all tasks for assignment dialog
  const fetchTasks = async () => {
    try {
      setLoadingTasks(true)
      const { data, error } = await supabase
        .from('meeting_tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading tasks:', error)
        throw error
      }

      // Get unique project IDs
      const projectIds = [...new Set(data?.map(t => t.project_id).filter(Boolean))]
      
      // Fetch projects separately
      let projectsMap: Record<string, any> = {}
      if (projectIds.length > 0) {
        const { data: projects } = await supabase
          .from('projects')
          .select('id, name, client_name')
          .in('id', projectIds)
        
        if (projects) {
          projectsMap = projects.reduce((acc, p) => ({ ...acc, [p.id]: p }), {})
        }
      }

      // Combine data
      const tasksWithProjects = (data || []).map(task => ({
        ...task,
        projects: task.project_id ? projectsMap[task.project_id] : null
      }))

      setTasks(tasksWithProjects)
    } catch (error: any) {
      console.error('Error loading tasks:', error)
      toast.error('Error al cargar tareas')
      setTasks([]) // Set empty array on error
    } finally {
      setLoadingTasks(false)
    }
  }

  // Assign task to team member (admin or team role)
  const handleAssignTask = async (taskId: string) => {
    if (!selectedMember) return

    try {
      // Update single meeting_task with user ID (mejor práctica)
      const { error } = await supabase
        .from('meeting_tasks')
        .update({ 
          assigned_to: selectedMember.name.toLowerCase(), // Usar name para compatibilidad actual
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)

      if (error) throw error

      toast.success(`Tarea asignada a ${selectedMember.name}`)
      
      // Refresh task list to show updated assignment
      await fetchTasks()
      
      // Refresh team members list to update task count
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'team'])
        .order('created_at', { ascending: false })

      if (data) {
        // Recalculate task counts
        const { data: taskData } = await supabase
          .from('meeting_tasks')
          .select('assigned_to')
          .not('assigned_to', 'is', null)

        const projectCounts: Record<string, number> = {}
        taskData?.forEach(task => {
          const assignedTo = task.assigned_to?.toLowerCase() || ''
          if (assignedTo) {
            projectCounts[assignedTo] = (projectCounts[assignedTo] || 0) + 1
          }
        })

        const members: TeamMember[] = data.map(profile => {
          const userName = (profile.full_name || profile.email?.split('@')[0] || '').toLowerCase()
          const projectCount = projectCounts[userName] || 0

          return {
            id: profile.id,
            name: profile.full_name || profile.email?.split('@')[0] || 'Usuario',
            role: profile.role,
            userRole: profile.user_role || (profile.role === 'admin' ? 'Administrador' : 'Miembro del Equipo'),
            status: 'Activo',
            projectsAssigned: projectCount,
            availability: projectCount > 3 ? 'Ocupado' : 'Disponible',
            avatar: profile.avatar_url || '',
            email: profile.email || ''
          }
        })

        setTeamMembers(members)
      }
      
      // Close dialog
      setShowAssignDialog(false)
    } catch (error: any) {
      console.error('Error assigning task:', error)
      toast.error('Error al asignar tarea')
    }
  }

  // Open assign dialog and load tasks
  const handleOpenAssignDialog = (member: TeamMember) => {
    setSelectedMember(member)
    setShowAssignDialog(true)
    fetchTasks()
  }

  // Open profile dialog
  const handleOpenProfileDialog = (member: TeamMember) => {
    setSelectedMember(member)
    setShowProfileDialog(true)
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }
  
  const filteredMembers = teamMembers.filter(member => {
    if (selectedFilter === 'all') { return true }
    if (selectedFilter === 'developer') { return member.role.includes('Developer') }
    if (selectedFilter === 'designer') { return member.role.includes('Designer') }
    if (selectedFilter === 'manager') { return member.role.includes('Manager') }
    if (selectedFilter === 'qa') { return member.role.includes('QA') }
    if (selectedFilter === 'devops') { return member.role.includes('DevOps') }
    return true
  })

  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter(m => m.status === 'Activo').length,
    available: teamMembers.filter(m => m.availability === 'Disponible').length,
    totalProjects: teamMembers.reduce((acc, m) => acc + m.projectsAssigned, 0)
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 min-h-screen bg-transparent">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold font-bricolage bg-gradient-to-r from-[#08A696] via-[#26FFDF] to-[#08A696] bg-clip-text text-transparent">
            Gestión de Equipo
          </h1>
          <p className="text-slate-400 text-lg mt-2">
            Administra y asigna miembros del equipo a proyectos
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Solo admin puede agregar miembros */}
          {userRole === 'admin' && (
            <Button className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl px-6 py-3 text-[#26FFDF] hover:bg-background/20 hover:border-[#08A696] transition-all duration-300">
              <UserPlus className="w-5 h-5 mr-2" />
              Agregar Miembro
            </Button>
          )}
          <Button 
            onClick={handleLogout}
            className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl px-4 py-3 text-[#26FFDF] hover:bg-background/20 hover:border-[#08A696] transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="container mx-auto px-6 py-8">


        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="p-6 bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl hover:bg-background/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Miembros</p>
                <p className="text-2xl font-bold text-[#26FFDF]">{stats.total}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#08A696]/20 to-[#26FFDF]/20 rounded-xl border border-[#08A696]/30">
                <Users className="w-6 h-6 text-[#26FFDF]" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl hover:bg-background/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Activos</p>
                <p className="text-2xl font-bold text-[#26FFDF]">{stats.active}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#08A696]/20 to-[#26FFDF]/20 rounded-xl border border-[#08A696]/30">
                <Shield className="w-6 h-6 text-[#26FFDF]" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl hover:bg-background/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Disponibles</p>
                <p className="text-2xl font-bold text-[#26FFDF]">{stats.available}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#08A696]/20 to-[#26FFDF]/20 rounded-xl border border-[#08A696]/30">
                <Users className="w-6 h-6 text-[#26FFDF]" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl hover:bg-background/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Proyectos Asignados</p>
                <p className="text-2xl font-bold text-[#26FFDF]">{stats.totalProjects}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#08A696]/20 to-[#26FFDF]/20 rounded-xl border border-[#08A696]/30">
                <Code className="w-6 h-6 text-[#26FFDF]" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6 bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-slate-400" />
              <h3 className="font-semibold text-[#26FFDF]">Filtrar por Rol</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {roleFilters.map((filter) => {
                const Icon = filter.icon
                return (
                  <Button
                    key={filter.id}
                    variant={selectedFilter === filter.id ? "default" : "outline"}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`rounded-2xl transition-all duration-300 ${
                      selectedFilter === filter.id
                        ? 'bg-[#02505931] backdrop-blur-sm border border-[#08A696] text-[#26FFDF]'
                        : 'bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-slate-400 hover:border-[#08A696] hover:text-[#26FFDF]'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {filter.label}
                  </Button>
                )
              })}
            </div>
          </Card>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-[#26FFDF] mx-auto" />
              <p className="text-slate-400">Cargando miembros del equipo...</p>
            </div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <Card className="p-12 bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl text-center">
            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">
              No hay miembros del equipo
            </h3>
            <p className="text-slate-500 mb-6">
              No se encontraron usuarios con rol "team" o "admin" en la base de datos
            </p>
            <Button className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] hover:from-[#26FFDF] hover:to-[#08A696] text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Primer Miembro
            </Button>
          </Card>
        ) : (
          /* Team Members Grid */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="p-6 bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl hover:bg-background/20 transition-all duration-300 group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#08A696]/20 to-[#26FFDF]/20 rounded-2xl flex items-center justify-center text-[#26FFDF] font-bold text-xl border border-[#08A696]/30">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#26FFDF] text-lg">{member.name}</h3>
                    <p className="text-slate-400 text-sm">{member.userRole || member.role}</p>
                    <p className="text-slate-500 text-xs mt-1">{member.email}</p>
                    <Badge 
                      className={`mt-1 text-xs ${
                        member.role === 'admin' 
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      {member.role === 'admin' ? '👑 Admin' : '👤 Team'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Estado:</span>
                    <Badge 
                      variant={member.status === 'Activo' ? 'default' : 'secondary'}
                      className={`rounded-2xl ${
                        member.status === 'Activo' 
                          ? 'bg-[#08A696]/20 text-[#26FFDF] border border-[#08A696]/30' 
                          : 'bg-background/20 text-slate-400 border border-slate-600/30'
                      }`}
                    >
                      {member.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Proyectos:</span>
                    <span className="font-semibold text-[#26FFDF]">{member.projectsAssigned}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Disponibilidad:</span>
                    <Badge 
                      variant={member.availability === 'Disponible' ? 'default' : 'secondary'}
                      className={`rounded-2xl ${
                        member.availability === 'Disponible' 
                          ? 'bg-[#08A696]/20 text-[#26FFDF] border border-[#08A696]/30' 
                          : 'bg-background/20 text-slate-400 border border-slate-600/30'
                      }`}
                    >
                      {member.availability}
                    </Badge>
                  </div>
                </div>

                {/* Solo admin puede ver estos botones */}
                {userRole === 'admin' && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleOpenProfileDialog(member)}
                      className="flex-1 bg-white/90 dark:bg-[#02505931] backdrop-blur-sm border border-[#08A696]/60 dark:border-[#08A696]/30 rounded-2xl text-[#08A696] dark:text-[#26FFDF] shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#08A696]/10 dark:hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Perfil
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleOpenAssignDialog(member)}
                      className="flex-1 bg-white/90 dark:bg-[#02505931] backdrop-blur-sm border border-[#08A696]/60 dark:border-[#08A696]/30 rounded-2xl text-[#08A696] dark:text-[#26FFDF] shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#08A696]/10 dark:hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Asignar
                    </Button>
                  </div>
                )}

                {/* Para usuarios team, mostrar un mensaje o nada */}
                {userRole === 'team' && (
                  <div className="text-center py-3">
                    <p className="text-xs text-slate-500 italic">
                      Solo administradores pueden gestionar miembros
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="bg-background/95 backdrop-blur-xl border-[#08A696]/30 rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#08A696] to-[#26FFDF] bg-clip-text text-transparent">
              Perfil del Miembro
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Información detallada del miembro del equipo
            </DialogDescription>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-6 mt-4">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-r from-[#08A696]/20 to-[#26FFDF]/20 rounded-2xl flex items-center justify-center text-[#26FFDF] font-bold text-2xl border-2 border-[#08A696]/30">
                  {selectedMember.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#26FFDF]">{selectedMember.name}</h3>
                  <p className="text-slate-400">{selectedMember.userRole || selectedMember.role}</p>
                  <Badge 
                    className={`mt-1 ${
                      selectedMember.role === 'admin' 
                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {selectedMember.role === 'admin' ? '👑 Admin' : '👤 Team'}
                  </Badge>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 pt-4 border-t border-[#08A696]/20">
                <div className="flex items-center gap-3 p-3 bg-[#02505931] rounded-xl border border-[#08A696]/20">
                  <Mail className="w-5 h-5 text-[#26FFDF]" />
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="text-sm text-[#26FFDF]">{selectedMember.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#02505931] rounded-xl border border-[#08A696]/20">
                  <Briefcase className="w-5 h-5 text-[#26FFDF]" />
                  <div>
                    <p className="text-xs text-slate-400">Proyectos Asignados</p>
                    <p className="text-sm text-[#26FFDF] font-bold">{selectedMember.projectsAssigned}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#02505931] rounded-xl border border-[#08A696]/20">
                  <Calendar className="w-5 h-5 text-[#26FFDF]" />
                  <div>
                    <p className="text-xs text-slate-400">Disponibilidad</p>
                    <Badge 
                      className={`rounded-2xl ${
                        selectedMember.availability === 'Disponible' 
                          ? 'bg-[#08A696]/20 text-[#26FFDF] border border-[#08A696]/30' 
                          : 'bg-background/20 text-slate-400 border border-slate-600/30'
                      }`}
                    >
                      {selectedMember.availability}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#02505931] rounded-xl border border-[#08A696]/20">
                  <Users className="w-5 h-5 text-[#26FFDF]" />
                  <div>
                    <p className="text-xs text-slate-400">Estado</p>
                    <Badge 
                      className={`rounded-2xl ${
                        selectedMember.status === 'Activo' 
                          ? 'bg-[#08A696]/20 text-[#26FFDF] border border-[#08A696]/30' 
                          : 'bg-background/20 text-slate-400 border border-slate-600/30'
                      }`}
                    >
                      {selectedMember.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setShowProfileDialog(false)}
                className="w-full bg-gradient-to-r from-[#08A696] to-[#26FFDF] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl"
              >
                Cerrar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Task Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="bg-background/95 backdrop-blur-xl border-[#08A696]/30 rounded-2xl max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#08A696] to-[#26FFDF] bg-clip-text text-transparent">
              Asignar Tarea
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Selecciona una tarea para asignar a {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>

          {loadingTasks ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#26FFDF]" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No hay tareas disponibles</p>
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              {tasks.map((task) => (
                <Card 
                  key={task.id}
                  className="p-4 bg-[#02505931] border-[#08A696]/20 rounded-xl hover:bg-[#02505950] hover:border-[#08A696]/40 transition-all duration-300 cursor-pointer"
                  onClick={() => handleAssignTask(task.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          className={`text-xs ${
                            task.priority === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                            task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }`}
                        >
                          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                        </Badge>
                        <Badge 
                          className={`text-xs ${
                            task.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            'bg-slate-500/20 text-slate-400 border-slate-500/30'
                          }`}
                        >
                          {task.status === 'completed' ? 'Completada' : 
                           task.status === 'in_progress' ? 'En Progreso' : 'Pendiente'}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-[#26FFDF] mb-1">
                        {task.title || 'Tarea sin título'}
                      </h4>
                      <p className="text-sm text-slate-400 mb-2">
                        {task.description || 'Sin descripción'}
                      </p>
                      {task.projects && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Briefcase className="w-3 h-3" />
                          <span>{task.projects.name}</span>
                          {task.projects.client_name && (
                            <span className="text-slate-600">• {task.projects.client_name}</span>
                          )}
                        </div>
                      )}
                      {task.assigned_to && (
                        <p className="text-xs text-amber-400 mt-2">
                          Actualmente asignada a: {task.assigned_to}
                        </p>
                      )}
                    </div>
                    <Button 
                      size="sm"
                      className="ml-4 bg-gradient-to-r from-[#08A696] to-[#26FFDF] hover:scale-105 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAssignTask(task.id)
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Asignar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <Button 
            variant="outline"
            onClick={() => setShowAssignDialog(false)}
            className="w-full mt-4 bg-[#02505931] border-[#08A696]/30 text-[#26FFDF] hover:bg-[#02505950] hover:border-[#08A696] rounded-xl"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}