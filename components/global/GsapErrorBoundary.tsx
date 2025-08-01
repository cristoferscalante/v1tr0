"use client"

import React, { Component, ReactNode } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GsapLoadingFallback } from './GsapLoadingFallback'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * Error Boundary específico para errores de GSAP/ScrollTrigger
 * Captura errores relacionados con DOM y animaciones
 */
export class GsapErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Detectar errores específicos de GSAP/DOM
    const isGsapError = 
      error.message.includes('removeChild') ||
      error.message.includes('NotFoundError') ||
      error.message.includes('ScrollTrigger') ||
      error.message.includes('gsap') ||
      error.name === 'NotFoundError'

    if (isGsapError) {
      console.warn('GSAP Error detected, attempting recovery:', error.message)
      
      // Cleanup inmediato de ScrollTrigger
      try {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill(true))
        ScrollTrigger.refresh()
      } catch (cleanupError) {
        console.warn('Error during GSAP cleanup:', cleanupError)
      }

      return { hasError: true, error }
    }

    // Re-lanzar errores que no son de GSAP
    throw error
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('GsapErrorBoundary caught an error:', error, errorInfo)
  }

  componentDidMount() {
    // Auto-recovery después de 100ms
    if (this.state.hasError) {
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined })
      }, 100)
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // Auto-recovery cuando se detecta un error
    if (this.state.hasError && !prevState.hasError) {
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined })
      }, 100)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <GsapLoadingFallback 
          message="Reiniciando animaciones..."
          showSpinner={true}
        />
      )
    }

    return this.props.children
  }
}

export default GsapErrorBoundary