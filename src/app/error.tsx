'use client';

import React from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  React.useEffect(() => {
    // Registra el error en un servicio de análisis
    console.error('Error no manejado:', error);
  }, [error]);

  return (
    <div className="flex h-screen bg-gray-100 items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Algo salió mal</h2>
        <p className="text-gray-700 mb-4">
          Ha ocurrido un error al cargar esta página. Nuestro equipo ha sido notificado.
        </p>
        {error.digest && (
          <p className="text-sm text-gray-500 mb-4">
            Código de diagnóstico: <code>{error.digest}</code>
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Intentar de nuevo
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
