"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Briefcase, 
  ClipboardList, 
  Users, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  MoreHorizontal 
} from "lucide-react"
import Link from "next/link"

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
  avatar?: string
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [activities, setActivities] = useState<RecentActivity[]>([])

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
      case "active": return "bg-blue-500"
      case "completed": return "bg-green-500"
      case "pending": return "bg-yellow-500"
      default: return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive"
      case "medium": return "secondary"
      case "low": return "outline"
      default: return "outline"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header mejorado */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#26FFDF]">
            Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Gestiona tus proyectos y supervisa el progreso del equipo
          </p>
        </div>
        <Button className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl transition-all duration-300 transform scale-95 hover:scale-100 hover:border-[#08A696] hover:bg-[#02505950] text-[#26FFDF] inline-flex items-center px-6 py-3 font-semibold">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>
      
      {/* Tarjetas de estadísticas mejoradas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 rounded-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#26FFDF]">
              Total Proyectos
            </CardTitle>
            <div className="p-2 bg-[#08A696]/20 rounded-xl">
              <Briefcase className="h-4 w-4 text-[#26FFDF]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#26FFDF]">12</div>
            <div className="flex items-center text-xs text-textMuted mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2 desde el mes pasado
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 rounded-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#26FFDF]">
              Proyectos Activos
            </CardTitle>
            <div className="p-2 bg-[#08A696]/20 rounded-xl">
              <ClipboardList className="h-4 w-4 text-[#26FFDF]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#26FFDF]">5</div>
            <div className="flex items-center text-xs text-textMuted mt-1">
              <Clock className="h-3 w-3 mr-1" />
              En desarrollo
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 rounded-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#26FFDF]">
              Clientes
            </CardTitle>
            <div className="p-2 bg-[#08A696]/20 rounded-xl">
              <Users className="h-4 w-4 text-[#26FFDF]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#26FFDF]">8</div>
            <div className="flex items-center text-xs text-textMuted mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +1 cliente nuevo
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 rounded-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#26FFDF]">
              Completados
            </CardTitle>
            <div className="p-2 bg-[#08A696]/20 rounded-xl">
              <CheckCircle className="h-4 w-4 text-[#26FFDF]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#26FFDF]">3</div>
            <div className="flex items-center text-xs text-textMuted mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Este mes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sección de proyectos y actividad */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Proyectos Recientes */}
        <Card className="col-span-2 bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 rounded-2xl transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-[#26FFDF]">Proyectos Recientes</CardTitle>
              <Button className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-xl transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] text-[#26FFDF] px-4 py-2" asChild>
                <Link href="/dashboard/projects">
                  Ver todos
                  <Eye className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center space-x-4 p-4 rounded-2xl border border-[#08A696]/20 bg-[#02505931] backdrop-blur-sm hover:shadow-md hover:border-[#08A696] transition-all duration-300">
                <div className={`w-2 h-12 rounded-full ${getStatusColor(project.status)}`} />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-[#26FFDF]">{project.name}</h4>
                    <Badge variant={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-textMuted">{project.client}</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-textMuted">Progreso</span>
                      <span className="text-[#26FFDF]">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-textMuted">
                    <span>Vence: {new Date(project.dueDate).toLocaleDateString()}</span>
                    <Button className="bg-[#08A696]/10 hover:bg-[#08A696]/20 text-[#26FFDF] border-none p-1 h-6 w-6 rounded">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 rounded-2xl transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-[#26FFDF]">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-2xl bg-[#08A696]/5 hover:bg-[#08A696]/10 transition-colors border border-[#08A696]/10">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.avatar} />
                  <AvatarFallback className="text-xs bg-[#08A696]/20 text-[#26FFDF] border border-[#08A696]/30">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium text-[#26FFDF]">{activity.user}</span>{' '}
                    <span className="text-textMuted">{activity.action}</span>{' '}
                    <span className="font-medium text-[#08A696]">{activity.project}</span>
                  </p>
                  <p className="text-xs text-textMuted">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
