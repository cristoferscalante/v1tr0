'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, Chrome } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/components/theme-provider'
import BackgroundAnimation from '@/components/home/BackgroundAnimation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Manejar errores de la URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlError = urlParams.get('error')
    
    if (urlError) {
      switch (urlError) {
        case 'session_expired':
          setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
          break
        case 'no_session':
          setError('No se encontró una sesión válida. Por favor, inicia sesión.')
          break
        case 'auth_error':
          setError('Error de autenticación. Por favor, inténtalo de nuevo.')
          break
        case 'profile_error':
          setError('Error al obtener tu perfil. Por favor, contacta al soporte.')
          break
        case 'callback_error':
          setError('Error en el callback de autenticación. Inténtalo de nuevo.')
          break
        case 'unexpected_error':
          setError('Error inesperado. Por favor, inténtalo de nuevo.')
          break
        default:
          setError('Ha ocurrido un error. Por favor, inténtalo de nuevo.')
      }
      
      // Limpiar la URL
      window.history.replaceState({}, document.title, '/login')
    }
  }, [])

  // Verificar sesión existente solo al cargar la página
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error checking existing session:', error)
      }
    }

    checkExistingSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Por favor, completa todos los campos.')
      return
    }

    setIsLoading(true)
    setError('')
    
    console.warn('[DEBUG] Iniciando proceso de login...', { email })

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.warn('[DEBUG] Respuesta de Supabase:', { data: !!data.session, error: error?.message })

      if (error) {
        console.error('[LOGIN] Error:', error.message)
        
        // Manejar errores específicos de Supabase
        switch (error.message) {
          case 'Invalid login credentials':
            setError('Credenciales incorrectas. Verifica tu email y contraseña.')
            break
          case 'Email not confirmed':
            setError('Por favor, confirma tu email antes de iniciar sesión.')
            break
          case 'Too many requests':
            setError('Demasiados intentos. Espera un momento antes de intentar de nuevo.')
            break
          default:
            setError('Error de autenticación: ' + error.message)
        }
        setIsLoading(false)
        return
      }

      // Verificar que tenemos una sesión válida
      if (!data.session || !data.user) {
        console.error('[LOGIN] No se obtuvo sesión válida:', {
          hasSession: !!data.session,
          hasUser: !!data.user
        })
        setError('Error en la autenticación. Inténtalo de nuevo.')
        setIsLoading(false)
        return
      }

      console.warn('[LOGIN] Sesión creada exitosamente:', {
        userId: data.user.id,
        email: data.user.email,
        sessionExpires: data.session.expires_at
      })
      
      // Esperar un momento para que la sesión se procese
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Verificar que la sesión aún existe antes de redirigir
      const { data: sessionCheck } = await supabase.auth.getSession()
      console.warn('[LOGIN] Verificación final de sesión:', {
        hasSession: !!sessionCheck.session,
        sessionId: sessionCheck.session?.access_token?.substring(0, 20) + '...'
      })
      
      if (!sessionCheck.session) {
        setError('La sesión se perdió después del login. Inténtalo de nuevo.')
        setIsLoading(false)
        return
      }
      
      // Sesión confirmada - redirigir al dashboard
      console.warn('[LOGIN] ¡Sesión exitosa! Redirigiendo al dashboard...')
      window.location.href = '/dashboard'
      
    } catch (error) {
      console.error('[LOGIN] Error inesperado:', error)
      setError('Error inesperado durante el login')
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        console.error('[GOOGLE LOGIN] Error:', error)
        setError('Error al iniciar sesión con Google: ' + error.message)
        setIsLoading(false)
      }
      // No setear isLoading a false aquí porque redirigirá a Google
    } catch (error) {
      console.error('[GOOGLE LOGIN] Error inesperado:', error)
      setError('Error inesperado al iniciar sesión con Google')
      setIsLoading(false)
    }
  }

  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <BackgroundAnimation />
      
      <motion.div 
        className="w-full max-w-md lg:max-w-lg relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* V1TR0 Badge */}
        <motion.div 
          className="relative group mb-8 inline-flex items-center w-full justify-center"
          variants={itemVariants}
        >
          {/* Gradiente de fondo con blur */}
          <div className={`absolute -inset-1 bg-gradient-to-r ${isDark ? "from-[#08a696]/20 via-[#26ffdf]/15 to-[#08a696]/20" : "from-[#08a696]/30 via-[#08a696]/20 to-[#08a696]/30"} rounded-3xl blur-lg opacity-40 group-hover:opacity-70 transition-all duration-500`} />
          
          {/* Badge principal */}
          <div className={`relative ${isDark ? "bg-[#025059]/40 backdrop-blur-xl" : "bg-white/80 backdrop-blur-xl"} px-8 py-4 rounded-3xl border ${isDark ? "border-[#08A696]/30" : "border-[#08A696]/40"} text-sm font-semibold transition-all duration-500 group-hover:border-[#08A696] ${isDark ? "group-hover:bg-[#025059]/60" : "group-hover:bg-white/95"} shadow-2xl group-hover:shadow-3xl group-hover:shadow-[#08A696]/20 transform group-hover:scale-105`}>
            <span className={`${isDark ? "text-[#26FFDF]" : "text-[#08A696]"} transition-colors duration-300 text-base font-bold tracking-wide`}>
              V1TR0 Technologies
            </span>
            <span className={`ml-3 inline-block transition-transform duration-500 group-hover:translate-x-2 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"} text-lg`}>
              →
            </span>
          </div>
        </motion.div>

        {/* Título */}
        <motion.div className="text-center mb-10" variants={itemVariants}>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">
            <span className="block text-textPrimary mb-2">Acceso al Portal</span>
            <span className={`block ${isDark ? "bg-gradient-to-r from-[#26FFDF] to-[#08A696] bg-clip-text text-transparent" : "text-[#08A696]"}`}>V1TR0</span>
          </h1>
          <p className="text-textSecondary text-base">Ingresa tus credenciales para acceder a tu cuenta</p>
        </motion.div>

        {/* Formulario */}
        <motion.div 
          className={`${isDark ? "bg-[#025059]/30 backdrop-blur-2xl border-[#08A696]/20" : "bg-white/85 backdrop-blur-2xl border-[#08A696]/30"} rounded-3xl p-8 lg:p-10 shadow-2xl border-2 relative overflow-hidden`}
          variants={itemVariants}
        >
          {/* Gradiente decorativo */}
          <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? "from-[#08A696]/5 via-transparent to-[#26FFDF]/5" : "from-[#08A696]/10 via-transparent to-[#08A696]/5"} pointer-events-none`} />
          
          {error && (
            <motion.div 
              className={`mb-6 p-4 text-sm ${isDark ? "text-red-300 bg-red-900/30 border border-red-500/40" : "text-red-700 bg-red-50/80 border border-red-200"} rounded-2xl backdrop-blur-sm shadow-lg`}
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            {/* Campo Email */}
            <motion.div className="space-y-3" variants={itemVariants}>
              <label htmlFor="email" className={`block text-sm font-semibold ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"} tracking-wide`}>
                Correo electrónico
              </label>
              <div className="relative group">
                <div className={`absolute -inset-1 bg-gradient-to-r ${isDark ? "from-[#08A696]/25 via-[#26FFDF]/20 to-[#08A696]/25" : "from-[#08A696]/30 via-[#08A696]/20 to-[#08A696]/30"} rounded-2xl blur-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500`} />
                <div className="relative">
                  <Mail className={`absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300 ${isDark ? "text-[#26FFDF]/60 group-focus-within:text-[#26FFDF] group-hover:text-[#26FFDF]" : "text-[#08A696]/60 group-focus-within:text-[#08A696] group-hover:text-[#08A696]"} group-focus-within:scale-110`} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-14 pr-5 py-5 rounded-2xl border-2 transition-all duration-300 backdrop-blur-xl ${isDark ? "bg-[#025059]/30 border-[#08A696]/30 text-[#26FFDF] placeholder-[#26FFDF]/40 focus:border-[#26FFDF] focus:bg-[#025059]/50" : "bg-white/70 border-[#08A696]/40 text-[#08A696] placeholder-[#08A696]/50 focus:border-[#08A696] focus:bg-white/90"} focus:outline-none focus:ring-4 focus:ring-[#08A696]/20 shadow-xl hover:shadow-2xl hover:shadow-[#08A696]/15 text-base`}
                    placeholder="tu@ejemplo.com"
                    required
                  />
                </div>
              </div>
            </motion.div>

            {/* Campo Contraseña */}
            <motion.div className="space-y-3" variants={itemVariants}>
              <label htmlFor="password" className={`block text-sm font-semibold ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"} tracking-wide`}>
                Contraseña
              </label>
              <div className="relative group">
                <div className={`absolute -inset-1 bg-gradient-to-r ${isDark ? "from-[#08A696]/25 via-[#26FFDF]/20 to-[#08A696]/25" : "from-[#08A696]/30 via-[#08A696]/20 to-[#08A696]/30"} rounded-2xl blur-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500`} />
                <div className="relative">
                  <Lock className={`absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300 ${isDark ? "text-[#26FFDF]/60 group-focus-within:text-[#26FFDF] group-hover:text-[#26FFDF]" : "text-[#08A696]/60 group-focus-within:text-[#08A696] group-hover:text-[#08A696]"} group-focus-within:scale-110`} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-14 pr-14 py-5 rounded-2xl border-2 transition-all duration-300 backdrop-blur-xl ${isDark ? "bg-[#025059]/30 border-[#08A696]/30 text-[#26FFDF] placeholder-[#26FFDF]/40 focus:border-[#26FFDF] focus:bg-[#025059]/50" : "bg-white/70 border-[#08A696]/40 text-[#08A696] placeholder-[#08A696]/50 focus:border-[#08A696] focus:bg-white/90"} focus:outline-none focus:ring-4 focus:ring-[#08A696]/20 shadow-xl hover:shadow-2xl hover:shadow-[#08A696]/15 text-base`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-5 top-1/2 transform -translate-y-1/2 transition-all duration-300 hover:scale-110 ${isDark ? "text-[#26FFDF]/60 hover:text-[#26FFDF]" : "text-[#08A696]/60 hover:text-[#08A696]"} p-1 rounded-lg hover:bg-[#08A696]/10`}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Opciones */}
            <motion.div className="flex items-center justify-between py-2" variants={itemVariants}>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={`w-5 h-5 rounded-lg border-2 transition-all duration-300 cursor-pointer ${isDark ? "border-[#08A696]/50 bg-[#025059]/30 checked:bg-[#26FFDF] checked:border-[#26FFDF]" : "border-[#08A696]/60 bg-white/80 checked:bg-[#08A696] checked:border-[#08A696]"} focus:ring-4 focus:ring-[#08A696]/20 hover:border-[#08A696] hover:scale-110`}
                  />
                </div>
                <label htmlFor="remember" className={`text-sm font-medium cursor-pointer ${isDark ? "text-[#26FFDF]/80 hover:text-[#26FFDF]" : "text-[#08A696]/80 hover:text-[#08A696]"} transition-colors duration-300`}>
                  Recordarme
                </label>
              </div>
              <Link
                href="/forgot-password"
                className={`text-sm font-medium transition-all duration-300 hover:underline hover:scale-105 ${isDark ? "text-[#26FFDF]/80 hover:text-[#26FFDF]" : "text-[#08A696]/80 hover:text-[#08A696]"}`}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </motion.div>

            {/* Botón Principal */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`relative w-full py-5 rounded-2xl font-bold text-white text-lg transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group ${isDark ? "bg-gradient-to-r from-[#08A696] via-[#0bb3a0] to-[#26FFDF] hover:from-[#0a9688] hover:via-[#0dc2b0] hover:to-[#28ffe1]" : "bg-gradient-to-r from-[#08A696] via-[#0bb3a0] to-[#08A696] hover:from-[#0a9688] hover:via-[#0dc2b0] hover:to-[#0a9688]"} shadow-[#08A696]/30 hover:shadow-[#08A696]/40`}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <span>Acceder a V1TR0</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </>
                )}
              </span>
            </motion.button>

            {/* Separador */}
            <motion.div className="relative my-10" variants={itemVariants}>
              <div className="absolute inset-0 flex items-center">
                <span className={`w-full border-t-2 ${isDark ? "border-[#08A696]/30" : "border-[#08A696]/40"}`} />
              </div>
              <div className="relative flex justify-center">
                <span className={`px-6 py-2 text-sm font-semibold ${isDark ? "bg-[#025059]/50 text-[#26FFDF]/70 border border-[#08A696]/30" : "bg-white/90 text-[#08A696]/70 border border-[#08A696]/40"} backdrop-blur-xl rounded-full shadow-lg`}>
                  O continúa con
                </span>
              </div>
            </motion.div>

            {/* Botón Google */}
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className={`relative w-full py-5 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 backdrop-blur-xl overflow-hidden group ${isDark ? "bg-[#025059]/40 border-[#08A696]/40 text-[#26FFDF] hover:bg-[#025059]/60 hover:border-[#26FFDF]" : "bg-white/80 border-[#08A696]/50 text-[#08A696] hover:bg-white/95 hover:border-[#08A696]"}`}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#08A696]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex items-center justify-center space-x-3">
                <Chrome className={`h-6 w-6 transition-all duration-300 group-hover:scale-110 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`} />
                <span className="text-base">Continuar con Google</span>
              </div>
            </motion.button>
          </form>

          {/* Enlace de registro */}
          <motion.div className="text-center mt-10 pt-6 border-t border-[#08A696]/20" variants={itemVariants}>
            <p className={`text-base ${isDark ? "text-[#26FFDF]/70" : "text-[#08A696]/70"}`}>
              ¿No tienes una cuenta?{' '}
              <Link
                href="/register"
                className={`font-bold transition-all duration-300 hover:underline hover:scale-105 inline-block ${isDark ? "text-[#26FFDF] hover:text-[#28ffe1]" : "text-[#08A696] hover:text-[#0a9688]"}`}
              >
                Regístrate aquí →
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Footer decorativo */}
        <motion.div 
          className="text-center mt-8"
          variants={itemVariants}
        >
          <p className={`text-sm ${isDark ? "text-[#26FFDF]/40" : "text-[#08A696]/50"}`}>
            © 2025 V1TR0 Technologies. Transformando ideas en realidad digital.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
