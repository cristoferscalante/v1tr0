"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Mail, Phone, Building } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  address: string
  notes: string
  status: "active" | "inactive"
}

export default function ClientsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [newClient, setNewClient] = useState<Omit<Client, "id">>({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    status: "active",
  })

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClientId, setEditingClientId] = useState<string | null>(null)
  const [filter, setFilter] = useState("all")

  // Cargar clientes
  useEffect(() => {
    try {
      const savedClients = localStorage.getItem("clients")
      if (savedClients) {
        setClients(JSON.parse(savedClients))
      }
    } catch (error) {
      console.error("Error al cargar clientes:", error)
      setClients([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const filteredClients = clients.filter(
    (client) =>
      (client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filter === "all" || filter === client.status),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewClient((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddClient = () => {
    if (!newClient.name) {
      toast({
        title: "Error",
        description: "El nombre del cliente es obligatorio.",
        variant: "destructive",
      })
      return
    }

    const clientToAdd = {
      ...newClient,
      id: editingClientId || Date.now().toString(),
    }

    let updatedClients: Client[] = []

    if (editingClientId) {
      // Actualizar cliente existente
      updatedClients = clients.map((client) => (client.id === editingClientId ? clientToAdd : client))
      setClients(updatedClients)
      toast({
        title: "Cliente actualizado",
        description: `${clientToAdd.name} ha sido actualizado correctamente.`,
      })
    } else {
      // Añadir nuevo cliente
      updatedClients = [...clients, clientToAdd]
      setClients(updatedClients)
      toast({
        title: "Cliente añadido",
        description: `${clientToAdd.name} ha sido añadido correctamente.`,
      })
    }

    // Guardar en localStorage
    try {
      localStorage.setItem("clients", JSON.stringify(updatedClients))
    } catch (error) {
      console.error("Error al guardar en localStorage:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el cliente. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }

    // Resetear formulario y cerrar diálogo
    setNewClient({
      name: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
      status: "active",
    })
    setEditingClientId(null)
    setIsDialogOpen(false)
  }

  const handleEditClient = (client: Client) => {
    setNewClient({
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      address: client.address,
      notes: client.notes,
      status: client.status,
    })
    setEditingClientId(client.id)
    setIsDialogOpen(true)
  }

  const handleDeleteClient = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      const updatedClients = clients.filter((client) => client.id !== id)
      setClients(updatedClients)

      // Guardar en localStorage
      try {
        localStorage.setItem("clients", JSON.stringify(updatedClients))
        toast({
          title: "Cliente eliminado",
          description: "El cliente ha sido eliminado correctamente.",
        })
      } catch (error) {
        console.error("Error al guardar en localStorage:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el cliente. Inténtalo de nuevo.",
          variant: "destructive",
        })
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 text-white">Activo</Badge>
      case "inactive":
        return <Badge className="bg-gray-400 text-white">Inactivo</Badge>
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingClientId ? "Editar Cliente" : "Añadir Nuevo Cliente"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nombre del cliente"
                    value={newClient.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Nombre de la empresa"
                    value={newClient.company}
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
                    value={newClient.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+34 600 000 000"
                    value={newClient.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Dirección completa"
                  value={newClient.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Notas adicionales sobre el cliente"
                  value={newClient.notes}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={newClient.status === "active"}
                      onChange={() => setNewClient((prev) => ({ ...prev, status: "active" }))}
                      className="h-4 w-4"
                    />
                    <span>Activo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={newClient.status === "inactive"}
                      onChange={() => setNewClient((prev) => ({ ...prev, status: "inactive" }))}
                      className="h-4 w-4"
                    />
                    <span>Inactivo</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddClient}>{editingClientId ? "Guardar Cambios" : "Añadir Cliente"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
          <Input
            placeholder="Buscar clientes..."
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
            variant={filter === "inactive" ? "default" : "outline"}
            size="sm"
            className="rounded-l-none"
            onClick={() => setFilter("inactive")}
          >
            Inactivos
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <Card key={client.id} className="overflow-hidden">
              <CardHeader className="bg-custom-1/10 pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span className="truncate">{client.name}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClient(client)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClient(client.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                {getStatusBadge(client.status)}
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {client.company && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-textMuted" />
                      <span className="text-sm">{client.company}</span>
                    </div>
                  )}
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-textMuted" />
                      <span className="text-sm">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-textMuted" />
                      <span className="text-sm">{client.phone}</span>
                    </div>
                  )}
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
              <Building className="mx-auto h-12 w-12 text-textMuted opacity-50" />
              <h3 className="mt-2 text-lg font-medium">No hay clientes</h3>
              <p className="mt-1 text-sm text-textMuted">
                {searchTerm ? "No se encontraron clientes con ese criterio" : "Comienza añadiendo un nuevo cliente"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
