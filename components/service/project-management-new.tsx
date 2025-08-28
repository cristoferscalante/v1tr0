"use client"

import type React from "react"
import { useState, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Settings, Target, Lightbulb, TrendingUp, Users, Zap, ChevronLeft, ChevronRight, ExternalLink, CheckCircle, BarChart3 } from "lucide-react"
import { useEffect } from "react"
import CharacterBackground from "@/components/about/CharacterBackground"
import FooterSection from "@/components/global/FooterSection"

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ProjectManagement() {
  const [selectedProject, setSelectedProject] = useState(0)

  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])

  // Projects data adapted from the original content
  const projects = [
    {
      id: 1,
      title: "Gestión y Administración",
      description: "PMO, metodologías ágiles y planificación estratégica para optimizar la ejecución de proyectos empresariales.",
      tech: ["Jira", "Confluence", "MS Project", "Slack"],
      category: "PMO",
      status: "Activo",
      image: "/images/gestion-administracion.png"
    },
    {
      id: 2,
      title: "Implementación y Construcción",
      description: "DevOps/CI/CD, aseguramiento de calidad y automatización de procesos para entregas eficientes y confiables.",
      tech: ["GitHub", "Docker", "Jenkins", "AWS"],
      category: "DevOps",
      status: "Activo",
      image: "/images/implementacion-construccion.png"
    },
    {
      id: 3,
      title: "Investigación e Innovación",
      description: "Design Thinking, Proof of Concept y vigilancia tecnológica para impulsar la innovación en tus proyectos.",
      tech: ["Figma", "Miro", "Notion", "Tableau"],
      category: "Innovation",
      status: "Activo",
      image: "/images/investigacion-innovacion.png"
    },
    {
      id: 4,
      title: "Consultoría Estratégica",
      description: "Transformación digital, optimización de procesos y gestión del cambio para evolucionar tu organización.",
      tech: ["Power BI", "Monday.com", "Trello", "Teams"],
      category: "Strategy",
      status: "Activo",
      image: "/images/consultoria-estrategica.png"
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



  useEffect(() => {
    const isMobile = window.innerWidth < 768
    
    if (!isMobile) {
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
      sectionsRef.current.forEach((section, index) => {
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
  }, [])

  return (
    <section className="relative">
      <CharacterBackground />
      
      <div className="snap-container h-screen overflow-y-auto">
        {/* Section 1: Hero - Gestión de Proyectos */}
        <div 
          ref={addToRefs}
          className="min-h-screen flex items-center justify-center snap-start bg-background pt-24 mt-8"
        >
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-highlight/20 text-highlight rounded-full text-sm font-medium border border-highlight/30">
                  Automatización de tareas
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-textPrimary leading-tight">
                  Automatizamos tu flujo de trabajo
                </h1>
                <div className="space-y-3">
                  <p className="text-lg text-textSecondary font-medium max-w-3xl mx-auto">
                    Transformamos procesos manuales en sistemas automatizados inteligentes.
                    Optimizamos tu productividad con soluciones tecnológicas personalizadas.
                  </p>
                  <p className="text-xl text-textMuted max-w-2xl mx-auto leading-relaxed">
                    Diseñamos e implementamos soluciones de automatización que optimizan procesos repetitivos, reducen errores humanos y liberan tiempo valioso para tareas estratégicas.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center items-center">
                <div className="flex items-center text-textMuted">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>+100 proyectos gestionados</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Interactive Projects Panel */}
        <div 
          ref={addToRefs}
          className="min-h-screen flex items-center justify-center snap-start bg-background pt-24 mt-8"
        >
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
                  Nuestros Servicios
                </h2>
                <div className="space-y-3">
                  <p className="text-lg text-textSecondary font-medium max-w-3xl mx-auto">
                    Metodologías ágiles y herramientas especializadas para gestión eficiente.
                    Llevamos tus proyectos desde la planificación hasta la entrega exitosa.
                  </p>
                  <p className="text-xl text-textMuted max-w-2xl mx-auto">
                    Metodologías probadas y herramientas especializadas para llevar tus proyectos al siguiente nivel
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-5 gap-8">
                {/* Panel izquierdo - Lista de servicios */}
                <div className="space-y-4 lg:col-span-2">
                  {projects.map((project, index) => (
                    <div
                      key={project.id}
                      onClick={() => selectProject(index)}
                      className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedProject === index
                          ? 'bg-gradient-to-r from-highlight/20 to-accent/20 border-highlight/50 shadow-lg'
                          : 'bg-custom-2/20 border-custom-2/30 hover:bg-custom-2/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-textPrimary">{project.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedProject === index ? 'bg-highlight/30 text-highlight' : 'bg-custom-3/30 text-custom-3'
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
                      Herramientas
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
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Ver Metodología
                  </button>
                </div>

                {/* Panel derecho - Vista previa del servicio */}
                <div className="space-y-6 lg:col-span-3">
                  <div className="bg-gradient-to-br from-custom-2/20 to-highlight/20 rounded-2xl p-6 border border-custom-2/30 h-full">
                    <div className="bg-background/50 rounded-xl p-6 h-80 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-highlight to-accent rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                          {selectedProject === 0 && <Settings className="w-10 h-10 text-white" />}
                          {selectedProject === 1 && <Zap className="w-10 h-10 text-white" />}
                          {selectedProject === 2 && <Lightbulb className="w-10 h-10 text-white" />}
                          {selectedProject === 3 && <TrendingUp className="w-10 h-10 text-white" />}
                        </div>
                        <p className="text-textMuted mb-3">Metodología especializada</p>
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

                {/* Números de servicios */}
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
      



    </section>
  )
}