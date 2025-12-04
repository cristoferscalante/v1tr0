'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FolderOpen, 
  Plus, 
  Calendar, 
  DollarSign,
  Clock,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  LogOut,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { ProjectDialog } from '@/components/dashboard/project-dialog'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Project {
  id: string
  name: string
  description?: string
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  client_id?: string
  created_at: string
  updated_at: string
  client?: {
    name: string
  }
}

const statusFilters = [
  { id: 'all', label: 'Todos' },
  { id: 'active', label: 'Activos' },
  { id: 'completed', label: 'Completados' },
  { id: 'paused', label: 'Pausados' },
  { id: 'cancelled', label: 'Cancelados' }
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<string | undefined>(undefined)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const { signOut } = useAuth()

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:profiles(name)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setProjects(data || [])
    } catch (error) {
      console.error('Error al cargar proyectos:', error)
      toast.error('Error al cargar los proyectos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const handleNewProject = () => {
    setEditingProject(undefined)
    setDialogOpen(true)
  }

  const handleEditProject = (projectId: string) => {
    setEditingProject(projectId)
    setDialogOpen(true)
  }

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) {
      return
    }

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectToDelete)

      if (error) {
        throw error
      }

      toast.success('Proyecto eliminado exitosamente')
      fetchProjects()
      setDeleteDialogOpen(false)
      setProjectToDelete(null)
    } catch (error) {
      console.error('Error al eliminar proyecto:', error)
      toast.error('Error al eliminar el proyecto')
    } finally {
      setDeleting(false)
    }
  }
  
  const filteredProjects = projects.filter(project => {
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.client?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    paused: projects.filter(p => p.status === 'paused').length
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo'
      case 'completed': return 'Completado'
      case 'paused': return 'Pausado'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'paused': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 min-h-screen bg-transparent">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bricolage font-bold bg-gradient-to-r from-[#08A696] via-[#26FFDF] to-[#08A696] bg-clip-text text-transparent">
              Gestión de Proyectos
            </h1>
            <p className="text-slate-400 text-lg">
              Administra y supervisa todos los proyectos de la empresa
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleNewProject}
              className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] hover:from-[#26FFDF] hover:to-[#08A696] text-slate-900 font-semibold px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Proyecto
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-[#26FFDF] hover:bg-background/20 hover:border-[#08A696] px-4 py-2 rounded-2xl transition-all duration-300 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <Card className="bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Proyectos</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#08A696] to-[#26FFDF] rounded-xl">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

        <Card className="bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Activos</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.active}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

        <Card className="bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Completados</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completed}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

        <Card className="bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Pausados</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.paused}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

      {/* Filters and Search */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card className="bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar proyectos o clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl text-[#26FFDF] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#08A696] focus:border-[#08A696] transition-all duration-300"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-400">Estado</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={statusFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(filter.id)}
                    className={`rounded-xl transition-all duration-300 ${
                      statusFilter === filter.id
                        ? 'bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-white border-0'
                        : 'bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-[#26FFDF] hover:bg-background/20 hover:border-[#08A696]'
                    }`}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-[#08A696]" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <FolderOpen className="w-16 h-16 mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">No hay proyectos</h3>
          <p className="text-slate-400 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'No se encontraron proyectos con los filtros aplicados'
              : 'Comienza creando tu primer proyecto'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Button 
              onClick={handleNewProject}
              className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] hover:from-[#26FFDF] hover:to-[#08A696] text-slate-900 font-semibold rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Proyecto
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <Card className="bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl p-6 hover:bg-background/20 hover:border-[#08A696] transition-all duration-300 group h-full flex flex-col">
                {/* Header Section - Altura fija */}
                <div className="flex items-start justify-between mb-4 min-h-[100px]">
                  <div className="flex-1 min-w-0 flex flex-col">
                    <h3 className="font-bold text-[#26FFDF] text-lg mb-2 line-clamp-2">{project.name}</h3>
                    {project.client ? (
                      <p className="text-slate-400 text-sm mb-2">{project.client.name}</p>
                    ) : (
                      <div className="h-6 mb-2"></div>
                    )}
                    <p className="text-slate-400 text-xs line-clamp-2 flex-1">
                      {project.description || 'Sin descripción'}
                    </p>
                  </div>
                </div>

                {/* Info Section - Altura fija */}
                <div className="space-y-3 mb-6 min-h-[100px]">
                  <div className="flex items-center gap-2">
                    <Badge className={`rounded-lg ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Creado: {formatDate(project.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">
                      {project.updated_at !== project.created_at 
                        ? `Actualizado: ${formatDate(project.updated_at)}`
                        : 'Sin actualizaciones'}
                    </span>
                  </div>
                </div>

                {/* Buttons Section - Siempre al final */}
                <div className="flex gap-2 mt-auto">
                  <Button 
                    size="sm" 
                    onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                    className="flex-1 bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-[#26FFDF] hover:bg-background/20 hover:border-[#08A696] rounded-2xl transition-all duration-300"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleEditProject(project.id)}
                    className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-[#26FFDF] hover:bg-background/20 hover:border-[#08A696] rounded-2xl transition-all duration-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleDeleteClick(project.id)}
                    className="bg-[#02505931] backdrop-blur-sm border border-red-500/30 text-red-400 hover:bg-background/20 hover:border-red-500 rounded-2xl transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Dialogs */}
      <ProjectDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onSuccess={fetchProjects}
        projectId={editingProject || undefined}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-md border-[#08A696]/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-[#26FFDF]">
              <AlertCircle className="w-5 h-5 text-red-400" />
              ¿Eliminar Proyecto?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Esta acción no se puede deshacer. El proyecto y todos sus datos asociados serán eliminados permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={deleting}
              className="bg-[#02505931] backdrop-blur-sm border-[#08A696]/30 text-[#26FFDF] hover:bg-background/20 rounded-xl"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={handleDeleteConfirm}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar Proyecto'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}