"use client"

import type React from "react"

import { useState, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Code2, X, Send, ChevronLeft, ChevronRight, ExternalLink, Calendar, Users, Code } from "lucide-react"
import { useEffect } from "react"
import CharacterBackground from "@/components/about/CharacterBackground"
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
  const [selectedProject, setSelectedProject] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    serviceArea: "desarrollo", // Preseleccionamos desarrollo de software
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Datos de proyectos de V1TR0
  const projects = [
    {
      id: 1,
      title: "Sistema de Gestión Hospitalaria",
      description: "Plataforma integral para la gestión de pacientes, citas médicas, historiales clínicos y administración hospitalaria con dashboards en tiempo real.",
      tech: ["React", "Node.js", "PostgreSQL", "WebSocket"],
      year: "2025",
      status: "Activo",
      image: "/service/clinica.png"
    },
    {
      id: 2,
      title: "Dashboard Financiero Corporativo",
      description: "Sistema de análisis financiero con visualización de KPIs, reportes automatizados y predicciones basadas en IA para empresas.",
      tech: ["Vue.js", "Python", "MongoDB", "TensorFlow"],
      year: "2025",
      status: "En desarrollo",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Plataforma E-learning Interactiva",
      description: "Sistema educativo con videoconferencias, evaluaciones automáticas, seguimiento de progreso y gamificación para instituciones.",
      tech: ["Next.js", "Express", "MySQL", "WebRTC"],
      year: "2023",
      status: "Completado",
      image: "/placeholder.svg"
    },
    {
      id: 4,
      title: "Sistema de Inventario Inteligente",
      description: "Gestión automatizada de inventarios con predicción de demanda, alertas de stock y optimización de cadena de suministro.",
      tech: ["Angular", "Java", "Oracle", "Machine Learning"],
      year: "2023",
      status: "Completado",
      image: "/placeholder.svg"
    },
    {
      id: 5,
      title: "Portal de Gestión Municipal",
      description: "Plataforma ciudadana para trámites en línea, seguimiento de solicitudes y comunicación directa con autoridades municipales.",
      tech: ["React", "Laravel", "MySQL", "Redis"],
      year: "2025",
      status: "En desarrollo",
      image: "/placeholder.svg"
    },
    {
      id: 6,
      title: "Sistema CRM Empresarial",
      description: "Gestión completa de relaciones con clientes, automatización de ventas, seguimiento de leads y análisis de comportamiento.",
      tech: ["Svelte", "Django", "PostgreSQL", "Elasticsearch"],
      year: "2023",
      status: "Activo",
      image: "/placeholder.svg"
    }
  ]

  // Funciones para navegación de proyectos
  const nextProject = () => {
    setSelectedProject((prev) => (prev + 1) % projects.length)
  }

  const prevProject = () => {
    setSelectedProject((prev) => (prev - 1 + projects.length) % projects.length)
  }

  const selectProject = (index: number) => {
    setSelectedProject(index)
  }

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simular envío del formulario
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSubmitSuccess(true)
      setTimeout(() => {
        setIsContactPopupOpen(false)
        setSubmitSuccess(false)
        setFormData({
          name: "",
          email: "",
          message: "",
          serviceArea: "sistemas",
        })
      }, 2000)
    } catch (error) {
      console.error("Error al enviar el formulario:", error)
    } finally {
      setIsSubmitting(false)
    }
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
          <CharacterBackground />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <div className="mb-8">
              <Code2 className="w-20 h-20 mx-auto mb-6 text-highlight animate-gentle-balance" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">
              Desarrollo de Software
            </h1>
            <p className="text-xl md:text-2xl text-textMuted leading-relaxed max-w-3xl mx-auto">
              Diseñamos y desarrollamos sistemas de información integrales que optimizan la gestión de datos 
              y procesos empresariales. Creamos soluciones que conectan, organizan y automatizan la información 
              para mejorar la toma de decisiones y la eficiencia operativa.
            </p>
          </div>
        </div>

        {/* Section 2: Panel Interactivo de Proyectos */}
        <div 
           ref={addToRefs}
           className="min-h-screen flex items-center justify-center snap-start relative overflow-hidden px-4 pt-24 pb-8"
         >
          <div className="max-w-6xl mx-auto w-full relative z-10">
            {/* Panel interactivo de proyectos - Layout horizontal */}
            <div className="relative bg-background/80 backdrop-blur-md rounded-3xl p-8 border-2 border-highlight/30 shadow-2xl overflow-hidden">
              <div className="grid lg:grid-cols-5 gap-8">
                {/* Panel izquierdo - Información del proyecto */}
                 <div className="space-y-6 lg:col-span-2">
                  <div className="bg-gradient-to-br from-custom-2/20 to-highlight/20 rounded-2xl p-6 border border-custom-2/30">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-textPrimary text-sm font-medium bg-highlight/20 px-3 py-1 rounded-full border border-highlight/30">
                        {projects[selectedProject].status}
                      </span>
                      <div className="flex items-center text-textMuted text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {projects[selectedProject].year}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-textPrimary mb-4">
                      {projects[selectedProject].title}
                    </h3>
                    <p className="text-textMuted mb-6 leading-relaxed">
                      {projects[selectedProject].description}
                    </p>
                    <div className="mb-6">
                      <h4 className="text-textPrimary font-semibold mb-3 flex items-center">
                        <Code className="w-5 h-5 mr-2" />
                        Tecnologías
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {projects[selectedProject].tech.map((tech, index) => (
                          <span key={index} className="bg-highlight/20 text-highlight px-3 py-1 rounded-full text-sm border border-highlight/30">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-highlight to-accent hover:from-accent hover:to-highlight text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center">
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Ver Proyecto
                    </button>
                  </div>
                </div>

                {/* Panel derecho - Vista previa del proyecto */}
                 <div className="space-y-6 lg:col-span-3">
                  <div className="bg-gradient-to-br from-custom-2/20 to-highlight/20 rounded-2xl p-6 border border-custom-2/30 h-full">
                    <div className="bg-background/50 rounded-xl p-6 h-80 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-highlight to-accent rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                          <ExternalLink className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-textMuted mb-3">Vista previa del proyecto</p>
                        <p className="text-textPrimary font-medium text-lg">{projects[selectedProject].title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel inferior - Navegación */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-highlight/20">
                {/* Botón anterior */}
                <button 
                  onClick={prevProject}
                  className="bg-highlight/20 hover:bg-highlight/30 text-textPrimary p-3 rounded-xl transition-all duration-300 border border-highlight/30 hover:border-highlight/50"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Números de proyectos */}
                <div className="flex space-x-3">
                  {projects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => selectProject(index)}
                      className={`w-14 h-14 rounded-xl border transition-all duration-300 flex items-center justify-center text-xl font-bold ${
                        selectedProject === index
                          ? 'bg-highlight/30 border-highlight/50 text-textPrimary scale-110'
                          : 'bg-custom-2/20 border-custom-2/30 text-textMuted hover:bg-custom-2/30 hover:border-custom-2/50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {/* Botón siguiente */}
                <button 
                  onClick={nextProject}
                  className="bg-highlight/20 hover:bg-highlight/30 text-textPrimary p-3 rounded-xl transition-all duration-300 border border-highlight/30 hover:border-highlight/50"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
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
                    placeholder="Cuéntanos sobre tu proyecto de desarrollo de software..."
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