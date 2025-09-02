"use client"

import React from "react"
import { ErrorIcon } from "@/lib/icons"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  // Asegurarse de que error es un objeto válido usando useMemo
  const errorObject = React.useMemo(() => {
    return error || { message: "Error desconocido" }
  }, [error])

  React.useEffect(() => {
    // Log del error para depuración (removido console.error)
  }, [errorObject])

  return (
    <div className="flex h-screen bg-background items-center justify-center p-4">
      <div className="bg-custom-1 p-8 rounded-lg shadow-md max-w-lg w-full border border-custom-2/20">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 rounded-full bg-red-500/10">
            <ErrorIcon className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-red-500 mb-4 text-center">Algo salió mal</h2>
        <p className="text-textMuted mb-4 text-center">
          Ha ocurrido un error al cargar esta página. Nuestro equipo ha sido notificado.
        </p>
        {errorObject?.digest && (
          <p className="text-sm text-textMuted mb-4 text-center">
            Código de diagnóstico: <code className="bg-custom-2/20 px-1 py-0.5 rounded">{errorObject.digest}</code>
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-highlight text-white rounded-md hover:bg-highlight/90 transition-colors"
          >
            Intentar de nuevo
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 bg-custom-2/20 text-textPrimary rounded-md hover:bg-custom-2/30 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  )
}
