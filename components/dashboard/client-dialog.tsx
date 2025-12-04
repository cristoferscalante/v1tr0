'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

interface ClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  clientId?: string
}

type UserRole = 'client' | 'team';

interface ClientFormData {
  name: string
  email: string
  role: UserRole
}

export function ClientDialog({ open, onOpenChange, onSuccess, clientId }: ClientDialogProps) {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    role: 'client'
  })

  // Cargar datos del cliente si estamos editando
  useEffect(() => {
    const fetchClient = async () => {
      if (!clientId) {
        return
      }

      setLoadingData(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', clientId)
        .single()

      if (error) {
        console.error('Error al cargar cliente:', error)
        toast.error('Error al cargar el cliente')
        return
      }

      if (data) {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          role: data.role || 'client'
        })
      }

      setLoadingData(false)
    }

    if (open && clientId) {
      fetchClient()
    } else if (open && !clientId) {
      // Reset form for new client
      setFormData({
        name: '',
        email: '',
        role: 'client'
      })
    }
  }, [open, clientId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación
    if (!formData.name.trim()) {
      toast.error('El nombre del cliente es requerido')
      return
    }

    if (!formData.email.trim()) {
      toast.error('El email del cliente es requerido')
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      toast.error('Por favor ingresa un email válido')
      return
    }

    setLoading(true)

    try {
      if (clientId) {
        // Actualizar cliente existente (solo el nombre)
        const { error } = await supabase
          .from('profiles')
          .update({
            name: formData.name.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', clientId)

        if (error) {
          throw error
        }

        toast.success('Cliente actualizado exitosamente')
      } else {
        // Crear nuevo cliente en profiles
        // Nota: Como es solo para profiles, no creamos usuario de auth
        // Solo actualizamos el perfil si ya existe o creamos uno básico
        
        // Primero verificar si el email ya existe
        const { data: existingProfile, error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', formData.email.trim())
          .single()

        if (checkError && checkError.code !== 'PGRST116') {
          // Error diferente a "no rows returned"
          throw checkError
        }

        if (existingProfile) {
          toast.error('Ya existe un cliente con ese email')
          setLoading(false)
          return
        }

        // Crear perfil de cliente o team
        const { error } = await supabase
          .from('profiles')
          .insert([{
            name: formData.name.trim(),
            email: formData.email.trim(),
            role: formData.role,
            avatar: ''
          }])

        if (error) {
          throw error
        }

        toast.success('Cliente creado exitosamente')
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Error al guardar cliente:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el cliente'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-md border-[#08A696]/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#08A696] to-[#26FFDF] bg-clip-text text-transparent">
            {clientId ? 'Editar Cliente' : 'Nuevo Cliente'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {clientId 
              ? 'Actualiza la información del cliente' 
              : 'Agrega un nuevo cliente al sistema'}
          </DialogDescription>
        </DialogHeader>

        {loadingData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-[#08A696]" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              {/* Nombre del cliente */}
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-slate-300">
                  Nombre Completo <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Juan Pérez"
                  className="bg-[#02505931] backdrop-blur-sm border-[#08A696]/30 text-[#26FFDF] placeholder-slate-500 focus:border-[#08A696] rounded-xl"
                  required
                />
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="cliente@ejemplo.com"
                  disabled={!!clientId} // No permitir cambiar email al editar
                  className="bg-[#02505931] backdrop-blur-sm border-[#08A696]/30 text-[#26FFDF] placeholder-slate-500 focus:border-[#08A696] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                {clientId && (
                  <p className="text-xs text-slate-500">
                    El email no se puede modificar
                  </p>
                )}
              </div>

              {/* Rol */}
              <div className="grid gap-2">
                <Label htmlFor="role" className="text-slate-300">
                  Rol <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                >
                  <SelectTrigger className="bg-[#02505931] backdrop-blur-sm border-[#08A696]/30 text-[#26FFDF] rounded-xl">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-md border-[#08A696]/30">
                    <SelectItem value="client" className="text-[#26FFDF]">
                      Cliente - Solo visualización
                    </SelectItem>
                    <SelectItem value="team" className="text-blue-400">
                      Team - Gestión de proyectos (sin editar tareas)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  {formData.role === 'client' 
                    ? '👤 Cliente: Puede ver sus proyectos y tareas asignadas'
                    : '👥 Team: Puede gestionar proyectos, ver todas las tareas pero no editarlas'}
                </p>
              </div>

              {!clientId && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <p className="text-sm text-blue-300">
                    💡 <strong>Nota:</strong> Este cliente podrá acceder al sistema cuando se registre con este email.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="bg-[#02505931] backdrop-blur-sm border-[#08A696]/30 text-[#26FFDF] hover:bg-background/20 hover:border-[#08A696] rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] hover:from-[#26FFDF] hover:to-[#08A696] text-slate-900 font-semibold rounded-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>{clientId ? 'Actualizar' : 'Crear'} Cliente</>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
