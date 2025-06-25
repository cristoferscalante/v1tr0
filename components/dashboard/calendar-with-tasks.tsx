"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Plus, 
  CalendarIcon, 
  User, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Calendar as CalendarIconLarge,
  Filter,
  Search
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Task {
  id: string
  title: string
  description: string
  projectId: string
  assigneeId: string | null
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  date: string
  completed: boolean
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

export function CalendarWithTasks() {
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "completed">>({
    title: "",
    description: "",
    projectId: "",
    assigneeId: null,
    status: "pending",
    priority: "medium",
    date: new Date().toISOString().split("T")[0],
  })

  // Función para verificar si una fecha es válida
  const isValidDate = (date: any): date is Date => {
    return date instanceof Date && !isNaN(date.getTime())
  }

  // Cargar datos
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Cargar tareas
        const savedTasks = localStorage.getItem("tasks")
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks)
          // Validar que las fechas sean correctas
          setTasks(parsedTasks.filter((task: any) => task && task.date))
        }

        // Cargar proyectos
        const savedProjects = localStorage.getItem("projects")
        if (savedProjects) {
          setProjects(JSON.parse(savedProjects))
        } else {
          // Proyectos por defecto si no hay ninguno guardado
          const defaultProjects = [
            { id: "1", name: "Sitio Web Corporativo" },
            { id: "2", name: "Aplicación Móvil" },
            { id: "3", name: "Rediseño de Marca" },
          ]
          setProjects(defaultProjects)
          localStorage.setItem("projects", JSON.stringify(defaultProjects))
        }

        // Cargar miembros del equipo
        const defaultTeamMembers = [
          { id: "1", name: "María González", role: "Project Manager" },
          { id: "2", name: "Carlos Rodríguez", role: "Developer" },
          { id: "3", name: "Ana López", role: "Designer" },
        ]

        const savedTeamMembers = localStorage.getItem("teamMembers")
        setTeamMembers(savedTeamMembers ? JSON.parse(savedTeamMembers) : defaultTeamMembers)
      } catch (error) {
        console.error("Error loading data:", error)
        // Inicializar con valores por defecto en caso de error
        setTasks([])
        setProjects([])
        setTeamMembers([])
      }
    }
  }, [])

  // Actualizar la fecha del nuevo task cuando cambia la fecha seleccionada
  useEffect(() => {
    if (selectedDate) {
      setNewTask((prev) => ({
        ...prev,
        date: selectedDate.toISOString().split("T")[0],
      }))
    }
  }, [selectedDate])

  // Filtrar tareas para la fecha seleccionada
  const tasksForSelectedDate = selectedDate
    ? tasks.filter((task) => {
        if (!task.date) return false
        const taskDate = new Date(task.date)
        return (
          isValidDate(taskDate) &&
          isValidDate(selectedDate) &&
          taskDate.getDate() === selectedDate.getDate() &&
          taskDate.getMonth() === selectedDate.getMonth() &&
          taskDate.getFullYear() === selectedDate.getFullYear()
        )
      })
    : []

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddTask = () => {
    if (!newTask.title || !newTask.projectId) {
      toast({
        title: "Error",
        description: "El título de la tarea y el proyecto son obligatorios.",
        variant: "destructive",
      })
      return
    }

    const taskToAdd = {
      ...newTask,
      id: Date.now().toString(),
      completed: false,
    }

    // Añadir nueva tarea
    const updatedTasks = [...tasks, taskToAdd]
    setTasks(updatedTasks)

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    }

    toast({
      title: "Tarea añadida",
      description: `${taskToAdd.title} ha sido añadida correctamente.`,
    })

    // Resetear formulario y cerrar diálogo
    setNewTask({
      title: "",
      description: "",
      projectId: "",
      assigneeId: null,
      status: "pending",
      priority: "medium",
      date: selectedDate ? selectedDate.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    })
    setIsDialogOpen(false)
  }

  const handleToggleTaskCompletion = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { 
            ...task, 
            completed: !task.completed, 
            status: (!task.completed ? "completed" : "pending") as "pending" | "in-progress" | "completed"
          }
        : task,
    )

    setTasks(updatedTasks)

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    }
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    return project ? project.name : "Proyecto desconocido"
  }

  const getAssigneeName = (assigneeId: string | null) => {
    if (!assigneeId) return "Sin asignar"
    const member = teamMembers.find((m) => m.id === assigneeId)
    return member ? member.name : "Miembro desconocido"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-blue-500"
      case "medium":
        return "bg-amber-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  // Función segura para renderizar días con tareas
  const renderDay = (day: Date | undefined) => {
    // Si el día no es válido, devolver null
    if (!day || !isValidDate(day)) return null

    // Filtrar tareas para este día de manera segura
    const dayTasks = tasks.filter((task) => {
      if (!task.date) return false
      try {
        const taskDate = new Date(task.date)
        return (
          isValidDate(taskDate) &&
          taskDate.getDate() === day.getDate() &&
          taskDate.getMonth() === day.getMonth() &&
          taskDate.getFullYear() === day.getFullYear()
        )
      } catch (e) {
        return false
      }
    })

    // Si no hay tareas, devolver null
    if (dayTasks.length === 0) return null

    // Renderizar indicadores de tareas
    return (
      <div className="flex gap-0.5 flex-wrap mt-1">
        {dayTasks.slice(0, 3).map((task) => (
          <div key={task.id} className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`} />
        ))}
        {dayTasks.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header mejorado */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Calendario de Tareas
          </h3>
          <p className="text-muted-foreground mt-1">
            Gestiona tus tareas y visualiza tu calendario
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Tarea
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-xl font-semibold">Crear Nueva Tarea</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">Título *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Ingresa el título de la tarea"
                      value={newTask.title}
                      onChange={handleInputChange}
                      className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-medium">Prioridad</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => handleSelectChange("priority", value as "low" | "medium" | "high")}
                    >
                      <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Seleccionar prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">🟢 Baja</SelectItem>
                        <SelectItem value="medium">🟡 Media</SelectItem>
                        <SelectItem value="high">🔴 Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectId" className="text-sm font-medium">Proyecto *</Label>
                  <Select value={newTask.projectId} onValueChange={(value) => handleSelectChange("projectId", value)}>
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Seleccionar proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.length > 0 ? (
                        projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4" />
                              {project.name}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-projects" disabled>
                          No hay proyectos disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assigneeId" className="text-sm font-medium">Asignar a</Label>
                  <Select
                    value={newTask.assigneeId || ""}
                    onValueChange={(value) => handleSelectChange("assigneeId", value)}
                  >
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Seleccionar miembro del equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 opacity-50" />
                          Sin asignar
                        </div>
                      </SelectItem>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-xs">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span>{member.name}</span>
                            <Badge variant="secondary" className="text-xs">{member.role}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe los detalles de la tarea..."
                    value={newTask.description}
                    onChange={handleInputChange}
                    className="min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddTask}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Tarea
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario principal */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CalendarIconLarge className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-xl">Calendario</CardTitle>
                </div>
                <Badge variant="secondary" className="font-normal">
                  {tasks.filter(t => !t.completed).length} tareas pendientes
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-lg border-0 shadow-inner bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20"
                components={{
                  Day: ({ day, ...props }) => {
                    if (!day || !isValidDate(day)) return <div {...props}></div>
                    return (
                      <div {...props} className="relative">
                        {day.getDate()}
                        {renderDay(day)}
                      </div>
                    )
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Panel lateral de tareas */}
        <div className="space-y-6">
          {/* Información del día seleccionado */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                  <CalendarIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {selectedDate ? (
                      selectedDate.toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })
                    ) : (
                      "Selecciona una fecha"
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {tasksForSelectedDate.length} tareas programadas
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Lista de tareas del día */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Tareas del Día
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {tasksForSelectedDate.length > 0 ? (
                  <div className="space-y-4">
                    {tasksForSelectedDate.map((task) => (
                      <div
                        key={task.id}
                        className={`group p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                          task.completed 
                            ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" 
                            : "bg-white border-gray-200 hover:border-blue-300 dark:bg-gray-900 dark:border-gray-700"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => handleToggleTaskCompletion(task.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                                {task.title}
                              </h4>
                              <Badge 
                                variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {task.priority === "low" ? "Baja" : task.priority === "medium" ? "Media" : "Alta"}
                              </Badge>
                            </div>
                            
                            {task.description && (
                              <p className={`text-sm ${task.completed ? "text-muted-foreground" : "text-gray-600 dark:text-gray-400"}`}>
                                {task.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                {getProjectName(task.projectId)}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {getAssigneeName(task.assigneeId)}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {task.status === 'completed' ? 'Completada' : 
                                 task.status === 'in-progress' ? 'En progreso' : 'Pendiente'}
                              </div>
                              {!task.completed && (
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                  Editar
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full mb-4">
                      <CalendarIconLarge className="h-12 w-12 text-blue-500" />
                    </div>
                    <h3 className="font-medium mb-2">No hay tareas programadas</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Añade una nueva tarea para este día
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(true)}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Tarea
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
