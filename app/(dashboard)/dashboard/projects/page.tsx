"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Calendar, User, Briefcase } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Client {
  id: string
  name: string
  company: string
}

interface Project {
  id: string
  name: string
  description: string
  clientId: string
  status: "planned" | "in-progress" | "completed"
  startDate: string
  endDate: string
}

export default function ProjectsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    name: "",
    description: "",
    clientId: "",
    status: "planned",
    startDate: "",
    endDate: "",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [filter, setFilter] = useState("all")

  // Cargar datos de forma segura
  useEffect(() => {
    const loadData = async () => {
      try {
        // Inicializar con valores por defecto
        let projectsData: Project[] = []
        let clientsData: Client[] = []

        // Cargar proyectos
        try {
          if (typeof window !== "undefined") {
            const savedProjects = localStorage.getItem("projects")
            if (savedProjects) {
              projectsData = JSON.parse(savedProjects)
            }
          }
        } catch (e) {
          console.error("Error al cargar proyectos:", e)
        }

        // Cargar clientes
        try {
          if (typeof window !== "undefined") {
            const savedClients = localStorage.getItem("clients")
            if (savedClients) {
              clientsData = JSON.parse(savedClients)
            }
          }
        } catch (e) {
          console.error("Error al cargar clientes:", e)
        }

        // Actualizar estados
        setProjects(projectsData)
        setClients(clientsData)
      } catch (error) {
        console.error("Error general al cargar datos:", error)
        setError(error instanceof Error ? error : new Error("Error desconocido al cargar datos"))
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Inicializar fecha de inicio al montar el componente
  useEffect(() => {
    try {
      setNewProject((prev) => ({
        ...prev,
        startDate: new Date().toISOString().split("T")[0],
      }))
    } catch (e) {
      console.error("Error al inicializar fecha:", e)
    }
  }, [])

  // Si hay un error, mostrar mensaje de error
  if (error) {
    return (
      <div className="flex-1 p-8 flex flex-col justify-center items-center">
        <div className="p-3 rounded-full bg-red-500/10 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-red-500 mb-2">Error al cargar los datos</h2>
        <p className="text-textMuted mb-4 text-center">
          Ha ocurrido un error al cargar los proyectos. Por favor, intenta de nuevo.
        </p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    )
  }

  // Si está cargando, mostrar spinner
  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight"></div>
      </div>
    )
  }

  const filteredProjects = projects.filter(
    (project) =>
      (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filter === "all" ||
        (filter === "active" && project.status === "in-progress") ||
        (filter === "completed" && project.status === "completed") ||
        (filter === "planned" && project.status === "planned")),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewProject((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewProject((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddProject = () => {
    try {
      if (!newProject.name || !newProject.clientId) {
        toast({
          title: "Error",
          description: "El nombre del proyecto y el cliente son obligatorios.",
          variant: "destructive",
        })
        return
      }

      const projectToAdd = {
        ...newProject,
        id: editingProjectId || `project-${Date.now()}`,
      }

      let updatedProjects: Project[] = []

      if (editingProjectId) {
        // Actualizar proyecto existente
        updatedProjects = projects.map((project) => (project.id === editingProjectId ? projectToAdd : project))
        setProjects(updatedProjects)
        toast({
          title: "Proyecto actualizado",
          description: `${projectToAdd.name} ha sido actualizado correctamente.`,
        })
      } else {
        // Añadir nuevo proyecto
        updatedProjects = [...projects, projectToAdd]
        setProjects(updatedProjects)
        toast({
          title: "Proyecto añadido",
          description: `${projectToAdd.name} ha sido añadido correctamente.`,
        })
      }

      // Guardar en localStorage
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("projects", JSON.stringify(updatedProjects))
        }
      } catch (error) {
        console.error("Error al guardar en localStorage:", error)
        toast({
          title: "Error",
          description: "No se pudo guardar el proyecto. Inténtalo de nuevo.",
          variant: "destructive",
        })
      }

      // Resetear formulario y cerrar diálogo
      setNewProject({
        name: "",
        description: "",
        clientId: "",
        status: "planned",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
      })
      setEditingProjectId(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error al añadir proyecto:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al añadir el proyecto. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleEditProject = (project: Project) => {
    try {
      setNewProject({
        name: project.name || "",
        description: project.description || "",
        clientId: project.clientId || "",
        status: project.status || "planned",
        startDate: project.startDate || "",
        endDate: project.endDate || "",
      })
      setEditingProjectId(project.id)
      setIsDialogOpen(true)
    } catch (error) {
      console.error("Error al editar proyecto:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al editar el proyecto. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProject = (id: string) => {
    try {
      if (confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
        const updatedProjects = projects.filter((project) => project.id !== id)
        setProjects(updatedProjects)

        // Guardar en localStorage
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem("projects", JSON.stringify(updatedProjects))
          }
          toast({
            title: "Proyecto eliminado",
            description: "El proyecto ha sido eliminado correctamente.",
          })
        } catch (error) {
          console.error("Error al guardar en localStorage:", error)
          toast({
            title: "Error",
            description: "No se pudo eliminar el proyecto. Inténtalo de nuevo.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error al eliminar proyecto:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al eliminar el proyecto. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    try {
      switch (status) {
        case "planned":
          return <Badge className="bg-gray-400 text-white">Planificado</Badge>
        case "in-progress":
          return <Badge className="bg-highlight text-white">En Progreso</Badge>
        case "completed":
          return <Badge className="bg-green-500 text-white">Completado</Badge>
        default:
          return null
      }
    } catch (error) {
      console.error("Error al obtener badge de estado:", error)
      return null
    }
  }

  const getClientName = (clientId: string) => {
    try {
      const client = clients.find((c) => c.id === clientId)
      return client ? client.name : "Cliente desconocido"
    } catch (error) {
      console.error("Error al obtener nombre de cliente:", error)
      return "Cliente desconocido"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Proyectos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingProjectId ? "Editar Proyecto" : "Añadir Nuevo Proyecto"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Proyecto</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nombre del proyecto"
                  value={newProject.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientId">Cliente</Label>
                <Select value={newProject.clientId} onValueChange={(value) => handleSelectChange("clientId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.length > 0 ? (
                      clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} {client.company ? `(${client.company})` : ""}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-clients" disabled>
                        No hay clientes disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={newProject.status}
                  onValueChange={(value) =>
                    handleSelectChange("status", value as "planned" | "in-progress" | "completed")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planificado</SelectItem>
                    <SelectItem value="in-progress">En Progreso</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de Inicio</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={newProject.startDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha de Finalización</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={newProject.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descripción del proyecto"
                  value={newProject.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddProject}>{editingProjectId ? "Guardar Cambios" : "Añadir Proyecto"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
          <Input
            placeholder="Buscar proyectos..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex rounded-md overflow-hidden">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            className="rounded-r-none"
            onClick={() => setFilter("all")}
          >
            Todos
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="sm"
            className="rounded-none border-x-0"
            onClick={() => setFilter("active")}
          >
            Activos
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            className="rounded-none border-r-0"
            onClick={() => setFilter("completed")}
          >
            Completados
          </Button>
          <Button
            variant={filter === "planned" ? "default" : "outline"}
            size="sm"
            className="rounded-l-none"
            onClick={() => setFilter("planned")}
          >
            Planificados
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="bg-custom-1/10 pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span className="truncate">{project.name}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditProject(project)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(project.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                {getStatusBadge(project.status)}
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-textMuted" />
                    <span className="text-sm">{getClientName(project.clientId)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-textMuted" />
                    <span className="text-sm">
                      {project.startDate} {project.endDate ? `- ${project.endDate}` : ""}
                    </span>
                  </div>
                  {project.description && <p className="text-sm text-textMuted line-clamp-2">{project.description}</p>}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-end">
                <Button variant="outline" size="sm">
                  Ver Detalles
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center p-8 border border-dashed rounded-lg">
            <div className="text-center">
              <Briefcase className="mx-auto h-12 w-12 text-textMuted opacity-50" />
              <h3 className="mt-2 text-lg font-medium">No hay proyectos</h3>
              <p className="mt-1 text-sm text-textMuted">
                {searchTerm ? "No se encontraron proyectos con ese criterio" : "Comienza añadiendo un nuevo proyecto"}
              </p>
              {clients.length === 0 && (
                <div className="mt-4">
                  <p className="text-sm text-amber-500 mb-2">Necesitas crear clientes primero</p>
                  <Link href="/dashboard/clients">
                    <Button variant="outline" size="sm">
                      Ir a Clientes
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
