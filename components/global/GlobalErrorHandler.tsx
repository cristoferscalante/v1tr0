"use client"

import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Manejador global de errores para GSAP y la aplicación.
 *
 * Captura la carrera conocida entre el desmontaje de React y la limpieza de
 * ScrollTrigger (un `removeChild`/`NotFoundError` sobre un nodo que GSAP ya
 * movió) y resincroniza las animaciones.
 *
 * Importante: NO mata todas las ScrollTrigger. La versión anterior hacía
 * `getAll().forEach(kill(true))` ante cualquier error cuyo mensaje contuviera
 * "NotFoundError"/"removeChild" —errores que también lanzan recursos
 * bloqueados, extensiones o la reconciliación de React, muy frecuentes en
 * Brave con los Shields activos—. Un solo error ajeno dejaba la página sin
 * ninguna animación de scroll hasta recargar. Ahora solo refrescamos, y solo
 * cuando el error apunta de verdad a GSAP.
 */
function isGsapRelatedError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }
  const message = String((error as { message?: unknown }).message ?? '')
  const stack = String((error as { stack?: unknown }).stack ?? '')
  const name = String((error as { name?: unknown }).name ?? '')
  const haystack = `${message}\n${stack}`.toLowerCase()

  // Señal directa: el error nombra a GSAP o ScrollTrigger.
  if (haystack.includes('gsap') || haystack.includes('scrolltrigger')) {
    return true
  }

  // Señal indirecta: la carrera de desmontaje (removeChild / NotFoundError).
  // Solo cuenta si la traza apunta a GSAP; de lo contrario es un error de DOM
  // cualquiera y no debe tocar las animaciones.
  const isDomRace =
    name === 'NotFoundError' ||
    message.includes('removeChild') ||
    message.includes('NotFoundError')
  return isDomRace && (haystack.includes('gsap') || haystack.includes('scrolltrigger'))
}

/** Resincroniza ScrollTrigger sin destruir las animaciones existentes. */
function softRefresh() {
  try {
    ScrollTrigger.refresh()
  } catch (refreshError) {
    console.warn('Error during ScrollTrigger refresh:', refreshError)
  }
}

export function GlobalErrorHandler() {
  useEffect(() => {
    const handleUnhandledError = (event: ErrorEvent) => {
      if (isGsapRelatedError(event.error)) {
        console.warn('GSAP-related error detected, refreshing ScrollTrigger:', event.error?.message)
        softRefresh()
        event.preventDefault()
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isGsapRelatedError(event.reason)) {
        console.warn('GSAP-related rejection detected, refreshing ScrollTrigger:', event.reason?.message)
        softRefresh()
        event.preventDefault()
      }
    }

    window.addEventListener('error', handleUnhandledError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleUnhandledError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  // Este componente no renderiza nada
  return null
}

export default GlobalErrorHandler
