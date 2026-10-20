"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * Scroll suave (Lenis) SOLO en móvil/táctil. En escritorio manda el snap de
 * GSAP (HomeScrollSnap), que controla el scroll a mano y se pelearía con Lenis,
 * así que ahí no se activa.
 *
 * Integración con GSAP: cada scroll de Lenis actualiza ScrollTrigger y el raf
 * lo maneja el ticker de GSAP (una sola fuente de tiempo). Las zonas con gesto
 * propio (carruseles 3D, chat) llevan `data-lenis-prevent` para que Lenis no
 * les robe el toque.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    // Solo donde no hay snap de escritorio ni se pidió menos movimiento.
    const esMovil = window.matchMedia("(max-width: 1023px)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!esMovil || reduce) {
      return
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      // Que respete el gesto nativo donde haya scroll propio o drag.
      prevent: (node) => node.hasAttribute("data-lenis-prevent") || node.closest("[data-scroll-inside]") !== null,
    })

    lenis.on("scroll", ScrollTrigger.update)

    const onRaf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onRaf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onRaf)
      lenis.destroy()
    }
  }, [])

  return null
}
