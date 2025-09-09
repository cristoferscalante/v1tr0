"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Plus, 
  FolderIcon,
  ClockIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  Eye,
  MoreHorizontal
} from "lucide-react"
import Link from "next/link"

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Gestiona tus proyectos y supervisa el progreso del equipo
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>

      {/* Grid de métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Proyectos
            </CardTitle>
            <FolderIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.length}
            </div>
            <p className="text-xs text-muted-foreground">
              proyectos activos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En Progreso
            </CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter(p => p.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">
              en desarrollo
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completados
            </CardTitle>
            <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter(p => p.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              finalizados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Productividad
            </CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              87%
            </div>
            <p className="text-xs text-muted-foreground">
              eficiencia general
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sección de proyectos y actividad */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Proyectos Recientes */}
        <Card className="col-span-2 bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Proyectos Recientes</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/projects">
                  Ver todos
                  <Eye className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center space-x-4 p-4 rounded-lg border">
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
                      <span className="text-muted-foreground">Progreso</span>
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
        <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.project}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
