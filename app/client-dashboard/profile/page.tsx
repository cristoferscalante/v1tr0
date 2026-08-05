'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useAuth } from '@/hooks/use-auth'
import { Mail, Shield, Save, Loader2, Camera } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { UploadButton } from '@uploadthing/react'
import type { OurFileRouter } from '@/lib/uploadthing'
import { Panel, PanelPage, Pill, SectionHeading } from '@/components/shared/panel-ui'

const inputClass =
  'w-full mt-1.5 bg-[#02505950] border border-[#08A696]/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-textSecondary/50 focus:outline-none focus:border-[#26FFDF] transition-colors'

export default function ProfilePage() {
  const { user, userRole } = useAuth()
  const { update } = useSession()
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const roleLabel = userRole === 'admin' ? 'Administrador' : userRole === 'team' ? 'Equipo' : 'Cliente'

  useEffect(() => {
    setName(user?.name ?? '')
  }, [user?.name])

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.phone) {setPhone(data.phone)}
      })
      .catch(() => { /* el teléfono es opcional */ })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      })
      if (!res.ok) {throw new Error('save failed')}
      await update({ name })
      toast.success('Perfil actualizado')
    } catch {
      toast.error('No se pudieron guardar los cambios')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PanelPage className="max-w-3xl">
      <SectionHeading
        badge="Cuenta"
        title="Mi Perfil"
        subtitle="Gestiona tu información personal"
      />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Panel className="p-6 sm:p-8 space-y-6">
          {/* Identidad */}
          <div className="flex items-center gap-5 pb-6 border-b border-[#08A696]/15">
            <div className="relative shrink-0 group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#08A696] to-[#26FFDF] rounded-full blur-sm opacity-50" />
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-[#08A696] to-[#26FFDF] flex items-center justify-center text-2xl font-bold text-black">
                {avatarUrl || user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl ?? user?.image ?? ''} alt="" className="w-full h-full object-cover" />
                ) : (
                  (user?.name ?? user?.email ?? '?').charAt(0).toUpperCase()
                )}
              </div>
              <UploadButton<OurFileRouter, "imageUploader">
                endpoint="imageUploader"
                onClientUploadComplete={(res) => { if (res?.[0]) {setAvatarUrl(res[0].url)} toast.success('Foto actualizada') }}
                onUploadError={(e) => { toast.error(e.message) }}
                appearance={{
                  button: 'absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-r from-[#08A696] to-[#26FFDF] flex items-center justify-center border-2 border-[#025059] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer',
                  allowedContent: 'hidden',
                }}
                content={{ button: <Camera className="w-3.5 h-3.5 text-black" /> }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-lg truncate">{user?.name ?? 'Sin nombre'}</p>
              <p className="text-textSecondary text-sm flex items-center gap-1.5 truncate">
                <Mail className="h-3.5 w-3.5 shrink-0" /> {user?.email}
              </p>
              <div className="mt-2">
                <Pill>
                  <Shield className="h-3 w-3 mr-1.5" /> {roleLabel}
                </Pill>
              </div>
            </div>
          </div>

          {/* Campos editables */}
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="text-textSecondary text-sm font-medium">
                Nombre
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-textSecondary text-sm font-medium">
                Teléfono
              </label>
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+57 300 000 0000"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-textSecondary text-sm font-medium">Correo</label>
              <p className="mt-1.5 px-4 py-2.5 rounded-xl bg-[#02505931] border border-[#08A696]/10 text-textSecondary text-sm">
                {user?.email}
                <span className="block text-xs text-textSecondary/60 mt-0.5">
                  Vinculado a tu cuenta de Google, no se puede cambiar
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-black font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar cambios
          </button>
        </Panel>
      </motion.div>
    </PanelPage>
  )
}
