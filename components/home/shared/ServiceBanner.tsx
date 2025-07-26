"use client"

import type React from "react"

import type { StaticImageData } from "next/image"
import type { ReactNode } from "react"
import Image from "next/image"
import { ArrowRightIcon } from "@/lib/icons"
import { useTheme } from "@/components/theme-provider"
import { useState, useContext, createContext, useEffect, useRef } from "react"
import { X, Send } from "lucide-react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

// Registrar el plugin useGSAP
gsap.registerPlugin(useGSAP)

// Contexto para detectar si estamos dentro de PinnedScrollSection
const PinnedScrollContext = createContext(false)

// Exportar el contexto para uso en PinnedScrollSection
export { PinnedScrollContext }

interface Feature {
  icon: ReactNode
  text: string
}

interface ServiceBannerProps {
  title: string
  description: string
  features?: Feature[]
  imageSrc: StaticImageData | string
  imageAlt: string
  ctaLink: string
  ctaText: string
}

export default function ServiceBanner({
  title,
  description,
  features = [],
  imageSrc,
  imageAlt,
  ctaLink,
  ctaText,
}: ServiceBannerProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    serviceArea: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [isGlowing, setIsGlowing] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  // Detectar si estamos dentro de PinnedScrollSection
  const isInsidePinnedScroll = useContext(PinnedScrollContext)
  
  // Referencias para animaciones GSAP
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  
  // Animaciones de entrada con GSAP (solo si NO está en PinnedScrollSection)
  useGSAP(() => {
    if (isInsidePinnedScroll) {
      // Si está en PinnedScrollSection, asegurar que los elementos estén visibles sin animación
      const elements = [
        titleRef.current,
        descriptionRef.current,
        featuresRef.current,
        ctaRef.current,
        imageRef.current
      ].filter(Boolean)
      
      // Establecer estado final directamente sin animación
      elements.forEach(element => {
        if (element) {
          element.style.opacity = '1'
          element.style.transform = 'translateY(0px)'
        }
      })
      return
    }
    
    const elements = [
      titleRef.current,
      descriptionRef.current,
      featuresRef.current,
      ctaRef.current,
      imageRef.current
    ].filter(Boolean)
    
    // Configurar estado inicial
    gsap.set(elements, { opacity: 0, y: 20 })
    
    // Animación de entrada escalonada
    gsap.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.2
    })
  }, { dependencies: [isInsidePinnedScroll] })
  
  // Animación del modal
  useGSAP(() => {
    if (!isPopupOpen || !modalRef.current || isInsidePinnedScroll) return
    
    gsap.fromTo(modalRef.current, 
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
    )
  }, { dependencies: [isPopupOpen, isInsidePinnedScroll] })

  // Hook para animaciones de interacción con contextSafe
  const { contextSafe } = useGSAP(() => {}, { dependencies: [] })

  const handleImageClick = contextSafe(() => {
    if (isInsidePinnedScroll) return // Deshabilitar en PinnedScrollSection
    
    setIsGlowing(true)
    setIsShaking(true)
    
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          // Asegurar que la escala vuelva a 1 al completar
          if (imageRef.current) {
            gsap.set(imageRef.current, { scale: 1 })
          }
        }
      })
    }

    setTimeout(() => setIsShaking(false), 500)
    setTimeout(() => setIsGlowing(false), 800)
  })
  
  // Animaciones de hover para el botón CTA
  const handleCtaHover = contextSafe((isHovering: boolean) => {
    if (!ctaRef.current || isInsidePinnedScroll) return // Deshabilitar en PinnedScrollSection
    
    gsap.to(ctaRef.current, {
      scale: isHovering ? 1.02 : 1,
      duration: 0.2,
      ease: "power2.out"
    })
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSubmitSuccess(true)
    setIsSubmitting(false)

    setTimeout(() => {
      setIsPopupOpen(false)
      setSubmitSuccess(false)
      setFormData({ name: "", email: "", message: "", serviceArea: "" })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const placeholderImage = `/placeholder.svg?height=400&width=500&query=${encodeURIComponent(imageAlt)}`

  return (
    <section className="min-h-screen lg:min-h-screen w-full px-4 py-8 lg:py-16 flex items-center bg-transparent">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 lg:pr-12">
          <h1
            ref={titleRef}
            className="text-4xl md:text-6xl font-bold text-textPrimary mb-6"
          >
            {title}
          </h1>

          <p 
            ref={descriptionRef}
            className="text-textMuted text-lg mb-8"
          >
            {description}
          </p>

          <div
            ref={featuresRef}
            className="space-y-4"
          >
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-custom-2 text-highlight">{feature.icon}</div>
                <p className="text-textPrimary">{feature.text}</p>
              </div>
            ))}
          </div>

          {/* Botón CTA con el nuevo diseño glassmorphism */}
          <div
            ref={ctaRef}
            className="mt-10"
          >
            <button
              onClick={() => setIsPopupOpen(true)}
              onMouseEnter={() => handleCtaHover(true)}
              onMouseLeave={() => handleCtaHover(false)}
              className={`${isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm"} rounded-2xl border ${isDark ? "border-[#08A696]/20" : "border-[#08A696]/30"} transition-all duration-300 hover:border-[#08A696] ${isDark ? "hover:bg-[#02505950]" : "hover:bg-[#c5ebe7]"} inline-flex items-center px-8 py-4 text-lg font-semibold`}
            >
              <span className={`${isDark ? "text-[#26FFDF]" : "text-[#08A696]"} transition-colors duration-300`}>
                {ctaText}
              </span>
              <ArrowRightIcon className={`ml-3 w-5 h-5 transition-transform duration-300 hover:translate-x-1 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`} />
            </button>
          </div>
        </div>

        <div
          ref={imageRef}
          className="lg:w-1/2 mt-12 lg:mt-0"
        >
          <div className="flex items-center justify-center">
            <Image
              src={imageSrc || placeholderImage}
              alt={imageAlt}
              width={600}
              height={600}
              onClick={handleImageClick}
              className={`w-full h-auto object-cover transition-all duration-700 ease-in-out hover:scale-105 ${
                isGlowing ? "animate-glow-pulse" : ""
              } ${isShaking ? "animate-shake" : ""}`}
              style={{
                cursor: "pointer",
              }}
            />
          </div>
        </div>
      </div>

      {/* Modal del formulario */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="bg-backgroundSecondary rounded-xl p-6 w-full max-w-md border border-custom-2/30"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-textPrimary">Solicitar Consulta</h3>
              <button
                onClick={() => setIsPopupOpen(false)}
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
                    <option value="" disabled>
                      Selecciona un área
                    </option>
                    <option value="desarrollo">Desarrollo de Software</option>
                    <option value="gestion">Gestión de Proyectos</option>
                    <option value="datos">Ciencia de Datos y Análisis Avanzado</option>
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
      )}

    </section>
  )
}
