"use client"

import dynamic from "next/dynamic"

// Importar el cursor personalizado con carga dinámica para evitar problemas de hidratación
const CustomCursor = dynamic(() => import("./CustomCursor"), {
  ssr: false,
})

export default function ClientCursorWrapper() {
  return <CustomCursor />
}