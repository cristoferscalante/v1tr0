"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface AuthDebugInfo {
  timestamp: string
  hasSession: boolean
  hasUser: boolean
  hasAccessToken: boolean
  expiresAt: number | undefined
  currentTime: number
  isExpired: boolean
  userEmail: string | undefined
  sessionError: string | undefined
  cookies: string
}

export function useAuthDebug() {
  const [debugInfo, setDebugInfo] = useState<AuthDebugInfo | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        const info: AuthDebugInfo = {
          timestamp: new Date().toISOString(),
          hasSession: !!session,
          hasUser: !!session?.user,
          hasAccessToken: !!session?.access_token,
          expiresAt: session?.expires_at,
          currentTime: Math.floor(Date.now() / 1000),
          isExpired: session?.expires_at ? Date.now() / 1000 > session.expires_at : false,
          userEmail: session?.user?.email,
          sessionError: error?.message,
          cookies: typeof document !== 'undefined' ? document.cookie : 'N/A',
        }
        
        setDebugInfo(info)
        console.warn('🔍 Auth Debug Info:', info)
      } catch (err) {
        console.error('🚨 Auth Debug Error:', err)
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.warn('🔔 Auth State Change:', event, !!session)
        checkAuth()
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  return debugInfo
}
