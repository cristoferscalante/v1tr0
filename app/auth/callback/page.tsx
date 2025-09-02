"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          // Error in auth callback (removido console.error)
          router.push('/login?error=callback_error')
          return
        }

        if (data.session) {
          // Usuario autenticado exitosamente
          // Redirigir al dashboard
          router.push('/dashboard')
        } else {
          // No hay sesión
          router.push('/login')
        }
      } catch {
        // Unexpected error in auth callback (removido console.error)
        router.push('/login?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#08A696]"></div>
        <p className="mt-4 text-gray-600">Procesando autenticación...</p>
      </div>
    </div>
  )
}
