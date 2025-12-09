'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import NavBar from '@/components/global/NavBar'
import FooterSection from '@/components/global/FooterSection'
import { CustomCheckbox } from '@/components/ui/custom-checkbox'
import { gsap } from 'gsap'
import { getAuthErrorMessage, logAuthError } from '@/lib/auth-errors'
// Componentes UI nativos - sin shadcn/ui

interface ValidationState {
  length: boolean
  number: boolean
  special: boolean
  uppercase: boolean
  match: boolean
}

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)


  useEffect(() => {
    // Animaciones GSAP
    const tl = gsap.timeline()

    tl.fromTo('.auth-container',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    )
      .fromTo('.auth-title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo('.auth-form',
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo('.form-element',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
        '-=0.2'
      )
  }, [])
  const [formData, setFormData] = useState({
    fullName: "",
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
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  })
  const [formErrors, setFormErrors] = useState({
    fullName: "",
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



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }))

    // Clear errors when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }))
    }
  }





  const isFormValid = () => {
    return (
      formData.fullName.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      validations.length &&
      validations.number &&
      validations.special &&
      validations.uppercase &&
      validations.match &&
      formData.terms &&
      !formErrors.fullName &&
      !formErrors.email
    )
  }

  // Función para manejar el registro
  const signUp = async (email: string, password: string, name: string) => {
    try {
      // console.log('[REGISTER] Intentando crear cuenta con email:', email)

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
          }
        }
      })

      // console.log('[REGISTER] Respuesta de Supabase:', { 
      //   hasData: !!data, 
      //   hasUser: !!data?.user,
      //   error: error?.message 
      // })

      if (error) {
        logAuthError(error, 'REGISTER')
        const authError = getAuthErrorMessage(error)
        return {
          success: false,
          error: authError.message,
          description: authError.description,
          action: authError.action
        }
      }

      if (data.user) {
        // console.log('[REGISTER] Usuario creado exitosamente')
        return { success: true, data: data.user }
      }

      return {
        success: false,
        error: 'No se pudo crear el usuario',
        description: 'No se recibió información del nuevo usuario.'
      }
    } catch (error) {
      logAuthError(error, 'REGISTER_EXCEPTION')
      const authError = getAuthErrorMessage(error)
      return {
        success: false,
        error: authError.message,
        description: authError.description
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Reset errors
    setFormErrors({
      fullName: "",
      email: "",
      terms: "",
      general: "",
    })

    // Final validation before submission
    if (!formData.terms) {
      toast.error('Debes aceptar los términos y condiciones')
      setIsLoading(false)
      return
    }

    if (!isFormValid()) {
      setIsLoading(false)
      return
    }

    try {
      const result = await signUp(formData.email, formData.password, formData.fullName)

      if (result.success) {
        setSuccess(true)
        toast.success('¡Cuenta creada exitosamente!', {
          description: 'Revisa tu email para confirmar tu cuenta.',
          duration: 5000
        })
        // Mostrar mensaje de éxito y redirigir después de unos segundos
        setTimeout(() => {
          router.push("/login?message=check_email")
        }, 3000)
      } else {
        toast.error(result.error || 'Error al crear la cuenta', {
          description: result.description,
          action: result.action ? {
            label: 'Entendido',
            onClick: () => { }
          } : undefined,
          duration: 5000
        })
        setFormErrors((prev) => ({
          ...prev,
          general: result.error || "Error al crear la cuenta",
        }))
      }
    } catch (error) {
      logAuthError(error, 'REGISTER_SUBMIT')
      const authError = getAuthErrorMessage(error)

      toast.error(authError.message, {
        description: authError.description,
        duration: 5000
      })
      setFormErrors((prev) => ({
        ...prev,
        general: "Error inesperado durante el registro",
      }))
    } finally {
      setIsLoading(false)
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
    <div className="min-h-screen bg-gradient-to-br from-[#02505931] via-[#08A696]/20 to-[#02505931] flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
        <NavBar />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12 pt-24">
        <div className="w-full max-w-md mx-auto">
          {/* Título fuera del formulario */}
          <div className="text-center mb-8 title-animation">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#26FFDF] to-[#08A696] bg-clip-text text-transparent mb-2">
              Crear cuenta
            </h1>
            <p className="text-gray-300 text-lg">
              Ingresa tus datos para registrarte
            </p>
          </div>

          {success ? (
            <div className="bg-[#02505931]/80 backdrop-blur-xl rounded-2xl p-8 border border-green-500/30 shadow-2xl text-center">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-400 mb-2">
                ¡Registro exitoso!
              </h2>
              <p className="text-gray-300 mb-4">
                Tu cuenta ha sido creada correctamente. Serás redirigido al login en unos segundos.
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>
          ) : (
            <div className="bg-[#02505931]/80 backdrop-blur-xl rounded-2xl p-8 border border-[#08A696]/30 shadow-2xl register-form">
              <div className="space-y-6">
                {formErrors.general && (
                  <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl mb-4 text-sm backdrop-blur-sm">
                    {formErrors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Campo de nombre */}
                  <div className="form-element">
                    <label htmlFor="fullName" className="block text-[#26FFDF] font-medium mb-2">
                      Nombre completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#08A696] h-5 w-5" />
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full h-[48px] pl-10 pr-4 bg-[#02505931]/50 border border-[#08A696]/30 rounded-xl text-white placeholder-gray-400 focus:border-[#26FFDF] focus:ring-2 focus:ring-[#26FFDF]/20 focus:outline-none transition-all duration-300"
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>
                  </div>

                  {/* Campo de email */}
                  <div className="form-element">
                    <label htmlFor="email" className="block text-[#26FFDF] font-medium mb-2">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#08A696] h-5 w-5" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full h-[48px] pl-10 pr-4 bg-[#02505931]/50 border border-[#08A696]/30 rounded-xl text-white placeholder-gray-400 focus:border-[#26FFDF] focus:ring-2 focus:ring-[#26FFDF]/20 focus:outline-none transition-all duration-300"
                        placeholder="tu@ejemplo.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Campo de contraseña */}
                  <div className="form-element">
                    <label htmlFor="password" className="block text-[#26FFDF] font-medium mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#08A696] h-5 w-5" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full h-[48px] pl-10 pr-12 bg-[#02505931]/50 border border-[#08A696]/30 rounded-xl text-white placeholder-gray-400 focus:border-[#26FFDF] focus:ring-2 focus:ring-[#26FFDF]/20 focus:outline-none transition-all duration-300"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#08A696] hover:text-[#26FFDF] transition-colors focus:outline-none"
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

                  {/* Campo de confirmar contraseña */}
                  <div className="form-element">
                    <label htmlFor="confirmPassword" className="block text-[#26FFDF] font-medium mb-2">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#08A696] h-5 w-5" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full h-[48px] pl-10 pr-12 bg-[#02505931]/50 border border-[#08A696]/30 rounded-xl text-white placeholder-gray-400 focus:border-[#26FFDF] focus:ring-2 focus:ring-[#26FFDF]/20 focus:outline-none transition-all duration-300"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#08A696] hover:text-[#26FFDF] transition-colors focus:outline-none"
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

                  <div className="form-element">
                    <div className="flex items-start space-x-3">
                      <CustomCheckbox
                        id="terms"
                        checked={formData.terms}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, terms: checked === true }))}
                        className="mt-1"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-300 leading-relaxed cursor-pointer">
                        Acepto los{' '}
                        <a href="/terminos" className="text-[#26FFDF] hover:text-[#08A696] underline transition-colors">
                          términos y condiciones
                        </a>
                        {' '}y la{' '}
                        <a href="/privacidad" className="text-[#26FFDF] hover:text-[#08A696] underline transition-colors">
                          política de privacidad
                        </a>
                      </label>
                    </div>
                    {formErrors.terms && <p className="text-sm text-red-400 -mt-2">{formErrors.terms}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-[48px] bg-gradient-to-r from-[#08A696] to-[#26FFDF] hover:from-[#26FFDF] hover:to-[#08A696] text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Creando cuenta...</span>
                      </div>
                    ) : (
                      'Crear cuenta'
                    )}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-[#0A1A1A] px-2 text-gray-400">O continúa con</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full h-[48px] bg-transparent border border-[#08A696]/30 text-white hover:bg-[#08A696]/10 hover:border-[#08A696] transition-all duration-300 rounded-xl flex items-center justify-center space-x-2"
                    onClick={() => {
                      // Implementar autenticación con Google
                      toast.info('Próximamente disponible')
                    }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Continuar con Google</span>
                  </button>

                  {/* Botón para volver a login */}
                  <div className="text-center pt-4">
                    <p className="text-gray-400 text-sm">
                      ¿Ya tienes una cuenta?{' '}
                      <a href="/login" className="text-[#26FFDF] hover:text-[#08A696] hover:underline transition-colors duration-300 font-medium">
                        Inicia sesión aquí
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <FooterSection />
    </div>
  )
}
