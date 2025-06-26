"use client"

import { useEffect, useRef, useState } from 'react'

interface SmoothTransitionWrapperProps {
  children: React.ReactNode
  className?: string
}

export default function SmoothTransitionWrapper({ 
  children, 
  className = "" 
}: SmoothTransitionWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!wrapperRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Activar cuando esté cerca del viewport
        if (entry.intersectionRatio > 0.1) {
          setIsVisible(true)
        }
      },
      {
        threshold: [0, 0.1, 0.2],
        rootMargin: '100px 0px 0px 0px'
      }
    )

    observer.observe(wrapperRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div 
      ref={wrapperRef}
      className={`transition-all duration-1000 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.98)',
        filter: isVisible ? 'blur(0px)' : 'blur(2px)'
      }}
    >
      {children}
    </div>
  )
}
