"use client"

import { useSyncExternalStore } from "react"

/**
 * Estado compartido de la intro del home. Mientras corre, la interfaz fija
 * (header, botones flotantes) espera fuera de pantalla y entra al terminar.
 *
 * `null` = aún no se sabe: el hero decide al montar si hay intro (primera
 * visita de la sesión) o no. Hasta entonces, en "/" se asume que sí, para
 * que el header no aparezca y desaparezca en el primer pintado.
 */
let introActive: boolean | null = null
const listeners = new Set<() => void>()

export function setIntroActive(active: boolean) {
  if (introActive === active) {
    return
  }
  introActive = active
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** true mientras la intro del home tapa la página. */
export function useIntroActive(pathname: string | null) {
  const value = useSyncExternalStore(
    subscribe,
    () => introActive,
    () => null,
  )
  return value ?? pathname === "/"
}
