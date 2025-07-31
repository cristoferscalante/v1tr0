"use client"

import type React from "react"

import { useState, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Database, X, Send } from "lucide-react"
import { useEffect } from "react"
import BokehBackground from "@/components/about/BokehBackground"
import InformationSystemsCarousel from "@/components/home/InformationSystemsCarousel"
import FooterSection from "@/components/global/FooterSection"

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function InformationSystems() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<HTMLDivElement[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    serviceArea: "sistemas", // Preseleccionamos sistemas de información
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío de datos
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mostrar mensaje de éxito
    setSubmitSuccess(true)
    setIsSubmitting(false)

    // Cerrar el popup después de 3 segundos
    setTimeout(() => {
      setIsContactPopupOpen(false)
      setSubmitSuccess(false)
      setFormData({ name: "", email: "", message: "", serviceArea: "sistemas" })
    }, 3000)
  }

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const isMobile = window.innerWidth <= 768
    
    // Only apply GSAP snap on desktop
    if (!isMobile && containerRef.current && sectionsRef.current.length > 0) {
      const sections = sectionsRef.current
      
      // Set up snap scrolling
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        snap: {
          snapTo: 1 / (sections.length - 1),
          duration: { min: 0.2, max: 0.6 },
          delay: 0.1,
          ease: 'power2.inOut'
        }
      })

      // Add entrance animations for each section
      sections.forEach((section, index) => {
        gsap.fromTo(section, 
          {
            opacity: 0,
            y: 50
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })
    }

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el)
    }
  }

  return (
    <section className="w-full font-sans relative">
      <div 
        ref={containerRef}
        className="min-h-screen"
      >
        {/* Section 1: Sistemas de Información */}
        <div 
          ref={addToRefs}
          className="min-h-screen flex items-center justify-center snap-start relative overflow-hidden"
        >
          <BokehBackground />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <div className="mb-8">
              <Database className="w-20 h-20 mx-auto mb-6 text-highlight animate-gentle-balance" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">
              Sistemas de Información
            </h1>
            <p className="text-xl md:text-2xl text-textMuted leading-relaxed max-w-3xl mx-auto">
              Un sistema de información te permite tener visualizaciones clave, seguimiento en tiempo real, 
              con un ecosistema de datos que te permita gestionar y mejorar el modelo de negocio o la gestión 
              institucional, agencial en cualquier entorno con manejo y control.
            </p>
          </div>
        </div>

        {/* Section 2: Apple Cards Carousel de Sistemas de Información */}
        <div 
          ref={addToRefs}
          className="min-h-screen flex items-center justify-center snap-start bg-background"
        >
          <InformationSystemsCarousel />
        </div>

        {/* Section 3: Footer integrado con snap */}
        <div 
          ref={addToRefs}
          className="min-h-screen flex items-center justify-center snap-start bg-background"
        >
          <FooterSection />
        </div>
      </div>

      {/* Contact Popup */}
      {isContactPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-custom-2 rounded-lg max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setIsContactPopupOpen(false)}
              className="absolute top-4 right-4 text-textMuted hover:text-textPrimary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold mb-4 text-textPrimary">
              Solicita una consulta
            </h3>

            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-custom-2 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-textPrimary mb-2">
                  ¡Mensaje enviado!
                </h4>
                <p className="text-textMuted">
                  Nos pondremos en contacto contigo pronto.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-textPrimary mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-custom-2 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight bg-background text-textPrimary"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-textPrimary mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-custom-2 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight bg-background text-textPrimary"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-textPrimary mb-1">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-custom-2 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight bg-background text-textPrimary"
                    placeholder="Cuéntanos sobre tu proyecto de sistemas de información..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-highlight disabled:bg-custom-3 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar mensaje
                    </>
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