"use client"

import { useState } from "react"
import { X, Send, Sparkles } from "lucide-react"
import CustomSelect from "@/components/ui/CustomSelect"

interface UnifiedContactModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  name: string
  email: string
  message: string
  serviceArea: string
}

export default function UnifiedContactModal({ isOpen, onClose }: UnifiedContactModalProps) {
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    serviceArea: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/unified-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        // Cerrar modal después de 3 segundos
        setTimeout(() => {
          onClose()
          setSubmitSuccess(false)
          setFormData({ name: "", email: "", message: "", serviceArea: "" })
        }, 3000)
      } else {
        console.error("Error al enviar el formulario")
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-lg">
        {/* Gradiente de fondo con blur - igual que en el home */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-2xl blur opacity-60 animate-pulse`} />
        
        {/* Modal principal con backdrop blur */}
        <div className={`relative bg-[#02505950] backdrop-blur-md rounded-2xl border border-[#08A696]/30 shadow-2xl shadow-[#08A696]/20 p-8 transform transition-all duration-300 scale-100 hover:shadow-3xl hover:shadow-[#08A696]/30`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-[#08A696]/10 transition-all duration-300`}>
              <Sparkles className={`w-5 h-5 text-[#26FFDF]`} />
            </div>
            <h3 className={`text-2xl font-bold text-[#26FFDF]`}>Solicitar Consulta</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-[#08A696]/20 transition-all duration-300 hover:scale-110`}
          >
            <X className={`w-5 h-5 text-[#26FFDF]`} />
          </button>
        </div>

        {submitSuccess ? (
          <div className="text-center py-8">
            <div className={`w-20 h-20 bg-[#08A696]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce`}>
              <Send className={`w-10 h-10 text-[#26FFDF]`} />
            </div>
            <h4 className={`text-xl font-bold mb-3 text-[#26FFDF]`}>¡Mensaje enviado!</h4>
            <p className="text-textMuted text-lg">Nos pondremos en contacto contigo lo antes posible.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label htmlFor="name" className={`block text-sm font-semibold mb-2 transition-colors duration-300 text-[#26FFDF]/80 group-focus-within:text-[#26FFDF]`}>
                Nombre
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 bg-[#02505931] backdrop-blur-sm border-[#08A696]/20 focus:border-[#08A696] focus:bg-[#02505950] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#08A696]/30 text-[#26FFDF] placeholder-[#26FFDF]/50 transition-all duration-300 hover:border-[#08A696]/50`}
                  placeholder="Tu nombre"
                />
              </div>
            </div>

            <div className="group">
              <label htmlFor="email" className={`block text-sm font-semibold mb-2 transition-colors duration-300 text-[#26FFDF]/80 group-focus-within:text-[#26FFDF]`}>
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 bg-[#02505931] backdrop-blur-sm border-[#08A696]/20 focus:border-[#08A696] focus:bg-[#02505950] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#08A696]/30 text-[#26FFDF] placeholder-[#26FFDF]/50 transition-all duration-300 hover:border-[#08A696]/50`}
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div className="group">
              <label htmlFor="serviceArea" className={`block text-sm font-semibold mb-2 transition-colors duration-300 text-[#26FFDF]/80 group-focus-within:text-[#26FFDF]`}>
                Área de Servicio
              </label>
              <CustomSelect
                options={[
                  { value: "desarrollo", label: "Desarrollo de Software" },
                  { value: "sistemas", label: "Sistemas de Información" },
                  { value: "automatizacion", label: "Automatización de Tareas" },
                  { value: "gestion", label: "Gestión de Proyectos" },
                  { value: "datos", label: "Ciencia de Datos y Análisis Avanzado" },
                  { value: "demo-landing", label: "Demo Landing Page (Gratis)" },
                  { value: "demo-ecommerce", label: "Demo E-commerce (Gratis)" },
                  { value: "demo-portafolio", label: "Demo Portafolio (Gratis)" },
                  { value: "demo-personalizada", label: "Demo Personalizada ($150,000 COP)" }
                ]}
                value={formData.serviceArea}
                onChange={(value) => setFormData(prev => ({ ...prev, serviceArea: value }))}
                placeholder="Selecciona un área"
              />
            </div>

            <div className="group">
              <label htmlFor="message" className={`block text-sm font-semibold mb-2 transition-colors duration-300 text-[#26FFDF]/80 group-focus-within:text-[#26FFDF]`}>
                Mensaje
              </label>
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className={`w-full px-4 py-3 bg-[#02505931] backdrop-blur-sm border-[#08A696]/20 focus:border-[#08A696] focus:bg-[#02505950] border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#08A696]/30 text-[#26FFDF] placeholder-[#26FFDF]/50 transition-all duration-300 hover:border-[#08A696]/50 resize-none`}
                  placeholder="Describe tu proyecto o consulta..."
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                  isSubmitting 
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                } bg-gradient-to-r from-[#08A696] to-[#26FFDF] hover:from-[#0a9b8a] hover:to-[#20e6c7] shadow-[0_0_20px_rgba(8,166,150,0.3)] hover:shadow-[0_0_30px_rgba(8,166,150,0.5)]`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Enviar Consulta
                    </>
                  )}
                </span>
                <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#26FFDF]/10 to-[#08A696]/10`} />
              </button>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  )
}