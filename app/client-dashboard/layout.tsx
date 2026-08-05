'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import BackgroundAnimation from '@/components/home/animations/BackgroundAnimation'
import ClientSidebar from '@/components/client/ClientSidebar'

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, userRole, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login')
        return
      }
      
      if (userRole && userRole !== 'client') {
        router.push('/dashboard')
        return
      }
    }
  }, [user, userRole, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <BackgroundAnimation />
        <div className="flex flex-col items-center space-y-4 relative z-10">
          <Loader2 className="h-8 w-8 animate-spin text-highlight" />
          <p className="text-textPrimary font-bricolage">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || (userRole && userRole !== 'client')) {
    return null
  }

  return (
    <div className="min-h-screen relative">
      {/* Fondo atenuado: mantiene la identidad del home sin competir con los datos */}
      <BackgroundAnimation density={0.22} intensity={0.55} />
      <ClientSidebar />
      {/* El riel flotante arranca en left-12 (48px, alineado con el botón de
          WhatsApp) y mide 80px colapsado; pl-36 deja el mismo respiro del
          otro lado. Al expandirse con el cursor queda flotando por encima
          del contenido (no empuja el layout). */}
      <div className="relative z-10 lg:pl-36">
        {children}
      </div>
    </div>
  )
}