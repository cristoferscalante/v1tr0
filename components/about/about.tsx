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
import ModernFooter from "../global/ModernFooter"

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
        className={`relative flex items-end justify-center overflow-hidden ${
          isMobile ? 'min-h-screen py-12 px-4' : 'h-screen w-screen pb-20'
        }`}
        style={!isMobile ? { height: "100svh" } : {}}
      >
        {!isMobile ? (
          <div className="absolute inset-0 w-full h-full mt-16">
            <V1tr0Logo3D />
          </div>
        ) : (
          <div className="w-full flex items-center justify-center bg-gradient-to-br from-custom-1/20 to-custom-2/20 rounded-2xl mt-16">
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
          isMobile ? 'py-12 px-4' : 'h-screen w-screen px-4 sm:px-6 lg:px-8'
        }`}
        style={!isMobile ? { height: "100svh" } : {}}
      >
        <div className="max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className={`text-center ${isMobile ? 'mb-6' : 'mb-8'}`}>
            <div className="inline-block px-2 py-1 rounded-full bg-custom-1 text-highlight text-xs font-medium mb-3">
              Nuestro Equipo
            </div>
            <h2 className={`font-bold tracking-tighter text-textPrimary mb-4 ${
              isMobile ? 'text-xl sm:text-2xl' : 'text-2xl md:text-3xl lg:text-4xl'
            }`}>
              Profesionales comprometidos con la excelencia
            </h2>
            <p className={`text-textMuted max-w-2xl mx-auto ${
              isMobile ? 'text-sm' : 'text-base md:text-lg'
            }`}>
              Conoce a los expertos que hacen posible la innovación en cada proyecto
            </p>
          </div>

          {/* Team Cards */}
          <div className={`gap-6 md:gap-8 ${
            isMobile ? 'flex flex-col space-y-8' : 'grid lg:grid-cols-3'
          }`}>
            <div className="text-center space-y-3">
              <div className={`w-full mx-auto ${
                isMobile ? 'h-[240px] max-w-[200px]' : 'h-[320px] max-w-[240px]'
              }`}>
                <CardViewerPremium frontImage="/about/card-efren.jpg" backImage="/about/card-back.jpg" />
              </div>
              <div>
                <h4 className={`font-bold text-textPrimary ${
                  isMobile ? 'text-base' : 'text-lg'
                }`}>Efrén Martínez</h4>
                <p className="text-highlight font-medium text-sm">CEO & Fundador</p>
                <p className={`text-textMuted mt-1 ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>
                  Especialista en gestión de proyectos y desarrollo de software con más de 8 años de experiencia.
                </p>
              </div>
            </div>

            <div className="text-center space-y-3">
              <div className={`w-full mx-auto ${
                isMobile ? 'h-[240px] max-w-[200px]' : 'h-[320px] max-w-[240px]'
              }`}>
                <CardViewerPremium frontImage="/about/card-cristofer.jpg" backImage="/about/card-back.jpg" />
              </div>
              <div>
                <h4 className={`font-bold text-textPrimary ${
                  isMobile ? 'text-base' : 'text-lg'
                }`}>Cristofer Javier</h4>
                <p className="text-highlight font-medium text-sm">CTO & Co-fundador</p>
                <p className={`text-textMuted mt-1 ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>
                  Experto en arquitectura de software y tecnologías emergentes, líder en innovación tecnológica.
                </p>
              </div>
            </div>

            <div className="text-center space-y-3">
              <div className={`w-full mx-auto ${
                isMobile ? 'h-[240px] max-w-[200px]' : 'h-[320px] max-w-[240px]'
              }`}>
                <CardViewerPremium frontImage="/about/card-maria.jpg" backImage="/about/card-back.jpg" />
              </div>
              <div>
                <h4 className={`font-bold text-textPrimary ${
                  isMobile ? 'text-base' : 'text-lg'
                }`}>María González</h4>
                <p className="text-highlight font-medium text-sm">Data Scientist</p>
                <p className={`text-textMuted mt-1 ${
                  isMobile ? 'text-xs' : 'text-sm'
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
        <div className="max-w-5xl mx-auto w-full">
          <div className={`text-center ${
            isMobile ? 'mb-6' : 'mb-8'
          }`}>
            <div className="inline-block px-2 py-1 rounded-full bg-custom-1 text-highlight text-xs font-medium mb-3">
              Servicios
            </div>
            <h3 className={`font-bold tracking-tighter text-textPrimary mb-4 ${
              isMobile ? 'text-xl sm:text-2xl' : 'text-2xl md:text-3xl lg:text-4xl'
            }`}>
              Nuestros Servicios
            </h3>
            <p className={`text-textMuted max-w-2xl mx-auto ${
              isMobile ? 'text-sm' : 'text-base md:text-lg'
            }`}>
              Soluciones integrales para impulsar tu negocio hacia el futuro digital
            </p>
          </div>

          <div className={`gap-6 md:gap-8 ${
            isMobile ? 'flex flex-col space-y-4' : 'grid lg:grid-cols-2'
          }`}>
            {/* Development */}
            <div className={`bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl text-[#26FFDF] shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10 ${
              isMobile ? 'p-4' : 'p-6'
            }`}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`bg-highlight/20 rounded-xl flex items-center justify-center ${
                    isMobile ? 'w-8 h-8' : 'w-10 h-10'
                  }`}>
                    <svg className={`text-highlight ${
                      isMobile ? 'w-4 h-4' : 'w-5 h-5'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-textPrimary mb-2 ${
                    isMobile ? 'text-base' : 'text-lg'
                  }`}>Desarrollo de Software</h4>
                  <p className={`text-textMuted leading-relaxed ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>
                    Creamos aplicaciones web y móviles robustas utilizando las últimas tecnologías como React, Next.js,
                    Node.js y bases de datos modernas.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Science */}
            <div className={`bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl text-[#26FFDF] shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10 ${
              isMobile ? 'p-4' : 'p-6'
            }`}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`bg-highlight/20 rounded-xl flex items-center justify-center ${
                    isMobile ? 'w-8 h-8' : 'w-10 h-10'
                  }`}>
                    <svg className={`text-highlight ${
                      isMobile ? 'w-4 h-4' : 'w-5 h-5'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-textPrimary mb-2 ${
                    isMobile ? 'text-base' : 'text-lg'
                  }`}>Ciencia de Datos</h4>
                  <p className={`text-textMuted leading-relaxed ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>
                    Transformamos datos en insights accionables mediante análisis avanzado, machine learning y
                    inteligencia artificial.
                  </p>
                </div>
              </div>
            </div>

            {/* Project Management */}
            <div className={`bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl text-[#26FFDF] shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10 ${
              isMobile ? 'p-4' : 'p-6'
            }`}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`bg-highlight/20 rounded-xl flex items-center justify-center ${
                    isMobile ? 'w-8 h-8' : 'w-10 h-10'
                  }`}>
                    <svg className={`text-highlight ${
                      isMobile ? 'w-4 h-4' : 'w-5 h-5'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-textPrimary mb-2 ${
                    isMobile ? 'text-base' : 'text-lg'
                  }`}>Gestión de Proyectos</h4>
                  <p className={`text-textMuted leading-relaxed ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>
                    Implementamos metodologías ágiles como Scrum y Kanban para optimizar la entrega de proyectos.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Visualization */}
            <div className={`bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-2xl text-[#26FFDF] shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10 ${
              isMobile ? 'p-4' : 'p-6'
            }`}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`bg-highlight/20 rounded-xl flex items-center justify-center ${
                    isMobile ? 'w-8 h-8' : 'w-10 h-10'
                  }`}>
                    <svg className={`text-highlight ${
                      isMobile ? 'w-4 h-4' : 'w-5 h-5'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-textPrimary mb-2 ${
                    isMobile ? 'text-base' : 'text-lg'
                  }`}>Visualización de Datos</h4>
                  <p className={`text-textMuted leading-relaxed ${
                    isMobile ? 'text-xs' : 'text-sm'
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
        <div className="max-w-5xl mx-auto w-full">
          <div className={`gap-6 md:gap-10 items-center ${
            isMobile ? 'flex flex-col space-y-6' : 'grid lg:grid-cols-2'
          }`}>
            <div className={`relative rounded-2xl overflow-hidden ${
              isMobile ? 'h-[200px]' : 'h-[250px] md:h-[300px]'
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
              isMobile ? 'p-4' : 'p-6'
            }`}>
              <div className={`text-center ${
                isMobile ? 'mb-4' : 'mb-6'
              }`}>
                <div className="inline-block px-2 py-1 rounded-full bg-custom-1 text-highlight text-xs font-medium mb-3">
                  Visión
                </div>
                <h3 className={`font-bold tracking-tighter text-textPrimary mb-4 ${
                  isMobile ? 'text-xl' : 'text-2xl md:text-3xl'
                }`}>
                  Nuestra Visión
                </h3>
              </div>
              <p className={`text-textMuted leading-relaxed ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>
                En <span className="font-bold text-highlight">V1TR0</span>, creemos en el poder de la tecnología para transformar la manera en que se gestionan los proyectos. Nos enfocamos en brindar soluciones eficientes e inteligentes que potencien la productividad y la toma de decisiones estratégicas.
              </p>
              <p className={`text-textMuted leading-relaxed mt-4 ${
                isMobile ? 'text-sm' : 'text-base'
              }`}>
                Nuestro compromiso es innovar continuamente, integrando las últimas tendencias en desarrollo de software, ciencia de datos y metodologías ágiles para impulsar el éxito de nuestros clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Footer */}
      <div ref={addToRefs} className="h-screen w-screen flex items-center justify-center">
        <ModernFooter />
      </div>
    </div>
  )
}

export default About
