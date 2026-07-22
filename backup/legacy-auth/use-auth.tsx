"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export type UserRole = 'admin' | 'client' | 'team';

interface UserProfile {
  id: string
  email: string
  name: string | null
  role: UserRole
}

interface AuthContextType {
  session: Session | null
  user: User | null
  userRole: UserRole | null
  userProfile: UserProfile | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      try {
        console.warn('[AUTH_HOOK] Obteniendo sesión inicial...')
        const { data: { session } } = await supabase.auth.getSession()
        console.warn('[AUTH_HOOK] Sesión inicial:', !!session)
        setSession(session)
        setUser(session?.user ?? null)
        
        // Obtener el perfil completo del usuario si existe sesión
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, email, name, role')
            .eq('id', session.user.id)
            .single()
          
          console.log('[AUTH_HOOK] Perfil del usuario (getSession):', profileData)
          setUserRole(profileData?.role || 'client')
          setUserProfile(profileData)
        } else {
          setUserRole(null)
          setUserProfile(null)
        }
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.warn('[AUTH_HOOK] Auth state change:', { event, hasSession: !!session })
        setSession(session)
        setUser(session?.user ?? null)
        
        // Obtener el perfil completo del usuario si existe sesión
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, email, name, role')
            .eq('id', session.user.id)
            .single()
          
          console.log('[AUTH_HOOK] Perfil del usuario (onAuthStateChange):', profileData)
          setUserRole(profileData?.role || 'client')
          setUserProfile(profileData)
        } else {
          setUserRole(null)
          setUserProfile(null)
        }
        
        setIsLoading(false)
        
        // Guardar sesión en localStorage cuando cambie
        if (session && typeof window !== 'undefined') {
          localStorage.setItem('supabase.auth.token', JSON.stringify(session))
        } else if (typeof window !== 'undefined') {
          localStorage.removeItem('supabase.auth.token')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      setIsLoading(true)
      await supabase.auth.signOut()
      setSession(null)
      setUser(null)
      setUserRole(null)
      setUserProfile(null)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    session,
    user,
    userRole,
    userProfile,
    isLoading,
    signOut
  }

  return (
    <AuthContext.Provider value={value as AuthContextType}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
