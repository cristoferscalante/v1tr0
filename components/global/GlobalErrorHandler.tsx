"use client"

import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Manejador global de errores para GSAP y la aplicación
 * Captura errores no manejados y realiza cleanup automático
 */
export function GlobalErrorHandler() {
  useEffect(() => {
    // Manejador para errores no capturados
    const handleUnhandledError = (event: ErrorEvent) => {
      const error = event.error
      
      // Detectar errores relacionados con GSAP/DOM
      const isGsapError = 
        error?.message?.includes('removeChild') ||
        error?.message?.includes('NotFoundError') ||
        error?.message?.includes('ScrollTrigger') ||
        error?.message?.includes('gsap') ||
        error?.name === 'NotFoundError'

      if (isGsapError) {
        console.warn('Global GSAP error detected, performing cleanup:', error.message)
        
        try {
          // Cleanup inmediato de ScrollTrigger
          ScrollTrigger.getAll().forEach(trigger => {
            try {
              trigger.kill(true)
            } catch (cleanupError) {
              console.warn('Error killing ScrollTrigger:', cleanupError)
            }
          })
          
          // Refresh ScrollTrigger
          ScrollTrigger.refresh()
          
          // Prevenir que el error se propague
          event.preventDefault()
          
        } catch (cleanupError) {
          console.error('Error during global GSAP cleanup:', cleanupError)
        }
      }
    }

    // Manejador para promesas rechazadas
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason
      
      // Detectar errores relacionados con GSAP/DOM
      const isGsapError = 
        error?.message?.includes('removeChild') ||
        error?.message?.includes('NotFoundError') ||
        error?.message?.includes('ScrollTrigger') ||
        error?.message?.includes('gsap') ||
        error?.name === 'NotFoundError'

      if (isGsapError) {
        console.warn('Global GSAP promise rejection detected:', error.message)
        
        try {
          // Cleanup inmediato de ScrollTrigger
          ScrollTrigger.getAll().forEach(trigger => {
            try {
              trigger.kill(true)
            } catch (cleanupError) {
              console.warn('Error killing ScrollTrigger:', cleanupError)
            }
          })
          
          // Refresh ScrollTrigger
          ScrollTrigger.refresh()
          
          // Prevenir que el error se propague
          event.preventDefault()
          
        } catch (cleanupError) {
          console.error('Error during global GSAP cleanup:', cleanupError)
        }
      }
    }

    // Registrar los manejadores
    window.addEventListener('error', handleUnhandledError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // Cleanup al desmontar
    return () => {
      window.removeEventListener('error', handleUnhandledError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  // Este componente no renderiza nada
  return null
}

export default GlobalErrorHandler