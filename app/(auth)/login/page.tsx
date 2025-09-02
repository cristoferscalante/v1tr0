"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Mail, Lock, LogIn, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import BackgroundAnimation from "@/components/home/BackgroundAnimation"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const { signIn, signInWithProvider, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const urlMessage = searchParams?.get('message')
    if (urlMessage === 'check_email') {
      setMessage('Revisa tu correo electrónico para verificar tu cuenta antes de iniciar sesión.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const result = await signIn(email, password)

    if (result.success) {
      // Redirigir al dashboard - el AuthProvider se encargará de determinar el rol
      router.push("/dashboard")
    } else {
      setError(result.error || "Error al iniciar sesión")
    }
  }

  const handleProviderSignIn = async (provider: 'google') => {
    setError("")
    
    const result = await signInWithProvider(provider)
    
    if (!result.success) {
      setError(result.error || `Error al iniciar sesión con ${provider}`)
    }
    // Si es exitoso, la redirección se maneja automáticamente
  }

  return (
    <>
      <BackgroundAnimation />
      <div className="min-h-screen flex flex-col items-center justify-start pt-4 p-4">
        <div className="w-full max-w-md mb-2">
          <Link href="/" className="flex justify-center mb-2 animate-slideInRight">
            <Image src="/v1tr0_imagotipo.svg" alt="V1TR0 Logo" width={100} height={100} className="h-25 w-auto transition-all duration-300 ease-in-out hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(8,166,150,0.6)] hover:filter hover:brightness-110" />
          </Link>

          <Card className="w-full bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 rounded-2xl animate-slideInLeft">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-white">Acceso al Portal</CardTitle>
              <CardDescription className="text-center text-textMuted">
                Ingresa tus credenciales para acceder a tu cuenta
              </CardDescription>
            </CardHeader>

            <CardContent>
              {message && (
                <div className="bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-2xl mb-4 text-sm backdrop-blur-sm flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {message}
                </div>
              )}

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl mb-4 text-sm backdrop-blur-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-textMuted" />
                    <Input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nombre@ejemplo.com"
                      className="pl-10 rounded-2xl border-[#08A696]/30 bg-[#02505931] backdrop-blur-sm transition-all duration-300 focus:border-[#08A696] focus:ring-2 focus:ring-[#08A696]/20 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-white font-medium">Contraseña</Label>
                    <Link href="/forgot-password" className="text-xs text-[#26FFDF] hover:text-[#08A696] hover:underline transition-colors duration-300">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-textMuted" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 rounded-2xl border-[#08A696]/30 bg-[#02505931] backdrop-blur-sm transition-all duration-300 focus:border-[#08A696] focus:ring-2 focus:ring-[#08A696]/20 text-white placeholder:text-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-[#26FFDF] transition-colors duration-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm text-textMuted">
                    Recordarme
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl transition-all duration-300 transform scale-95 hover:scale-100 hover:border-[#08A696] hover:bg-[#02505950] text-white hover:text-white px-8 py-4 text-lg font-semibold" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Iniciando sesión..."
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Iniciar Sesión
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#08A696]/20"></span>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-[#02505931] px-2 text-textMuted">O continúa con</span>
                  </div>
                </div>                  <div className="mt-4">
                    <Button 
                      type="button"
                      onClick={() => handleProviderSignIn('google')}
                      disabled={isLoading}
                      className="w-full bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] text-[#26FFDF]"
                    >
                      <Image src="/icons/google.svg" width={16} height={16} alt="Google" className="mr-2" />
                      Continuar con Google
                    </Button>
                  </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                <span className="text-textMuted">¿No tienes una cuenta? </span>
                <Link href="/register" className="text-[#26FFDF] hover:text-[#08A696] hover:underline font-medium transition-colors duration-300">
                  Regístrate
                </Link>
              </div>

              <p className="text-xs text-textMuted text-center">
                Al iniciar sesión, aceptas nuestros{" "}
                <Link href="/terminos" className="text-[#26FFDF] hover:text-[#08A696] hover:underline transition-colors duration-300">
                  Términos de Servicio
                </Link>{" "}
                y{" "}
                <Link href="/privacidad" className="text-[#26FFDF] hover:text-[#08A696] hover:underline transition-colors duration-300">
                  Política de Privacidad
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
