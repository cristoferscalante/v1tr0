"use client"

import { useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Hook para verificar que GSAP esté completamente listo
 * Útil para evitar errores de inicialización prematura
 */
export function useGsapReady() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') {
      return
    }

    // Función para verificar si GSAP está listo
    const checkGsapReady = () => {
      try {
        // Verificar que GSAP y ScrollTrigger estén disponibles
        const gsapAvailable = typeof gsap !== 'undefined' && gsap.version
        const scrollTriggerAvailable = typeof ScrollTrigger !== 'undefined'
        
        // Verificar que el DOM esté listo
        const domReady = document.readyState === 'complete' || document.readyState === 'interactive'
        
        if (gsapAvailable && scrollTriggerAvailable && domReady) {
          setIsReady(true)
          return true
        }
        
        return false
      } catch (error) {
        console.warn('Error checking GSAP readiness:', error)
        return false
      }
    }

    // Verificar inmediatamente
    if (checkGsapReady()) {
      return
    }

    // Si no está listo, esperar a que el DOM esté completamente cargado
    const handleDOMContentLoaded = () => {
      // Pequeño delay para asegurar que todo esté inicializado
      setTimeout(() => {
        if (checkGsapReady()) {
          setIsReady(true)
        }
      }, 50)
    }

    // Si el DOM ya está listo, ejecutar inmediatamente
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', handleDOMContentLoaded)
    } else {
      handleDOMContentLoaded()
    }

    // Cleanup
    return () => {
      document.removeEventListener('DOMContentLoaded', handleDOMContentLoaded)
    }
  }, [])

  return { isReady }
}

export default useGsapReady