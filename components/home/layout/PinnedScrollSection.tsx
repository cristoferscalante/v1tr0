"use client"

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PinnedScrollContext } from '../shared/ServiceBanner'
import { useScrollContext } from '../shared/ScrollContext'

// Registrar los plugins
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
  const sectionsCount = children.length
  const [isMobile, setIsMobile] = useState(false)
  const { setHorizontalScrollActive, setHorizontalScrollPosition } = useScrollContext()
  const [currentSection, setCurrentSection] = useState(0)
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Detectar si es móvil en el cliente para evitar errores de hidratación
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Actualizar horizontalScrollPosition cuando cambie currentSection
  useEffect(() => {
    setHorizontalScrollPosition(currentSection)
  }, [currentSection, setHorizontalScrollPosition])

  // Implementar carrusel automático
  useEffect(() => {
    // Si no es visible, no hacer nada
    if (!isVisible) {
      return
    }
    
    // Si el usuario ha interactuado y está pausado, no hacer nada
    if (userInteracted && isPaused) {
      return
    }

    // Iniciar carrusel automático
    const startAutoScroll = () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
      
      autoScrollIntervalRef.current = setInterval(() => {
        setCurrentSection(prev => (prev + 1) % sectionsCount)
      }, 2000)
    }

    startAutoScroll()

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
      
      // Limpiar el temporizador de pausa si existe
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current)
      }
    }
  }, [isVisible, sectionsCount, isPaused, userInteracted])

  // ScrollTrigger para detectar visibilidad
  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") {
      return
    }

    const container = containerRef.current

    ScrollTrigger.create({
      trigger: container,
      start: "top center",
      end: "bottom center",
      onEnter: () => {
        setIsVisible(true)
        setHorizontalScrollActive(true)
      },
      onLeave: () => {
        setIsVisible(false)
        setHorizontalScrollActive(false)
      },
      onEnterBack: () => {
        setIsVisible(true)
        setHorizontalScrollActive(true)
      },
      onLeaveBack: () => {
        setIsVisible(false)
        setHorizontalScrollActive(false)
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [setHorizontalScrollActive])

  // Función para navegar a una sección específica
  const navigateToSection = (index: number, pauseCarousel: boolean = false) => {
    if (index >= 0 && index < sectionsCount) {
      setCurrentSection(index)
      setHorizontalScrollPosition(index)
      
      // Limpiar cualquier intervalo existente
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
      
      // Limpiar cualquier temporizador de pausa existente
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current)
      }
      
      // Marcar que el usuario ha interactuado con los botones
      if (!userInteracted) {
        setUserInteracted(true)
      }
      
      // Si se solicita pausar el carrusel
      if (pauseCarousel) {
        setIsPaused(true)
        
        // Configurar un temporizador para reanudar después de 15 segundos
        pauseTimerRef.current = setTimeout(() => {
          setIsPaused(false)
          
          // Reiniciar el carrusel automático después de la pausa
          if (isVisible && autoScrollIntervalRef.current === null) {
            autoScrollIntervalRef.current = setInterval(() => {
              setCurrentSection(prev => (prev + 1) % sectionsCount)
            }, 2000)
          }
        }, 15000) // 15 segundos
      } else if (isVisible && !isPaused) {
        // Reiniciar el carrusel automático si no está pausado
        autoScrollIntervalRef.current = setInterval(() => {
          setCurrentSection(prev => (prev + 1) % sectionsCount)
        }, 2000)
      }
    }
  }


  // Renderizado responsive para móvil
  if (isMobile) {
    return (
      <PinnedScrollContext.Provider value={false}>
        <div className={`w-full ${className}`}>
          {children.map((child, index) => (
            <div 
              key={index}
              className="w-full min-h-screen flex items-center justify-center px-4 py-8 sm:py-12"
            >
              <div className="w-full max-w-sm sm:max-w-md flex flex-col justify-center">
                {child}
              </div>
            </div>
          ))}
        </div>
      </PinnedScrollContext.Provider>
    )
  }

  // Desktop: renderizar carrusel automático
  return (
    <PinnedScrollContext.Provider value={true}>
      <div 
        ref={containerRef}
        className={`relative w-full h-screen overflow-hidden ${className}`}
      >
        {/* Contenedor del carrusel */}
        <div className="relative w-full h-full">
          {children.map((child, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-700 ease-in-out ${
                index === currentSection 
                  ? 'opacity-100 translate-x-0' 
                  : index < currentSection 
                    ? 'opacity-0 -translate-x-full' 
                    : 'opacity-0 translate-x-full'
              }`}
            >
              <div className="w-full h-full max-w-7xl mx-auto px-4 lg:px-6 xl:px-8 flex items-center justify-center">
                {child}
              </div>
            </div>
          ))}
        </div>
        
        {/* Navegación con flechas y puntos indicadores */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center gap-2 z-20">
          {/* Indicador de pausa */}
          {isPaused && (
            <div className="text-xs text-highlight mb-2 bg-[#02505950] backdrop-blur-sm px-3 py-1 rounded-full border border-[#08A696]/30 animate-pulse">
              Pausado por 15 segundos
            </div>
          )}
          <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => {
              // Pausar por 15 segundos
              navigateToSection(currentSection - 1, true)
            }}
            disabled={currentSection === 0}
            className="flex items-center justify-center w-12 h-12 bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-full text-[#26FFDF] shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Servicio anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex gap-2">
            {children.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  // Pausar por 15 segundos
                  navigateToSection(index, true)
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSection 
                    ? 'bg-highlight shadow-lg shadow-highlight/30' 
                    : 'bg-[#08A696]/30 hover:bg-[#08A696]/50'
                }`}
                aria-label={`Ir a servicio ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={() => {
              // Pausar por 15 segundos
              navigateToSection(currentSection + 1, true)
            }}
            disabled={currentSection === sectionsCount - 1}
            className="flex items-center justify-center w-12 h-12 bg-[#02505931] backdrop-blur-sm border border-[#08A696]/30 rounded-full text-[#26FFDF] shadow-lg transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:shadow-xl hover:shadow-[#08A696]/10 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            aria-label="Siguiente servicio"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          </div>
        </div>
      </div>
    </PinnedScrollContext.Provider>
  )
}