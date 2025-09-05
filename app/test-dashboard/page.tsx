"use client"

import { useAuth } from '@/hooks/use-auth'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TestDashboard() {
  const { session, user, isLoading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.warn('[DASHBOARD] Auth state:', {
      isLoading,
      hasSession: !!session,
      hasUser: !!user,
      userEmail: user?.email
    })

    if (!isLoading && !session) {
      console.warn('[DASHBOARD] No session, redirecting to login')
      router.push('/login')
    }
  }, [session, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#08A696]"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard de V1TR0</h1>
            <button
              onClick={signOut}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-800 mb-2">¡Login Exitoso! 🎉</h2>
              <p className="text-green-700">Has iniciado sesión correctamente en V1TR0.</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Información del Usuario</h3>
              <div className="space-y-2 text-blue-700">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Nombre:</strong> {user.user_metadata?.name || 'No definido'}</p>
                <p><strong>Sesión expira:</strong> {session.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Próximos Pasos</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>El sistema de autenticación está funcionando correctamente</li>
                <li>Puedes continuar desarrollando las funcionalidades del dashboard</li>
                <li>Revisa la consola del navegador para logs de debugging</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
