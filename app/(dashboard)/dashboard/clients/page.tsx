'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth'
import { 
  Users, 
  Plus, 
  Eye, 
  Edit, 
  Building2, 
  DollarSign, 
  FolderOpen,
  Filter,
  LogOut,
  Loader2,
  Trash2,
  AlertCircle,
  Mail,
  Clock
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { ClientDialog } from '@/components/dashboard/client-dialog'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Client {
  id: string
  name: string
  email?: string
  role: string
  created_at: string
  updated_at: string
  projects?: { count: number }[]
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<string | undefined>(undefined)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { signOut } = useAuth()
  const router = useRouter()

  const fetchClients = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          projects:projects(count)
        `)
        .eq('role', 'client')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setClients(data || [])
    } catch (error) {
      console.error('Error al cargar clientes:', error)
      toast.error('Error al cargar los clientes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const handleNewClient = () => {
    setEditingClient(undefined)
    setDialogOpen(true)
  }

  const handleEditClient = (clientId: string) => {
    setEditingClient(clientId)
    setDialogOpen(true)
  }

  const handleDeleteClick = (clientId: string) => {
    setClientToDelete(clientId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) {
      return
    }

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', clientToDelete)

      if (error) {
        throw error
      }

      toast.success('Cliente eliminado exitosamente')
      fetchClients()
      setDeleteDialogOpen(false)
      setClientToDelete(null)
    } catch (error) {
      console.error('Error al eliminar cliente:', error)
      toast.error('Error al eliminar el cliente')
    } finally {
      setDeleting(false)
    }
  }

  const getProjectCount = (client: Client) => {
    return client.projects && client.projects.length > 0 ? client.projects[0].count : 0
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 min-h-screen bg-transparent">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bricolage font-bold bg-gradient-to-r from-[#08A696] via-[#26FFDF] to-[#08A696] bg-clip-text text-transparent mb-2">
              Gestión de Clientes
            </h1>
            <p className="text-slate-400 text-lg">
              Administra y supervisa todos tus clientes
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleNewClient}
              className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] hover:from-[#26FFDF] hover:to-[#08A696] text-slate-900 font-semibold px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Cliente
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-[#26FFDF] hover:bg-background/20 hover:border-[#08A696] px-4 py-2 rounded-2xl transition-all duration-300 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Clientes</p>
                  <p className="text-2xl font-bold text-white">{clients.length}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-[#08A696]/20 to-[#26FFDF]/20 rounded-xl">
                  <Users className="w-6 h-6 text-[#26FFDF]" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Con Email</p>
                  <p className="text-2xl font-bold text-white">
                    {clients.filter(c => c.email).length}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500/20 to-green-400/20 rounded-xl">
                  <Mail className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-background/10 backdrop-blur-md border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Proyectos Totales</p>
                  <p className="text-2xl font-bold text-white">
                    {clients.reduce((sum, client) => sum + getProjectCount(client), 0)}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500/20 to-blue-400/20 rounded-xl">
                  <FolderOpen className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-background/10 backdrop-blur-md border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Última Actividad</p>
                  <p className="text-2xl font-bold text-white">
                    {clients.length > 0 ? formatDate(clients[0].updated_at) : '-'}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-500/20 to-purple-400/20 rounded-xl">
                  <Clock className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#26FFDF]" />
        </div>
      )}

      {/* Clients Grid */}
      {!loading && clients.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="bg-background/10 border-[#08A696]/20 backdrop-blur-md rounded-2xl p-6 hover:bg-background/20 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#26FFDF] transition-colors duration-300">
                      {client.name}
                    </h3>
                    <Badge className="bg-[#08A696]/20 text-[#26FFDF] border border-[#08A696]/30 rounded-lg px-3 py-1">
                      {client.role}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-white text-sm">{client.email || 'Sin email'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Proyectos:</span>
                    <span className="text-white font-semibold">{getProjectCount(client)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Registrado:</span>
                    <span className="text-white text-sm">{formatDate(client.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Actualizado:</span>
                    <span className="text-white text-sm">{formatDate(client.updated_at)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={() => handleEditClient(client.id)}
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 text-slate-300 hover:bg-background/20 hover:border-[#08A696] rounded-2xl transition-all duration-300"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button 
                    onClick={() => handleDeleteClick(client.id)}
                    variant="outline" 
                    size="sm" 
                    className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500 rounded-2xl transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && clients.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">
            No hay clientes registrados
          </h3>
          <p className="text-slate-500 mb-4">
            Los usuarios que se registren aparecerán aquí automáticamente.
          </p>
          <Button 
            onClick={handleNewClient}
            className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] hover:from-[#26FFDF] hover:to-[#08A696] text-slate-900 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Primer Cliente
          </Button>
        </motion.div>
      )}

      {/* Client Dialog */}
      <ClientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        clientId={editingClient}
        onSuccess={fetchClients}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-xl border border-[#08A696]/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-white">
              <AlertCircle className="w-5 h-5 text-red-400" />
              ¿Eliminar cliente?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Esta acción no se puede deshacer. El cliente será eliminado permanentemente
              de la base de datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={deleting}
              className="bg-transparent border border-[#08A696]/30 text-slate-300 hover:bg-background/20"
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}