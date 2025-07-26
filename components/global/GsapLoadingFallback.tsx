"use client"

import React from 'react'

interface GsapLoadingFallbackProps {
  message?: string
  showSpinner?: boolean
}

/**
 * Componente de fallback para errores de GSAP
 * Muestra un mensaje de carga mientras se recupera de errores
 */
export function GsapLoadingFallback({ 
  message = "Cargando animaciones...", 
  showSpinner = true 
}: GsapLoadingFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      <div className="flex flex-col items-center gap-4">
        {showSpinner && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        )}
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

export default GsapLoadingFallback