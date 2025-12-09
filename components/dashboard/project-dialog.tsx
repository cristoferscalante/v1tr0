'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  projectId?: string | undefined
}

interface ProjectFormData {
  name: string
  description: string
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  client_id: string
}

interface Profile {
  id: string
  name: string
  role: string
}

export function ProjectDialog({ open, onOpenChange, onSuccess, projectId }: ProjectDialogProps) {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [clients, setClients] = useState<Profile[]>([])
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    status: 'active',
    client_id: ''
  })

  // Cargar clientes
  useEffect(() => {
    const fetchClients = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, role')
        .eq('role', 'client')
        .order('name', { ascending: true })

      if (error) {
        console.error('Error al cargar clientes:', error)
        return
      }

      setClients(data || [])
    }

    if (open) {
      fetchClients()
    }
  }, [open])

  // Cargar datos del proyecto si estamos editando
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        return
      }

      setLoadingData(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (error) {
        console.error('Error al cargar proyecto:', error)
        toast.error('Error al cargar el proyecto')
        return
      }

      if (data) {
        setFormData({
          name: data.name,
          description: data.description || '',
          status: data.status,
          client_id: data.client_id || ''
        })
      }

      setLoadingData(false)
    }

    if (open && projectId) {
      fetchProject()
    } else if (open && !projectId) {
      // Reset form for new project
      setFormData({
        name: '',
        description: '',
        status: 'active',
        client_id: ''
      })
    }
  }, [open, projectId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación
    if (!formData.name.trim()) {
      toast.error('El nombre del proyecto es requerido')
      return
    }

    setLoading(true)

    try {
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        status: formData.status,
        client_id: formData.client_id && formData.client_id.trim() !== '' && formData.client_id.trim() !== ' '
          ? formData.client_id
          : null,
        updated_at: new Date().toISOString()
      }

      if (projectId) {
        // Actualizar proyecto existente
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', projectId)

        if (error) {
          throw error
        }

        toast.success('Proyecto actualizado exitosamente')
      } else {
        // Crear nuevo proyecto
        const { error } = await supabase
          .from('projects')
          .insert([projectData])

        if (error) {
          throw error
        }

        toast.success('Proyecto creado exitosamente')
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Error al guardar proyecto:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar el proyecto'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-md border-[#08A696]/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#08A696] to-[#26FFDF] bg-clip-text text-transparent">
            {projectId ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {projectId
              ? 'Actualiza la información del proyecto'
              : 'Crea un nuevo proyecto para gestionar con tu equipo'}
          </DialogDescription>
        </DialogHeader>

        {loadingData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-[#08A696]" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              {/* Nombre del proyecto */}
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-slate-300">
                  Nombre del Proyecto <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Desarrollo Web E-commerce"
                  className="bg-[#02505931] backdrop-blur-sm border-[#08A696]/30 text-[#26FFDF] placeholder-slate-500 focus:border-[#08A696] rounded-xl"
                  required
                />
              </div>

              {/* Descripción */}
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-slate-300">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe brevemente el alcance y objetivos del proyecto..."
                  className="bg-[#02505931] backdrop-blur-sm border-[#08A696]/30 text-[#26FFDF] placeholder-slate-500 focus:border-[#08A696] rounded-xl min-h-[100px] resize-none"
                />
              </div>

              {/* Cliente */}
              <div className="grid gap-2">
                <Label htmlFor="client" className="text-slate-300">
                  Cliente
                </Label>
                <Select
                  value={formData.client_id || "none"}
                  onValueChange={(value) => setFormData({ ...formData, client_id: value === "none" ? "" : value })}
                >
                  <SelectTrigger className="bg-[#02505931] backdrop-blur-sm border-[#08A696]/30 text-[#26FFDF] focus:border-[#08A696] rounded-xl">
                    <SelectValue placeholder="Selecciona un cliente (opcional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-md border-[#08A696]/30">
                    <SelectItem value="none" className="text-slate-400">
                      Sin cliente asignado
                    </SelectItem>
                    {clients.map((client) => (
                      <SelectItem
                        key={client.id}
                        value={client.id}
                        className="text-[#26FFDF] hover:bg-[#08A696]/20"
                      >
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Estado */}
              <div className="grid gap-2">
                <Label htmlFor="status" className="text-slate-300">
                  Estado <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'completed' | 'paused' | 'cancelled' })}
                >
                  <SelectTrigger className="bg-[#02505931] backdrop-blur-sm border-[#08A696]/30 text-[#26FFDF] focus:border-[#08A696] rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-md border-[#08A696]/30">
                    <SelectItem value="active" className="text-[#26FFDF] hover:bg-[#08A696]/20">
                      🟢 Activo
                    </SelectItem>
                    <SelectItem value="paused" className="text-[#26FFDF] hover:bg-[#08A696]/20">
                      🟡 Pausado
                    </SelectItem>
                    <SelectItem value="completed" className="text-[#26FFDF] hover:bg-[#08A696]/20">
                      ✅ Completado
                    </SelectItem>
                    <SelectItem value="cancelled" className="text-[#26FFDF] hover:bg-[#08A696]/20">
                      ❌ Cancelado
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  <>{projectId ? 'Actualizar' : 'Crear'} Proyecto</>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
