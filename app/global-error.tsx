"use client"

import React from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Log del error para depuración
    console.error("Error global no manejado:", error)
  }, [error])

  return (
    <html lang="es">
      <body>
        <div className="flex h-screen bg-gray-100 items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full border border-gray-200">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 rounded-full bg-red-500/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-red-500 mb-4 text-center">Error crítico</h2>
            <p className="text-gray-600 mb-4 text-center">
              Ha ocurrido un error crítico en la aplicación. Nuestro equipo ha sido notificado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <button
                onClick={() => reset()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Intentar de nuevo
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
