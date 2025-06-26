"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import BackgroundAnimation from "@/components/home/BackgroungAnimation"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

// Importar las credenciales y la función de validación
import { demoCredentials, validateCredentials } from "@/lib/auth/credentials"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Modificar la función handleSubmit para usar la validación
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validar credenciales
      const result = validateCredentials(email, password)

      // Simular un pequeño retraso para mostrar el estado de carga
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (result.success) {
        // Redirigir según el rol
        if (result.user.role === "admin") {
          router.push("/dashboard")
        } else if (result.user.role === "client") {
          router.push("/dashboard/client")
        }
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <BackgroundAnimation />
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mb-8">
          <Link href="/" className="flex justify-center mb-8">
            <Image src="/v1tr0-logo.svg" alt="V1TR0 Logo" width={80} height={80} className="h-20 w-auto" />
          </Link>

          <Card className="w-full bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 rounded-2xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-white">Acceso al Portal</CardTitle>
              <CardDescription className="text-center text-textMuted">
                Ingresa tus credenciales para acceder a tu cuenta
              </CardDescription>
            </CardHeader>

            <CardContent>
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
                    <div className="flex items-center justify-center">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></div>
                      <span className="ml-2">Iniciando sesión...</span>
                    </div>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Iniciar Sesión
                    </>
                  )}
                </Button>
              </form>

              {/* Añadir información de credenciales de demostración */}
              {/* Añadir después del formulario, antes del CardFooter */}
              <div className="mt-6 p-4 bg-[#02505931] backdrop-blur-sm rounded-2xl border border-[#08A696]/20">
                <h3 className="text-sm font-medium mb-2 text-[#26FFDF]">Credenciales de demostración:</h3>
                <div className="space-y-2 text-xs text-textMuted">
                  <div>
                    <p className="font-semibold text-[#26FFDF]">Administrador:</p>
                    <p>Email: {demoCredentials.admin.email}</p>
                    <p>Contraseña: {demoCredentials.admin.password}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#26FFDF]">Cliente:</p>
                    <p>Email: {demoCredentials.client.email}</p>
                    <p>Contraseña: {demoCredentials.client.password}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-[#08A696]/20"></span>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-[#02505931] px-2 text-textMuted">O continúa con</span>
                    </div>
                  </div>                  <div className="mt-4 flex gap-2">
                    <Button className="w-full bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] text-[#26FFDF]">
                      <Image src="/icons/google.svg" width={16} height={16} alt="Google" className="mr-2" />
                      Google
                    </Button>
                    <Button className="w-full bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] text-[#26FFDF]">
                      <Image src="/icons/microsoft.svg" width={16} height={16} alt="Microsoft" className="mr-2" />
                      Microsoft
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
