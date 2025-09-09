'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import NavBar from '@/components/global/NavBar'
import FooterSection from '@/components/global/FooterSection'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const formRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline()
    
    tl.fromTo(titleRef.current, 
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    )
    .fromTo(formRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(footerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.2"
    )
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // Obtener el rol del usuario para redirigir correctamente
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        const userRole = profileData?.role || 'client'
        if (userRole === 'admin') {
          router.push('/dashboard')
        } else {
          router.push('/client-dashboard')
        }
      }
    }
    checkUser()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Por favor, completa todos los campos.')
      return
    }

    setIsLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error('Credenciales incorrectas. Verifica tu email y contraseña.')
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Obtener el rol del usuario desde la tabla profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          console.error('Error fetching user role:', profileError)
          toast.error('Error al obtener información del usuario')
          setIsLoading(false)
          return
        }

        // Redirigir según el rol
        const userRole = profileData?.role || 'client'
        if (userRole === 'admin') {
          router.push('/dashboard')
        } else {
          router.push('/client-dashboard')
        }
        
        toast.success(`¡Bienvenido! Redirigiendo al dashboard de ${userRole === 'admin' ? 'administrador' : 'cliente'}...`)
      }
      
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Error al iniciar sesión. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        toast.error('Error al iniciar sesión con Google')
      }
    } catch (error) {
      console.error('Google login error:', error)
      toast.error('Error al iniciar sesión con Google')
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#02505931] via-[#08A696]/20 to-[#02505931] flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
        <NavBar />
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 py-12 pt-24">
        <div className="w-full max-w-md">
          {/* Título */}
          <div className="text-center mb-8" ref={titleRef}>
            <h1 className="text-3xl font-bold text-[#26FFDF] mb-2">
              Bienvenido a V1TR0
            </h1>
            <p className="text-[#26FFDF]/70">
              Inicia sesión para acceder a tu cuenta
            </p>
          </div>

          {/* Formulario */}
          <div 
            ref={formRef}
            className="bg-[#02505931]/80 backdrop-blur-xl rounded-2xl p-8 border border-[#08A696]/30 shadow-2xl"
          >
            <form onSubmit={handleLogin}>
            <div className="space-y-5">
              {/* Email Field */}
              <div className="h-[60px]">
                <label htmlFor="email" className="block text-sm font-medium text-[#26FFDF] mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#26FFDF]/70 h-5 w-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[48px] pl-12 pr-4 bg-[#08A696]/20 border border-[#08A696]/50 rounded-xl text-[#26FFDF] placeholder-[#26FFDF]/50 focus:outline-none focus:ring-2 focus:ring-[#26FFDF] focus:border-transparent transition-all duration-200"
                    placeholder="tu@ejemplo.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="h-[60px]">
                <label htmlFor="password" className="block text-sm font-medium text-[#26FFDF] mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#26FFDF]/70 h-5 w-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[48px] pl-12 pr-12 bg-[#08A696]/20 border border-[#08A696]/50 rounded-xl text-[#26FFDF] placeholder-[#26FFDF]/50 focus:outline-none focus:ring-2 focus:ring-[#26FFDF] focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#26FFDF]/70 hover:text-[#26FFDF] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#26FFDF] bg-[#08A696]/20 border-[#08A696]/50 rounded focus:ring-[#26FFDF] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-[#26FFDF]/80">Recordarme</span>
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-[#26FFDF] hover:text-[#26FFDF]/80 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[48px] bg-gradient-to-r from-[#08A696] to-[#26FFDF] hover:from-[#08A696]/80 hover:to-[#26FFDF]/80 text-black font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Acceder a V1TR0 →'
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-[#08A696]/30"></div>
              <span className="px-4 text-sm text-[#26FFDF]/70">O continúa con</span>
              <div className="flex-1 border-t border-[#08A696]/30"></div>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-[48px] bg-[#08A696]/20 hover:bg-[#08A696]/30 border border-[#08A696]/50 text-[#26FFDF] font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continuar con Google</span>
            </button>
            </form>

          {/* Footer */}
          <div className="text-center mt-6" ref={footerRef}>
            <p className="text-[#26FFDF]/70">
              ¿No tienes una cuenta?{' '}
              <Link 
                href="/register" 
                className="text-[#26FFDF] hover:text-[#26FFDF]/80 font-medium transition-colors"
              >
                Regístrate aquí →
              </Link>
            </p>
          </div>
          </div>
        </div>
      </div>
      
      <FooterSection />
    </div>
  )
}
