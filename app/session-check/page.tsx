"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function SessionVerification() {
  const [status, setStatus] = useState('Verificando sesión...')
  const router = useRouter()

  useEffect(() => {
    const verifySession = async () => {
      try {
        console.warn('[SESSION_CHECK] Iniciando verificación...')
        
        // Esperar un momento para que las cookies se establezcan
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Verificar la sesión
        const { data: { session }, error } = await supabase.auth.getSession()
        
        console.warn('[SESSION_CHECK] Resultado:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          error: error?.message
        })
        
        if (error) {
          setStatus('Error verificando sesión: ' + error.message)
          setTimeout(() => router.push('/login?error=session_verification_failed'), 2000)
          return
        }
        
        if (session && session.user) {
          setStatus('¡Sesión válida! Redirigiendo al dashboard...')
          setTimeout(() => router.push('/test-dashboard'), 1000)
        } else {
          setStatus('No se encontró sesión válida. Redirigiendo al login...')
          setTimeout(() => router.push('/login?error=no_session_after_login'), 2000)
        }
        
      } catch (error) {
        console.error('[SESSION_CHECK] Error inesperado:', error)
        setStatus('Error inesperado verificando sesión')
        setTimeout(() => router.push('/login?error=unexpected_verification_error'), 2000)
      }
    }

    verifySession()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#08A696] mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Verificando Sesión</h2>
        <p className="text-gray-600">{status}</p>
        
        <div className="mt-8 p-4 bg-white/80 dark:bg-background/10 rounded-lg shadow-lg max-w-md">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Estado del Sistema</h3>
          <p className="text-sm text-gray-600">
            Verificando que la sesión de autenticación se haya establecido correctamente
            después del login exitoso.
          </p>
        </div>
      </div>
    </div>
  )
}
