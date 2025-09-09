'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter,
  Paperclip,
  MoreHorizontal,
  Star,
  Circle,
  CheckCheck,
  LogOut
} from 'lucide-react'

interface Message {
  id: string
  sender: string
  recipient: string
  subject: string
  preview: string
  content: string
  timestamp: string
  isRead: boolean
  isStarred: boolean
  hasAttachment: boolean
  priority: 'Alta' | 'Media' | 'Baja'
  type: 'Interno' | 'Cliente' | 'Proveedor'
  project?: string
}

const messages: Message[] = [
  {
    id: '1',
    sender: 'Ana García',
    recipient: 'Equipo Desarrollo',
    subject: 'Actualización del componente Timeline',
    preview: 'He completado las mejoras en el componente Timeline con los nuevos filtros...',
    content: 'He completado las mejoras en el componente Timeline con los nuevos filtros. Los cambios incluyen selección múltiple y mejor UX.',
    timestamp: '2024-01-24T10:30:00',
    isRead: false,
    isStarred: true,
    hasAttachment: false,
    priority: 'Alta',
    type: 'Interno',
    project: 'Desarrollo Web V1TR0'
  },
  {
    id: '2',
    sender: 'Cliente TechCorp',
    recipient: 'Juan Pérez',
    subject: 'Feedback sobre el último demo',
    preview: 'Excelente trabajo en la presentación de ayer. Tenemos algunas sugerencias...',
    content: 'Excelente trabajo en la presentación de ayer. Tenemos algunas sugerencias para mejorar la experiencia de usuario en el dashboard.',
    timestamp: '2024-01-24T09:15:00',
    isRead: false,
    isStarred: false,
    hasAttachment: true,
    priority: 'Alta',
    type: 'Cliente',
    project: 'Desarrollo Web V1TR0'
  },
  {
    id: '3',
    sender: 'Carlos López',
    recipient: 'Diego Ruiz',
    subject: 'Configuración del servidor de producción',
    preview: 'Necesito ayuda con la configuración del servidor para el deploy...',
    content: 'Necesito ayuda con la configuración del servidor para el deploy. ¿Podrías revisar los logs de Docker?',
    timestamp: '2024-01-24T08:45:00',
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    priority: 'Media',
    type: 'Interno'
  },
  {
    id: '4',
    sender: 'María Silva',
    recipient: 'Cliente GreenTech',
    subject: 'Propuesta de diseño - EcoTrack App',
    preview: 'Adjunto los mockups finales de la aplicación móvil...',
    content: 'Adjunto los mockups finales de la aplicación móvil. Hemos incorporado todas las sugerencias del equipo.',
    timestamp: '2024-01-23T16:20:00',
    isRead: true,
    isStarred: true,
    hasAttachment: true,
    priority: 'Alta',
    type: 'Cliente',
    project: 'App Móvil EcoTrack'
  },
  {
    id: '5',
    sender: 'Proveedor CloudHost',
    recipient: 'Diego Ruiz',
    subject: 'Mantenimiento programado del servidor',
    preview: 'Le informamos sobre el mantenimiento programado para el próximo fin de semana...',
    content: 'Le informamos sobre el mantenimiento programado para el próximo fin de semana. El servicio estará interrumpido por 2 horas.',
    timestamp: '2024-01-23T14:10:00',
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    priority: 'Media',
    type: 'Proveedor'
  },
  {
    id: '6',
    sender: 'Laura Martín',
    recipient: 'Equipo QA',
    subject: 'Reporte de bugs - Sprint 3',
    preview: 'He encontrado algunos issues en la última versión que necesitan atención...',
    content: 'He encontrado algunos issues en la última versión que necesitan atención inmediata antes del release.',
    timestamp: '2024-01-23T11:30:00',
    isRead: false,
    isStarred: false,
    hasAttachment: true,
    priority: 'Alta',
    type: 'Interno',
    project: 'Sistema CRM Empresarial'
  }
]

const typeFilters = [
  { id: 'all', label: 'Todos' },
  { id: 'interno', label: 'Internos' },
  { id: 'cliente', label: 'Clientes' },
  { id: 'proveedor', label: 'Proveedores' }
]

const statusFilters = [
  { id: 'all', label: 'Todos' },
  { id: 'unread', label: 'No leídos' },
  { id: 'read', label: 'Leídos' },
  { id: 'starred', label: 'Destacados' }
]

export default function MessagesPage() {
  const router = useRouter()
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const { signOut } = useAuth()
  
  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }
  
  const filteredMessages = messages.filter(message => {
    const matchesType = typeFilter === 'all' || 
      (typeFilter === 'interno' && message.type === 'Interno') ||
      (typeFilter === 'cliente' && message.type === 'Cliente') ||
      (typeFilter === 'proveedor' && message.type === 'Proveedor')
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'unread' && !message.isRead) ||
      (statusFilter === 'read' && message.isRead) ||
      (statusFilter === 'starred' && message.isStarred)
    
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesType && matchesStatus && matchesSearch
  })

  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.isRead).length,
    starred: messages.filter(m => m.isStarred).length,
    clients: messages.filter(m => m.type === 'Cliente').length
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Interno': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Cliente': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Proveedor': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
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

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Hace unos minutos'
    }
    if (diffInHours < 24) {
      return `Hace ${diffInHours}h`
    }
    return date.toLocaleDateString()
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
                Centro de Mensajes
              </h1>
              <p className="text-slate-400 text-lg mt-2">
                Gestiona toda la comunicación del equipo y clientes
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl px-6 py-3 font-semibold transition-all duration-300 hover:bg-background/20 hover:border-[#08A696] text-[#26FFDF]">
                <Plus className="w-5 h-5 mr-2" />
                Nuevo Mensaje
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
          <Card className="p-6 bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl hover:bg-background/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Mensajes</p>
                <p className="text-2xl font-bold text-[#26FFDF]">{stats.total}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#08A696]/20 to-[#26FFDF]/20 rounded-2xl">
                <MessageSquare className="w-6 h-6 text-[#26FFDF]" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl hover:bg-background/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">No Leídos</p>
                <p className="text-2xl font-bold text-[#26FFDF]">{stats.unread}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#08A696]/20 to-[#26FFDF]/20 rounded-2xl">
                <Circle className="w-6 h-6 text-[#26FFDF]" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl hover:bg-background/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Destacados</p>
                <p className="text-2xl font-bold text-[#26FFDF]">{stats.starred}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#08A696]/20 to-[#26FFDF]/20 rounded-2xl">
                <Star className="w-6 h-6 text-[#26FFDF]" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl hover:bg-background/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">De Clientes</p>
                <p className="text-2xl font-bold text-[#26FFDF]">{stats.clients}</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-[#08A696]/20 to-[#26FFDF]/20 rounded-2xl">
                <MessageSquare className="w-6 h-6 text-[#26FFDF]" />
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
          <Card className="p-6 bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar mensajes, remitentes o contenido..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-background/10 border border-[#08A696]/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#26FFDF] focus:border-[#08A696] transition-all duration-300 text-[#26FFDF] placeholder:text-slate-400"
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
                          : 'bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-[#26FFDF] hover:bg-background/20 hover:border-[#08A696]'
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

        {/* Messages List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredMessages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <Card className={`p-6 bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl hover:bg-background/20 transition-all duration-300 cursor-pointer ${
                !message.isRead ? 'border-l-4 border-l-[#26FFDF]' : ''
              }`}

              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#08A696]/20 to-[#26FFDF]/20 rounded-2xl flex items-center justify-center text-[#26FFDF] font-bold text-sm border border-[#08A696]/30">
                    {message.sender.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold text-[#26FFDF] ${
                            !message.isRead ? 'font-bold' : ''
                          }`}>
                            {message.sender}
                          </h3>
                          {message.isStarred && <Star className="w-4 h-4 text-[#26FFDF] fill-current" />}
                          {!message.isRead && <Circle className="w-3 h-3 text-[#26FFDF] fill-current" />}
                        </div>
                        <p className={`text-slate-400 text-sm mb-1 ${
                          !message.isRead ? 'font-semibold' : ''
                        }`}>
                          {message.subject}
                        </p>
                        <p className="text-slate-400 text-sm truncate">
                          {message.preview}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-xs text-slate-400">{formatTime(message.timestamp)}</span>
                        <Button variant="ghost" size="sm" className="rounded-2xl hover:bg-background/20 text-slate-400 hover:text-[#26FFDF]">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge className={`rounded-lg text-xs ${getTypeColor(message.type)}`}>
                          {message.type}
                        </Badge>
                        <Badge className={`rounded-lg text-xs ${getPriorityColor(message.priority)}`}>
                          {message.priority}
                        </Badge>
                        {message.project && (
                          <Badge variant="secondary" className="rounded-lg text-xs">
                            {message.project}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {message.hasAttachment && <Paperclip className="w-4 h-4 text-slate-400" />}
                        {message.isRead && <CheckCheck className="w-4 h-4 text-green-500" />}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions Floating Button */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-3">
          <Button 
            size="lg" 
            className="w-14 h-14 rounded-full bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-[#26FFDF] hover:bg-background/20 hover:border-[#08A696] transition-all duration-300"
          >
            <MessageSquare className="w-6 h-6" />
          </Button>
        </div>
    </div>
  )
}