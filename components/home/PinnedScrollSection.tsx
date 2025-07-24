"use client"

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Registrar el plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface PinnedScrollSectionProps {
  children: React.ReactNode[]
  className?: string
}

export default function PinnedScrollSection({ 
  children, 
  className = "" 
}: PinnedScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const sectionsCount = children.length
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    setMounted(true)
    
    // Detectar móvil de manera simple y directa
    const checkMobile = () => {
      const width = window.innerWidth
      setIsMobile(width < 1024) // Simplemente usar el ancho como criterio principal
    }
    
    checkMobile()
    
    // Listener simple para resize
    window.addEventListener('resize', checkMobile)
    window.addEventListener('orientationchange', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', checkMobile)
    }
  }, [])

  useEffect(() => {
    if (!mounted || isMobile || !containerRef.current || sectionsCount <= 1) return

    // Limpiar animaciones previas
    if (tlRef.current) {
      tlRef.current.kill()
    }
    ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())

    const sections = sectionsRef.current.filter(Boolean) as HTMLDivElement[]
    if (sections.length === 0) return

    // Configurar el timeline principal con GSAP
    const duration = 10
    const sectionIncrement = duration / (sections.length - 1)
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        snap: {
          snapTo: 1 / (sections.length - 1),
          duration: { min: 0.2, max: 0.6 },
          delay: 0.1
        },
        start: "top top",
        end: "+=5000",
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: -1 // Prioridad baja para evitar conflictos con resize
      }
    })

    // Animación horizontal principal
    tl.to(sections, {
      xPercent: -100 * (sections.length - 1),
      duration: duration,
      ease: "none"
    })

    // Animaciones de entrada/salida para cada sección
    sections.forEach((section, index) => {
      // Configurar cada sección para optimización de GPU
      gsap.set(section, { 
        willChange: 'transform',
        force3D: true 
      })

      let tween = gsap.from(section, {
        opacity: 0,
        scale: 0.9,
        y: 50,
        duration: 1,
        force3D: true,
        paused: true,
        ease: "power2.out"
      })

      // Usar la función helper para callbacks
      addSectionCallbacks(tl, {
        start: sectionIncrement * (index - 0.99),
        end: sectionIncrement * (index + 0.99),
        onEnter: () => tween.play(),
        onLeave: () => tween.reverse(),
        onEnterBack: () => tween.play(),
        onLeaveBack: () => tween.reverse()
      })

      // La primera sección debe empezar visible
      if (index === 0) tween.progress(1)
    })

    tlRef.current = tl

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
    }
  }, [mounted, isMobile, sectionsCount])

  // Función helper para callbacks de secciones (adaptada del ejemplo GSAP)
  const addSectionCallbacks = (timeline: any, {
    start, end, onEnter, onLeave, onEnterBack, onLeaveBack
  }: {
    start: number
    end: number
    onEnter?: () => void
    onLeave?: () => void
    onEnterBack?: () => void
    onLeaveBack?: () => void
  }) => {
    const trackDirection = (animation: any) => {
      const onUpdate = animation.eventCallback("onUpdate")
      let prevTime = animation.time()
      
      animation.direction = animation.reversed() ? -1 : 1
      animation.eventCallback("onUpdate", () => {
        const time = animation.time()
        if (prevTime !== time) {
          animation.direction = time < prevTime ? -1 : 1
          prevTime = time
        }
        onUpdate && onUpdate.call(animation)
      })
    }

    const empty = () => {} // callback vacío por defecto
    
    if (!timeline.direction) trackDirection(timeline)
    
    if (start >= 0) {
      timeline.add(() => {
        const callback = timeline.direction < 0 ? onLeaveBack : onEnter
        ;(callback || empty)()
      }, start)
    }
    
    if (end <= timeline.duration()) {
      timeline.add(() => {
        const callback = timeline.direction < 0 ? onEnterBack : onLeave
        ;(callback || empty)()
      }, end)
    }
  }

  // Si no está montado, renderizar layout básico para evitar hydration mismatch
  if (!mounted) {
    return (
      <div className={`w-full ${className}`}>
        {children.map((child, index) => (
          <div 
            key={index}
            className="w-full min-h-screen"
          >
            {child}
          </div>
        ))}
      </div>
    )
  }

  // Si es móvil, renderizar layout simple y plano
  if (isMobile) {
    return (
      <div className={`w-full ${className}`}>
        {children.map((child, index) => {
          // La última sección no debería tener min-h-screen para evitar espacio extra
          const isLastSection = index === children.length - 1
          
          return (
            <div 
              key={index}
              className={`w-full ${isLastSection ? 'min-h-fit' : 'min-h-screen'} flex items-center justify-center`}
              style={{ 
                minHeight: isLastSection ? 'fit-content' : '100vh'
              }}
            >
              <div className={`w-full h-full flex flex-col justify-center px-4 ${isLastSection ? 'py-4' : 'py-8'}`}>
                {child}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Desktop: renderizar con scroll horizontal usando GSAP
  return (
    <div 
      ref={containerRef}
      className={`relative w-full gsap-container ${className}`}
      style={{ height: '100vh' }}
    >
      <div 
        className="flex h-full horizontal-scroll-container"
        style={{ width: `${sectionsCount * 100}%` }}
      >
        {children.map((child, index) => (
          <div 
            key={index}
            ref={(el: HTMLDivElement | null) => { sectionsRef.current[index] = el }}
            className="flex-shrink-0 w-full h-full gsap-section horizontal-scroll-section"
            style={{ width: `${100 / sectionsCount}%` }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}