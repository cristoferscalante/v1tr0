"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import type { AmbientScore } from "@/lib/audio/ambient-score"

type ToneLib = typeof import("tone")

/**
 * Preferencia de sonido que sobrevive entre visitas. Sin valor = encendido.
 * La comparten la música y los efectos puntuales (lib/audio/bleeps): apagar
 * el sonido del sitio apaga las dos cosas.
 */
export const SOUND_STORAGE_KEY = "v1tr0-sound"
const STORAGE_KEY = SOUND_STORAGE_KEY

/**
 * Marca los controles que deciden el sonido por su cuenta (el botón de
 * música, "Entrar sin sonido"): su clic no cuenta como primera interacción.
 */
export const SOUND_CONTROL_ATTR = "data-sound-control"

type SoundStatus = "off" | "loading" | "on"

interface SoundContextValue {
  status: SoundStatus
  /** Enciende la música. Debe llamarse desde un gesto del usuario (clic, tecla). */
  enable: () => void
  disable: () => void
  toggle: () => void
  /** Descarga el motor de audio por adelantado, sin sonar. */
  preload: () => void
}

const SoundContext = createContext<SoundContextValue | null>(null)

const readPreference = () => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

const writePreference = (value: "on" | "off") => {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Sin almacenamiento la preferencia dura solo esta visita
  }
}

const loadEngine = () => import("@/lib/audio/ambient-score")

/** Precarga en reposo, para no competir con la carga inicial de la página. */
const whenIdle = (callback: () => void) => {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout: 4000 })
    return () => window.cancelIdleCallback(id)
  }
  const id = setTimeout(callback, 2000)
  return () => clearTimeout(id)
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SoundStatus>("off")
  const scoreRef = useRef<AmbientScore | null>(null)
  const wantedRef = useRef(false)

  const toneRef = useRef<ToneLib | null>(null)
  const startingRef = useRef<Promise<void> | null>(null)

  const loadTone = useCallback(async () => (toneRef.current ??= await import("tone")), [])

  const enable = useCallback(() => {
    wantedRef.current = true
    writePreference("on")
    // Sin ningún await antes: con Tone ya precargado, el audio se desbloquea
    // aquí mismo, dentro del gesto, que es lo que exige el navegador.
    void toneRef.current?.start()
    if (scoreRef.current) {
      scoreRef.current.play()
      setStatus("on")
      return
    }
    setStatus("loading")
    startingRef.current ??= (async () => {
      const Tone = await loadTone()
      await Tone.start()
      const { createAmbientScore } = await loadEngine()
      scoreRef.current = await createAmbientScore()
    })()
    startingRef.current
      .then(() => {
        // Si lo apagaron mientras cargaba, no arranca
        if (wantedRef.current) {
          scoreRef.current?.play()
          setStatus("on")
        } else {
          setStatus("off")
        }
      })
      .catch(() => {
        startingRef.current = null
        wantedRef.current = false
        setStatus("off")
      })
  }, [loadTone])

  const disable = useCallback(() => {
    wantedRef.current = false
    writePreference("off")
    scoreRef.current?.pause()
    setStatus("off")
  }, [])

  const toggle = useCallback(() => (wantedRef.current ? disable() : enable()), [enable, disable])

  const preload = useCallback(() => {
    // La precarga es una optimización: si un chunk no llega (red, o el dev
    // server recompilando), no debe romper la página. `enable` lo reintenta,
    // porque webpack vuelve a pedir un chunk que falló en el siguiente import().
    loadTone().catch(() => undefined)
    loadEngine().catch(() => undefined)
  }, [loadTone])

  // Encendida por defecto: el navegador no deja sonar sin un gesto, así que
  // arranca con la primera interacción, salvo que la hayan apagado antes.
  useEffect(() => {
    if (readPreference() === "off") {
      return
    }
    const cancelPreload = whenIdle(preload)
    const events = ["pointerdown", "keydown", "touchend"] as const
    const detach = () => events.forEach((event) => window.removeEventListener(event, onFirstInteraction, true))
    function onFirstInteraction(event: Event) {
      const target = event.target as Element | null
      if (target?.closest?.(`[${SOUND_CONTROL_ATTR}]`)) {
        return
      }
      detach()
      // Pudieron apagarla desde un control antes de esta interacción
      if (!wantedRef.current && readPreference() !== "off") {
        enable()
      }
    }
    events.forEach((event) => window.addEventListener(event, onFirstInteraction, true))
    return () => {
      cancelPreload()
      detach()
    }
  }, [enable, preload])

  // Pestaña oculta = silencio; al volver sigue donde iba
  useEffect(() => {
    const onVisibility = () => {
      if (!wantedRef.current || !scoreRef.current) {
        return
      }
      if (document.hidden) {
        scoreRef.current.pause()
      } else {
        scoreRef.current.play()
      }
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [])

  useEffect(() => () => scoreRef.current?.dispose(), [])

  const value = useMemo(() => ({ status, enable, disable, toggle, preload }), [status, enable, disable, toggle, preload])

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSound() {
  const context = useContext(SoundContext)
  if (!context) {
    throw new Error("useSound debe usarse dentro de <SoundProvider>")
  }
  return context
}
