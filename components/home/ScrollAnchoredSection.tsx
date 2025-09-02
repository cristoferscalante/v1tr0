"use client"

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Registrar el plugin de ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ScrollAnchoredSectionProps {
  children: React.ReactNode[]
  sectionHeight?: string
}

export default function ScrollAnchoredSection({ 
  children, 
  sectionHeight = "100vh" 
}: ScrollAnchoredSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!containerRef.current || !contentRef.current || isInitialized) {
      return
    }

    const container = containerRef.current
    const content = contentRef.current
    const sections = content.children

    // Configurar la altura del contenedor para crear el espacio de scroll
    const totalHeight = sections.length * window.innerHeight
    container.style.height = `${totalHeight}px`

    // Crear timeline principal
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: `+=${totalHeight - window.innerHeight}`,
        scrub: 1,
        pin: content,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress
          // const currentSection = Math.floor(progress * sections.length)
          
          // Animar cada sección basada en el progreso
          Array.from(sections).forEach((section, index) => {
            const sectionElement = section as HTMLElement
            const sectionProgress = (progress * sections.length) - index
            
            if (sectionProgress >= 0 && sectionProgress <= 1) {
              // Sección activa - visible
              gsap.to(sectionElement, {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
              })
            } else if (sectionProgress > 1) {
              // Sección ya pasada - mantener visible pero al fondo
              gsap.to(sectionElement, {
                opacity: 0.7,
                x: -50,
                scale: 0.95,
                duration: 0.3,
                ease: "power2.out"
              })
            } else {
              // Sección no alcanzada - oculta
              gsap.to(sectionElement, {
                opacity: 0,
                x: 100,
                scale: 0.9,
                duration: 0.3,
                ease: "power2.out"
              })
            }
          })
        }
      }
    })

    // Configurar estado inicial de las secciones
    Array.from(sections).forEach((section, index) => {
      const sectionElement = section as HTMLElement
      sectionElement.style.position = 'absolute'
      sectionElement.style.top = '0'
      sectionElement.style.left = '0'
      sectionElement.style.width = '100%'
      sectionElement.style.height = '100vh'
      
      if (index === 0) {
        gsap.set(sectionElement, { opacity: 1, x: 0, scale: 1 })
      } else {
        gsap.set(sectionElement, { opacity: 0, x: 100, scale: 0.9 })
      }
    })

    setIsInitialized(true)

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [isInitialized])

  return (
    <div 
      ref={containerRef}
      className="relative w-full"
      style={{ height: sectionHeight }}
    >
      <div 
        ref={contentRef}
        className="relative w-full h-screen overflow-hidden"
      >
        {children.map((child, index) => (
          <div 
            key={index}
            className="absolute inset-0 w-full h-full"
            data-section={index}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
