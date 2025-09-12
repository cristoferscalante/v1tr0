'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import BackgroundAnimation from '@/components/home/animations/BackgroundAnimation'

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
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundAnimation />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}