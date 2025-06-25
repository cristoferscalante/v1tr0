"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Clock, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function ClientProjectList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  // Datos de ejemplo para los proyectos
  const projects = [
    {
      id: "1",
      name: "Plataforma E-commerce",
      description: "Desarrollo de una plataforma de comercio electrónico con gestión de inventario y pagos.",
      startDate: "15 Mar 2023",
      endDate: "30 Sep 2023",
      status: "in-progress",
      progress: 65,
      manager: "María González",
    },
    {
      id: "2",
      name: "App Móvil de Fidelización",
      description: "Aplicación móvil para programa de fidelización de clientes con sistema de puntos y recompensas.",
      startDate: "10 Ene 2023",
      endDate: "30 Jun 2023",
      status: "completed",
      progress: 100,
      manager: "Carlos Rodríguez",
    },
    {
      id: "3",
      name: "Rediseño de Sitio Web Corporativo",
      description: "Rediseño completo del sitio web corporativo con enfoque en experiencia de usuario y SEO.",
      startDate: "05 Feb 2023",
      endDate: "15 Abr 2023",
      status: "completed",
      progress: 100,
      manager: "Ana López",
    },
    {
      id: "4",
      name: "Sistema de Gestión de Inventario",
      description: "Desarrollo de un sistema de gestión de inventario con seguimiento en tiempo real y reportes.",
      startDate: "20 Jun 2023",
      endDate: "15 Dic 2023",
      status: "planned",
      progress: 0,
      manager: "Pedro Sánchez",
    },
  ]

  // Filtrar proyectos según el término de búsqueda y el filtro
  const filteredProjects = projects.filter(
    (project) =>
      (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filter === "all" ||
        (filter === "active" && project.status === "in-progress") ||
        (filter === "completed" && project.status === "completed") ||
        (filter === "planned" && project.status === "planned")),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
          <Input
            type="search"
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

      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="p-4 rounded-lg border border-custom-2/20 bg-custom-1/10 hover:bg-custom-1/30 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-medium">{project.name}</h3>
                  <Badge
                    className={
                      project.status === "completed"
                        ? "bg-green-500 text-white"
                        : project.status === "in-progress"
                          ? "bg-highlight text-white"
                          : "bg-gray-400 text-white"
                    }
                  >
                    {project.status === "completed"
                      ? "Completado"
                      : project.status === "in-progress"
                        ? "En Progreso"
                        : "Planificado"}
                  </Badge>
                </div>
                <p className="text-sm text-textMuted mb-3">{project.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-textMuted">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      {project.startDate} - {project.endDate}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Progreso: {project.progress}%</span>
                  </div>
                  <div>
                    <span>Gestor: {project.manager}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/dashboard/projects/${project.id}`} passHref>
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </span>
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver Línea de Tiempo</DropdownMenuItem>
                    <DropdownMenuItem>Ver Documentos</DropdownMenuItem>
                    <DropdownMenuItem>Ver Pagos</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {project.status === "in-progress" && (
              <div className="mt-4 pt-4 border-t border-custom-2/10">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-custom-1/30 rounded-full overflow-hidden">
                    <div className="h-full bg-highlight rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                  <span className="text-xs font-medium">{project.progress}%</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
