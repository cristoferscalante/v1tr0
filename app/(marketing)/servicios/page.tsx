"use client"

import { useEffect } from "react"
import BackgroundAnimation from "@/components/home/animations/BackgroundAnimation"
import ServiciosIntro from "@/components/servicios/scroll/ServiciosIntro"
import ServiciosShowcase from "@/components/servicios/scroll/ServiciosShowcase"
import ServiciosChapters from "@/components/servicios/scroll/ServiciosChapters"
import ServiciosAnatomia from "@/components/servicios/scroll/ServiciosAnatomia"
import ServiciosCta from "@/components/servicios/scroll/ServiciosCta"

/**
 * /servicios como un recorrido guiado por el scroll (GSAP ScrollTrigger):
 * quiénes somos, proyectos en producción, un capítulo por línea de
 * desarrollo, la anatomía por capas y cierre. Sin scroll-snap: choca con las secciones fijadas de GSAP.
 */
export default function ServiciosPage() {
  // Barra de scroll sobria solo mientras esta página está montada
  useEffect(() => {
    const root = document.documentElement
    root.classList.add("servicios-scroll")
    return () => root.classList.remove("servicios-scroll")
  }, [])

  return (
    <div className="text-textPrimary overflow-x-clip">
      {/* Lluvia binaria del apartado V1TR0: se ve en la intro, que no tiene
          fondo propio; el resto de secciones la tapan con el suyo. */}
      <BackgroundAnimation density={0.3} intensity={0.7} />
      <ServiciosIntro />
      <ServiciosShowcase />
      <ServiciosChapters />
      <ServiciosAnatomia />
      <ServiciosCta />
    </div>
  )
}
