'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  FolderOpen, 
  Plus, 
  Calendar, 
  Users, 
  DollarSign,
  Clock,
  Filter,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  LogOut
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

interface Project {
  id: string
  name: string
  client: string
  status: 'En Progreso' | 'Completado' | 'Pausado' | 'Planificación'
  priority: 'Alta' | 'Media' | 'Baja'
  progress: number
  startDate: string
  endDate: string
  budget: number
  teamSize: number
  description: string
}

const projects: Project[] = [
  {
    id: '1',
    name: 'Desarrollo Web V1TR0',
    client: 'TechCorp Solutions',
    status: 'En Progreso',
    priority: 'Alta',
    progress: 75,
    startDate: '2024-01-15',
    endDate: '2024-03-30',
    budget: 45000,
    teamSize: 5,
    description: 'Plataforma web completa con dashboard administrativo y portal de clientes'
  },
  {
    id: '2',
    name: 'App Móvil EcoTrack',
    client: 'GreenTech Inc',
    status: 'En Progreso',
    priority: 'Alta',
    progress: 60,
    startDate: '2024-02-01',
    endDate: '2024-04-15',
    budget: 38000,
    teamSize: 4,
    description: 'Aplicación móvil para seguimiento de huella de carbono personal'
  },
  {
    id: '3',
    name: 'Sistema CRM Empresarial',
    client: 'BusinessFlow Ltd',
    status: 'Planificación',
    priority: 'Media',
    progress: 15,
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    budget: 62000,
    teamSize: 6,
    description: 'Sistema de gestión de relaciones con clientes con IA integrada'
  },
  {
    id: '4',
    name: 'E-commerce Fashion Hub',
    client: 'StyleMart',
    status: 'Completado',
    priority: 'Alta',
    progress: 100,
    startDate: '2023-10-01',
    endDate: '2024-01-15',
    budget: 52000,
    teamSize: 5,
    description: 'Plataforma de comercio electrónico para moda con AR virtual'
  },
  {
    id: '5',
    name: 'Portal Educativo Online',
    client: 'EduLearn Academy',
    status: 'En Progreso',
    priority: 'Media',
    progress: 40,
    startDate: '2024-01-20',
    endDate: '2024-05-20',
    budget: 35000,
    teamSize: 4,
    description: 'Plataforma de aprendizaje online con videoconferencias integradas'
  },
  {
    id: '6',
    name: 'Sistema IoT Industrial',
    client: 'IndusTech Corp',
    status: 'Pausado',
    priority: 'Baja',
    progress: 25,
    startDate: '2024-02-15',
    endDate: '2024-07-15',
    budget: 78000,
    teamSize: 7,
    description: 'Sistema de monitoreo IoT para maquinaria industrial'
  }
]

const statusFilters = [
  { id: 'all', label: 'Todos' },
  { id: 'progress', label: 'En Progreso' },
  { id: 'completed', label: 'Completados' },
  { id: 'planning', label: 'Planificación' },
  { id: 'paused', label: 'Pausados' }
]

const priorityFilters = [
  { id: 'all', label: 'Todas' },
  { id: 'high', label: 'Alta' },
  { id: 'medium', label: 'Media' },
  { id: 'low', label: 'Baja' }
]

export default function ProjectsPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }
  
  const filteredProjects = projects.filter(project => {
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'progress' && project.status === 'En Progreso') ||
      (statusFilter === 'completed' && project.status === 'Completado') ||
      (statusFilter === 'planning' && project.status === 'Planificación') ||
      (statusFilter === 'paused' && project.status === 'Pausado')
    
    const matchesPriority = priorityFilter === 'all' || 
      (priorityFilter === 'high' && project.priority === 'Alta') ||
      (priorityFilter === 'medium' && project.priority === 'Media') ||
      (priorityFilter === 'low' && project.priority === 'Baja')
    
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesPriority && matchesSearch
  })

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'En Progreso').length,
    completed: projects.filter(p => p.status === 'Completado').length,
    totalBudget: projects.reduce((acc, p) => acc + p.budget, 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En Progreso': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Completado': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Pausado': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'Planificación': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'Media': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Baja': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
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
            <Button className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] hover:from-[#26FFDF] hover:to-[#08A696] text-slate-900 font-semibold px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl">
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
                <p className="text-sm text-slate-600 dark:text-slate-400">En Progreso</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.inProgress}</p>
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
                <p className="text-sm text-slate-600 dark:text-slate-400">Presupuesto Total</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">${stats.totalBudget.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
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
            
            {/* Priority Filter */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-400">Prioridad</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {priorityFilters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={priorityFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPriorityFilter(filter.id)}
                    className={`rounded-xl transition-all duration-300 ${
                      priorityFilter === filter.id
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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl p-6 hover:bg-background/20 hover:border-[#08A696] transition-all duration-300 group hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-[#26FFDF] text-lg mb-1">{project.name}</h3>
                  <p className="text-slate-400 text-sm mb-2">{project.client}</p>
                  <p className="text-slate-400 text-xs">{project.description}</p>
                </div>
                <Button variant="ghost" size="sm" className="rounded-xl text-slate-400 hover:text-[#26FFDF]">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge className={`rounded-lg ${getStatusColor(project.status)}`}>
                      {project.status}
                    </Badge>
                    <Badge className={`rounded-lg ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </Badge>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Progreso</span>
                    <span className="text-sm font-semibold text-[#26FFDF]">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400">{new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400">{project.teamSize} miembros</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400">${project.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400">{new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-[#26FFDF] hover:bg-background/20 hover:border-[#08A696] rounded-2xl transition-all duration-300"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalles
                </Button>
                <Button 
                  size="sm" 
                  className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-[#26FFDF] hover:bg-background/20 hover:border-[#08A696] rounded-2xl transition-all duration-300"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  className="bg-[#02505931] backdrop-blur-sm border border-red-500/30 text-red-400 hover:bg-background/20 hover:border-red-500 rounded-2xl transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}