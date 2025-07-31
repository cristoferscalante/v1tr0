"use client"

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGsapReady } from '../../hooks/use-gsap-ready'

// Registrar los plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * HomeScrollSnap - Componente para scroll snap vertical en el home
 * 
 * Implementa scroll snap basado en el patrón de information-systems.tsx
 * Permite navegación fluida: Hero → Scroll Horizontal → Gestión de Proyectos → Footer
 * Con un solo scroll entre cada sección
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
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])
  const [mounted, setMounted] = useState(false)
  const sectionsCount = children.length
  
  const { isReady: gsapReady } = useGsapReady()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === 'undefined' || !gsapReady) return

    const isMobile = window.innerWidth <= 768
    
    // Solo aplicar GSAP snap en desktop
    if (!isMobile && containerRef.current && sectionsRef.current.length > 0) {
      const sections = sectionsRef.current.filter(Boolean) as HTMLDivElement[]
      
      // Sin scroll snap - scroll libre en todas las secciones

      // Añadir animaciones de entrada para cada sección
      sections.forEach((section, index) => {
        gsap.fromTo(section, 
          {
            opacity: 0,
            y: 50
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      })
    }

    // Función de limpieza
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [mounted, gsapReady, sectionsCount])

  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    if (el && sectionsRef.current[index] !== el) {
      sectionsRef.current[index] = el
    }
  }

  // Si no está montado, renderizar layout básico
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

  return (
    <section className="w-full font-sans relative">
      <div 
        ref={containerRef}
        className={`min-h-screen ${className}`}
      >
        {children.map((child, index) => {
          const isHorizontalSection = index === 1 // Asumiendo que la sección horizontal es la segunda
          const isLastSection = index === children.length - 1 // Footer
          
          return (
            <div 
              key={index}
              ref={(el) => addToRefs(el, index)}
              className={`
                w-full snap-section
                ${isHorizontalSection ? 'h-screen' : isLastSection ? 'min-h-fit' : 'min-h-screen'}
                flex items-center justify-center
              `}
              style={{
                minHeight: isHorizontalSection ? '100vh' : isLastSection ? 'fit-content' : '100vh'
              }}
            >
              <div className="w-full h-full">
                {child}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}