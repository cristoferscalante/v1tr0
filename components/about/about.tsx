"use client"


import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { useScrollSnapEnabled, useDeviceDetection } from "@/hooks/use-device-detection"
import TeamMemberProfile, { type TeamMemberProfileProps } from "./TeamMemberProfile"
import BackgroundAnimation from "../home/animations/BackgroundAnimation"
import FooterSection from "@/components/global/FooterSection"
import { useTheme } from "@/components/theme-provider"
import AnimatedV1tr0Logo from "./AnimatedV1tr0Logo"
import AboutHero from "./AboutHero"

type TeamMemberData = Omit<TeamMemberProfileProps, "isMobile" | "animationDelay">

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
}

// Team Members Data
const teamMembersData = [
  {
    name: "Alvaro Efren B.S.",
    role: "CEO & Fundador",
    image: "/imagenes/about/cards/card-efren.webp",
    biography: "Soy politólogo y desarrollador de software apasionado por transformar datos en soluciones con impacto social. He trabajado con varias agencias de Cooperación Internacional creando sistemas de información y dashboards que fortalecen la coordinación humanitaria en contextos de emergencia. Domino Python, bases de datos relacionales y NoSQL, además de front-end con Next.js y TailwindCSS. Mi enfoque une tecnología y análisis social para diseñar herramientas que generan decisiones estratégicas y valor sostenible que aporten al desarrollo de las comunidades y las empresas.",
    specialties: [
      "Python",
      "Next.js",
      "TailwindCSS",
      "PostgreSQL",
      "MongoDB",
      "Data Visualization",
      "Dashboards",
      "Ciencia de Datos",
      "Análisis Social"
    ],
    github: "https://github.com/alvaroefren",
    linkedin: "https://www.linkedin.com/in/alvaro-efren"
  },
  {
    name: "Cristofer Bolaños Scalante",
    role: "CTO & Fundador",
    image: "/imagenes/about/cards/card-cristofer.webp",
    biography: "Experto en arquitectura de software y tecnologías emergentes, líder en innovación tecnológica. Responsable de la dirección técnica y la implementación de las mejores prácticas de desarrollo. Su expertise incluye desarrollos a medida, microservicios, automatizaciones, infraestructura, seguridad, integraciones APIREST y tecnologías de vanguardia.",
    specialties: [
      "Arquitectura de Software",
      "Microservicios",
      "DevOps",
      "Cloud Infrastructure",
      "API REST",
      "Seguridad",
      "Automatización",
      "Node.js",
      "Docker"
    ],
    github: "https://github.com/cristoferbolanos",
    linkedin: "https://www.linkedin.com/in/cristofer-bolanos"
  }
] as const satisfies readonly [TeamMemberData, TeamMemberData]

const [alvaroMember, cristoferMember] = teamMembersData

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<HTMLElement[]>([])
  const currentSectionRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const shouldEnableScrollSnap = useScrollSnapEnabled()
  const { isMobile } = useDeviceDetection()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Service card styles
  const serviceCardBase = "backdrop-blur-sm border rounded-2xl shadow-lg transition-all duration-300 hover:border-[#08A696] hover:shadow-xl hover:shadow-[#08A696]/10"
  
  const serviceCardBorder = isDark
    ? "border-[#08A696]/30"
    : "border-[#08A696]/60"

  const serviceCardTheme = isDark
    ? "bg-[#02505931] text-[#26FFDF] hover:bg-[#02505950]"
    : "bg-white/90 text-[#08A696] hover:bg-[#08A696]/10"

  // Initialize GSAP ScrollTrigger and snap functionality (only for desktop)
  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined" || !shouldEnableScrollSnap) { return }
    const totalSections = sectionsRef.current.length

    // Set up scroll snap with GSAP (desktop only)
    const setupScrollSnap = () => {
      // Disable normal scrolling
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"

      // Create ScrollTrigger for each section
      sectionsRef.current.forEach((section, index) => {
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
        if (isAnimatingRef.current || index < 0 || index >= totalSections) { return }
        
        isAnimatingRef.current = true
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
        if (isAnimatingRef.current) { return }

        const direction = e.deltaY > 0 ? 1 : -1
        const nextSection = currentSectionRef.current + direction
        goToSection(nextSection)
      }
      
      // Touch event handlers
      let touchStartY = 0
      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          touchStartY = e.touches[0]?.clientY || 0
        }
      }

      const handleTouchEnd = (e: TouchEvent) => {
        if (isAnimatingRef.current || e.changedTouches.length === 0) { return }
        
        const touchEndY = e.changedTouches[0]?.clientY || 0
        const deltaY = touchStartY - touchEndY
        
        if (Math.abs(deltaY) > 50) {
          const direction = deltaY > 0 ? 1 : -1
          const nextSection = currentSectionRef.current + direction
          goToSection(nextSection)
        }
      }

      // Keyboard navigation
      const handleKeyDown = (e: KeyboardEvent) => {
        if (isAnimatingRef.current) { return }
        
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
    
    return cleanup;
  }, [isMobile, shouldEnableScrollSnap]);

  // Add section to refs
  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <BackgroundAnimation />
      
      {/* Section 1: Hero 3D + Storytelling */}
      <section
        ref={addToRefs}
        role="region"
        aria-label="Presentación de V1TR0"
        className={`relative overflow-hidden ${
          isMobile ? 'min-h-screen' : 'h-screen w-screen'
        }`}
        style={!isMobile ? { height: "100svh" } : undefined}
      >
        <AboutHero />
      </section>

      {/* Section 2: Alvaro Card */}
      <section 
        ref={addToRefs}
        role="region"
        aria-label="CEO"
        className={`relative flex items-center justify-center overflow-x-hidden ${
          isMobile ? 'py-12 px-2 sm:px-4' : 'h-screen w-screen px-4 sm:px-6 lg:px-8'
        }`}
        style={!isMobile ? { height: "100svh" } : undefined}
      >
        <div className="max-w-7xl mx-auto w-full">
          <TeamMemberProfile
            {...alvaroMember}
            isMobile={isMobile}
            animationDelay="0s"
          />
        </div>
      </section>

      {/* Section 3: Cristofer Card */}
      <section 
        ref={addToRefs}
        role="region"
        aria-label="CTO"
        className={`relative flex items-center justify-center overflow-x-hidden ${
          isMobile ? 'py-16 px-2 sm:px-4' : 'h-screen w-screen px-4 sm:px-6 lg:px-8'
        }`}
        style={!isMobile ? { height: "100svh" } : undefined}
      >
        <div className="max-w-7xl mx-auto w-full">
          <TeamMemberProfile
            {...cristoferMember}
            isMobile={isMobile}
            animationDelay="0.5s"
          />
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
        style={!isMobile ? { height: "100svh" } : undefined}
      >
        <div className="max-w-5xl mx-auto w-full">
          <div className={`gap-6 md:gap-10 items-center ${
            isMobile ? 'flex flex-col space-y-6' : 'grid lg:grid-cols-2'
          }`}>
            <div className={`relative flex items-center justify-center ${
              isMobile ? 'h-[200px]' : 'h-[250px] md:h-[300px]'
            }`}>
              <AnimatedV1tr0Logo />
            </div>

            <div className={`${serviceCardBase} ${serviceCardBorder} ${serviceCardTheme} ${
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
      <section 
        ref={addToRefs}
        role="region"
        aria-label="Footer"
        className={`relative flex items-center justify-center overflow-hidden ${
          isMobile ? 'py-0' : 'h-screen w-screen'
        }`}
        style={!isMobile ? { height: "100svh" } : undefined}
      >
        <div className="w-full">
          <FooterSection />
        </div>
      </section>

    </div>
  )
}

export default About
