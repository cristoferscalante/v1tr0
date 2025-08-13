"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import CardViewerPremium from "./card-viewer-premium"
import BackgroundAnimation from "../home/BackgroungAnimation"

// Dynamic import for 3D component (no SSR)
const V1tr0Logo3D = dynamic(() => import("../3d/V1tr0Logo3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-pulse text-highlight text-xl">Cargando experiencia 3D...</div>
    </div>
  )
})

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
}

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<HTMLElement[]>([])
  const currentSectionRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768

  // Initialize GSAP ScrollTrigger and snap functionality
  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return

    const sections = sectionsRef.current
    const totalSections = sections.length

    // Set up scroll snap with GSAP
    const setupScrollSnap = () => {
      // Disable normal scrolling
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"

      // Create ScrollTrigger for each section
      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            currentSectionRef.current = index
          },
          onEnterBack: () => {
            currentSectionRef.current = index
          }
        })
      })

      // Snap navigation function
      const goToSection = (index: number) => {
        if (isAnimatingRef.current || index < 0 || index >= totalSections) return
        
        isAnimatingRef.current = true
        currentSectionRef.current = index
        
        gsap.to(window, {
          duration: 0.8,
          scrollTo: {
            y: index * window.innerHeight,
            autoKill: false
          },
          ease: "power2.out",
          onComplete: () => {
            isAnimatingRef.current = false
          }
        })
      }

      // Wheel event handler
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault()
        if (isAnimatingRef.current) return

        const direction = e.deltaY > 0 ? 1 : -1
        const nextSection = currentSectionRef.current + direction
        goToSection(nextSection)
      }

      // Touch event handlers
      let touchStartY = 0
      const handleTouchStart = (e: TouchEvent) => {
        touchStartY = e.touches[0].clientY
      }

      const handleTouchEnd = (e: TouchEvent) => {
        if (isAnimatingRef.current) return
        
        const touchEndY = e.changedTouches[0].clientY
        const deltaY = touchStartY - touchEndY
        
        if (Math.abs(deltaY) > 50) {
          const direction = deltaY > 0 ? 1 : -1
          const nextSection = currentSectionRef.current + direction
          goToSection(nextSection)
        }
      }

      // Keyboard navigation
      const handleKeyDown = (e: KeyboardEvent) => {
        if (isAnimatingRef.current) return
        
        switch (e.key) {
          case "ArrowDown":
          case "PageDown":
            e.preventDefault()
            goToSection(currentSectionRef.current + 1)
            break
          case "ArrowUp":
          case "PageUp":
            e.preventDefault()
            goToSection(currentSectionRef.current - 1)
            break
        }
      }

      // Add event listeners
      window.addEventListener("wheel", handleWheel, { passive: false })
      window.addEventListener("touchstart", handleTouchStart, { passive: true })
      window.addEventListener("touchend", handleTouchEnd, { passive: true })
      window.addEventListener("keydown", handleKeyDown)

      // Cleanup function
      return () => {
        window.removeEventListener("wheel", handleWheel)
        window.removeEventListener("touchstart", handleTouchStart)
        window.removeEventListener("touchend", handleTouchEnd)
        window.removeEventListener("keydown", handleKeyDown)
        document.body.style.overflow = ""
        document.documentElement.style.overflow = ""
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      }
    }

    const cleanup = setupScrollSnap()
    
    return cleanup
  }, [])

  // Add section to refs
  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <BackgroundAnimation />
      
      {/* Section 1: Hero 3D */}
      <section 
        ref={addToRefs}
        role="region"
        aria-label="Presentación 3D de V1TR0"
        className="relative h-screen w-screen flex items-center justify-center overflow-hidden"
        style={{ height: "100svh" }}
      >
        {!isMobile ? (
          <div className="absolute inset-0 w-full h-full">
            <V1tr0Logo3D />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-custom-1/20 to-custom-2/20">
            <div className="text-center p-8">
              <div className="w-32 h-32 bg-gradient-to-br from-highlight to-custom-2 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-background">V1</span>
              </div>
              <h1 className="text-4xl font-bold text-highlight mb-4">V1TR0</h1>
              <p className="text-textMuted">Innovación Tecnológica</p>
            </div>
          </div>
        )}
      </section>

      {/* Section 2: Team Cards */}
      <section 
        ref={addToRefs}
        role="region"
        aria-label="Nuestro equipo"
        className="relative h-screen w-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
        style={{ height: "100svh" }}
      >
        <div className="max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-custom-1 text-highlight text-sm font-medium mb-4">
              Nuestro Equipo
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-textPrimary mb-6">
              Profesionales comprometidos con la excelencia
            </h2>
            <p className="text-textMuted text-lg md:text-xl max-w-3xl mx-auto">
              Conoce a los expertos que hacen posible la innovación en cada proyecto
            </p>
          </div>

          {/* Team Cards */}
          <div className="grid gap-8 md:gap-12 lg:grid-cols-3">
            <div className="text-center space-y-4">
              <div className="h-[420px] w-full max-w-[300px] mx-auto">
                <CardViewerPremium frontImage="/about/card-efren.jpg" backImage="/about/card-back.jpg" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-textPrimary">Efrén Martínez</h4>
                <p className="text-highlight font-medium">CEO & Fundador</p>
                <p className="text-textMuted text-sm mt-2">
                  Especialista en gestión de proyectos y desarrollo de software con más de 8 años de experiencia.
                </p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="h-[420px] w-full max-w-[300px] mx-auto">
                <CardViewerPremium frontImage="/about/card-cristofer.jpg" backImage="/about/card-back.jpg" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-textPrimary">Cristofer Javier</h4>
                <p className="text-highlight font-medium">CTO & Co-fundador</p>
                <p className="text-textMuted text-sm mt-2">
                  Experto en arquitectura de software y tecnologías emergentes, líder en innovación tecnológica.
                </p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="h-[420px] w-full max-w-[300px] mx-auto">
                <CardViewerPremium frontImage="/about/card-maria.jpg" backImage="/about/card-back.jpg" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-textPrimary">María González</h4>
                <p className="text-highlight font-medium">Data Scientist</p>
                <p className="text-textMuted text-sm mt-2">
                  Especialista en análisis de datos y machine learning, transformando datos en insights valiosos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Services */}
      <section 
        ref={addToRefs}
        role="region"
        aria-label="Nuestros servicios"
        className="relative h-screen w-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
        style={{ height: "100svh" }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-custom-1 text-highlight text-sm font-medium mb-4">
              Servicios
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-textPrimary mb-6">
              Nuestros Servicios
            </h3>
            <p className="text-textMuted text-lg md:text-xl max-w-3xl mx-auto">
              Soluciones integrales para impulsar tu negocio hacia el futuro digital
            </p>
          </div>

          <div className="grid gap-8 md:gap-12 lg:grid-cols-2">
            {/* Development */}
            <div className="bg-custom-1/30 backdrop-blur-sm rounded-2xl p-8 border border-custom-2/20 hover:border-highlight/30 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-highlight/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-textPrimary mb-3">Desarrollo de Software</h4>
                  <p className="text-textMuted leading-relaxed">
                    Creamos aplicaciones web y móviles robustas utilizando las últimas tecnologías como React, Next.js,
                    Node.js y bases de datos modernas.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Science */}
            <div className="bg-custom-1/30 backdrop-blur-sm rounded-2xl p-8 border border-custom-2/20 hover:border-highlight/30 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-highlight/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-textPrimary mb-3">Ciencia de Datos</h4>
                  <p className="text-textMuted leading-relaxed">
                    Transformamos datos en insights accionables mediante análisis avanzado, machine learning y
                    inteligencia artificial.
                  </p>
                </div>
              </div>
            </div>

            {/* Project Management */}
            <div className="bg-custom-1/30 backdrop-blur-sm rounded-2xl p-8 border border-custom-2/20 hover:border-highlight/30 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-highlight/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-textPrimary mb-3">Gestión de Proyectos</h4>
                  <p className="text-textMuted leading-relaxed">
                    Implementamos metodologías ágiles como Scrum y Kanban para optimizar la entrega de proyectos.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Visualization */}
            <div className="bg-custom-1/30 backdrop-blur-sm rounded-2xl p-8 border border-custom-2/20 hover:border-highlight/30 transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-highlight/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-textPrimary mb-3">Visualización de Datos</h4>
                  <p className="text-textMuted leading-relaxed">
                    Creamos dashboards interactivos y visualizaciones impactantes que facilitan la comprensión de
                    datos complejos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Vision */}
      <section 
        ref={addToRefs}
        role="region"
        aria-label="Nuestra visión"
        className="relative h-screen w-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
        style={{ height: "100svh" }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid gap-10 md:gap-16 lg:grid-cols-2 items-center">
            <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/15-SzfeYK3mFDL4IOh7XyaucnbCXX7OPV.png"
                alt="Equipo V1TR0 observando una red neuronal digital"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-custom-1/80 to-transparent"></div>
            </div>

            <div className="bg-custom-1/30 backdrop-blur-sm rounded-2xl p-8 border border-custom-2/20">
              <div className="text-center mb-8">
                <div className="inline-block px-3 py-1 rounded-full bg-custom-1 text-highlight text-sm font-medium mb-4">
                  Visión
                </div>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tighter text-textPrimary mb-6">
                  Nuestra Visión
                </h3>
              </div>
              <p className="text-textMuted text-lg leading-relaxed">
                En <span className="font-bold text-highlight">V1TR0</span>, creemos en el poder de la tecnología para
                transformar la manera en que se gestionan los proyectos. Nos enfocamos en brindar soluciones eficientes
                e inteligentes que potencien la productividad y la toma de decisiones estratégicas.
              </p>
              <p className="text-textMuted text-lg leading-relaxed mt-6">
                Nuestro compromiso es innovar continuamente, integrando las últimas tendencias en desarrollo de
                software, ciencia de datos y metodologías ágiles para impulsar el éxito de nuestros clientes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
