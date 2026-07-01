"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useTheme } from "@/components/theme-provider"
import { motion } from "framer-motion"
import { LockKeyholeIcon, ShieldCheckIcon } from "lucide-react"

// Credenciales por defecto
const DEFAULT_CREDENTIALS = {
  email: "admin@v1tr0.com",
  password: "V1tr0Admin2024!"
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState(DEFAULT_CREDENTIALS.email)
  const [password, setPassword] = useState(DEFAULT_CREDENTIALS.password)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { user, userRole, isLoading: authLoading } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Redireccionar si ya está autenticado como admin
  useEffect(() => {
    if (!authLoading && user && userRole === 'admin') {
      router.push('/admin')
    }
  }, [user, userRole, authLoading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      // Verificar que el usuario sea admin
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profileData?.role !== 'admin') {
        await supabase.auth.signOut()
        toast.error("Acceso denegado", {
          description: "No tienes permisos de administrador"
        })
        return
      }

      toast.success("Bienvenido, Administrador", {
        description: "Acceso concedido al panel de administración"
      })

      router.push('/admin')
    } catch (error: unknown) {
      console.error('Error al iniciar sesión:', error)
      if (error instanceof Error) {
        toast.error("Error de autenticación", {
          description: error.message
        })
      } else {
        toast.error("Error de autenticación", {
          description: "Credenciales inválidas"
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fillDefaultCredentials = () => {
    setEmail(DEFAULT_CREDENTIALS.email)
    setPassword(DEFAULT_CREDENTIALS.password)
    toast.info("Credenciales cargadas", {
      description: "Presiona 'Iniciar Sesión' para continuar"
    })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#025159] to-[#04423c]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#26FFDF]"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm"}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className={`${isDark ? "bg-[#02505931] border-[#08A696]/20" : "bg-white/90 border-[#08A696]/60"} backdrop-blur-md rounded-2xl border p-8 shadow-2xl`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${isDark ? "bg-[#08A696]/20 border-[#08A696]/30" : "bg-[#08A696]/10 border-[#08A696]/40"} border mb-4`}>
              <ShieldCheckIcon className={`w-8 h-8 ${isDark ? "text-[#26FFDF]" : "text-[#025159]"}`} />
            </div>
            <h1 className={`text-3xl font-bold ${isDark ? "text-[#26FFDF]" : "text-[#04423c]"} mb-2`}>
              Panel de Administración
            </h1>
            <p className={`text-sm ${isDark ? "text-[#b2fff6]" : "text-[#085c54]"}`}>
              V1TR0 Admin Dashboard
            </p>
          </div>

          {/* Credenciales por defecto */}
          <div className={`${isDark ? "bg-[#08A696]/10 border-[#08A696]/20" : "bg-[#08A696]/5 border-[#08A696]/30"} border rounded-xl p-4 mb-6`}>
            <div className="flex items-start gap-3">
              <LockKeyholeIcon className={`w-5 h-5 mt-0.5 ${isDark ? "text-[#26FFDF]" : "text-[#025159]"}`} />
              <div className="flex-1">
                <h3 className={`text-sm font-semibold ${isDark ? "text-[#26FFDF]" : "text-[#04423c]"} mb-2`}>
                  Credenciales por Defecto
                </h3>
                <div className={`text-xs ${isDark ? "text-[#b2fff6]" : "text-[#085c54]"} space-y-1 mb-3`}>
                  <p><strong>Email:</strong> {DEFAULT_CREDENTIALS.email}</p>
                  <p><strong>Password:</strong> {DEFAULT_CREDENTIALS.password}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillDefaultCredentials}
                  className={`w-full ${isDark ? "border-[#08A696]/40 text-[#26FFDF] hover:bg-[#08A696]/20" : "border-[#08A696]/60 text-[#025159] hover:bg-[#08A696]/10"}`}
                >
                  Usar Credenciales
                </Button>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className={`${isDark ? "text-[#26FFDF]" : "text-[#04423c]"}`}>
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@v1tr0.com"
                required
                className={`${isDark ? "bg-[#02505950] border-[#08A696]/30 text-[#b2fff6] placeholder:text-[#b2fff6]/50" : "bg-white border-[#08A696]/40 text-[#04423c] placeholder:text-[#085c54]/50"}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={`${isDark ? "text-[#26FFDF]" : "text-[#04423c]"}`}>
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`${isDark ? "bg-[#02505950] border-[#08A696]/30 text-[#b2fff6] placeholder:text-[#b2fff6]/50" : "bg-white border-[#08A696]/40 text-[#04423c] placeholder:text-[#085c54]/50"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${isDark ? "text-[#26FFDF]" : "text-[#025159]"} hover:underline`}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full h-12 text-base font-semibold ${isDark ? "bg-[#08A696] hover:bg-[#26FFDF] text-white" : "bg-[#025159] hover:bg-[#04423c] text-white"} transition-all duration-300`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className={`text-xs ${isDark ? "text-[#b2fff6]/70" : "text-[#085c54]/70"}`}>
              Acceso exclusivo para administradores
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
