"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function RecentProjects() {
  const projects = [
    {
      id: "1",
      name: "Plataforma E-commerce",
      client: "Comercio Electrónico S.A.",
      status: "En Progreso",
      statusColor: "bg-highlight text-white",
      lastUpdated: "Hace 2 horas",
      assignee: {
        name: "María G.",
        avatar: "/team/maria.jpg",
        initials: "MG",
      },
    },
    {
      id: "2",
      name: "App Móvil de Finanzas",
      client: "Banco Nacional",
      status: "En Revisión",
      statusColor: "bg-amber-500 text-white",
      lastUpdated: "Hace 1 día",
      assignee: {
        name: "Carlos R.",
        avatar: "/team/carlos.jpg",
        initials: "CR",
      },
    },
    {
      id: "3",
      name: "Dashboard Analítico",
      client: "Consultora Datos",
      status: "Completado",
      statusColor: "bg-green-500 text-white",
      lastUpdated: "Hace 3 días",
      assignee: {
        name: "Ana L.",
        avatar: "/team/ana.jpg",
        initials: "AL",
      },
    },
    {
      id: "4",
      name: "Sistema de Gestión",
      client: "Industrias XYZ",
      status: "En Progreso",
      statusColor: "bg-highlight text-white",
      lastUpdated: "Hace 5 días",
      assignee: {
        name: "Juan P.",
        avatar: "/team/juan.jpg",
        initials: "JP",
      },
    },
  ]

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/dashboard/projects/${project.id}`}
          className="flex items-center justify-between p-4 rounded-lg border border-custom-2/20 bg-custom-1/10 hover:bg-custom-1/30 transition-colors"
        >
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{project.name}</span>
              <Badge className={project.statusColor}>{project.status}</Badge>
            </div>
            <span className="text-sm text-textMuted">{project.client}</span>
            <span className="text-xs text-textMuted">{project.lastUpdated}</span>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={project.assignee.avatar || "/placeholder.svg"} alt={project.assignee.name} />
            <AvatarFallback>{project.assignee.initials}</AvatarFallback>
          </Avatar>
        </Link>
      ))}
    </div>
  )
}
