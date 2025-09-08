"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Plus, 
  ArrowUpRight, 
  FolderIcon,
  ClockIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  Eye,
  MoreHorizontal
} from "lucide-react"

// Tipos para los datos
interface Project {
  id: string
  name: string
  client: string
  progress: number
  status: "active" | "completed" | "pending"
  dueDate: string
  priority: "high" | "medium" | "low"
}

interface RecentActivity {
  id: string
  user: string
  action: string
  project: string
  time: string
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    // Datos simulados mejorados
    setProjects([
      {
        id: "1",
        name: "Rediseño Web Corporativo",
        client: "TechCorp S.A.",
        progress: 75,
        status: "active",
        dueDate: "2025-07-15",
        priority: "high"
      },
      {
        id: "2", 
        name: "App Móvil E-commerce",
        client: "Retail Plus",
        progress: 45,
        status: "active",
        dueDate: "2025-08-20",
        priority: "medium"
      },
      {
        id: "3",
        name: "Sistema CRM",
        client: "BusinessPro",
        progress: 100,
        status: "completed",
        dueDate: "2025-06-10",
        priority: "high"
      }
    ])

    setActivities([
      {
        id: "1",
        user: "Ana García",
        action: "completó la tarea",
        project: "Rediseño Web",
        time: "hace 2 horas"
      },
      {
        id: "2",
        user: "Carlos López",
        action: "actualizó el proyecto",
        project: "App Móvil",
        time: "hace 4 horas"
      },
      {
        id: "3",
        user: "María Silva",
        action: "añadió comentarios en",
        project: "Sistema CRM",
        time: "hace 6 horas"
      }
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return isDark ? "bg-[#08A696]" : "bg-[#08A696]"
      case "completed": return isDark ? "bg-[#26FFDF]" : "bg-[#26FFDF]"
      case "pending": return isDark ? "bg-[#08A696]/50" : "bg-[#08A696]/50"
      default: return "bg-gray-500"
    }
  }

  const getPriorityBadge = (priority: string) => {
    const baseClass = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300`
    switch (priority) {
      case "high": 
        return `${baseClass} ${isDark ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-red-100 text-red-700 border border-red-200"}`
      case "medium": 
        return `${baseClass} ${isDark ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30" : "bg-yellow-100 text-yellow-700 border border-yellow-200"}`
      case "low": 
        return `${baseClass} ${isDark ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-green-100 text-green-700 border border-green-200"}`
      default: 
        return `${baseClass} ${isDark ? "bg-gray-500/20 text-gray-300 border border-gray-500/30" : "bg-gray-100 text-gray-700 border border-gray-200"}`
    }
  }

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 min-h-screen bg-gradient-to-br from-background to-background/95">
      {/* Header mejorado con estilo del home */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div>
          <h1 className={`text-3xl md:text-4xl font-bold tracking-tight mb-2 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
            Dashboard
          </h1>
          <p className={`${isDark ? "text-textMuted" : "text-muted-foreground"} text-lg`}>
            Gestiona tus proyectos y supervisa el progreso del equipo
          </p>
        </div>
        
        {/* Botón con estilo del home */}
        <div className="relative group">
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${isDark ? "from-[#08a6961e] to-[#26ffde23]" : "from-[#08a69630] to-[#08a69620]"} rounded-2xl blur opacity-40 group-hover:opacity-60 transition-all duration-300`} />
          <Button className={`relative ${isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm"} border ${isDark ? "border-[#08A696]/30" : "border-[#08A696]/40"} rounded-2xl transition-all duration-300 transform scale-95 hover:scale-100 hover:border-[#08A696] ${isDark ? "hover:bg-[#02505950] text-[#26FFDF]" : "hover:bg-[#c5ebe7] text-[#08A696]"} inline-flex items-center px-6 py-3 font-semibold shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 group-hover:translate-y-[-2px]`}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proyecto
            <ArrowUpRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-[-1px]" />
          </Button>
        </div>
      </motion.div>

      {/* Grid de métricas con estilo glassmorphic del home */}
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            title: "Total Proyectos",
            value: projects.length,
            icon: FolderIcon,
            subtitle: "proyectos activos"
          },
          {
            title: "En Progreso", 
            value: projects.filter(p => p.status === "active").length,
            icon: ClockIcon,
            subtitle: "en desarrollo"
          },
          {
            title: "Completados",
            value: projects.filter(p => p.status === "completed").length,
            icon: CheckCircleIcon,
            subtitle: "finalizados"
          },
          {
            title: "Productividad",
            value: "87%",
            icon: TrendingUpIcon,
            subtitle: "eficiencia general"
          }
        ].map((metric) => (
          <motion.div
            key={metric.title}
            variants={itemVariants}
            className="relative group"
          >
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${isDark ? "from-[#08a6961e] to-[#26ffde23]" : "from-[#08a69630] to-[#08a69620]"} rounded-3xl blur opacity-40 group-hover:opacity-60 transition-all duration-300`} />
            
            <Card className={`relative ${isDark ? "bg-[#02505931]" : "bg-white/80"} backdrop-blur-md border ${isDark ? "border-[#08A696]/30" : "border-[#08A696]/20"} rounded-3xl transition-all duration-300 hover:border-[#08A696] ${isDark ? "hover:bg-[#02505950]" : "hover:bg-white/90"} shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 group-hover:translate-y-[-2px]`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-semibold ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                  {metric.title}
                </CardTitle>
                <metric.icon className={`h-5 w-5 ${isDark ? "text-[#26FFDF]/60" : "text-[#08A696]/60"} transition-colors duration-300 group-hover:text-[#08A696]`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold mb-1 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                  {metric.value}
                </div>
                <p className={`text-xs ${isDark ? "text-textMuted" : "text-muted-foreground"}`}>
                  {metric.subtitle}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Sección principal de proyectos y actividad con estilo glassmorphic */}
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-7"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Proyectos Recientes */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-5 relative group"
        >
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${isDark ? "from-[#08a6961e] to-[#26ffde23]" : "from-[#08a69630] to-[#08a69620]"} rounded-3xl blur opacity-40 group-hover:opacity-60 transition-all duration-300`} />
          
          <Card className={`relative ${isDark ? "bg-[#02505931]" : "bg-white/80"} backdrop-blur-md border ${isDark ? "border-[#08A696]/30" : "border-[#08A696]/20"} rounded-3xl transition-all duration-300 hover:border-[#08A696] ${isDark ? "hover:bg-[#02505950]" : "hover:bg-white/90"} shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 group-hover:translate-y-[-2px]`}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-xl font-bold ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                  Proyectos Recientes
                </CardTitle>
                <div className="relative group/btn">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${isDark ? "from-[#08a6961e] to-[#26ffde23]" : "from-[#08a69630] to-[#08a69620]"} rounded-xl blur opacity-40 group-hover/btn:opacity-60 transition-all duration-300`} />
                  <Button className={`relative ${isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm"} border ${isDark ? "border-[#08A696]/30" : "border-[#08A696]/40"} rounded-xl transition-all duration-300 transform scale-95 hover:scale-100 hover:border-[#08A696] ${isDark ? "hover:bg-[#02505950] text-[#26FFDF]" : "hover:bg-[#c5ebe7] text-[#08A696]"} px-4 py-2 text-sm font-semibold shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 group-hover/btn:translate-y-[-1px]`}>
                    Ver todos
                    <Eye className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project, index) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center space-x-4 p-4 rounded-2xl border ${isDark ? "border-[#08A696]/20 bg-[#02505931]" : "border-[#08A696]/15 bg-white/50"} backdrop-blur-sm hover:shadow-md ${isDark ? "hover:border-[#08A696] hover:bg-[#02505950]" : "hover:border-[#08A696] hover:bg-white/70"} transition-all duration-300 group/item`}
                >
                  <div className={`w-2 h-12 rounded-full ${getStatusColor(project.status)} transition-all duration-300 group-hover/item:scale-110`} />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-semibold ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                        {project.name}
                      </h4>
                      <span className={getPriorityBadge(project.priority)}>
                        {project.priority}
                      </span>
                    </div>
                    <p className={`text-sm ${isDark ? "text-textMuted" : "text-muted-foreground"}`}>
                      {project.client}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`${isDark ? "text-textMuted" : "text-muted-foreground"}`}>
                          Progreso
                        </span>
                        <span className={`font-semibold ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                          {project.progress}%
                        </span>
                      </div>
                      <div className={`w-full rounded-full h-2 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                        <div 
                          className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className={`flex items-center justify-between text-xs ${isDark ? "text-textMuted" : "text-muted-foreground"}`}>
                      <span>Vence: {new Date(project.dueDate).toLocaleDateString()}</span>
                      <Button className={`${isDark ? "bg-[#08A696]/10 hover:bg-[#08A696]/20 text-[#26FFDF]" : "bg-[#08A696]/10 hover:bg-[#08A696]/20 text-[#08A696]"} border-none p-1 h-6 w-6 rounded transition-all duration-300 hover:scale-110`}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Actividad Reciente */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 relative group"
        >
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${isDark ? "from-[#08a6961e] to-[#26ffde23]" : "from-[#08a69630] to-[#08a69620]"} rounded-3xl blur opacity-40 group-hover:opacity-60 transition-all duration-300`} />
          
          <Card className={`relative ${isDark ? "bg-[#02505931]" : "bg-white/80"} backdrop-blur-md border ${isDark ? "border-[#08A696]/30" : "border-[#08A696]/20"} rounded-3xl transition-all duration-300 hover:border-[#08A696] ${isDark ? "hover:bg-[#02505950]" : "hover:bg-white/90"} shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 group-hover:translate-y-[-2px] h-full`}>
            <CardHeader className="pb-4">
              <CardTitle className={`text-xl font-bold ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div 
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start space-x-3 p-3 rounded-xl ${isDark ? "bg-[#08A696]/5 hover:bg-[#08A696]/10" : "bg-[#08A696]/5 hover:bg-[#08A696]/10"} transition-all duration-300 group/activity`}
                >
                  <div className={`w-2 h-2 rounded-full ${isDark ? "bg-[#26FFDF]" : "bg-[#08A696]"} mt-2 transition-all duration-300 group-hover/activity:scale-125`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                      <span className="font-semibold">{activity.user}</span>{" "}
                      <span className={`${isDark ? "text-textMuted" : "text-muted-foreground"}`}>
                        {activity.action}
                      </span>{" "}
                      <span className="font-medium">{activity.project}</span>
                    </p>
                    <p className={`text-xs ${isDark ? "text-textMuted" : "text-muted-foreground"} mt-1`}>
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
