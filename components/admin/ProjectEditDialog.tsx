"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { SERVICE_TYPES, SERVICE_TYPE_META } from "@/components/shared/service-type"

interface ClientOption {
  id: string
  name: string | null
  email: string | null
}

export default function ProjectEditDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [clients, setClients] = useState<ClientOption[]>([])
  const [form, setForm] = useState({
    name: "",
    description: "",
    clientId: "",
    serviceType: "other",
  })

  useEffect(() => {
    if (!open) {return}
    fetch("/api/admin/clients?pageSize=100")
      .then((res) => res.json())
      .then((data) => setClients(data.clients ?? []))
      .catch(() => setClients([]))
  }, [open])

  const handleSave = async () => {
    if (!form.name || !form.clientId) {
      toast.error("Nombre y cliente son requeridos")
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {throw new Error("create failed")}
      toast.success("Proyecto creado")
      setOpen(false)
      setForm({ name: "", description: "", clientId: "", serviceType: "other" })
      router.refresh()
    } catch {
      toast.error("No se pudo crear el proyecto")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#08A696]/20 border border-[#08A696]/50 text-[#26FFDF] hover:bg-[#08A696]/30">
          <Plus className="h-4 w-4 mr-2" /> Nuevo proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border-[#08A696]/20">
        <DialogHeader>
          <DialogTitle className="text-white">Nuevo proyecto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="clientId">Cliente</Label>
            <select
              id="clientId"
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              className="w-full bg-black/40 border border-[#08A696]/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">Selecciona un cliente</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name ?? c.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="serviceType">Tipo de servicio</Label>
            <select
              id="serviceType"
              value={form.serviceType}
              onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
              className="w-full bg-black/40 border border-[#08A696]/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              {SERVICE_TYPES.map((value) => (
                <option key={value} value={value}>
                  {SERVICE_TYPE_META[value].label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={saving} className="bg-[#08A696] hover:bg-[#08A696]/80">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Crear proyecto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
