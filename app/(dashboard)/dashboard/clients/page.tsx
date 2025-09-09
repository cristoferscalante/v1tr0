'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth'
import { 
  Users, 
  Plus, 
  Eye, 
  Edit, 
  Building2, 
  DollarSign, 
  FolderOpen,
  Filter,
  LogOut
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Client {
  id: string
  name: string
  status: 'active' | 'paused' | 'completed'
  projects: number
  totalValue: number
  email: string
  phone: string
  lastActivity: string
}

const clients: Client[] = [
  {
    id: '1',
    name: 'V1TR0 Technologies',
    status: 'active',
    projects: 3,
    totalValue: 75000,
    email: 'contact@v1tr0.com',
    phone: '+1 (555) 123-4567',
    lastActivity: '2024-01-15'
  },
  {
    id: '2',
    name: 'TechCorp S.A.',
    status: 'active',
    projects: 2,
    totalValue: 45000,
    email: 'info@techcorp.com',
    phone: '+1 (555) 234-5678',
    lastActivity: '2024-01-14'
  },
  {
    id: '3',
    name: 'Retail Plus',
    status: 'paused',
    projects: 1,
    totalValue: 25000,
    email: 'admin@retailplus.com',
    phone: '+1 (555) 345-6789',
    lastActivity: '2024-01-10'
  },
  {
    id: '4',
    name: 'BusinessPro',
    status: 'completed',
    projects: 1,
    totalValue: 35000,
    email: 'hello@businesspro.com',
    phone: '+1 (555) 456-7890',
    lastActivity: '2024-01-08'
  },
  {
    id: '5',
    name: 'StartupXYZ',
    status: 'active',
    projects: 2,
    totalValue: 50000,
    email: 'team@startupxyz.com',
    phone: '+1 (555) 567-8901',
    lastActivity: '2024-01-12'
  }
]

const statusConfig = {
  active: { label: 'Activo', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  paused: { label: 'En pausa', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  completed: { label: 'Completado', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
}

const filterOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'paused', label: 'En pausa' },
  { value: 'completed', label: 'Completados' }
]

export default function ClientsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const { signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const filteredClients = clients.filter(client => 
    selectedFilter === 'all' || client.status === selectedFilter
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 min-h-screen bg-transparent">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bricolage font-bold bg-gradient-to-r from-[#08A696] via-[#26FFDF] to-[#08A696] bg-clip-text text-transparent mb-2">
              Gestión de Clientes
            </h1>
            <p className="text-slate-400 text-lg">
              Administra y supervisa todos tus clientes
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] hover:from-[#26FFDF] hover:to-[#08A696] text-slate-900 font-semibold px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Cliente
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Clientes</p>
                  <p className="text-2xl font-bold text-white">{clients.length}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-[#08A696]/20 to-[#26FFDF]/20 rounded-xl">
                  <Users className="w-6 h-6 text-[#26FFDF]" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Clientes Activos</p>
                  <p className="text-2xl font-bold text-white">
                    {clients.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500/20 to-green-400/20 rounded-xl">
                  <Building2 className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-background/10 backdrop-blur-md border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Proyectos Totales</p>
                  <p className="text-2xl font-bold text-white">
                    {clients.reduce((sum, client) => sum + client.projects, 0)}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500/20 to-blue-400/20 rounded-xl">
                  <FolderOpen className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-background/10 backdrop-blur-md border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Valor Total</p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(clients.reduce((sum, client) => sum + client.totalValue, 0))}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 rounded-xl">
                  <DollarSign className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <span className="text-slate-400 font-medium">Filtrar por estado:</span>
          </div>
          <div className="flex gap-2">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedFilter === option.value ? "default" : "outline"}
                onClick={() => setSelectedFilter(option.value)}
                className={`rounded-2xl transition-all duration-300 ${
                  selectedFilter === option.value
                    ? 'bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-slate-900 font-semibold'
                    : 'bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-slate-300 hover:bg-background/20 hover:border-[#08A696]'
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Clients Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredClients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <Card className="bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl p-6 hover:bg-background/20 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#26FFDF] transition-colors duration-300">
                    {client.name}
                  </h3>
                  <Badge className={`${statusConfig[client.status].color} border rounded-lg px-3 py-1`}>
                    {statusConfig[client.status].label}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Proyectos:</span>
                  <span className="text-white font-semibold">{client.projects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Valor total:</span>
                  <span className="text-[#26FFDF] font-bold">{formatCurrency(client.totalValue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Email:</span>
                  <span className="text-white text-sm">{client.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Teléfono:</span>
                  <span className="text-white text-sm">{client.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Última actividad:</span>
                  <span className="text-white text-sm">{client.lastActivity}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-slate-300 hover:bg-background/20 hover:border-[#08A696] rounded-2xl transition-all duration-300"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-slate-300 hover:bg-background/20 hover:border-[#08A696] rounded-2xl transition-all duration-300"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredClients.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">
            No se encontraron clientes
          </h3>
          <p className="text-slate-500">
            No hay clientes que coincidan con el filtro seleccionado.
          </p>
        </motion.div>
      )}
    </div>
  )
}