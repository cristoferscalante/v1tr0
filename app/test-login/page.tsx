'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function TestLoginPage() {
  const [email, setEmail] = useState('cristoferscalante@gmail.com')
  const [password, setPassword] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
    console.warn(`[TEST-LOGIN] ${message}`)
  }

  const testLogin = async () => {
    setIsLoading(true)
    setLogs([])
    
    try {
      addLog('🔄 Iniciando proceso de login...')
      
      // 1. Verificar estado inicial
      const { data: initialSession } = await supabase.auth.getSession()
      addLog(`📊 Estado inicial - Sesión existente: ${!!initialSession.session}`)
      
      // 2. Intentar login
      addLog('🔐 Enviando credenciales...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      })
      
      if (error) {
        addLog(`❌ Error de login: ${error.message}`)
        setIsLoading(false)
        return
      }
      
      addLog(`✅ Login exitoso - Usuario: ${data.user?.email}`)
      addLog(`🎟️ Session ID: ${data.session?.access_token?.substring(0, 20)}...`)
      addLog(`⏰ Expira: ${new Date((data.session?.expires_at || 0) * 1000).toLocaleString()}`)
      
      // 3. Verificar inmediatamente
      addLog('🔍 Verificando sesión inmediatamente...')
      const { data: immediateCheck } = await supabase.auth.getSession()
      addLog(`📊 Verificación inmediata - Sesión existe: ${!!immediateCheck.session}`)
      
      // 4. Esperar y verificar de nuevo
      addLog('⏳ Esperando 1 segundo...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const { data: delayedCheck } = await supabase.auth.getSession()
      addLog(`📊 Verificación después de 1s - Sesión existe: ${!!delayedCheck.session}`)
      
      // 5. Verificar localStorage
      const storageKeys = Object.keys(localStorage).filter(key => 
        key.includes('supabase') || key.includes('auth')
      )
      addLog(`💾 Claves en localStorage: ${storageKeys.join(', ') || 'ninguna'}`)
      
      // 6. Verificar cookies
      const cookies = document.cookie.split(';').map(c => c.trim().split('=')[0])
      const authCookies = cookies.filter(name => 
        name.includes('supabase') || name.includes('auth') || name.includes('session')
      )
      addLog(`🍪 Cookies de auth: ${authCookies.join(', ') || 'ninguna'}`)
      
      // 7. Test final después de más tiempo
      addLog('⏳ Esperando 3 segundos más...')
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const { data: finalCheck } = await supabase.auth.getSession()
      addLog(`📊 Verificación final - Sesión existe: ${!!finalCheck.session}`)
      
      if (finalCheck.session) {
        addLog('🎉 ¡Sesión persistió correctamente!')
      } else {
        addLog('💥 La sesión se perdió')
      }
      
    } catch (error) {
      addLog(`💥 Error inesperado: ${error}`)
    }
    
    setIsLoading(false)
  }

  const clearStorage = () => {
    localStorage.clear()
    sessionStorage.clear()
    addLog('🧹 Storage limpiado')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔬 Diagnóstico de Login</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Credenciales</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={testLogin}
                  disabled={isLoading || !password}
                  className="w-full bg-blue-600 text-white p-3 rounded-lg disabled:opacity-50"
                >
                  {isLoading ? '🔄 Diagnosticando...' : '🧪 Test Login'}
                </button>
                
                <button
                  onClick={clearStorage}
                  className="w-full bg-red-600 text-white p-3 rounded-lg"
                >
                  🧹 Limpiar Storage
                </button>
              </div>
            </div>
          </div>
          
          {/* Logs */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Logs de Diagnóstico</h2>
            
            <div className="bg-black text-green-400 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-500">Presiona &quot;Test Login&quot; para comenzar...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">ℹ️ Información</h3>
          <p className="text-yellow-700 text-sm">
            Esta página diagnostica el proceso completo de login para identificar exactamente 
            dónde se pierde la sesión. Observa los logs para ver el estado en cada paso.
          </p>
        </div>
      </div>
    </div>
  )
}
