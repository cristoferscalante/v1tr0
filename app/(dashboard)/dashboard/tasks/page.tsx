"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ClipboardList, Calendar, User, Briefcase } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskForm } from "@/components/dashboard/task-form"
import { useToast } from "@/hooks/use-toast"

interface Task {
  id: string
  title: string
  description: string
  projectId: string
  assigneeId: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed"
  dueDate: string
  createdAt: string
}

interface Project {
  id: string
  name: string
}

interface TeamMember {
  id: string
  name: string
  role: string
}

export default function TasksPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")

  // Cargar datos
  useEffect(() => {
    try {
      // Cargar tareas
      const savedTasks = localStorage.getItem("tasks")
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks))
      }

      // Cargar proyectos
      const savedProjects = localStorage.getItem("projects")
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects))
      }

      // Cargar miembros del equipo o usar datos por defecto
      const defaultTeamMembers = [
        { id: "1", name: "María González", role: "Project Manager" },
        { id: "2", name: "Carlos Rodríguez", role: "Developer" },
        { id: "3", name: "Ana López", role: "Designer" },
      ]

      const savedTeamMembers = localStorage.getItem("teamMembers")
      setTeamMembers(savedTeamMembers ? JSON.parse(savedTeamMembers) : defaultTeamMembers)
    } catch (error) {
      console.error("Error al cargar datos:", error)
      setTasks([])
      setProjects([])
      setTeamMembers([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask])
    toast({
      title: "Tarea creada",
      description: `La tarea "${newTask.title}" ha sido creada correctamente.`,
    })
  }

  const handleTaskStatusChange = (taskId: string, newStatus: "pending" | "in-progress" | "completed") => {
    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    setTasks(updatedTasks)

    // Guardar en localStorage
    try {
      localStorage.setItem("tasks", JSON.stringify(updatedTasks))
      toast({
        title: "Estado actualizado",
        description: "El estado de la tarea ha sido actualizado correctamente.",
      })
    } catch (error) {
      console.error("Error al guardar en localStorage:", error)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    // Filtro de búsqueda
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro de estado
    const matchesStatus = filter === "all" || task.status === filter

    // Filtro de proyecto
    const matchesProject = projectFilter === "all" || task.projectId === projectFilter

    // Filtro de asignado
    const matchesAssignee =
      assigneeFilter === "all" ||
      (assigneeFilter === "unassigned" && !task.assigneeId) ||
      task.assigneeId === assigneeFilter

    return matchesSearch && matchesStatus && matchesProject && matchesAssignee
  })

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    return project ? project.name : "Proyecto desconocido"
  }

  const getAssigneeName = (assigneeId: string) => {
    if (!assigneeId) return "Sin asignar"
    const member = teamMembers.find((m) => m.id === assigneeId)
    return member ? member.name : "Miembro desconocido"
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <Badge className="bg-blue-500 text-white">Baja</Badge>
      case "medium":
        return <Badge className="bg-amber-500 text-white">Media</Badge>
      case "high":
        return <Badge className="bg-red-500 text-white">Alta</Badge>
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-gray-400 text-white">Pendiente</Badge>
      case "in-progress":
        return <Badge className="bg-highlight text-white">En Progreso</Badge>
      case "completed":
        return <Badge className="bg-green-500 text-white">Completada</Badge>
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tareas</h2>
        <TaskForm projects={projects} teamMembers={teamMembers} onTaskCreated={handleTaskCreated} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-4 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
            <Input
              placeholder="Buscar tareas..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="in-progress">En Progreso</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Proyecto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los proyectos</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Asignado a" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="unassigned">Sin asignar</SelectItem>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredTasks.length > 0 ? (
          <>
            <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Columna: Pendientes */}
              <Card>
                <CardHeader className="bg-gray-100 dark:bg-gray-800">
                  <CardTitle className="flex items-center justify-between">
                    <span>Pendientes</span>
                    <Badge variant="outline">{filteredTasks.filter((t) => t.status === "pending").length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredTasks
                    .filter((task) => task.status === "pending")
                    .map((task) => (
                      <div key={task.id} className="p-3 bg-white dark:bg-gray-900 rounded-lg border shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{task.title}</h3>
                          {getPriorityBadge(task.priority)}
                        </div>
                        <div className="space-y-2 text-sm text-textMuted">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-3 w-3" />
                            <span>{getProjectName(task.projectId)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            <span>{getAssigneeName(task.assigneeId)}</span>
                          </div>
                          {task.dueDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 pt-3 border-t flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTaskStatusChange(task.id, "in-progress")}
                          >
                            Iniciar
                          </Button>
                        </div>
                      </div>
                    ))}
                  {filteredTasks.filter((t) => t.status === "pending").length === 0 && (
                    <div className="text-center py-8 text-textMuted">No hay tareas pendientes</div>
                  )}
                </CardContent>
              </Card>

              {/* Columna: En Progreso */}
              <Card>
                <CardHeader className="bg-highlight/10">
                  <CardTitle className="flex items-center justify-between">
                    <span>En Progreso</span>
                    <Badge variant="outline">{filteredTasks.filter((t) => t.status === "in-progress").length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredTasks
                    .filter((task) => task.status === "in-progress")
                    .map((task) => (
                      <div key={task.id} className="p-3 bg-white dark:bg-gray-900 rounded-lg border shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{task.title}</h3>
                          {getPriorityBadge(task.priority)}
                        </div>
                        <div className="space-y-2 text-sm text-textMuted">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-3 w-3" />
                            <span>{getProjectName(task.projectId)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            <span>{getAssigneeName(task.assigneeId)}</span>
                          </div>
                          {task.dueDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 pt-3 border-t flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTaskStatusChange(task.id, "pending")}
                          >
                            Pausar
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleTaskStatusChange(task.id, "completed")}
                          >
                            Completar
                          </Button>
                        </div>
                      </div>
                    ))}
                  {filteredTasks.filter((t) => t.status === "in-progress").length === 0 && (
                    <div className="text-center py-8 text-textMuted">No hay tareas en progreso</div>
                  )}
                </CardContent>
              </Card>

              {/* Columna: Completadas */}
              <Card>
                <CardHeader className="bg-green-500/10">
                  <CardTitle className="flex items-center justify-between">
                    <span>Completadas</span>
                    <Badge variant="outline">{filteredTasks.filter((t) => t.status === "completed").length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredTasks
                    .filter((task) => task.status === "completed")
                    .map((task) => (
                      <div key={task.id} className="p-3 bg-white dark:bg-gray-900 rounded-lg border shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{task.title}</h3>
                          {getPriorityBadge(task.priority)}
                        </div>
                        <div className="space-y-2 text-sm text-textMuted">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-3 w-3" />
                            <span>{getProjectName(task.projectId)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            <span>{getAssigneeName(task.assigneeId)}</span>
                          </div>
                          {task.dueDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 pt-3 border-t flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTaskStatusChange(task.id, "in-progress")}
                          >
                            Reabrir
                          </Button>
                        </div>
                      </div>
                    ))}
                  {filteredTasks.filter((t) => t.status === "completed").length === 0 && (
                    <div className="text-center py-8 text-textMuted">No hay tareas completadas</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="md:col-span-4 flex justify-center items-center p-8 border border-dashed rounded-lg">
            <div className="text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-textMuted opacity-50" />
              <h3 className="mt-2 text-lg font-medium">No hay tareas</h3>
              <p className="mt-1 text-sm text-textMuted">
                {searchTerm || filter !== "all" || projectFilter !== "all" || assigneeFilter !== "all"
                  ? "No se encontraron tareas con esos criterios"
                  : "Comienza añadiendo una nueva tarea"}
              </p>
              {projects.length === 0 && (
                <div className="mt-4">
                  <p className="text-sm text-amber-500 mb-2">Necesitas crear proyectos primero</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/dashboard/projects">Ir a Proyectos</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
