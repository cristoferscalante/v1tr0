"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
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
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize GSAP ScrollTrigger and snap functionality (only for desktop)
  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined" || isMobile) return

    const sections = sectionsRef.current
    const totalSections = sections.length

    // Set up scroll snap with GSAP (desktop only)
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
  }, [isMobile])

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
        className={`relative flex items-center justify-center overflow-hidden ${
          isMobile ? 'min-h-screen py-12 px-4' : 'h-screen w-screen'
        }`}
        style={!isMobile ? { height: "100svh" } : {}}
      >
        {!isMobile ? (
          <div className="absolute inset-0 w-full h-full">
            <V1tr0Logo3D />
          </div>
        ) : (
          <div className="w-full flex items-center justify-center bg-gradient-to-br from-custom-1/20 to-custom-2/20 rounded-2xl">
            <div className="text-center py-16 px-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-highlight mb-6">V1TR0</h1>
              <div className="space-y-4 text-textMuted text-sm sm:text-base leading-relaxed max-w-2xl">
                <p>
                  V1TR0 nace en el año 2025 con el propósito de ayudar a las empresas a optimizar el uso de sus recursos a través de la implementación y desarrollo de software hecho a medida.
                </p>
                <p>
                  Apostamos por integrar y optimizar todas las herramientas de gestión y trabajo diario de cualquier entorno empresarial, institucional o corporativo mediante el uso del software.
                </p>
                <p>
                  Analizamos que tipo de necesidades pueden ser resueltas mediante diferentes módulos soportados por nuestros software y ofrecemos una solución adaptada y escalable que nos permita hacerla crecer al ritmo del crecimiento del negocio.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Section 2: Team Cards */}
      <section 
        ref={addToRefs}
        role="region"
        aria-label="Nuestro equipo"
        className={`relative flex items-center justify-center overflow-hidden ${
          isMobile ? 'py-16 px-4' : 'h-screen w-screen px-4 sm:px-6 lg:px-8'
        }`}
        style={!isMobile ? { height: "100svh" } : {}}
      >
        <div className="max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className={`text-center ${isMobile ? 'mb-8' : 'mb-12'}`}>
            <div className="inline-block px-3 py-1 rounded-full bg-custom-1 text-highlight text-sm font-medium mb-4">
              Nuestro Equipo
            </div>
            <h2 className={`font-bold tracking-tighter text-textPrimary mb-6 ${
              isMobile ? 'text-2xl sm:text-3xl' : 'text-3xl md:text-4xl lg:text-5xl'
            }`}>
              Profesionales comprometidos con la excelencia
            </h2>
            <p className={`text-textMuted max-w-3xl mx-auto ${
              isMobile ? 'text-base' : 'text-lg md:text-xl'
            }`}>
              Conoce a los expertos que hacen posible la innovación en cada proyecto
            </p>
          </div>

          {/* Team Cards */}
          <div className={`gap-8 md:gap-12 ${
            isMobile ? 'flex flex-col space-y-12' : 'grid lg:grid-cols-3'
          }`}>
            <div className="text-center space-y-4">
              <div className={`w-full mx-auto ${
                isMobile ? 'h-[300px] max-w-[250px]' : 'h-[420px] max-w-[300px]'
              }`}>
                <CardViewerPremium frontImage="/about/card-efren.jpg" backImage="/about/card-back.jpg" />
              </div>
              <div>
                <h4 className={`font-bold text-textPrimary ${
                  isMobile ? 'text-lg' : 'text-xl'
                }`}>Efrén Martínez</h4>
                <p className="text-highlight font-medium">CEO & Fundador</p>
                <p className={`text-textMuted mt-2 ${
                  isMobile ? 'text-sm' : 'text-sm'
                }`}>
                  Especialista en gestión de proyectos y desarrollo de software con más de 8 años de experiencia.
                </p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className={`w-full mx-auto ${
                isMobile ? 'h-[300px] max-w-[250px]' : 'h-[420px] max-w-[300px]'
              }`}>
                <CardViewerPremium frontImage="/about/card-cristofer.jpg" backImage="/about/card-back.jpg" />
              </div>
              <div>
                <h4 className={`font-bold text-textPrimary ${
                  isMobile ? 'text-lg' : 'text-xl'
                }`}>Cristofer Javier</h4>
                <p className="text-highlight font-medium">CTO & Co-fundador</p>
                <p className={`text-textMuted mt-2 ${
                  isMobile ? 'text-sm' : 'text-sm'
                }`}>
                  Experto en arquitectura de software y tecnologías emergentes, líder en innovación tecnológica.
                </p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className={`w-full mx-auto ${
                isMobile ? 'h-[300px] max-w-[250px]' : 'h-[420px] max-w-[300px]'
              }`}>
                <CardViewerPremium frontImage="/about/card-maria.jpg" backImage="/about/card-back.jpg" />
              </div>
              <div>
                <h4 className={`font-bold text-textPrimary ${
                  isMobile ? 'text-lg' : 'text-xl'
                }`}>María González</h4>
                <p className="text-highlight font-medium">Data Scientist</p>
                <p className={`text-textMuted mt-2 ${
                  isMobile ? 'text-sm' : 'text-sm'
                }`}>
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
        className={`relative flex items-center justify-center overflow-hidden ${
          isMobile ? 'py-16 px-4' : 'h-screen w-screen px-4 sm:px-6 lg:px-8'
        }`}
        style={!isMobile ? { height: "100svh" } : {}}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className={`text-center ${isMobile ? 'mb-8' : 'mb-12'}`}>
            <div className="inline-block px-3 py-1 rounded-full bg-custom-1 text-highlight text-sm font-medium mb-4">
              Servicios
            </div>
            <h3 className={`font-bold tracking-tighter text-textPrimary mb-6 ${
              isMobile ? 'text-2xl sm:text-3xl' : 'text-3xl md:text-4xl lg:text-5xl'
            }`}>
              Nuestros Servicios
            </h3>
            <p className={`text-textMuted max-w-3xl mx-auto ${
              isMobile ? 'text-base' : 'text-lg md:text-xl'
            }`}>
              Soluciones integrales para impulsar tu negocio hacia el futuro digital
            </p>
          </div>

          <div className={`gap-8 md:gap-12 ${
            isMobile ? 'flex flex-col space-y-6' : 'grid lg:grid-cols-2'
          }`}>
            {/* Development */}
            <div className={`bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl text-[#26FFDF] shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10 ${
              isMobile ? 'p-6' : 'p-8'
            }`}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`bg-highlight/20 rounded-xl flex items-center justify-center ${
                    isMobile ? 'w-10 h-10' : 'w-12 h-12'
                  }`}>
                    <svg className={`text-highlight ${
                      isMobile ? 'w-5 h-5' : 'w-6 h-6'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-textPrimary mb-3 ${
                    isMobile ? 'text-lg' : 'text-xl'
                  }`}>Desarrollo de Software</h4>
                  <p className={`text-textMuted leading-relaxed ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}>
                    Creamos aplicaciones web y móviles robustas utilizando las últimas tecnologías como React, Next.js,
                    Node.js y bases de datos modernas.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Science */}
            <div className={`bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl text-[#26FFDF] shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10 ${
              isMobile ? 'p-6' : 'p-8'
            }`}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`bg-highlight/20 rounded-xl flex items-center justify-center ${
                    isMobile ? 'w-10 h-10' : 'w-12 h-12'
                  }`}>
                    <svg className={`text-highlight ${
                      isMobile ? 'w-5 h-5' : 'w-6 h-6'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-textPrimary mb-3 ${
                    isMobile ? 'text-lg' : 'text-xl'
                  }`}>Ciencia de Datos</h4>
                  <p className={`text-textMuted leading-relaxed ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}>
                    Transformamos datos en insights accionables mediante análisis avanzado, machine learning y
                    inteligencia artificial.
                  </p>
                </div>
              </div>
            </div>

            {/* Project Management */}
            <div className={`bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl text-[#26FFDF] shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10 ${
              isMobile ? 'p-6' : 'p-8'
            }`}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`bg-highlight/20 rounded-xl flex items-center justify-center ${
                    isMobile ? 'w-10 h-10' : 'w-12 h-12'
                  }`}>
                    <svg className={`text-highlight ${
                      isMobile ? 'w-5 h-5' : 'w-6 h-6'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-textPrimary mb-3 ${
                    isMobile ? 'text-lg' : 'text-xl'
                  }`}>Gestión de Proyectos</h4>
                  <p className={`text-textMuted leading-relaxed ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}>
                    Implementamos metodologías ágiles como Scrum y Kanban para optimizar la entrega de proyectos.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Visualization */}
            <div className={`bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl text-[#26FFDF] shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10 ${
              isMobile ? 'p-6' : 'p-8'
            }`}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`bg-highlight/20 rounded-xl flex items-center justify-center ${
                    isMobile ? 'w-10 h-10' : 'w-12 h-12'
                  }`}>
                    <svg className={`text-highlight ${
                      isMobile ? 'w-5 h-5' : 'w-6 h-6'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-textPrimary mb-3 ${
                    isMobile ? 'text-lg' : 'text-xl'
                  }`}>Visualización de Datos</h4>
                  <p className={`text-textMuted leading-relaxed ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}>
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
        className={`relative flex items-center justify-center overflow-hidden ${
          isMobile ? 'py-16 px-4' : 'h-screen w-screen px-4 sm:px-6 lg:px-8'
        }`}
        style={!isMobile ? { height: "100svh" } : {}}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className={`gap-10 md:gap-16 items-center ${
            isMobile ? 'flex flex-col space-y-8' : 'grid lg:grid-cols-2'
          }`}>
            <div className={`relative rounded-2xl overflow-hidden ${
              isMobile ? 'h-[250px]' : 'h-[300px] md:h-[400px]'
            }`}>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/15-SzfeYK3mFDL4IOh7XyaucnbCXX7OPV.png"
                alt="Equipo V1TR0 observando una red neuronal digital"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-custom-1/80 to-transparent"></div>
            </div>

            <div className={`bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl text-[#26FFDF] shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10 ${
              isMobile ? 'p-6' : 'p-8'
            }`}>
              <div className={`text-center ${
                isMobile ? 'mb-6' : 'mb-8'
              }`}>
                <div className="inline-block px-3 py-1 rounded-full bg-custom-1 text-highlight text-sm font-medium mb-4">
                  Visión
                </div>
                <h3 className={`font-bold tracking-tighter text-textPrimary mb-6 ${
                  isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'
                }`}>
                  Nuestra Visión
                </h3>
              </div>
              <p className={`text-textMuted leading-relaxed ${
                isMobile ? 'text-base' : 'text-lg'
              }`}>
                En <span className="font-bold text-highlight">V1TR0</span>, creemos en el poder de la tecnología para transformar la manera en que se gestionan los proyectos. Nos enfocamos en brindar soluciones eficientes e inteligentes que potencien la productividad y la toma de decisiones estratégicas.
              </p>
              <p className={`text-textMuted leading-relaxed mt-6 ${
                isMobile ? 'text-base' : 'text-lg'
              }`}>
                Nuestro compromiso es innovar continuamente, integrando las últimas tendencias en desarrollo de software, ciencia de datos y metodologías ágiles para impulsar el éxito de nuestros clientes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
