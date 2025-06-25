"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Edit, MoreHorizontal, Share, Star, Users } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ProjectHeaderProps {
  projectId: string
}

export function ProjectHeader({ projectId }: ProjectHeaderProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  // En un caso real, estos datos vendrían de una API o base de datos
  const project = {
    id: projectId,
    name: "Plataforma E-commerce",
    client: "Comercio Electrónico S.A.",
    status: "En Progreso",
    startDate: "15 Mar 2023",
    endDate: "30 Sep 2023",
    progress: 65,
    manager: {
      name: "María González",
      avatar: "/team/maria.jpg",
      initials: "MG",
    },
    team: [
      {
        name: "Carlos Rodríguez",
        avatar: "/team/carlos.jpg",
        initials: "CR",
      },
      {
        name: "Ana López",
        avatar: "/team/ana.jpg",
        initials: "AL",
      },
      {
        name: "Juan Pérez",
        avatar: "/team/juan.jpg",
        initials: "JP",
      },
      {
        name: "Pedro Sánchez",
        avatar: "/team/pedro.jpg",
        initials: "PS",
      },
    ],
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${isFavorite ? "text-yellow-400" : "text-textMuted"}`}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Star className="h-5 w-5 fill-current" />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <Badge className="bg-highlight text-white">{project.status}</Badge>
          <div className="flex items-center text-sm text-textMuted">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {project.startDate} - {project.endDate}
            </span>
          </div>
          <div className="flex items-center text-sm text-textMuted">
            <Clock className="h-4 w-4 mr-1" />
            <span>Progreso: {project.progress}%</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-textMuted">Equipo:</span>
          <div className="flex -space-x-2">
            {project.team.map((member, index) => (
              <Avatar key={index} className="h-8 w-8 border-2 border-backgroundSecondary">
                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Gestionar Equipo
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Compartir
          </Button>
          <Button size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Duplicar Proyecto</DropdownMenuItem>
              <DropdownMenuItem>Exportar Datos</DropdownMenuItem>
              <DropdownMenuItem>Archivar Proyecto</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
