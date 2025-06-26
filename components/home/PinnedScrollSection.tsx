"use client"

import { useEffect, useRef, useState, useCallback } from 'react'

interface PinnedScrollSectionProps {
  children: React.ReactNode[]
  className?: string
}

export default function PinnedScrollSection({ 
  children, 
  className = "" 
}: PinnedScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isFixed, setIsFixed] = useState(false)
  const [transitionState, setTransitionState] = useState<'entering' | 'active' | 'exiting'>('entering')
  const sectionsCount = children.length

  const handleScroll = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return

    const container = containerRef.current
    const content = contentRef.current
    const rect = container.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const containerHeight = container.offsetHeight

    // Determinar si debe estar fijo
    const shouldBeFixed = rect.top <= 0 && rect.bottom > windowHeight * 0.8

    if (shouldBeFixed !== isFixed) {
      setIsFixed(shouldBeFixed)
    }

    if (shouldBeFixed) {
      // Calcular progreso basado en la posición del scroll con mayor sensibilidad
      const scrolled = Math.abs(rect.top)
      const maxScroll = containerHeight - (windowHeight * 0.8)
      const progress = Math.min(scrolled / maxScroll, 1)
      
      // Determinar sección actual con mayor sensibilidad y menos delay
      const rawSection = progress * (sectionsCount - 1) * 1.2 // Multiplicador para más sensibilidad
      const section = Math.floor(rawSection + 0.2) // Offset más pequeño para cambios más rápidos
      const clampedSection = Math.max(0, Math.min(section, sectionsCount - 1))
      
      // Manejar estados de transición
      if (progress < 0.05) {
        setTransitionState('entering')
      } else if (progress > 0.95) {
        setTransitionState('exiting')
      } else {
        setTransitionState('active')
      }
      
      if (clampedSection !== currentSection) {
        // Reducir delay para cambios más rápidos
        setTimeout(() => {
          setCurrentSection(clampedSection)
        }, 50)
      }

      // Aplicar estilos de fijación con transición suave
      content.style.position = 'fixed'
      content.style.top = '0'
      content.style.left = '0'
      content.style.width = '100%'
      content.style.height = '100vh'
      content.style.zIndex = '10'
      
      // Fade out suave al final
      if (progress > 0.95) {
        const fadeProgress = (progress - 0.95) / 0.05
        content.style.opacity = `${1 - fadeProgress * 0.3}`
      } else {
        content.style.opacity = '1'
      }
    } else {
      // Liberar el contenido con transición
      content.style.position = 'relative'
      content.style.top = 'auto'
      content.style.left = 'auto'
      content.style.zIndex = 'auto'
      content.style.opacity = '1'
    }
  }, [isFixed, currentSection, sectionsCount])

  useEffect(() => {
    if (!containerRef.current) return

    // Reducir la altura del contenedor para menos scroll necesario
    const totalHeight = (sectionsCount * window.innerHeight * 0.6) + (window.innerHeight * 0.3)
    containerRef.current.style.height = `${totalHeight}px`

    // Throttled scroll handler
    let ticking = false
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', scrollHandler, { passive: true })
    window.addEventListener('resize', scrollHandler, { passive: true })
    
    // Trigger inicial
    handleScroll()

    return () => {
      window.removeEventListener('scroll', scrollHandler)
      window.removeEventListener('resize', scrollHandler)
      if (contentRef.current) {
        const content = contentRef.current
        content.style.position = 'relative'
        content.style.top = 'auto'
        content.style.left = 'auto'
        content.style.zIndex = 'auto'
        content.style.opacity = '1'
      }
    }
  }, [handleScroll, sectionsCount])

  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${className}`}
    >
      <div 
        ref={contentRef}
        className="relative w-full h-screen overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
        }}
      >
        {children.map((child, index) => {
          const isActive = index === currentSection
          
          return (
            <div 
              key={index}
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{
                opacity: isActive ? 1 : 0,
                transform: `translateX(${
                  isActive ? '0px' : index > currentSection ? '100px' : '-100px'
                }) scale(${
                  isActive ? 1 : 0.9
                })`,
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', // Transición más rápida
                zIndex: isActive ? 2 : 0,
                filter: isActive ? 'blur(0px)' : 'blur(4px)',
                pointerEvents: isActive ? 'auto' : 'none',
                visibility: isActive ? 'visible' : 'hidden'
              }}
            >
              <div className="w-full h-full">
                {child}
              </div>
            </div>
          )
        })}
        
        {/* Indicador de progreso mejorado */}
        <div className="fixed bottom-8 right-8 z-20 flex flex-col gap-3 p-2 bg-black/20 backdrop-blur-sm rounded-2xl border border-[#08A696]/20">
          {children.map((_, index) => (
            <div
              key={index}
              className={`relative w-3 h-12 rounded-full transition-all duration-500 ${
                index === currentSection 
                  ? 'bg-gradient-to-b from-[#26FFDF] to-[#08A696] shadow-lg shadow-[#26FFDF]/30' 
                  : index < currentSection
                    ? 'bg-[#08A696]/60'
                    : 'bg-gray-600/30'
              }`}
            >
              {index === currentSection && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#26FFDF] to-[#08A696] rounded-full animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* Indicador de scroll */}
        {currentSection < sectionsCount - 1 && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-[#26FFDF] animate-bounce">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium">Continúa desplazándote</span>
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
