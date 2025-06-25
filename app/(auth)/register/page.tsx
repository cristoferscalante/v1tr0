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
import { CheckCircle2, AlertCircle } from "lucide-react"

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
  })

  // Validate password whenever it changes
  useEffect(() => {
    setValidations({
      length: formData.password.length >= 8,
      number: /\d/.test(formData.password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
      uppercase: /[A-Z]/.test(formData.password),
      match: formData.password === formData.confirmPassword && formData.confirmPassword !== "",
    })
  }, [formData.password, formData.confirmPassword])

  // Validate email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Validate fields on change
    if (name === "email" && touched.email) {
      setFormErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Por favor, introduce un email válido",
      }))
    }

    if (name === "name" && touched.name) {
      setFormErrors((prev) => ({
        ...prev,
        name: value.trim() ? "" : "El nombre es obligatorio",
      }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))

    // Validate on blur
    if (name === "email") {
      setFormErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Por favor, introduce un email válido",
      }))
    }

    if (name === "name") {
      setFormErrors((prev) => ({
        ...prev,
        name: value.trim() ? "" : "El nombre es obligatorio",
      }))
    }
  }

  const isFormValid = () => {
    // Check all password validations
    const isPasswordValid = Object.values(validations).every((v) => v)

    // Check other fields
    const isNameValid = formData.name.trim() !== ""
    const isEmailValid = validateEmail(formData.email)
    const isTermsAccepted = formData.terms

    return isPasswordValid && isNameValid && isEmailValid && isTermsAccepted
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Final validation before submission
    if (!formData.terms) {
      setFormErrors((prev) => ({
        ...prev,
        terms: "Debes aceptar los términos y condiciones",
      }))
      return
    }

    if (!isFormValid()) {
      return
    }

    setIsLoading(true)

    try {
      // Simular registro (reemplazar con tu lógica real)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirigir al dashboard o a donde corresponda después del registro exitoso
      router.push("/dashboard")
    } catch (error) {
      console.error("Error durante el registro:", error)
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
      <span className={isValid ? "text-green-500" : "text-muted-foreground"}>{text}</span>
    </div>
  )

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Crear una cuenta</CardTitle>
          <CardDescription>Ingresa tus datos para registrarte</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                name="name"
                placeholder="Tu nombre completo"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.name && formErrors.name ? "border-red-500" : ""}
                autoComplete="name"
              />
              {touched.name && formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.email && formErrors.email ? "border-red-500" : ""}
                autoComplete="email"
              />
              {touched.email && formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onBlur={(e) => setTouched((prev) => ({ ...prev, password: true }))}
                autoComplete="new-password"
              />

              {touched.password && (
                <div className="mt-2 space-y-1 text-sm">
                  <ValidationItem isValid={validations.length} text="Mínimo 8 caracteres" />
                  <ValidationItem isValid={validations.uppercase} text="Al menos una mayúscula" />
                  <ValidationItem isValid={validations.number} text="Al menos un número" />
                  <ValidationItem isValid={validations.special} text="Al menos un carácter especial" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={(e) => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                className={touched.confirmPassword && !validations.match ? "border-red-500" : ""}
                autoComplete="new-password"
              />
              {touched.confirmPassword && !validations.match && (
                <p className="text-sm text-red-500">Las contraseñas no coinciden</p>
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
              <Label htmlFor="terms" className="text-sm leading-tight">
                Acepto los{" "}
                <Link href="/terminos" className="text-highlight hover:underline">
                  términos y condiciones
                </Link>
              </Label>
            </div>
            {formErrors.terms && <p className="text-sm text-red-500">{formErrors.terms}</p>}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" variant="teal" disabled={isLoading || !isFormValid()}>
              {isLoading ? "Registrando..." : "Registrarse"}
            </Button>
            <div className="text-center text-sm">
              <span className="text-textMuted">¿Ya tienes una cuenta? </span>
              <Link href="/login" className="text-highlight hover:underline font-medium">
                Iniciar sesión
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
