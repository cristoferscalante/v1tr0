"use client"

import type React from "react"
import { useState, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { X, Send, ChevronLeft, ChevronRight, ExternalLink, Users, Calendar } from "lucide-react"
import { useEffect } from "react"
import { useScrollSnapEnabled } from "@/hooks/use-device-detection"
import CharacterBackground from "@/components/about/CharacterBackground"
import FooterSection from "@/components/global/FooterSection"

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function SoftwareDevelopment() {
  const [selectedProject, setSelectedProject] = useState(0)
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])

  // Projects data adapted from the original content
  const projects = [
    {
      id: 1,
      title: "Aplicaciones Empresariales",
      description: "Sistemas ERP, CRM y de gestión interna adaptados a tus procesos específicos para maximizar la eficiencia operativa.",
      tech: ["React", "Node.js", "PostgreSQL", "Docker"],
      category: "Enterprise",
      status: "Activo",
      image: "/images/ciclo-vida-software.png"
    },
    {
      id: 2,
      title: "Plataformas Web",
      description: "Portales, e-commerce y aplicaciones web progresivas con experiencias de usuario excepcionales y alto rendimiento.",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
      category: "Web",
      status: "Activo",
      image: "/images/ciclo-vida-software.png"
    },
    {
      id: 3,
      title: "Aplicaciones Móviles",
      description: "Apps nativas y multiplataforma que conectan con tus usuarios en cualquier dispositivo con interfaces intuitivas.",
      tech: ["React Native", "Flutter", "Swift", "Kotlin"],
      category: "Mobile",
      status: "Activo",
      image: "/images/ciclo-vida-software.png"
    },
    {
      id: 4,
      title: "Soluciones de IA",
      description: "Implementación de inteligencia artificial y machine learning para automatizar procesos y generar insights.",
      tech: ["Python", "TensorFlow", "PyTorch", "AWS"],
      category: "AI/ML",
      status: "Activo",
      image: "/images/ciclo-vida-software.png"
    }
  ]

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el)
    }
  }

  const selectProject = (index: number) => {
    setSelectedProject(index)
  }

  const nextProject = () => {
    setSelectedProject((prev) => (prev + 1) % projects.length)
  }

  const prevProject = () => {
    setSelectedProject((prev) => (prev - 1 + projects.length) % projects.length)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSubmitSuccess(true)
    setIsSubmitting(false)

    // Close popup after 3 seconds
    setTimeout(() => {
      setIsContactPopupOpen(false)
      setSubmitSuccess(false)
      setFormData({ name: "", email: "", message: "" })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const shouldEnableScrollSnap = useScrollSnapEnabled()

  useEffect(() => {
    if (shouldEnableScrollSnap) {
      // Desktop: Enable snap scrolling and animations
      ScrollTrigger.create({
        trigger: ".snap-container",
        start: "top top",
        end: "bottom bottom",
        snap: {
          snapTo: 1 / 3, // Snap to thirds of the container
          duration: { min: 0.2, max: 0.6 },
          delay: 0.1,
        },
      })

      // Animate sections on scroll
      sectionsRef.current.forEach((section) => {
        if (section) {
          gsap.fromTo(
            section.children,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              stagger: 0.2,
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
              },
            }
          )
        }
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [shouldEnableScrollSnap])

  return (
    <section className="relative">
      <CharacterBackground />
      
      <div className="snap-container h-screen overflow-y-auto">
        {/* Section 1: Hero - Desarrollo de Software */}
        <div 
          ref={addToRefs}
          className="min-h-screen flex items-center justify-center snap-start bg-background"
        >
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-highlight/20 text-highlight rounded-full text-sm font-medium border border-highlight/30">
                  Desarrollo de Software
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-textPrimary leading-tight">
                  Soluciones digitales a la medida
                </h1>
                <div className="space-y-4">
                  <p className="text-lg text-textSecondary max-w-3xl mx-auto leading-relaxed font-medium">
                    Creamos software personalizado que se adapta perfectamente a las necesidades específicas de tu empresa.
                    Desde aplicaciones web hasta sistemas empresariales complejos, transformamos tus ideas en realidad digital.
                  </p>
                  <p className="text-xl text-textMuted max-w-2xl mx-auto leading-relaxed">
                    Transformamos ideas en soluciones tecnológicas innovadoras. Nuestro enfoque combina las últimas tecnologías con metodologías ágiles para crear software que impulsa el crecimiento de tu negocio.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center items-center">
                <div className="flex items-center text-textMuted">
                  <Users className="w-5 h-5 mr-2" />
                  <span>+50 proyectos exitosos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Interactive Projects Panel */}
        <div 
          ref={addToRefs}
          className="min-h-screen flex items-center justify-center snap-start bg-background"
        >
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-textPrimary mb-4">
                  Desarrollo de Software
                </h2>
                <div className="space-y-3">
                  <p className="text-lg text-textSecondary max-w-3xl mx-auto leading-relaxed font-medium">
                    Especialistas en crear aplicaciones robustas y escalables que impulsan la transformación digital de tu negocio.
                    Utilizamos las mejores prácticas de desarrollo y tecnologías de vanguardia para garantizar resultados excepcionales.
                  </p>
                  <p className="text-xl text-textMuted max-w-2xl mx-auto">
                    Desarrollamos soluciones personalizadas que se adaptan perfectamente a tus necesidades específicas
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-5 gap-8">
                {/* Panel izquierdo - Lista de proyectos */}
                <div className="space-y-4 lg:col-span-2">
                  {projects.map((project, projectIndex) => (
                    <div
                      key={project.id}
                      onClick={() => selectProject(projectIndex)}
                      className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedProject === projectIndex
                          ? 'bg-gradient-to-r from-highlight/20 to-accent/20 border-highlight/50 shadow-lg'
                          : 'bg-custom-2/20 border-custom-2/30 hover:bg-custom-2/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-textPrimary">{project.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedProject === projectIndex ? 'bg-highlight/30 text-highlight' : 'bg-custom-3/30 text-custom-3'
                        }`}>
                          {project.category}
                        </span>
                      </div>
                      <p className="text-textMuted text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-textMuted">{project.status}</span>
                        <div className="flex -space-x-1">
                          {project.tech.slice(0, 3).map((tech, techIndex) => (
                            <div key={techIndex} className="w-6 h-6 bg-gradient-to-br from-highlight to-accent rounded-full border-2 border-background flex items-center justify-center">
                              <span className="text-xs text-white font-bold">{tech[0]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-6">
                    <h4 className="text-lg font-bold text-textPrimary mb-3">
                      Tecnologías
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {projects[selectedProject]?.tech.map((tech, index) => (
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

                {/* Panel derecho - Vista previa del proyecto */}
                <div className="space-y-6 lg:col-span-3">
                  <div className="bg-gradient-to-br from-custom-2/20 to-highlight/20 rounded-2xl p-6 border border-custom-2/30 h-full">
                    <div className="bg-background/50 rounded-xl p-6 h-80 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-highlight to-accent rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                          <ExternalLink className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-textMuted mb-3">Vista previa del proyecto</p>
                        <p className="text-textPrimary font-medium text-lg">{projects[selectedProject]?.title}</p>
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
              
              {/* Botón flotante en la parte inferior derecha */}
              <div className="absolute bottom-8 right-8">
                <button 
                  onClick={() => setIsContactPopupOpen(true)}
                  className="bg-gradient-to-r from-highlight to-accent hover:from-accent hover:to-highlight text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Solicitar consulta
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