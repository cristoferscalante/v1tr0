"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface SessionProviderProps {
  children: React.ReactNode
}

export default function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true
    
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!isMounted) {
          return
        }
        
        console.warn('[SESSION_PROVIDER] Session check:', { hasSession: !!session, error: error?.message })
        
        if (error) {
          console.error('SessionProvider: Error getting session:', error)
          router.push('/login?error=session_error')
          return
        }
        
        if (!session) {
          console.warn('[SESSION_PROVIDER] No session found, redirecting to login')
          router.push('/login?error=no_session')
          return
        }
        
        console.warn('[SESSION_PROVIDER] Valid session found, allowing access')
        setSession(session)
      } catch (error) {
        console.error('SessionProvider: Unexpected error:', error)
        router.push('/login?error=unexpected_error')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    // Solo verificar sesión una vez al cargar
    getSession()

    return () => {
      isMounted = false
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#025059]/10 to-[#08A696]/10">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-[#08A696]/30 border-t-[#08A696] rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-[#26FFDF] rounded-full animate-ping mx-auto"></div>
          </div>
          <p className="text-[#08A696] font-medium">
            Verificando autenticación...
          </p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // El useEffect se encargará de la redirección
  }

  return <>{children}</>
}
