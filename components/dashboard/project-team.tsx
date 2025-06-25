"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Mail, Phone, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ProjectTeamProps {
  projectId?: string
}

export function ProjectTeam({ projectId }: ProjectTeamProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Datos de ejemplo para los miembros del equipo
  const teamMembers = [
    {
      id: "1",
      name: "María González",
      role: "Project Manager",
      email: "maria.gonzalez@v1tr0.com",
      phone: "+34 612 345 678",
      avatar: "/team/maria.jpg",
      initials: "MG",
      department: "Gestión",
      status: "active",
    },
    {
      id: "2",
      name: "Carlos Rodríguez",
      role: "Analista de Sistemas",
      email: "carlos.rodriguez@v1tr0.com",
      phone: "+34 623 456 789",
      avatar: "/team/carlos.jpg",
      initials: "CR",
      department: "Análisis",
      status: "active",
    },
    {
      id: "3",
      name: "Ana López",
      role: "Diseñadora UI/UX",
      email: "ana.lopez@v1tr0.com",
      phone: "+34 634 567 890",
      avatar: "/team/ana.jpg",
      initials: "AL",
      department: "Diseño",
      status: "active",
    },
    {
      id: "4",
      name: "Juan Pérez",
      role: "Desarrollador Frontend",
      email: "juan.perez@v1tr0.com",
      phone: "+34 645 678 901",
      avatar: "/team/juan.jpg",
      initials: "JP",
      department: "Desarrollo",
      status: "active",
    },
    {
      id: "5",
      name: "Pedro Sánchez",
      role: "Desarrollador Backend",
      email: "pedro.sanchez@v1tr0.com",
      phone: "+34 656 789 012",
      avatar: "/team/pedro.jpg",
      initials: "PS",
      department: "Desarrollo",
      status: "active",
    },
    {
      id: "6",
      name: "Laura Martínez",
      role: "QA Tester",
      email: "laura.martinez@v1tr0.com",
      phone: "+34 667 890 123",
      avatar: "/team/laura.jpg",
      initials: "LM",
      department: "Calidad",
      status: "active",
    },
    {
      id: "7",
      name: "Roberto Fernández",
      role: "DevOps Engineer",
      email: "roberto.fernandez@v1tr0.com",
      phone: "+34 678 901 234",
      avatar: "/team/roberto.jpg",
      initials: "RF",
      department: "Infraestructura",
      status: "inactive",
    },
  ]

  // Filtrar miembros según el término de búsqueda
  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
          <Input
            type="search"
            placeholder="Buscar miembros..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Añadir Miembro
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="flex flex-col p-4 rounded-lg border border-custom-2/20 bg-custom-1/10 hover:bg-custom-1/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-sm text-textMuted">{member.role}</p>
                  <Badge
                    className={
                      member.status === "active" ? "bg-green-500 text-white mt-1" : "bg-gray-400 text-white mt-1"
                    }
                  >
                    {member.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Mail className="h-4 w-4 mr-2" />
                    <span>Enviar Email</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Phone className="h-4 w-4 mr-2" />
                    <span>Llamar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-auto pt-4 border-t border-custom-2/10">
              <div className="flex flex-col space-y-1 text-xs text-textMuted">
                <div className="flex items-center">
                  <Mail className="h-3 w-3 mr-2" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-3 w-3 mr-2" />
                  <span>{member.phone}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
