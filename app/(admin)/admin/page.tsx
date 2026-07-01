"use client"

import { useAuth } from "@/hooks/use-auth"
import { Users, FileText, Briefcase, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
  const { userProfile } = useAuth()

  const stats = [
    {
      name: "Usuarios Totales",
      value: "156",
      icon: Users,
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Posts Publicados",
      value: "23",
      icon: FileText,
      change: "+3",
      changeType: "positive",
    },
    {
      name: "Proyectos Activos",
      value: "8",
      icon: Briefcase,
      change: "+2",
      changeType: "positive",
    },
    {
      name: "Visitas Totales",
      value: "12.4k",
      icon: TrendingUp,
      change: "+23%",
      changeType: "positive",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-400">
          Bienvenido de vuelta, {userProfile?.name || userProfile?.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="bg-black/40 backdrop-blur-sm border border-[#08A696]/20 rounded-xl p-6 hover:border-[#08A696]/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-[#08A696]/10 border border-[#08A696]/20">
                  <Icon className="h-6 w-6 text-[#08A696]" />
                </div>
                <span className="text-sm font-medium text-green-500">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-400">{stat.name}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-black/40 backdrop-blur-sm border border-[#08A696]/20 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Actividad Reciente
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 p-4 rounded-lg bg-black/20 border border-[#08A696]/10"
            >
              <div className="h-10 w-10 rounded-full bg-[#08A696]/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-[#08A696]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Nuevo post publicado</p>
                <p className="text-sm text-gray-400">Hace {item} hora(s)</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-[#08A696]/10 hover:bg-[#08A696]/20 border border-[#08A696]/30 rounded-xl p-6 transition-all duration-200 text-left group">
          <Users className="h-8 w-8 text-[#08A696] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-semibold mb-1">Gestionar Usuarios</h3>
          <p className="text-sm text-gray-400">Ver y administrar usuarios del sistema</p>
        </button>
        
        <button className="bg-[#08A696]/10 hover:bg-[#08A696]/20 border border-[#08A696]/30 rounded-xl p-6 transition-all duration-200 text-left group">
          <FileText className="h-8 w-8 text-[#08A696] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-semibold mb-1">Crear Post</h3>
          <p className="text-sm text-gray-400">Publica nuevo contenido en el blog</p>
        </button>
        
        <button className="bg-[#08A696]/10 hover:bg-[#08A696]/20 border border-[#08A696]/30 rounded-xl p-6 transition-all duration-200 text-left group">
          <Briefcase className="h-8 w-8 text-[#08A696] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="text-white font-semibold mb-1">Nuevo Proyecto</h3>
          <p className="text-sm text-gray-400">Añade un nuevo proyecto al portfolio</p>
        </button>
      </div>
    </div>
  )
}
