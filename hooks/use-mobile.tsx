"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Estado crudo de la detección: `undefined` mientras aún no se ha resuelto en
 * el cliente.
 *
 * Distinguir "todavía no lo sé" de "no es móvil" es lo que permite a un
 * call-site no montar nada pesado hasta tener certeza. `useIsMobile` colapsa
 * `undefined` a `false`, y con eso el primer render de un teléfono es idéntico
 * al de un escritorio — suficiente para decidir clases, pero no para decidir si
 * se descarga un chunk de 650 KB.
 */
export function useIsMobileState(): boolean | undefined {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}

export function useIsMobile(): boolean {
  return !!useIsMobileState()
}

/** true solo cuando la detección ya corrió y confirmó que NO es móvil. */
export function useIsConfirmedDesktop(): boolean {
  return useIsMobileState() === false
}
