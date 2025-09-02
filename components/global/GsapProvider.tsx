"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { GsapLoadingFallback } from './GsapLoadingFallback'

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
  maxRetries = 3,
  showProgress = false 
}: GsapProviderProps) {
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

  // Mostrar loading mientras se inicializa
  if (isLoading) {
    return (
      <GsapLoadingFallback 
        message="Inicializando animaciones..."
        showSpinner={showProgress}
      />
    )
  }

  // Mostrar error si falló la inicialización
  if (error && retryCount >= maxRetries) {
    return (
      <div className="flex items-center justify-center min-h-[200px] w-full">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-red-500 text-sm">
            Error al inicializar GSAP: {error.message}
          </div>
          <button 
            onClick={retry}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <GsapContext.Provider value={contextValue}>
      {children}
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