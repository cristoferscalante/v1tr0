'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  LogOut
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: string
  status: 'Activo' | 'Inactivo'
  projectsAssigned: number
  availability: 'Disponible' | 'Ocupado'
  avatar: string
  email: string
}

const teamMembers: TeamMember[] = [
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
  const { signOut } = useAuth()

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
          <Button className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl px-6 py-3 text-[#26FFDF] hover:bg-background/20 hover:border-[#08A696] transition-all duration-300">
            <UserPlus className="w-5 h-5 mr-2" />
            Agregar Miembro
          </Button>
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

        {/* Team Members Grid */}
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
                    <p className="text-slate-400 text-sm">{member.role}</p>
                    <p className="text-slate-500 text-xs mt-1">{member.email}</p>
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

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-white/90 dark:bg-[#02505931] backdrop-blur-sm border border-[#08A696]/60 dark:border-[#08A696]/30 rounded-2xl text-[#08A696] dark:text-[#26FFDF] shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#08A696]/10 dark:hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Perfil
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-white/90 dark:bg-[#02505931] backdrop-blur-sm border border-[#08A696]/60 dark:border-[#08A696]/30 rounded-2xl text-[#08A696] dark:text-[#26FFDF] shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#08A696]/10 dark:hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Asignar
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}