"use client"

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useScrollContext } from '../shared/ScrollContext'
import { useScrollSnapEnabled, useDeviceDetection } from '@/hooks/use-device-detection'

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
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const shouldEnableScrollSnap = useScrollSnapEnabled()
  const { isMobile } = useDeviceDetection()
  const { canScrollVertically } = useScrollContext()
  // const { isHorizontalScrollActive, horizontalScrollPosition } = useScrollContext() // No utilizadas

  // Implementar scroll snap limpio como en /about (solo desktop)
  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") {
      return
    }

    // En móviles y tablets, permitir scroll normal sin GSAP
    // Solo aplicar scroll snap en desktop
    if (!shouldEnableScrollSnap) {
      document.body.style.overflow = "auto"
      document.documentElement.style.overflow = "auto"
      return
    }

    const sections = sectionsRef.current
    const totalSections = sections.length

    // Configurar scroll snap limpio (solo desktop)
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

      // Función para resetear el flag de animación de forma segura
      const resetAnimationFlag = () => {
        // console.log('[DEBUG] Resetting animation flag')
        isAnimatingRef.current = false
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current)
          animationTimeoutRef.current = null
        }
      }

      // Función de navegación snap con manejo de errores robusto - igual que /about
      const goToSection = (index: number) => {
        if (isAnimatingRef.current || index < 0 || index >= totalSections) {
          // console.log('[DEBUG] Navigation blocked:', { isAnimating: isAnimatingRef.current, index, totalSections })
          return
        }
        
        // console.log('[DEBUG] Starting navigation:', { from: currentSectionRef.current, to: index })
        isAnimatingRef.current = true
        currentSectionRef.current = index
        
        // Timeout de seguridad para evitar congelamientos
        animationTimeoutRef.current = setTimeout(() => {
          // console.log('[DEBUG] Animation timeout triggered - force reset')
          resetAnimationFlag()
        }, 1500)
        
        gsap.to(window, {
          duration: 0.8,
          scrollTo: {
            y: index * window.innerHeight,
            autoKill: false
          },
          ease: "power2.out",
          onComplete: () => {
            // console.log('[DEBUG] Animation completed successfully')
            resetAnimationFlag()
          },
          onInterrupt: () => {
            // console.log('[DEBUG] Animation interrupted')
            resetAnimationFlag()
          }
        })
      }

      // Control de wheel events - lógica simple como en /about
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault()
        if (isAnimatingRef.current) {
          // console.log('[DEBUG] Wheel blocked - animation in progress')
          return
        }

        const direction = e.deltaY > 0 ? 1 : -1
        const nextSection = currentSectionRef.current + direction
        
        // console.log('[DEBUG] Wheel event:', { current: currentSectionRef.current, direction, next: nextSection })
        goToSection(nextSection)
      }

      // Control de eventos táctiles
      let touchStartY = 0
      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches[0]) {
          touchStartY = e.touches[0].clientY
        }
      }

      const handleTouchEnd = (e: TouchEvent) => {
        if (isAnimatingRef.current) {
          return
        }
        
        if (e.changedTouches[0]) {
          const touchEndY = e.changedTouches[0].clientY
          const deltaY = touchStartY - touchEndY
          
          if (Math.abs(deltaY) > 50) {
            const direction = deltaY > 0 ? 1 : -1
            const nextSection = currentSectionRef.current + direction
            goToSection(nextSection)
          }
        }
      }

      // Control de teclado
      const handleKeyDown = (e: KeyboardEvent) => {
        if (isAnimatingRef.current) {
          return
        }
        
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
        // Limpiar timeout de seguridad
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current)
          animationTimeoutRef.current = null
        }
        resetAnimationFlag()
      }
    }

    const cleanup = setupScrollSnap()
    
    return cleanup
  }, [canScrollVertically, isMobile, shouldEnableScrollSnap])

  // Agregar sección a refs
  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el)
    }
  }

  // Renderizado responsive - scroll normal para móviles y tablets
  if (!shouldEnableScrollSnap) {
    return (
      <div ref={containerRef} className={`relative ${className}`}>
        {children.map((child, index) => {
          return (
            <section 
              key={index}
              role="region"
              aria-label={`Sección ${index + 1}`}
              className="relative w-full min-h-screen"
            >
              {child}
            </section>
          )
        })}
      </div>
    )
  }

  // Desktop: scroll snap con GSAP
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