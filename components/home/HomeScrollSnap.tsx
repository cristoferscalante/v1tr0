"use client"

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useScrollContext } from './shared/ScrollContext'

// Registrar los plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
}

/**
 * HomeScrollSnap - Componente para scroll snap vertical limpio
 * 
 * Implementa la misma lógica del apartado /about con snap-to-snap
 * Navegación: Hero → Scroll Horizontal → Tecnologías
 * Sin scroll intermedio, solo snap entre secciones completas
 */

interface HomeScrollSnapProps {
  children: React.ReactNode[]
  className?: string
}

export default function HomeScrollSnap({ 
  children, 
  className = "" 
}: HomeScrollSnapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<HTMLElement[]>([])
  const currentSectionRef = useRef(0)
  const isAnimatingRef = useRef(false)
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768
  const { isHorizontalScrollActive, horizontalScrollPosition, canScrollVertically } = useScrollContext()

  // Implementar scroll snap limpio como en /about
  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined" || isMobile) return

    const sections = sectionsRef.current
    const totalSections = sections.length

    // Configurar scroll snap limpio
    const setupScrollSnap = () => {
      // Deshabilitar scroll normal
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"

      // Crear ScrollTrigger para cada sección
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

      // Función de navegación snap
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

      // Control de wheel events
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault()
        if (isAnimatingRef.current || !canScrollVertically) return

        const direction = e.deltaY > 0 ? 1 : -1
        const nextSection = currentSectionRef.current + direction
        goToSection(nextSection)
      }

      // Control de eventos táctiles
      let touchStartY = 0
      const handleTouchStart = (e: TouchEvent) => {
        touchStartY = e.touches[0].clientY
      }

      const handleTouchEnd = (e: TouchEvent) => {
        if (isAnimatingRef.current || !canScrollVertically) return
        
        const touchEndY = e.changedTouches[0].clientY
        const deltaY = touchStartY - touchEndY
        
        if (Math.abs(deltaY) > 50) {
          const direction = deltaY > 0 ? 1 : -1
          const nextSection = currentSectionRef.current + direction
          goToSection(nextSection)
        }
      }

      // Control de teclado
      const handleKeyDown = (e: KeyboardEvent) => {
        if (isAnimatingRef.current || !canScrollVertically) return
        
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

      // Agregar listeners
      window.addEventListener("wheel", handleWheel, { passive: false })
      window.addEventListener("touchstart", handleTouchStart, { passive: true })
      window.addEventListener("touchend", handleTouchEnd, { passive: true })
      window.addEventListener("keydown", handleKeyDown)

      // Función de limpieza
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

  // Agregar sección a refs
  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el)
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {children.map((child, index) => {
        const isHorizontalSection = index === 1 // PinnedScrollSection
        const isLastSection = index === children.length - 1 // TechnologiesSection
        
        return (
          <section 
            key={index}
            ref={addToRefs}
            role="region"
            aria-label={`Sección ${index + 1}`}
            className={`
              relative w-screen overflow-hidden
              ${isHorizontalSection ? 'h-screen' : isLastSection ? 'min-h-screen' : 'h-screen'}
              flex items-center justify-center
            `}
            style={{ 
              height: isHorizontalSection ? "100vh" : isLastSection ? "100vh" : "100vh"
            }}
          >
            {child}
          </section>
        )
      })}
    </div>
  )
}