"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Edit, Trash2, Mail, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TeamMember {
  id: string
  name: string
  email: string
  phone: string
  role: string
  avatar: string
  initials: string
  status: "active" | "inactive"
}

export default function TeamPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [members, setMembers] = useState<TeamMember[]>(() => {
    // Cargar miembros desde localStorage si existen
    if (typeof window !== "undefined") {
      const savedMembers = localStorage.getItem("teamMembers")
      if (savedMembers) {
        return JSON.parse(savedMembers)
      }
    }

    // Datos de ejemplo
    return [
      {
        id: "1",
        name: "María González",
        email: "maria@v1tr0.com",
        phone: "+34 612 345 678",
        role: "Project Manager",
        avatar: "/team/maria.jpg",
        initials: "MG",
        status: "active" as const,
      },
      {
        id: "2",
        name: "Carlos Rodríguez",
        email: "carlos@v1tr0.com",
        phone: "+34 623 456 789",
        role: "Developer",
        avatar: "/team/carlos.jpg",
        initials: "CR",
        status: "active" as const,
      },
      {
        id: "3",
        name: "Ana López",
        email: "ana@v1tr0.com",
        phone: "+34 634 567 890",
        role: "Designer",
        avatar: "/team/ana.jpg",
        initials: "AL",
        status: "active" as const,
      },
    ]
  })

  const [newMember, setNewMember] = useState<Omit<TeamMember, "id" | "initials">>({
    name: "",
    email: "",
    phone: "",
    role: "",
    avatar: "",
    status: "active",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)

  // Guardar miembros en localStorage cuando cambien
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("teamMembers", JSON.stringify(members))
    }
  }, [members])

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewMember((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewMember((prev) => ({ ...prev, [name]: value }))
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email || !newMember.role) {
      toast({
        title: "Error",
        description: "El nombre, email y rol son obligatorios.",
        variant: "destructive",
      })
      return
    }

    const memberToAdd = {
      ...newMember,
      id: editingMemberId || Date.now().toString(),
      initials: getInitials(newMember.name),
    }

    if (editingMemberId) {
      // Actualizar miembro existente
      setMembers((prev) => prev.map((member) => (member.id === editingMemberId ? memberToAdd : member)))
      toast({
        title: "Miembro actualizado",
        description: `${memberToAdd.name} ha sido actualizado correctamente.`,
      })
    } else {
      // Añadir nuevo miembro
      setMembers((prev) => [...prev, memberToAdd])
      toast({
        title: "Miembro añadido",
        description: `${memberToAdd.name} ha sido añadido correctamente.`,
      })
    }

    // Resetear formulario y cerrar diálogo
    setNewMember({
      name: "",
      email: "",
      phone: "",
      role: "",
      avatar: "",
      status: "active",
    })
    setEditingMemberId(null)
    setIsDialogOpen(false)
  }

  const handleEditMember = (member: TeamMember) => {
    setNewMember({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      avatar: member.avatar,
      status: member.status,
    })
    setEditingMemberId(member.id)
    setIsDialogOpen(true)
  }

  const handleDeleteMember = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este miembro del equipo?")) {
      setMembers((prev) => prev.filter((member) => member.id !== id))
      toast({
        title: "Miembro eliminado",
        description: "El miembro ha sido eliminado correctamente.",
      })
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Equipo</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Miembro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingMemberId ? "Editar Miembro" : "Añadir Nuevo Miembro"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nombre completo"
                    value={newMember.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Input
                    id="role"
                    name="role"
                    placeholder="Rol o cargo"
                    value={newMember.role}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={newMember.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+34 600 000 000"
                    value={newMember.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="avatar">URL de Avatar (opcional)</Label>
                  <Input
                    id="avatar"
                    name="avatar"
                    placeholder="https://ejemplo.com/avatar.jpg"
                    value={newMember.avatar}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={newMember.status}
                    onValueChange={(value) => handleSelectChange("status", value as "active" | "inactive")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddMember}>{editingMemberId ? "Guardar Cambios" : "Añadir Miembro"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
        <Input
          placeholder="Buscar miembros..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            <CardHeader className="bg-custom-1/10 pb-2">
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="block">{member.name}</span>
                    <span className="text-sm text-textMuted">{member.role}</span>
                  </div>
                </div>
                <Badge className={member.status === "active" ? "bg-green-500 text-white" : "bg-gray-400 text-white"}>
                  {member.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-textMuted" />
                  <span className="text-sm">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-textMuted" />
                  <span className="text-sm">{member.phone || "No especificado"}</span>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEditMember(member)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteMember(member.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
