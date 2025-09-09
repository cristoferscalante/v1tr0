"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Briefcase, ClipboardList, Users, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Project {
  id: string
  name: string
  clientId: string
  status: "planned" | "in-progress" | "completed"
}

interface Client {
  id: string
  name: string
}

interface Task {
  id: string
  title: string
  projectId: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  date: string
  completed: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  
  // Cargar datos
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProjects = localStorage.getItem("projects")
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects))
      }
      
      const savedClients = localStorage.getItem("clients")
      if (savedClients) {
        setClients(JSON.parse(savedClients))
      }
      
      const savedTasks = localStorage.getItem("tasks")
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks))
      }
    }
  }, [])
  
  // Calcular estadísticas
  const activeProjects = projects.filter(p => p.status === "in-progress").length
  const completedProjects = projects.filter(p => p.status === "completed").length
  const pendingTasks = tasks.filter(t => !t.completed).length
  const completedTasks = tasks.filter(t => t.completed).length
  
  // Obtener tareas recientes (últimos 5 días)
  const today = new Date()
  const fiveDaysAgo = new Date(today)
  fiveDaysAgo.setDate(today.getDate() - 5)
  
  const recentTasks = tasks
    .filter(task => {
      const taskDate = new Date(task.date)
      return taskDate >= fiveDaysAgo && taskDate <= today
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
  
  // Obtener proyectos activos
  const activeProjectsList = projects
    .filter(project => project.status === "in-progress")
    .slice(0, 3)
  
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    return client ? client.name : "Cliente desconocido"
  }
  
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    return project ? project.name : "Proyecto desconocido"
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push("/dashboard/projects/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
            <Briefcase className="h-4 w-4 text-highlight" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-textMuted">
              {completedProjects} proyectos completados
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Pendientes</CardTitle>
            <ClipboardList className="h-4 w-4 text-highlight" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <p className="text-xs text-textMuted">
              {completedTasks} tareas completadas
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-highlight" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-textMuted">
              {activeProjects} proyectos activos
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas Tareas</CardTitle>
            <Calendar className="h-4 w-4 text-highlight" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentTasks.length}
            </div>
            <p className="text-xs text-textMuted">
              En los próximos 5 días
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="projects">Proyectos</TabsTrigger>
          <TabsTrigger value="tasks">Tareas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bg-white/80 dark:bg-background/10 rounded-2xl">
              <CardHeader>
                <CardTitle>Proyectos Activos</CardTitle>
              </CardHeader>
              <CardContent>
                {activeProjectsList.length > 0 ? (
                  <div className="space-y-4">
                    {activeProjectsList.map(project => (
                      <div key={project.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-sm text-textMuted">{getClientName(project.clientId)}</p>
                        </div>
                        <Link href={`/dashboard/projects/${project.id}`} passHref>
                          <Button variant="outline" size="sm">Ver</Button>
                        </Link>
                      </div>
                    ))}
                    {activeProjects > 3 && (
                      <div className="text-center pt-2">
                        <Link href="/dashboard/projects" passHref>
                          <Button variant="link" size="sm">Ver todos los proyectos</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <Briefcase className="h-10 w-10 text-textMuted opacity-50 mb-2" />
                    <p className="text-textMuted">No hay proyectos activos</p>
                    <Link href="/dashboard/projects/new" passHref>
                      <Button variant="outline" size="sm" className="mt-4">
                        <Plus className="h-4 w-4 mr-1" />
                        Crear Proyecto
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-3 bg-white/80 dark:bg-background/10 rounded-2xl">
              <CardHeader>
                <CardTitle>Tareas Recientes</CardTitle>
              </CardHeader>
              <CardContent>
                {recentTasks.length > 0 ? (
                  <div className="space-y-4">
                    {recentTasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className={`font-medium ${task.completed ? 'line-through text-textMuted' : ''}`}>
                            {task.title}
                          </p>
                          <p className="text-sm text-textMuted">
                            {getProjectName(task.projectId)} • {task.date}
                          </p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          task.priority === 'high' ? 'bg-red-500' : 
                          task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />
                      </div>
                    ))}
                    <div className="text-center pt-2">
                      <Link href="/dashboard/tasks" passHref>
                        <Button variant="link" size="sm">Ver todas las tareas</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <ClipboardList className="h-10 w-10 text-textMuted opacity-50 mb-2" />
                    <p className="text-textMuted">No hay tareas recientes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
            <CardHeader>
              <CardTitle>Todos los Proyectos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-textMuted">Vista de proyectos en desarrollo</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4">
          <Card className="bg-white/80 dark:bg-background/10 rounded-2xl">
            <CardHeader>
              <CardTitle>Todas las Tareas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-textMuted">Vista de tareas en desarrollo</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
