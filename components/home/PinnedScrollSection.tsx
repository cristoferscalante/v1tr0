"use client"

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PinnedScrollContext } from './shared/ServiceBanner'
import { useScrollContext } from './shared/ScrollContext'

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
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768
  const { setHorizontalScrollActive, setHorizontalScrollPosition } = useScrollContext()
  const [currentSection, setCurrentSection] = useState(0)
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Implementar carrusel automático
  useEffect(() => {
    if (!isVisible) return

    // Iniciar carrusel automático
    const startAutoScroll = () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
      
      autoScrollIntervalRef.current = setInterval(() => {
        setCurrentSection(prev => (prev + 1) % sectionsCount)
      }, 5000)
    }

    startAutoScroll()

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
    }
  }, [isVisible, sectionsCount])

  // ScrollTrigger para detectar visibilidad
  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return

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
  }, [])

  // Función para navegar a una sección específica
  const navigateToSection = (index: number) => {
    if (index >= 0 && index < sectionsCount) {
      setCurrentSection(index)
      
      // Reiniciar el carrusel automático
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
      
      if (isVisible) {
        autoScrollIntervalRef.current = setInterval(() => {
          setCurrentSection(prev => (prev + 1) % sectionsCount)
        }, 5000)
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
              className="w-full min-h-screen flex items-center justify-center px-4 py-6"
            >
              <div className="w-full h-full max-w-sm flex flex-col justify-center">
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
        
        {/* Barra de navegación inferior */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => navigateToSection(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                currentSection === index
                  ? 'w-8 bg-white shadow-lg'
                  : 'w-6 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Ir a servicio ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </PinnedScrollContext.Provider>
  )
}