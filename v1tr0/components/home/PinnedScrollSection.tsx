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
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const sectionsCount = children.length

  useEffect(() => {
    setMounted(true)
    
    // Detectar móvil de manera simple
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Desktop: comportamiento de scroll pinned
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return

    const container = containerRef.current
    const content = contentRef.current
    const rect = container.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const containerHeight = container.offsetHeight

    // Simplificar la lógica de fijación
    const shouldBeFixed = rect.top <= 0 && rect.bottom > windowHeight

    if (shouldBeFixed !== isFixed) {
      setIsFixed(shouldBeFixed)
    }

    if (shouldBeFixed) {
      // Cálculo más simple del progreso
      const scrolled = Math.abs(rect.top)
      const maxScroll = containerHeight - windowHeight
      const progress = Math.min(scrolled / maxScroll, 1)
      
      // Determinar sección actual de manera más directa
      const section = Math.floor(progress * sectionsCount)
      const clampedSection = Math.max(0, Math.min(section, sectionsCount - 1))
      
      if (clampedSection !== currentSection) {
        setCurrentSection(clampedSection)
      }

      // Fijar el contenido
      content.style.position = 'fixed'
      content.style.top = '0'
      content.style.left = '0'
      content.style.width = '100%'
      content.style.height = '100vh'
      content.style.zIndex = '10'
      content.style.opacity = '1'
    } else {
      // Liberar el contenido
      content.style.position = 'relative'
      content.style.top = 'auto'
      content.style.left = 'auto'
      content.style.zIndex = 'auto'
      content.style.opacity = '1'
    }
  }, [isFixed, currentSection, sectionsCount])

  useEffect(() => {
    // Si es móvil o no está montado, no ejecutar la lógica de scroll pinned
    if (!mounted || isMobile || !containerRef.current) return

    // Altura simple y consistente
    const totalHeight = sectionsCount * window.innerHeight * 1.5
    containerRef.current.style.height = `${totalHeight}px`

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
  }, [handleScroll, sectionsCount, isMobile, mounted])

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

  // Si es móvil, renderizar layout normal sin scroll pinned
  if (isMobile) {
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

  // Desktop: renderizar con scroll pinned
  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${className}`}
    >
      <div 
        ref={contentRef}
        className="relative w-full h-screen overflow-hidden"
      >
        {children.map((child, index) => {
          const isActive = index === currentSection
          
          return (
            <div 
              key={index}
              className="absolute inset-0 w-full h-full"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateX(0)' : 'translateX(50px)',
                transition: 'all 0.3s ease-out',
                zIndex: isActive ? 1 : 0,
                pointerEvents: isActive ? 'auto' : 'none',
                visibility: isActive ? 'visible' : 'hidden'
              }}
            >
              {child}
            </div>
          )
        })}
      </div>
    </div>
  )
}
