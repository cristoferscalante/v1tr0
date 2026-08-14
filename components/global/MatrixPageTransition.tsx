"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"

// Una sola pasada de símbolos que cruza la pantalla. No tapa la página:
// es una lluvia translúcida que entra, pasa y se va.
const SWEEP_MS = 1000

const GLYPHS = "01"

/**
 * Lluvia de unos y ceros sobre canvas transparente: en vez de limpiar el
 * fondo, se borra con `destination-out` para dejar estela sin pintar negro.
 */
function MatrixRain({ isDark }: { isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext("2d")
    if (!ctx) return undefined

    // Siempre de izquierda a derecha
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const fontSize = 18
    const step = fontSize * 1.15
    let lanes: number[] = []
    let width = 0
    let height = 0
    let speed = 0

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Una fila de símbolos por cada línea de alto
      const laneCount = Math.ceil(height / fontSize)
      // Arranque escalonado a la izquierda: la lluvia entra progresivamente
      lanes = Array.from({ length: laneCount }, () => -Math.random() * width)
      // Recorre pantalla y media durante la pasada
      speed = (width * 1.5) / (SWEEP_MS / 16.7)
    }

    resize()
    window.addEventListener("resize", resize)

    let frame = 0
    const draw = () => {
      // Estela sin fondo sólido: borramos parte del alfa acumulado
      ctx.globalCompositeOperation = "destination-out"
      ctx.fillStyle = "rgba(0, 0, 0, 0.12)"
      ctx.fillRect(0, 0, width, height)
      ctx.globalCompositeOperation = "source-over"
      ctx.font = `${fontSize}px monospace`

      // Mismos colores que el texto de la web: acento de marca y su versión apagada
      const head = isDark ? "#26FFDF" : "#08A696"
      const tail = isDark ? "rgba(38, 255, 223, 0.45)" : "rgba(8, 166, 150, 0.45)"

      for (let i = 0; i < lanes.length; i++) {
        const pos = lanes[i] ?? 0
        const lane = i * fontSize
        const headChar = GLYPHS[Math.floor(Math.random() * 2)] ?? "0"
        const tailChar = GLYPHS[Math.floor(Math.random() * 2)] ?? "1"

        // Cabeza en el acento de marca y un símbolo de cola más apagado
        ctx.fillStyle = head
        ctx.fillText(headChar, pos, lane)
        ctx.fillStyle = tail
        ctx.fillText(tailChar, pos - step, lane)

        lanes[i] = pos + speed * (0.75 + Math.random() * 0.5)
      }

      frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
    }
  }, [isDark])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />
}

export default function MatrixPageTransition() {
  // `sweep` es null salvo durante la pasada; el id la reinicia si el usuario
  // hace clic dos veces seguidas.
  const [sweep, setSweep] = useState<number | null>(null)
  const [prefersReduced, setPrefersReduced] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setPrefersReduced(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  // Arranca en el clic, antes de que Next resuelva la ruta
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as HTMLElement | null)?.closest?.("a")
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href || href.startsWith("#")) return
      if (anchor.target && anchor.target !== "_self") return
      if (anchor.hasAttribute("download")) return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname) return

      setSweep(Date.now())
    }

    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])

  if (prefersReduced) return null

  return (
    <AnimatePresence>
      {sweep !== null && (
        <motion.div
          key={sweep}
          className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: SWEEP_MS / 1000, ease: "linear", times: [0, 0.18, 0.72, 1] }}
          onAnimationComplete={() => setSweep(null)}
          aria-hidden
        >
          {/* Velo apenas perceptible: da contraste a los símbolos sin tapar la página */}
          <div className="absolute inset-0 bg-[#020a0c]/35" />
          <MatrixRain isDark={theme === "dark"} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
