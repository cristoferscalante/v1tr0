'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface SessionContextType {
  user: User | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const signOut = async () => {
    try {
      // Cerrando sesión...
      await supabase.auth.signOut()
      setUser(null)
      // No hacer redirección automática desde aquí
      // Sesión cerrada exitosamente
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error)
    }
  }

  useEffect(() => {
    let isMounted = true
    
    const initializeAuth = async () => {
      try {
        // Verificando sesión inicial...
        
        // Verificar sesión existente
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!isMounted) {
          return
        }
        
        if (error) {
          console.error('❌ Error al verificar sesión:', error)
          setUser(null)
        } else if (session?.user) {
          // Sesión válida encontrada
          setUser(session.user)
        } else {
          // No hay sesión activa
          setUser(null)
        }
        
      } catch (error) {
        console.error('❌ Error en inicialización de auth:', error)
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
          // Inicialización de auth completada
        }
      }
    }

    // Inicializar autenticación
    initializeAuth()

    // Listener para cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Cambio de estado de auth
        
        if (!isMounted) {
          return
        }
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Usuario autenticado
          setUser(session.user)
        } else if (event === 'SIGNED_OUT') {
          // Usuario desautenticado
          setUser(null)
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Token renovado
          setUser(session.user)
        }
        
        // Asegurar que loading esté en false después de cualquier cambio
        setIsLoading(false)
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
      // SessionProvider cleanup completado
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#08A696] mx-auto mb-4"></div>
          <p className="text-[#26FFDF] text-lg font-medium">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  return (
    <SessionContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </SessionContext.Provider>
  )
}
