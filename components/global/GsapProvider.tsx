"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { GsapMinimalLoader } from '../gsap/GsapMinimalLoader'
import { GsapErrorBoundary } from './GsapErrorBoundary'

// Registrar plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

interface GsapContextType {
  isReady: boolean
  isLoading: boolean
  error: Error | null
  retry: () => void
}

const GsapContext = createContext<GsapContextType | undefined>(undefined)

interface GsapProviderProps {
  children: ReactNode
  initialDelay?: number
  maxRetries?: number
  showProgress?: boolean
}

/**
 * Proveedor global de GSAP que maneja la inicialización y estado
 * Asegura que GSAP esté completamente listo antes de renderizar componentes
 */
export function GsapProvider({ 
  children, 
  initialDelay = 100,
  maxRetries = 3 
}: Omit<GsapProviderProps, 'showProgress'>) {
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const initializeGsap = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Esperar el delay inicial
      await new Promise(resolve => setTimeout(resolve, initialDelay))

      // Verificar que estamos en el cliente
      if (typeof window === 'undefined') {
        throw new Error('GSAP requires browser environment')
      }

      // Verificar que GSAP está disponible
      if (typeof gsap === 'undefined') {
        throw new Error('GSAP is not available')
      }

      // Verificar que ScrollTrigger está disponible
      if (typeof ScrollTrigger === 'undefined') {
        throw new Error('ScrollTrigger is not available')
      }

      // Configuración global de GSAP
      gsap.config({
        force3D: true,
        nullTargetWarn: false
      })

      // Configuración de ScrollTrigger
      ScrollTrigger.config({
        ignoreMobileResize: true,
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
      })

      // Pequeño delay adicional para asegurar que todo esté listo
      await new Promise(resolve => setTimeout(resolve, 50))

      setIsReady(true)
      setIsLoading(false)
      setRetryCount(0)

    } catch (err) {
      const error = err as Error
      console.error('Error initializing GSAP:', error)
      setError(error)
      setIsLoading(false)
      
      // Retry automático si no se han agotado los intentos
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          initializeGsap()
        }, 1000 * (retryCount + 1)) // Delay incremental
      }
    }
  }, [initialDelay, retryCount, maxRetries])

  const retry = () => {
    setRetryCount(0)
    initializeGsap()
  }

  useEffect(() => {
    initializeGsap()
  }, [initializeGsap])

  const contextValue: GsapContextType = {
    isReady,
    isLoading,
    error,
    retry
  }

  return (
    <GsapContext.Provider value={contextValue}>
      <GsapErrorBoundary>
        <GsapMinimalLoader isVisible={isLoading} duration={initialDelay} />
        {children}
      </GsapErrorBoundary>
    </GsapContext.Provider>
  )
}

/**
 * Hook para acceder al contexto de GSAP
 */
export function useGsapContext() {
  const context = useContext(GsapContext)
  if (context === undefined) {
    throw new Error('useGsapContext must be used within a GsapProvider')
  }
  return context
}

export default GsapProvider