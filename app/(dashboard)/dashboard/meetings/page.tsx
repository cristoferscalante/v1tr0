'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  MapPin, 
  Phone,
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  LogOut 
} from 'lucide-react'

interface Meeting {
  id: string
  title: string
  type: 'Presencial' | 'Virtual' | 'Híbrida'
  status: 'Programada' | 'En Curso' | 'Completada' | 'Cancelada'
  date: string
  time: string
  duration: number
  location?: string
  meetingLink?: string
  attendees: string[]
  project?: string
  description: string
  organizer: string
}

const meetings: Meeting[] = [
  {
    id: '1',
    title: 'Revisión de Progreso - V1TR0',
    type: 'Virtual',
    status: 'Programada',
    date: '2024-01-25',
    time: '10:00',
    duration: 60,
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    attendees: ['Ana García', 'Carlos López', 'María Silva', 'Cliente TechCorp'],
    project: 'Desarrollo Web V1TR0',
    description: 'Revisión semanal del progreso del proyecto y planificación de próximas tareas',
    organizer: 'Juan Pérez'
  },
  {
    id: '2',
    title: 'Presentación de Propuesta - EcoTrack',
    type: 'Presencial',
    status: 'Programada',
    date: '2024-01-26',
    time: '14:30',
    duration: 90,
    location: 'Sala de Juntas A - Oficina Principal',
    attendees: ['Juan Pérez', 'María Silva', 'Cliente GreenTech'],
    project: 'App Móvil EcoTrack',
    description: 'Presentación de la propuesta final y demo de la aplicación móvil',
    organizer: 'Juan Pérez'
  },
  {
    id: '3',
    title: 'Daily Standup - Equipo Backend',
    type: 'Virtual',
    status: 'En Curso',
    date: '2024-01-24',
    time: '09:00',
    duration: 30,
    meetingLink: 'https://zoom.us/j/123456789',
    attendees: ['Carlos López', 'Diego Ruiz', 'Ana García'],
    description: 'Reunión diaria del equipo de desarrollo backend',
    organizer: 'Carlos López'
  },
  {
    id: '4',
    title: 'Retrospectiva Sprint 3',
    type: 'Híbrida',
    status: 'Completada',
    date: '2024-01-22',
    time: '16:00',
    duration: 120,
    location: 'Sala de Juntas B',
    meetingLink: 'https://teams.microsoft.com/meet/xyz',
    attendees: ['Todo el equipo', 'Product Owner'],
    project: 'Sistema CRM Empresarial',
    description: 'Retrospectiva del sprint completado y planificación de mejoras',
    organizer: 'Juan Pérez'
  },
  {
    id: '5',
    title: 'Capacitación UX/UI Design',
    type: 'Virtual',
    status: 'Programada',
    date: '2024-01-27',
    time: '11:00',
    duration: 180,
    meetingLink: 'https://meet.google.com/training-ux',
    attendees: ['María Silva', 'Ana García', 'Carlos López'],
    description: 'Sesión de capacitación en nuevas tendencias de diseño UX/UI',
    organizer: 'María Silva'
  },
  {
    id: '6',
    title: 'Reunión con Cliente - StyleMart',
    type: 'Presencial',
    status: 'Cancelada',
    date: '2024-01-23',
    time: '15:00',
    duration: 60,
    location: 'Oficina del Cliente',
    attendees: ['Juan Pérez', 'María Silva'],
    project: 'E-commerce Fashion Hub',
    description: 'Reunión de seguimiento post-entrega del proyecto',
    organizer: 'Juan Pérez'
  }
]

const typeFilters = [
  { id: 'all', label: 'Todas' },
  { id: 'virtual', label: 'Virtual' },
  { id: 'presencial', label: 'Presencial' },
  { id: 'hibrida', label: 'Híbrida' }
]

const statusFilters = [
  { id: 'all', label: 'Todos' },
  { id: 'programada', label: 'Programadas' },
  { id: 'curso', label: 'En Curso' },
  { id: 'completada', label: 'Completadas' },
  { id: 'cancelada', label: 'Canceladas' }
]

export default function MeetingsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const { signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }
  
  const filteredMeetings = meetings.filter(meeting => {
    const matchesType = typeFilter === 'all' || 
      (typeFilter === 'virtual' && meeting.type === 'Virtual') ||
      (typeFilter === 'presencial' && meeting.type === 'Presencial') ||
      (typeFilter === 'hibrida' && meeting.type === 'Híbrida')
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'programada' && meeting.status === 'Programada') ||
      (statusFilter === 'curso' && meeting.status === 'En Curso') ||
      (statusFilter === 'completada' && meeting.status === 'Completada') ||
      (statusFilter === 'cancelada' && meeting.status === 'Cancelada')
    
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.project?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.organizer.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesType && matchesStatus && matchesSearch
  })

  const stats = {
    total: meetings.length,
    scheduled: meetings.filter(m => m.status === 'Programada').length,
    inProgress: meetings.filter(m => m.status === 'En Curso').length,
    completed: meetings.filter(m => m.status === 'Completada').length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Programada': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'En Curso': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Completada': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      case 'Cancelada': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Virtual': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'Presencial': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'Híbrida': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Virtual': return Video
      case 'Presencial': return MapPin
      case 'Híbrida': return Phone
      default: return Calendar
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 min-h-screen bg-transparent">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bricolage font-bold bg-gradient-to-r from-[#08A696] via-[#26FFDF] to-[#08A696] bg-clip-text text-transparent">
                Gestión de Reuniones
              </h1>
              <p className="text-slate-400 text-lg mt-2">
                Programa y administra todas las reuniones del equipo
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl px-6 py-3 font-semibold transition-all duration-300 hover:bg-background/20 hover:border-[#08A696] text-[#26FFDF]">
                <Plus className="w-5 h-5 mr-2" />
                Nueva Reunión
              </Button>
              <Button 
                onClick={handleLogout}
                className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl px-4 py-3 font-semibold transition-all duration-300 hover:bg-background/20 hover:border-[#08A696] text-[#26FFDF]"
              >
                <LogOut className="w-5 h-5" />
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
          <Card className="p-6 bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Reuniones</p>
                <p className="text-2xl font-bold text-[#26FFDF]">{stats.total}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#08A696]/20 to-[#26FFDF]/20 rounded-xl">
                <Calendar className="w-6 h-6 text-[#26FFDF]" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Programadas</p>
                <p className="text-2xl font-bold text-[#26FFDF]">{stats.scheduled}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#08A696]/20 to-[#26FFDF]/20 rounded-xl">
                <Clock className="w-6 h-6 text-[#26FFDF]" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">En Curso</p>
                <p className="text-2xl font-bold text-[#26FFDF]">{stats.inProgress}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#08A696]/20 to-[#26FFDF]/20 rounded-xl">
                <Video className="w-6 h-6 text-[#26FFDF]" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Completadas</p>
                <p className="text-2xl font-bold text-[#26FFDF]">{stats.completed}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#08A696]/20 to-[#26FFDF]/20 rounded-xl">
                <Users className="w-6 h-6 text-[#26FFDF]" />
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
          <Card className="p-6 bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl shadow-lg">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar reuniones, proyectos o organizadores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#26FFDF] focus:border-[#08A696] transition-all duration-300 text-[#26FFDF] placeholder:text-slate-400"
                  />
                </div>
              </div>
              
              {/* Type Filter */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-400">Tipo</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {typeFilters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={typeFilter === filter.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTypeFilter(filter.id)}
                      className={`rounded-2xl transition-all duration-300 ${
                        typeFilter === filter.id
                          ? 'bg-[#02505931] backdrop-blur-sm border border-[#08A696] text-[#26FFDF]'
                          : 'bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-slate-400 hover:border-[#08A696] hover:text-[#26FFDF]'
                      }`}
                    >
                      {filter.label}
                    </Button>
                  ))}
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
                      className={`rounded-2xl transition-all duration-300 ${
                        statusFilter === filter.id
                          ? 'bg-[#02505931] backdrop-blur-sm border border-[#08A696] text-[#26FFDF]'
                          : 'bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-slate-400 hover:border-[#08A696] hover:text-[#26FFDF]'
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

        {/* Meetings Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredMeetings.map((meeting, index) => {
            const TypeIcon = getTypeIcon(meeting.type)
            return (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 hover:bg-background/20 hover:border-[#08A696]">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-[#26FFDF] text-lg mb-1">{meeting.title}</h3>
                      <p className="text-slate-400 text-sm mb-2">Organizado por {meeting.organizer}</p>
                      {meeting.project && (
                        <p className="text-slate-400 text-xs mb-2">Proyecto: {meeting.project}</p>
                      )}
                      <p className="text-slate-400 text-xs">{meeting.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-2xl hover:bg-background/20 text-slate-400 hover:text-[#26FFDF]">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge className={`rounded-lg ${getStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </Badge>
                        <Badge className={`rounded-lg ${getTypeColor(meeting.type)}`}>
                          <TypeIcon className="w-3 h-3 mr-1" />
                          {meeting.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-400">{new Date(meeting.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-400">{meeting.time} ({meeting.duration}min)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-400">{meeting.attendees.length} asistentes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {meeting.location ? (
                          <>
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-400 text-xs truncate">{meeting.location}</span>
                          </>
                        ) : (
                          <>
                            <Video className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-400 text-xs">Virtual</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 mb-2">Asistentes:</p>
                      <div className="flex flex-wrap gap-1">
                        {meeting.attendees.slice(0, 3).map((attendee, idx) => (
                          <Badge key={idx} className="text-xs rounded-2xl bg-[#02505931] border border-[#08A696]/30 text-slate-400">
                            {attendee}
                          </Badge>
                        ))}
                        {meeting.attendees.length > 3 && (
                          <Badge className="text-xs rounded-2xl bg-[#02505931] border border-[#08A696]/30 text-slate-400">
                            +{meeting.attendees.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 rounded-2xl bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-slate-400 hover:border-[#08A696] hover:text-[#26FFDF] transition-all duration-300"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalles
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-2xl bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-slate-400 hover:border-[#08A696] hover:text-[#26FFDF] transition-all duration-300"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-2xl bg-[#02505931] backdrop-blur-sm border border-red-500/30 text-red-400 hover:border-red-500 hover:text-red-300 transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}