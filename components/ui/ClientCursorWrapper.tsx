"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

// Importar el cursor personalizado con carga dinámica para evitar problemas de hidratación
const CustomCursor = dynamic(() => import("./CustomCursor"), {
  ssr: false,
})

export default function ClientCursorWrapper() {
  // En dispositivos táctiles no existe puntero fino: montar el cursor solo añade
  // un listener global de mousemove que nunca dispara. La decisión vive aquí,
  // en el call-site, para que dynamic() ni siquiera pida el chunk en móvil.
  const [hasFinePointer, setHasFinePointer] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => setHasFinePointer(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

  if (!hasFinePointer) return null

  return <CustomCursor />
}
