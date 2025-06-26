"use client"

import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { ReactNode } from 'react'

interface ScrollAnimationWrapperProps {
  children: ReactNode
  delay?: number
  className?: string
  animationType?: 'slideRight' | 'slideLeft' | 'fadeUp' | 'scale'
}

export default function ScrollAnimationWrapper({ 
  children, 
  delay = 0,
  className = "",
  animationType = 'slideRight'
}: ScrollAnimationWrapperProps) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px',
    triggerOnce: true
  })

  const getAnimationStyles = () => {
    const baseStyles = {
      transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      transitionDelay: `${delay}ms`
    }

    switch (animationType) {
      case 'slideRight':
        return {
          ...baseStyles,
          transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(120px) scale(0.95)',
          opacity: isVisible ? 1 : 0,
          filter: isVisible ? 'blur(0px)' : 'blur(4px)'
        }
      case 'slideLeft':
        return {
          ...baseStyles,
          transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(-120px) scale(0.95)',
          opacity: isVisible ? 1 : 0,
          filter: isVisible ? 'blur(0px)' : 'blur(4px)'
        }
      case 'fadeUp':
        return {
          ...baseStyles,
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.95)',
          opacity: isVisible ? 1 : 0,
          filter: isVisible ? 'blur(0px)' : 'blur(4px)'
        }
      case 'scale':
        return {
          ...baseStyles,
          transform: isVisible ? 'scale(1)' : 'scale(0.8)',
          opacity: isVisible ? 1 : 0,
          filter: isVisible ? 'blur(0px)' : 'blur(4px)'
        }
      default:
        return baseStyles
    }
  }

  return (
    <div
      ref={elementRef}
      className={`will-change-transform ${className}`}
      style={getAnimationStyles()}
    >
      {children}
    </div>
  )
}
