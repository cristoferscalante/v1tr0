"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, AlertCircle, Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import BackgroundAnimation from "@/components/home/BackgroundAnimation"
import Image from "next/image"

interface ValidationState {
  length: boolean
  number: boolean
  special: boolean
  uppercase: boolean
  match: boolean
}

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  })
  const [validations, setValidations] = useState<ValidationState>({
    length: false,
    number: false,
    special: false,
    uppercase: false,
    match: false,
  })
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  })
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    terms: "",
    general: "",
  })
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Validate password
    const password = formData.password
    setValidations({
      length: password.length >= 8,
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      uppercase: /[A-Z]/.test(password),
      match: formData.password === formData.confirmPassword && formData.confirmPassword !== "",
    })
  }, [formData.password, formData.confirmPassword])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear errors when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))

    // Validate fields on blur
    validateField(name, formData[name as keyof typeof formData] as string)
  }

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        if (!value.trim()) {
          setFormErrors((prev) => ({ ...prev, name: "El nombre es requerido" }))
        } else if (value.trim().length < 2) {
          setFormErrors((prev) => ({ ...prev, name: "El nombre debe tener al menos 2 caracteres" }))
        }
        break
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value) {
          setFormErrors((prev) => ({ ...prev, email: "El correo electrónico es requerido" }))
        } else if (!emailRegex.test(value)) {
          setFormErrors((prev) => ({ ...prev, email: "Ingresa un correo electrónico válido" }))
        }
        break
    }
  }

  const isFormValid = () => {
    return (
      formData.name.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      validations.length &&
      validations.number &&
      validations.special &&
      validations.uppercase &&
      validations.match &&
      formData.terms &&
      !formErrors.name &&
      !formErrors.email
    )
  }

  // Función para manejar el registro
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        return { success: true, data: data.user }
      }

      return { success: false, error: 'No se pudo crear el usuario' }
    } catch {
      return { success: false, error: 'Error inesperado durante el registro' }
    }
  }

  // Función para manejar el registro con proveedores
  const signInWithProvider = async (provider: 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch {
      return { success: false, error: `Error al registrarse con ${provider}` }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Reset errors
    setFormErrors({
      name: "",
      email: "",
      terms: "",
      general: "",
    })

    // Final validation before submission
    if (!formData.terms) {
      setFormErrors((prev) => ({
        ...prev,
        terms: "Debes aceptar los términos y condiciones",
      }))
      setIsLoading(false)
      return
    }

    if (!isFormValid()) {
      setIsLoading(false)
      return
    }

    try {
      const result = await signUp(formData.email, formData.password, formData.name)

      if (result.success) {
        setSuccess(true)
        // Mostrar mensaje de éxito y redirigir después de unos segundos
        setTimeout(() => {
          router.push("/login?message=check_email")
        }, 3000)
      } else {
        setFormErrors((prev) => ({
          ...prev,
          general: result.error || "Error al crear la cuenta",
        }))
      }
    } catch (error) {
      console.error("Error durante el registro:", error)
      setFormErrors((prev) => ({
        ...prev,
        general: "Error inesperado durante el registro",
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const handleProviderSignIn = async (provider: 'google') => {
    setFormErrors({
      name: "",
      email: "",
      terms: "",
      general: "",
    })
    
    const result = await signInWithProvider(provider)
    
    if (!result.success) {
      setFormErrors((prev) => ({
        ...prev,
        general: result.error || `Error al registrarse con ${provider}`,
      }))
    }
  }

  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className="flex items-center gap-2">
      {isValid ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : (
        <AlertCircle className="h-4 w-4 text-amber-500" />
      )}
      <span className={`text-xs ${isValid ? "text-green-500" : "text-gray-400"}`}>{text}</span>
    </div>
  )

  return (
    <>
      <BackgroundAnimation />
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mb-8">
          <Link href="/" className="flex justify-center mb-8">
            <Image src="/v1tr0-logo.svg" alt="V1TR0 Logo" width={80} height={80} className="h-20 w-auto" />
          </Link>

          {success ? (
            <Card className="w-full bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 rounded-2xl">
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">¡Cuenta creada exitosamente!</h2>
                <p className="text-textMuted mb-4">
                  Hemos enviado un enlace de verificación a tu correo electrónico. 
                  Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
                </p>
                <p className="text-sm text-textMuted">
                  Serás redirigido a la página de login en unos segundos...
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="w-full bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 rounded-2xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center text-white">Crear una cuenta</CardTitle>
                <CardDescription className="text-center text-textMuted">
                  Ingresa tus datos para registrarte en V1TR0
                </CardDescription>
              </CardHeader>

              <CardContent>
                {formErrors.general && (
                  <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl mb-4 text-sm backdrop-blur-sm">
                    {formErrors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white font-medium">Nombre completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-textMuted" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="Tu nombre completo"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`pl-10 rounded-2xl border-[#08A696]/30 bg-[#02505931] backdrop-blur-sm transition-all duration-300 focus:border-[#08A696] focus:ring-2 focus:ring-[#08A696]/20 text-white placeholder:text-gray-400 ${touched.name && formErrors.name ? "border-red-500" : ""}`}
                        autoComplete="name"
                        required
                      />
                    </div>
                    {touched.name && formErrors.name && <p className="text-sm text-red-400">{formErrors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white font-medium">Correo electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-textMuted" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@ejemplo.com"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`pl-10 rounded-2xl border-[#08A696]/30 bg-[#02505931] backdrop-blur-sm transition-all duration-300 focus:border-[#08A696] focus:ring-2 focus:ring-[#08A696]/20 text-white placeholder:text-gray-400 ${touched.email && formErrors.email ? "border-red-500" : ""}`}
                        autoComplete="email"
                        required
                      />
                    </div>
                    {touched.email && formErrors.email && <p className="text-sm text-red-400">{formErrors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white font-medium">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-textMuted" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="pl-10 pr-10 rounded-2xl border-[#08A696]/30 bg-[#02505931] backdrop-blur-sm transition-all duration-300 focus:border-[#08A696] focus:ring-2 focus:ring-[#08A696]/20 text-white placeholder:text-gray-400"
                        autoComplete="new-password"
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
                    {touched.password && (
                      <div className="space-y-1 mt-2">
                        <ValidationItem isValid={validations.length} text="Al menos 8 caracteres" />
                        <ValidationItem isValid={validations.number} text="Al menos un número" />
                        <ValidationItem isValid={validations.special} text="Al menos un carácter especial" />
                        <ValidationItem isValid={validations.uppercase} text="Al menos una mayúscula" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white font-medium">Confirmar contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-textMuted" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="pl-10 pr-10 rounded-2xl border-[#08A696]/30 bg-[#02505931] backdrop-blur-sm transition-all duration-300 focus:border-[#08A696] focus:ring-2 focus:ring-[#08A696]/20 text-white placeholder:text-gray-400"
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-[#26FFDF] transition-colors duration-300"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {touched.confirmPassword && (
                      <div className="mt-1">
                        <ValidationItem isValid={validations.match} text="Las contraseñas coinciden" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      name="terms"
                      checked={formData.terms}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          terms: checked === true,
                        }))
                      }
                    />
                    <Label htmlFor="terms" className="text-sm leading-tight text-textMuted">
                      Acepto los{" "}
                      <Link href="/terminos" className="text-[#26FFDF] hover:text-[#08A696] hover:underline transition-colors duration-300">
                        términos y condiciones
                      </Link>{" "}
                      y la{" "}
                      <Link href="/privacidad" className="text-[#26FFDF] hover:text-[#08A696] hover:underline transition-colors duration-300">
                        política de privacidad
                      </Link>
                    </Label>
                  </div>
                  {formErrors.terms && <p className="text-sm text-red-400">{formErrors.terms}</p>}

                  <Button 
                    type="submit" 
                    className="w-full bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl transition-all duration-300 transform scale-95 hover:scale-100 hover:border-[#08A696] hover:bg-[#02505950] text-white hover:text-white px-8 py-4 text-lg font-semibold" 
                    disabled={isLoading || !isFormValid()}
                  >
                    {isLoading ? "Registrando..." : "Crear cuenta"}
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
                  </div>
                  <div className="mt-4">
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
                  <span className="text-textMuted">¿Ya tienes una cuenta? </span>
                  <Link href="/login" className="text-[#26FFDF] hover:text-[#08A696] hover:underline font-medium transition-colors duration-300">
                    Iniciar sesión
                  </Link>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
