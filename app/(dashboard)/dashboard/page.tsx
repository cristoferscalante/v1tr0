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
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Gestiona tus proyectos y supervisa el progreso del equipo
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>
      
      {/* Tarjetas de estadísticas mejoradas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Total Proyectos
            </CardTitle>
            <div className="p-2 bg-blue-500 rounded-full">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">12</div>
            <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2 desde el mes pasado
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Proyectos Activos
            </CardTitle>
            <div className="p-2 bg-green-500 rounded-full">
              <ClipboardList className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">5</div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
              <Clock className="h-3 w-3 mr-1" />
              En desarrollo
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Clientes
            </CardTitle>
            <div className="p-2 bg-purple-500 rounded-full">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">8</div>
            <div className="flex items-center text-xs text-purple-600 dark:text-purple-400 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +1 cliente nuevo
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Completados
            </CardTitle>
            <div className="p-2 bg-orange-500 rounded-full">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">3</div>
            <div className="flex items-center text-xs text-orange-600 dark:text-orange-400 mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              Este mes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sección de proyectos y actividad */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Proyectos Recientes */}
        <Card className="col-span-2 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Proyectos Recientes</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/projects">
                  Ver todos
                  <Eye className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center space-x-4 p-4 rounded-lg border bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:shadow-md transition-all duration-200">
                <div className={`w-2 h-12 rounded-full ${getStatusColor(project.status)}`} />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{project.name}</h4>
                    <Badge variant={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{project.client}</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Progreso</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Vence: {new Date(project.dueDate).toLocaleDateString()}</span>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.avatar} />
                  <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{' '}
                    {activity.action}{' '}
                    <span className="font-medium text-blue-600">{activity.project}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
