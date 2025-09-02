"use client"

import { useEffect, useState } from 'react'

interface SimplePinnedScrollProps {
  children: React.ReactNode[]
  className?: string
}

export default function SimplePinnedScroll({ 
  children, 
  className = "" 
}: SimplePinnedScrollProps) {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Si no está montado o es móvil, usar scroll normal
  if (!mounted || isMobile) {
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

  // Desktop: por ahora también usar scroll normal hasta que funcione
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
