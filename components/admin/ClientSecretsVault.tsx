"use client"

import { useEffect, useState } from "react"
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
import { Panel } from "@/components/shared/panel-ui"
import { KeyRound, Plus, Eye, EyeOff, Copy, Trash2, Loader2, ShieldAlert } from "lucide-react"

interface SecretRow {
  id: string
  label: string
  notes: string | null
  lastRevealedAt: string | null
  createdAt: string
}

export default function ClientSecretsVault({ clientId }: { clientId: string }) {
  const [secrets, setSecrets] = useState<SecretRow[]>([])
  const [loading, setLoading] = useState(true)
  const [revealed, setRevealed] = useState<Record<string, string>>({})
  const [revealingId, setRevealingId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ label: "", value: "", notes: "" })

  const load = async () => {
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/secrets`)
      if (res.ok) {
        const data = await res.json()
        setSecrets(data.secrets ?? [])
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId])

  const handleCreate = async () => {
    if (!form.label.trim() || !form.value.trim()) {
      toast.error("Nombre y valor son requeridos")
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/secrets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {throw new Error("create failed")}
      toast.success("Clave guardada (cifrada)")
      setForm({ label: "", value: "", notes: "" })
      setDialogOpen(false)
      await load()
    } catch {
      toast.error("No se pudo guardar la clave")
    } finally {
      setSaving(false)
    }
  }

  const handleReveal = async (id: string) => {
    if (revealed[id]) {
      setRevealed((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      return
    }
    setRevealingId(id)
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/secrets/${id}/reveal`, { method: "POST" })
      if (!res.ok) {throw new Error("reveal failed")}
      const data = await res.json()
      setRevealed((prev) => ({ ...prev, [id]: data.value }))
      await load()
    } catch {
      toast.error("No se pudo revelar la clave")
    } finally {
      setRevealingId(null)
    }
  }

  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value)
    toast.success("Copiado al portapapeles")
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta clave? No se puede deshacer.")) {return}
    try {
      const res = await fetch(`/api/admin/clients/${clientId}/secrets/${id}`, { method: "DELETE" })
      if (!res.ok) {throw new Error("delete failed")}
      toast.success("Clave eliminada")
      await load()
    } catch {
      toast.error("No se pudo eliminar la clave")
    }
  }

  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-[#26FFDF]" /> Claves y Tokens
        </h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="border-[#08A696]/40 text-[#26FFDF]">
              <Plus className="h-4 w-4 mr-1.5" /> Agregar
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black border-[#08A696]/20">
            <DialogHeader>
              <DialogTitle className="text-white">Nueva clave</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="secretLabel">Nombre</Label>
                <Input
                  id="secretLabel"
                  placeholder="Ej: Token API Vercel, Contraseña hosting..."
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="secretValue">Valor</Label>
                <Input
                  id="secretValue"
                  type="password"
                  placeholder="Se cifra antes de guardarse"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="secretNotes">Notas (opcional)</Label>
                <Textarea
                  id="secretNotes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} disabled={saving} className="bg-[#08A696] hover:bg-[#08A696]/80">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Guardar cifrado
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <p className="flex items-center gap-1.5 text-textSecondary/70 text-xs mb-4">
        <ShieldAlert className="h-3 w-3" /> Cifrado en reposo (AES-256-GCM). Solo admin/team pueden verlas.
      </p>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-[#26FFDF]" />
        </div>
      ) : secrets.length === 0 ? (
        <p className="text-textSecondary text-sm py-6 text-center">Sin claves guardadas</p>
      ) : (
        <div className="space-y-2">
          {secrets.map((s) => (
            <div key={s.id} className="rounded-xl border border-[#08A696]/15 bg-[#02505931] p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{s.label}</p>
                  {s.notes && <p className="text-textSecondary text-xs truncate">{s.notes}</p>}
                  {revealed[s.id] ? (
                    <p className="mt-1.5 font-mono text-xs text-[#26FFDF] bg-black/40 rounded-lg px-2 py-1 break-all">
                      {revealed[s.id]}
                    </p>
                  ) : (
                    <p className="mt-1.5 font-mono text-xs text-textSecondary/50 tracking-widest">••••••••••••</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {revealed[s.id] && (
                    <button
                      onClick={() => handleCopy(revealed[s.id]!)}
                      className="p-2 rounded-lg text-textSecondary hover:text-[#26FFDF] hover:bg-white/5 transition-colors"
                      title="Copiar"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleReveal(s.id)}
                    disabled={revealingId === s.id}
                    className="p-2 rounded-lg text-textSecondary hover:text-[#26FFDF] hover:bg-white/5 transition-colors"
                    title={revealed[s.id] ? "Ocultar" : "Revelar"}
                  >
                    {revealingId === s.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : revealed[s.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-2 rounded-lg text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}
