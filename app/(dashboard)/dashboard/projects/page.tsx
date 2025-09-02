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
    startDate: new Date().toISOString().split("T")[0] || "",
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



  // Si hay un error, mostrar mensaje de error
  if (error) {
    return (
      <div className="flex-1 p-8 flex flex-col justify-center items-center">
        <div className="p-3 rounded-full bg-red-500/10 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-400"
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
        <h2 className="text-xl font-bold text-white mb-2">Error al cargar los datos</h2>
        <p className="text-gray-300 mb-4 text-center">
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
        startDate: new Date().toISOString().split("T")[0] || "",
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
        <h2 className="text-3xl font-bold tracking-tight text-white">Proyectos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl transition-all duration-300 transform scale-95 hover:scale-100 hover:border-[#08A696] hover:bg-[#02505950] text-white inline-flex items-center px-6 py-3 font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-white font-bold">{editingProjectId ? "Editar Proyecto" : "Añadir Nuevo Proyecto"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-medium">Nombre del Proyecto</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nombre del proyecto"
                  value={newProject.name}
                  onChange={handleInputChange}
                  className="rounded-2xl border-[#08A696]/30 bg-[#02505931] backdrop-blur-sm transition-all duration-300 focus:border-[#08A696] focus:ring-2 focus:ring-[#08A696]/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientId" className="text-white font-medium">Cliente</Label>
                <Select value={newProject.clientId} onValueChange={(value) => handleSelectChange("clientId", value)}>
                  <SelectTrigger className="rounded-2xl border-[#08A696]/30 bg-[#02505931] backdrop-blur-sm transition-all duration-300 focus:border-[#08A696] focus:ring-2 focus:ring-[#08A696]/20 text-white">
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
                <Label htmlFor="status" className="text-white font-medium">Estado</Label>
                <Select
                  value={newProject.status}
                  onValueChange={(value) =>
                    handleSelectChange("status", value as "planned" | "in-progress" | "completed")
                  }
                >
                  <SelectTrigger className="rounded-2xl border-[#08A696]/30 bg-[#02505931] backdrop-blur-sm transition-all duration-300 focus:border-[#08A696] focus:ring-2 focus:ring-[#08A696]/20 text-white">
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
                  <Label htmlFor="startDate" className="text-white font-medium">Fecha de Inicio</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={newProject.startDate}
                    onChange={handleInputChange}
                    className="rounded-2xl border-[#08A696]/30 bg-[#02505931] backdrop-blur-sm transition-all duration-300 focus:border-[#08A696] focus:ring-2 focus:ring-[#08A696]/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-white font-medium">Fecha de Finalización</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={newProject.endDate}
                    onChange={handleInputChange}
                    className="rounded-2xl border-[#08A696]/30 bg-[#02505931] backdrop-blur-sm transition-all duration-300 focus:border-[#08A696] focus:ring-2 focus:ring-[#08A696]/20 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white font-medium">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descripción del proyecto"
                  value={newProject.description}
                  onChange={handleInputChange}
                  className="rounded-2xl border-[#08A696]/30 bg-[#02505931] backdrop-blur-sm transition-all duration-300 focus:border-[#08A696] focus:ring-2 focus:ring-[#08A696]/20 text-white placeholder:text-gray-400 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddProject} className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl transition-all duration-300 transform scale-95 hover:scale-100 hover:border-[#08A696] hover:bg-[#02505950] text-white px-6 py-3 font-semibold">
                {editingProjectId ? "Guardar Cambios" : "Añadir Proyecto"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar proyectos..."
            className="pl-10 rounded-2xl border-[#08A696]/30 bg-[#02505931] backdrop-blur-sm transition-all duration-300 focus:border-[#08A696] focus:ring-2 focus:ring-[#08A696]/20 text-white placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex rounded-2xl overflow-hidden border border-[#08A696]/20">
          <Button
            className={`${filter === "all" ? "bg-[#02505931] backdrop-blur-sm border-[#08A696]/30 text-white" : "bg-transparent text-gray-400 hover:bg-[#02505931] hover:backdrop-blur-sm hover:text-white"} rounded-r-none border-r border-[#08A696]/20`}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Todos
          </Button>
          <Button
            className={`${filter === "active" ? "bg-[#02505931] backdrop-blur-sm border-[#08A696]/30 text-white" : "bg-transparent text-gray-400 hover:bg-[#02505931] hover:backdrop-blur-sm hover:text-white"} rounded-none border-x border-[#08A696]/20`}
            size="sm"
            onClick={() => setFilter("active")}
          >
            Activos
          </Button>
          <Button
            className={`${filter === "completed" ? "bg-[#02505931] backdrop-blur-sm border-[#08A696]/30 text-white" : "bg-transparent text-gray-400 hover:bg-[#02505931] hover:backdrop-blur-sm hover:text-white"} rounded-none border-l border-[#08A696]/20`}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Completados
          </Button>
          <Button
            className={`${filter === "planned" ? "bg-[#02505931] backdrop-blur-sm border-[#08A696]/30 text-white" : "bg-transparent text-gray-400 hover:bg-[#02505931] hover:backdrop-blur-sm hover:text-white"} rounded-l-none border-l border-[#08A696]/20`}
            size="sm"
            onClick={() => setFilter("planned")}
          >
            Planificados
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 rounded-2xl transition-all duration-300 hover:border-[#08A696]">
              <CardHeader className="bg-[#08A696]/5 pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span className="truncate text-white">{project.name}</span>
                  <div className="flex gap-2">
                    <Button className="bg-[#08A696]/10 hover:bg-[#08A696]/20 text-white border-none p-1 h-8 w-8 rounded" onClick={() => handleEditProject(project)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-none p-1 h-8 w-8 rounded" onClick={() => handleDeleteProject(project.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                {getStatusBadge(project.status)}
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{getClientName(project.clientId)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">
                      {project.startDate} {project.endDate ? `- ${project.endDate}` : ""}
                    </span>
                  </div>
                  {project.description && <p className="text-sm text-gray-300 line-clamp-2">{project.description}</p>}
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#08A696]/20 pt-4 flex justify-end">
                <Button className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-xl transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] text-white px-4 py-2 text-sm">
                  Ver Detalles
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center p-8 border border-dashed border-[#08A696]/30 rounded-2xl bg-[#02505931] backdrop-blur-sm">
            <div className="text-center">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400 opacity-50" />
              <h3 className="mt-2 text-lg font-medium text-white">No hay proyectos</h3>
              <p className="mt-1 text-sm text-gray-300">
                {searchTerm ? "No se encontraron proyectos con ese criterio" : "Comienza añadiendo un nuevo proyecto"}
              </p>
              {clients.length === 0 && (
                <div className="mt-4">
                  <p className="text-sm text-amber-400 mb-2">Necesitas crear clientes primero</p>
                  <Link href="/dashboard/clients">
                    <Button className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-xl transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] text-white px-4 py-2 text-sm">
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
