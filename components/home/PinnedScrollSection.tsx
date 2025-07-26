"use client"

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useGsapReady } from '../../hooks/use-gsap-ready'
import { PinnedScrollContext } from './shared/ServiceBanner'

// Registrar los plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

/**
 * PinnedScrollSection - Componente responsive para scroll horizontal con GSAP
 * 
 * Breakpoints:
 * - Mobile (< 800px): Layout vertical sin scroll horizontal - pantallas menores a 11 pulgadas
 * - Tablet (800px - 1023px): Layout vertical optimizado para tablet
 * - Desktop (>= 1024px): Scroll horizontal con GSAP
 * 
 * Características responsive:
 * - Detección automática de tamaño de pantalla con debounce
 * - Layouts adaptativos para cada breakpoint
 * - Optimizaciones de performance según dispositivo
 * - Configuración dinámica de distancia de scroll según viewport
 */

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
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const sectionsCount = children.length
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const sectionTweensRef = useRef<gsap.core.Tween[]>([])
  
  const { isReady: gsapReady } = useGsapReady()

  useEffect(() => {
    setMounted(true)
    
    // Detectar tamaño de pantalla de manera responsive
    const checkScreenSize = () => {
      const width = window.innerWidth
      
      if (width < 800) {
        setScreenSize('mobile') // pantallas menores a 11 pulgadas
      } else if (width < 1024) {
        setScreenSize('tablet') // md/lg breakpoint
      } else {
        setScreenSize('desktop') // xl/2xl breakpoint
      }
    }
    
    checkScreenSize()
    
    // Listener para resize con debounce para mejor performance
    let timeoutId: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkScreenSize, 150)
    }
    
    window.addEventListener('resize', debouncedResize)
    window.addEventListener('orientationchange', debouncedResize)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', debouncedResize)
      window.removeEventListener('orientationchange', debouncedResize)
    }
  }, [])

  useGSAP(() => {
    // Solo ejecutar cuando GSAP esté completamente listo y en desktop
    if (!mounted || screenSize !== 'desktop' || !containerRef.current || sectionsCount <= 1 || !gsapReady) {
      return
    }

    const container = containerRef.current
    const sections = sectionsRef.current.filter(Boolean) as HTMLDivElement[]
    
    if (sections.length === 0) return

    // Validar que todos los elementos están conectados al DOM
    if (!container.isConnected || !document.contains(container)) {
      console.warn('Container not connected to DOM, skipping animation')
      return
    }
    
    const invalidSections = sections.filter(section => 
      !section.isConnected || !document.contains(section)
    )
    
    if (invalidSections.length > 0) {
      console.warn('Some sections not connected to DOM, skipping animation')
      return
    }

    // Limpiar animaciones previas de forma segura
    if (tlRef.current) {
      tlRef.current.kill()
      tlRef.current = null
    }
    
    // Limpiar tweens de secciones previas
    sectionTweensRef.current.forEach(tween => {
      if (tween) tween.kill()
    })
    sectionTweensRef.current = []

    // Configurar el timeline principal con GSAP optimizado para desktop
    const duration = 10
    const sectionIncrement = duration / (sections.length - 1)
    
    // Configuración adaptativa según el viewport
    const viewportWidth = window.innerWidth
    const scrollDistance = viewportWidth > 1536 ? 6000 : // 2xl
                          viewportWidth > 1280 ? 5500 : // xl
                          5000 // lg y menores
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        snap: {
          snapTo: 1 / (sections.length - 1),
          duration: { min: 0.2, max: 0.6 },
          delay: 0.1
        },
        start: "top top",
        end: `+=${scrollDistance}`,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: -1
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
      
      // Almacenar el tween para limpieza posterior
      sectionTweensRef.current.push(tween)

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
  }, { 
    dependencies: [mounted, screenSize, sectionsCount, gsapReady],
    scope: containerRef 
  })

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
      <PinnedScrollContext.Provider value={false}>
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
      </PinnedScrollContext.Provider>
    )
  }

  // Renderizado responsive para móvil y tablet
  if (screenSize === 'mobile' || screenSize === 'tablet') {
    return (
      <PinnedScrollContext.Provider value={false}>
        <div className={`w-full ${className}`}>
          {children.map((child, index) => {
            const isLastSection = index === children.length - 1
            
            return (
              <div 
                key={index}
                className={`
                  w-full flex items-center justify-center
                  ${isLastSection ? 'min-h-fit' : 'min-h-screen'}
                  ${screenSize === 'mobile' ? 'px-4 py-6' : 'px-6 py-8'}
                `}
                style={{ 
                  minHeight: isLastSection ? 'fit-content' : 
                    screenSize === 'mobile' ? '100vh' : '100vh'
                }}
              >
                <div className={`
                  w-full h-full flex flex-col justify-center
                  ${screenSize === 'mobile' ? 'max-w-sm' : 'max-w-4xl'}
                  ${isLastSection ? 'py-4' : screenSize === 'mobile' ? 'py-6' : 'py-8'}
                `}>
                  {child}
                </div>
              </div>
            )
          })}
        </div>
      </PinnedScrollContext.Provider>
    )
  }

  // Desktop: renderizar con scroll horizontal usando GSAP
  return (
    <PinnedScrollContext.Provider value={true}>
      <div 
        ref={containerRef}
        className={`
          relative w-full gsap-container overflow-hidden
          ${className}
        `}
        style={{ 
          height: '100vh',
          minHeight: '600px' // Altura mínima para pantallas muy pequeñas
        }}
      >
        <div 
          className="flex h-full horizontal-scroll-container"
          style={{ 
            width: `${sectionsCount * 100}%`,
            minWidth: '100%' // Asegurar ancho mínimo
          }}
        >
          {children.map((child, index) => (
            <div 
              key={index}
              ref={(el: HTMLDivElement | null) => { sectionsRef.current[index] = el }}
              className={`
                flex-shrink-0 w-full h-full gsap-section horizontal-scroll-section
                flex items-center justify-center
              `}
              style={{ 
                width: `${100 / sectionsCount}%`,
                minWidth: `${100 / sectionsCount}%`
              }}
            >
              <div className="w-full h-full max-w-7xl mx-auto px-4 lg:px-6 xl:px-8">
                {child}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PinnedScrollContext.Provider>
  )
}