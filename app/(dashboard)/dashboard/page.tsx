"use client"

import React from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Plus, 
  CheckCircleIcon,
  TrendingUpIcon,
  Users,
  FolderOpen,
  UserCheck,
  Calendar,
  MessageSquare,
  Building2,
  DollarSign,
  LogOut
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
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

  const navigationCards = [
    {
      title: 'Clientes',
      description: '5 activos',
      icon: Users,
      href: '/dashboard/clients',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-400'
    },
    {
      title: 'Proyectos',
      description: '8 en curso',
      icon: FolderOpen,
      href: '/dashboard/projects',
      gradient: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-400'
    },
    {
      title: 'Equipo',
      description: '12 miembros',
      icon: UserCheck,
      href: '/dashboard/team',
      gradient: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-400'
    },
    {
      title: 'Reuniones',
      description: '3 hoy',
      icon: Calendar,
      href: '/dashboard/meetings',
      gradient: 'from-orange-500/20 to-red-500/20',
      iconColor: 'text-orange-400'
    },
    {
      title: 'Mensajes',
      description: '15 nuevos',
      icon: MessageSquare,
      href: '/dashboard/messages',
      gradient: 'from-indigo-500/20 to-blue-500/20',
      iconColor: 'text-indigo-400'
    }
  ]

  const quickStats = [
    {
      title: 'Total Clientes',
      value: '25',
      icon: Building2,
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Proyectos Activos',
      value: '8',
      icon: FolderOpen,
      change: '+3',
      changeType: 'positive' as const
    },
    {
      title: 'Ingresos del Mes',
      value: '$45,000',
      icon: DollarSign,
      change: '+18%',
      changeType: 'positive' as const
    },
    {
      title: 'Tareas Completadas',
      value: '156',
      icon: CheckCircleIcon,
      change: '+24',
      changeType: 'positive' as const
    }
  ]





  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 min-h-screen bg-transparent">
      {/* Header mejorado con estilo del home */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#08A696] via-[#26FFDF] to-[#08A696] bg-clip-text text-transparent font-bricolage">
            Panel de Administración
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Gestiona clientes, proyectos, equipo y recursos desde un solo lugar
          </p>
        </div>
        
        {/* Botones con estilo del home */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-2xl blur opacity-40 group-hover:opacity-60 transition-all duration-300" />
            <Button className="relative bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl transition-all duration-300 transform scale-95 hover:scale-100 hover:border-[#08A696] hover:bg-[#02505950] text-[#26FFDF] inline-flex items-center px-6 py-3 font-semibold shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 group-hover:translate-y-[-2px]">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </div>
          
          {/* Botón de Cerrar Sesión */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-2xl blur opacity-40 group-hover:opacity-60 transition-all duration-300" />
            <Button 
              onClick={handleLogout}
              className="relative bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl transition-all duration-300 transform scale-95 hover:scale-100 hover:border-[#08A696] hover:bg-[#02505950] text-[#26FFDF] inline-flex items-center px-6 py-3 font-semibold shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 group-hover:translate-y-[-2px]"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Navigation Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {navigationCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={card.href}>
                <Card className="bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl p-6 hover:bg-background/20 transition-all duration-300 cursor-pointer group h-full">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`bg-gradient-to-br ${card.gradient} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 ${card.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white font-bricolage">
                        {card.title}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl p-6 hover:bg-background/20 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-white mt-1 font-bricolage">{stat.value}</p>
                    <p className={`text-sm mt-1 flex items-center ${
                      stat.changeType === 'positive' ? 'text-[#26FFDF]' : 'text-red-400'
                    }`}>
                      <TrendingUpIcon className="w-4 h-4 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-[#08A696]/20 to-[#26FFDF]/20 p-3 rounded-2xl">
                    <Icon className="w-6 h-6 text-[#26FFDF]" />
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

    </div>
  )
}
