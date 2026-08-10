"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/lib/uploadthing"
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
import { Plus, Loader2, ImagePlus, X } from "lucide-react"
import { SERVICE_TYPES, SERVICE_TYPE_META } from "@/components/shared/service-type"

interface ClientOption {
  id: string
  name: string | null
  email: string | null
}

const inputClass = "bg-black/40 border-[#08A696]/20 text-white placeholder:text-white/30 focus-visible:ring-[#26FFDF]/50"
const selectClass =
  "w-full bg-black/40 border border-[#08A696]/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#26FFDF] transition-colors"

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
    coverImage: "",
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
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          clientId: form.clientId,
          serviceType: form.serviceType,
          images: form.coverImage ? [form.coverImage] : [],
        }),
      })
      if (!res.ok) {throw new Error("create failed")}
      toast.success("Proyecto creado")
      setOpen(false)
      setForm({ name: "", description: "", clientId: "", serviceType: "other", coverImage: "" })
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
        <Button className="group relative bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-[#26FFDF] rounded-2xl shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10">
          <Plus className="h-4 w-4 mr-2" /> Nuevo proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border-[#08A696]/20 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Nuevo proyecto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Banner/logo: la misma miniatura cuadrada que ya usa la tarjeta
              del tablero (KanbanCard) — subir la imagen acá es lo que hace
              que el proyecto muestre su logo en vez del ícono genérico. */}
          <div>
            <Label>Logo / banner</Label>
            <div className="mt-1.5 flex items-center gap-4">
              <div className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-[#08A696]/30 bg-[#02505950] flex items-center justify-center">
                {form.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.coverImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImagePlus className="h-6 w-6 text-[#08A696]/50" />
                )}
                {form.coverImage && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, coverImage: "" })}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 border border-white/10 flex items-center justify-center text-white/70 hover:text-[#FF6B6B] transition-colors"
                    aria-label="Quitar imagen"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="min-w-0">
                <UploadButton<OurFileRouter, "imageUploader">
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {setForm((prev) => ({ ...prev, coverImage: res[0]!.url }))}
                    toast.success("Imagen cargada")
                  }}
                  onUploadError={(e) => { toast.error(e.message) }}
                  appearance={{
                    button:
                      "relative bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-[#26FFDF] rounded-xl text-xs font-medium shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10 after:hidden",
                    allowedContent: "text-[10px] text-textSecondary/60 mt-1",
                  }}
                  content={{ button: form.coverImage ? "Cambiar imagen" : "Subir imagen" }}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej: Tienda en línea de..."
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="clientId">Cliente</Label>
              <select
                id="clientId"
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                className={selectClass}
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
                className={selectClass}
              >
                {SERVICE_TYPES.map((value) => (
                  <option key={value} value={value}>
                    {SERVICE_TYPE_META[value].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Breve resumen del proyecto (opcional)"
              className={inputClass}
            />
          </div>
        </div>
        <DialogFooter>
          <div className="group relative w-full sm:w-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-2xl blur opacity-40 group-hover:opacity-60 transition-all duration-300" />
            <Button
              onClick={handleSave}
              disabled={saving}
              className="relative w-full sm:w-auto bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-[#26FFDF] rounded-2xl font-semibold shadow-lg transition-all duration-300 group-hover:border-[#08A696] group-hover:bg-[#02505950] group-hover:shadow-xl group-hover:shadow-[#08A696]/10"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Crear proyecto
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
