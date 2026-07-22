'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, User, Mail, Shield, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { user, userRole } = useAuth()
  const [saving, setSaving] = useState(false)

  const roleLabel = userRole === 'admin' ? 'Administrador' : userRole === 'team' ? 'Equipo' : 'Cliente'

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    toast.success('Perfil actualizado')
    setSaving(false)
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 font-bricolage">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center space-x-4 mb-8 p-6 rounded-2xl bg-background/10 backdrop-blur-sm border border-[#08A696]/20"
      >
        <Link href="/client-dashboard">
          <Button variant="outline" size="sm" className="border-[#08A696]/30 text-textPrimary hover:bg-[#08A696]/10">
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-textPrimary bg-gradient-to-r from-[#08A696] to-[#26FFDF] bg-clip-text text-transparent">Mi Perfil</h1>
          <p className="text-textSecondary text-sm">Gestiona tu información personal</p>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-textPrimary flex items-center gap-2">
              <User className="h-5 w-5 text-[#26FFDF]" />
              Información de la cuenta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-background/20 rounded-xl border border-[#08A696]/10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#08A696] to-[#26FFDF] flex items-center justify-center text-2xl font-bold text-black">
                {user?.name?.charAt(0) ?? user?.email?.charAt(0) ?? '?'}
              </div>
              <div>
                <p className="text-textPrimary font-semibold text-lg">{user?.name ?? 'Sin nombre'}</p>
                <p className="text-textSecondary text-sm flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {user?.email}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/10 border border-[#08A696]/10">
                <span className="text-textSecondary text-sm">Rol</span>
                <span className="text-textPrimary font-medium flex items-center gap-1">
                  <Shield className="h-4 w-4 text-[#26FFDF]" /> {roleLabel}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-background/10 border border-[#08A696]/10">
                <span className="text-textSecondary text-sm">ID</span>
                <span className="text-textPrimary font-mono text-xs">{user?.id?.slice(0, 16)}...</span>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-black font-semibold"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Guardar cambios
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
