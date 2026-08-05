"use client"

import { useState } from "react"
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
import { Label } from "@/components/ui/label"
import { Pencil, Loader2 } from "lucide-react"

interface Client {
  id: string
  name: string | null
  phone: string | null
  role: string
  accountStatus: string
  accountType: string
  credits: number
}

export default function ClientEditDialog({ client }: { client: Client }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: client.name ?? "",
    phone: client.phone ?? "",
    role: client.role,
    accountStatus: client.accountStatus,
    accountType: client.accountType,
    credits: client.credits,
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {throw new Error("No se pudo guardar")}
      toast.success("Cliente actualizado")
      setOpen(false)
      router.refresh()
    } catch {
      toast.error("Error al guardar los cambios")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-[#08A696]/40 text-[#26FFDF]">
          <Pencil className="h-4 w-4 mr-2" /> Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border-[#08A696]/20">
        <DialogHeader>
          <DialogTitle className="text-white">Editar cliente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="role">Rol</Label>
            <select
              id="role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full bg-black/40 border border-[#08A696]/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="client">Cliente</option>
              <option value="team">Equipo</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <Label htmlFor="accountStatus">Estado</Label>
            <select
              id="accountStatus"
              value={form.accountStatus}
              onChange={(e) => setForm({ ...form, accountStatus: e.target.value })}
              className="w-full bg-black/40 border border-[#08A696]/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
          <div>
            <Label htmlFor="credits">Créditos</Label>
            <Input
              id="credits"
              type="number"
              value={form.credits}
              onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={saving} className="bg-[#08A696] hover:bg-[#08A696]/80">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
