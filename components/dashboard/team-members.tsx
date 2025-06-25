"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Mail, Phone, MoreHorizontal, MessageSquare, UserCog, UserMinus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function TeamMembers() {
  const [searchQuery, setSearchQuery] = useState("")

  const members = [
    {
      id: "1",
      name: "María González",
      role: "Project Manager",
      email: "maria@v1tr0.com",
      phone: "+34 612 345 678",
      avatar: "/team/maria.jpg",
      initials: "MG",
      status: "Activo",
    },
    {
      id: "2",
      name: "Carlos Rodríguez",
      role: "UI/UX Designer",
      email: "carlos@v1tr0.com",
      phone: "+34 623 456 789",
      avatar: "/team/carlos.jpg",
      initials: "CR",
      status: "Activo",
    },
    {
      id: "3",
      name: "Ana López",
      role: "Frontend Developer",
      email: "ana@v1tr0.com",
      phone: "+34 634 567 890",
      avatar: "/team/ana.jpg",
      initials: "AL",
      status: "Activo",
    },
    {
      id: "4",
      name: "Juan Pérez",
      role: "Backend Developer",
      email: "juan@v1tr0.com",
      phone: "+34 645 678 901",
      avatar: "/team/juan.jpg",
      initials: "JP",
      status: "Activo",
    },
    {
      id: "5",
      name: "Laura Martínez",
      role: "QA Engineer",
      email: "laura@v1tr0.com",
      phone: "+34 656 789 012",
      avatar: "/team/laura.jpg",
      initials: "LM",
      status: "Activo",
    },
    {
      id: "6",
      name: "Miguel Sánchez",
      role: "DevOps Engineer",
      email: "miguel@v1tr0.com",
      phone: "+34 667 890 123",
      avatar: "/team/miguel.jpg",
      initials: "MS",
      status: "Ausente",
    },
  ]

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
          <Input
            placeholder="Buscar miembros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="highlight" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Añadir Miembro
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="border border-custom-2/20 rounded-lg p-4 bg-custom-1/10 hover:bg-custom-1/20 transition-colors"
          >
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-textMuted">{member.role}</p>
                    <Badge
                      className={member.status === "Activo" ? "bg-green-500 text-white" : "bg-amber-500 text-white"}
                    >
                      {member.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Más opciones</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Enviar Mensaje
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <UserCog className="h-4 w-4 mr-2" />
                    Editar Rol
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500">
                    <UserMinus className="h-4 w-4 mr-2" />
                    Eliminar del Equipo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-textMuted" />
                <span className="text-textMuted">{member.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-textMuted" />
                <span className="text-textMuted">{member.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="p-8 text-center text-textMuted border border-custom-2/20 rounded-lg">
          No se encontraron miembros que coincidan con la búsqueda.
        </div>
      )}
    </div>
  )
}
