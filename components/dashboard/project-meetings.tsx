"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Calendar, Clock, Users, Video, MapPin, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ProjectMeetingsProps {
  projectId?: string
}

export function ProjectMeetings({ projectId }: ProjectMeetingsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  // Datos de ejemplo para las reuniones
  const meetings = [
    {
      id: "1",
      title: "Reunión Inicial",
      date: "15 Mar 2023",
      time: "10:00 - 11:30",
      type: "Presencial",
      location: "Oficina Central",
      status: "completed",
      attendees: [
        {
          name: "María González",
          avatar: "/team/maria.jpg",
          initials: "MG",
        },
        {
          name: "Carlos Rodríguez",
          avatar: "/team/carlos.jpg",
          initials: "CR",
        },
        {
          name: "Cliente",
          avatar: "/team/cliente.jpg",
          initials: "CL",
        },
      ],
      description: "Reunión inicial para definir los objetivos y alcance del proyecto.",
    },
    {
      id: "2",
      title: "Revisión de Requisitos",
      date: "22 Mar 2023",
      time: "15:00 - 16:30",
      type: "Virtual",
      location: "Google Meet",
      status: "completed",
      attendees: [
        {
          name: "María González",
          avatar: "/team/maria.jpg",
          initials: "MG",
        },
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
          name: "Cliente",
          avatar: "/team/cliente.jpg",
          initials: "CL",
        },
      ],
      description: "Revisión y validación de los requisitos funcionales y no funcionales del sistema.",
    },
    {
      id: "3",
      title: "Presentación de Diseños",
      date: "10 Abr 2023",
      time: "11:00 - 12:30",
      type: "Virtual",
      location: "Zoom",
      status: "completed",
      attendees: [
        {
          name: "María González",
          avatar: "/team/maria.jpg",
          initials: "MG",
        },
        {
          name: "Ana López",
          avatar: "/team/ana.jpg",
          initials: "AL",
        },
        {
          name: "Cliente",
          avatar: "/team/cliente.jpg",
          initials: "CL",
        },
      ],
      description: "Presentación de los diseños de UI/UX al cliente para su aprobación.",
    },
    {
      id: "4",
      title: "Seguimiento Quincenal",
      date: "25 Abr 2023",
      time: "10:00 - 11:00",
      type: "Virtual",
      location: "Microsoft Teams",
      status: "completed",
      attendees: [
        {
          name: "María González",
          avatar: "/team/maria.jpg",
          initials: "MG",
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
        {
          name: "Cliente",
          avatar: "/team/cliente.jpg",
          initials: "CL",
        },
      ],
      description: "Reunión quincenal de seguimiento del proyecto.",
    },
    {
      id: "5",
      title: "Seguimiento Quincenal",
      date: "09 May 2023",
      time: "10:00 - 11:00",
      type: "Virtual",
      location: "Microsoft Teams",
      status: "completed",
      attendees: [
        {
          name: "María González",
          avatar: "/team/maria.jpg",
          initials: "MG",
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
        {
          name: "Cliente",
          avatar: "/team/cliente.jpg",
          initials: "CL",
        },
      ],
      description: "Reunión quincenal de seguimiento del proyecto.",
    },
    {
      id: "6",
      title: "Seguimiento Quincenal",
      date: "23 May 2023",
      time: "10:00 - 11:00",
      type: "Virtual",
      location: "Microsoft Teams",
      status: "completed",
      attendees: [
        {
          name: "María González",
          avatar: "/team/maria.jpg",
          initials: "MG",
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
        {
          name: "Cliente",
          avatar: "/team/cliente.jpg",
          initials: "CL",
        },
      ],
      description: "Reunión quincenal de seguimiento del proyecto.",
    },
    {
      id: "7",
      title: "Revisión de Avance",
      date: "15 Jun 2023",
      time: "15:00 - 16:30",
      type: "Presencial",
      location: "Oficina Cliente",
      status: "scheduled",
      attendees: [
        {
          name: "María González",
          avatar: "/team/maria.jpg",
          initials: "MG",
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
        {
          name: "Cliente",
          avatar: "/team/cliente.jpg",
          initials: "CL",
        },
      ],
      description: "Presentación del avance del proyecto al cliente. Revisión de objetivos y ajustes de planificación.",
    },
    {
      id: "8",
      title: "Seguimiento Quincenal",
      date: "20 Jun 2023",
      time: "10:00 - 11:00",
      type: "Virtual",
      location: "Microsoft Teams",
      status: "scheduled",
      attendees: [
        {
          name: "María González",
          avatar: "/team/maria.jpg",
          initials: "MG",
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
        {
          name: "Cliente",
          avatar: "/team/cliente.jpg",
          initials: "CL",
        },
      ],
      description: "Reunión quincenal de seguimiento del proyecto.",
    },
  ]

  // Filtrar reuniones según el término de búsqueda y el filtro
  const filteredMeetings = meetings.filter(
    (meeting) =>
      (meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filter === "all" ||
        (filter === "upcoming" && meeting.status === "scheduled") ||
        (filter === "past" && meeting.status === "completed")),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
          <Input
            type="search"
            placeholder="Buscar reuniones..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-md overflow-hidden">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setFilter("all")}
            >
              Todas
            </Button>
            <Button
              variant={filter === "upcoming" ? "default" : "outline"}
              size="sm"
              className="rounded-none border-x-0"
              onClick={() => setFilter("upcoming")}
            >
              Próximas
            </Button>
            <Button
              variant={filter === "past" ? "default" : "outline"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setFilter("past")}
            >
              Pasadas
            </Button>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Reunión
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="flex flex-col p-4 rounded-lg border border-custom-2/20 bg-custom-1/10 hover:bg-custom-1/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{meeting.title}</h4>
                  <Badge
                    className={meeting.status === "completed" ? "bg-green-500 text-white" : "bg-amber-500 text-white"}
                  >
                    {meeting.status === "completed" ? "Completada" : "Programada"}
                  </Badge>
                </div>
                <p className="text-sm text-textMuted mt-1">{meeting.description}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Añadir al Calendario</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Video className="h-4 w-4 mr-2" />
                    <span>Unirse</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-col space-y-2 text-sm text-textMuted">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{meeting.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{meeting.time}</span>
              </div>
              <div className="flex items-center">
                {meeting.type === "Virtual" ? <Video className="h-4 w-4 mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}
                <span>
                  {meeting.type}: {meeting.location}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-custom-2/10">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-textMuted" />
                <span className="text-sm text-textMuted mr-2">Asistentes:</span>
                <div className="flex -space-x-2">
                  {meeting.attendees.map((attendee, index) => (
                    <Avatar key={index} className="h-6 w-6 border-2 border-backgroundSecondary">
                      <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                      <AvatarFallback>{attendee.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
