"use client"

import { useState } from "react"
import { X, Send } from "lucide-react"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  name: string
  email: string
  serviceArea: string
  message: string
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    serviceArea: "datos",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simular envío del formulario
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSubmitSuccess(true)
      
      // Resetear formulario después de 3 segundos
      setTimeout(() => {
        setSubmitSuccess(false)
        setFormData({
          name: "",
          email: "",
          serviceArea: "datos",
          message: ""
        })
        onClose()
      }, 3000)
    } catch (error) {
      console.error("Error al enviar el formulario:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-backgroundSecondary rounded-xl p-6 w-full max-w-md shadow-2xl border border-custom-2/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-textPrimary">Solicitar información</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-custom-1/50 transition-colors"
          >
            <X className="w-5 h-5 text-textMuted" />
          </button>
        </div>

        {submitSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-500" />
            </div>
            <h4 className="text-lg font-semibold text-textPrimary mb-2">¡Mensaje enviado!</h4>
            <p className="text-textMuted">Nos pondremos en contacto contigo lo antes posible.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-textMuted mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-custom-1/30 border border-custom-2/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight text-textPrimary"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-textMuted mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-custom-1/30 border border-custom-2/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight text-textPrimary"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="serviceArea" className="block text-sm font-medium text-textMuted mb-1">
                Área de Servicio
              </label>
              <select
                id="serviceArea"
                name="serviceArea"
                value={formData.serviceArea}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-custom-1/30 border border-custom-2/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight text-textPrimary"
              >
                <option value="datos">Sistemas de Información</option>
                <option value="desarrollo">Desarrollo de Software</option>
                <option value="gestion">Gestión de Proyectos</option>
                <option value="automatizacion">Automatización de Tareas</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-textMuted mb-1">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 bg-custom-1/30 border border-custom-2/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight resize-none text-textPrimary"
                placeholder="¿En qué podemos ayudarte?"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-custom-3 to-custom-4 text-white rounded-lg font-medium hover:from-highlight hover:to-custom-3 transition-all duration-300 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Enviando...
                </>
              ) : (
                "Enviar mensaje"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}