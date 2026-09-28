"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useRef, useState, type ComponentType } from "react"
import { motion, useAnimationControls } from "framer-motion"
import { ArrowLeft, ArrowRight, Plus } from "lucide-react"
import { servicesData } from "@/components/home/sections/ServicesTabSection"
import type { CarruselCurvoHandle, ProyectoCarrusel } from "@/components/home/sections/proyectos/CarruselCurvo"
import useSnapAnimations from "@/hooks/use-snap-animations"

/**
 * Prueba antes que catálogo: sitios de clientes publicados y en uso, en un
 * carrusel curvo que se arrastra (ver CarruselCurvo).
 *
 * Los datos salen de `servicesData` (los ejemplos con `href`), la misma fuente
 * de /servicios, así que un proyecto nuevo aparece aquí sin tocar este archivo
 * salvo para decidir si entra en la selección.
 */

const CarruselCurvo = dynamic(() => import("@/components/home/sections/proyectos/CarruselCurvo"), { ssr: false })

const SELECCION = ["Megudan", "Pet Gourmet", "Mister LYA", "Casa de Fiestas"]

const publicados = servicesData.flatMap((servicio) =>
  servicio.subcategories.flatMap((subcategoria) => subcategoria.examples.filter((ejemplo) => ejemplo.href)),
)

const proyectos: ProyectoCarrusel[] = SELECCION.flatMap((titulo) => {
  const p = publicados.find((publicado) => publicado.title === titulo)
  return p?.href ? [{ title: p.title, image: p.image, href: p.href }] : []
})

const botonRedondo =
  "relative flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-textPrimary transition-colors duration-300 hover:border-[#26FFDF]/50 hover:text-[#26FFDF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60"

/**
 * Botón redondo de control con respuesta al pulsarlo: se hunde, destella un
 * relleno teal y el ícono hace su gesto (la flecha avanza, el + gira). Se
 * dispara en el clic, así que también responde al teclado.
 */
function BotonControl({
  etiqueta,
  Icono,
  gesto,
  onClick,
  href,
}: {
  etiqueta: string
  Icono: ComponentType<{ className?: string }>
  gesto: { x?: number; rotate?: number }
  onClick?: () => void
  href?: string
}) {
  const boton = useAnimationControls()
  const destello = useAnimationControls()
  const icono = useAnimationControls()

  const pulsar = () => {
    void boton.start({ scale: [1, 0.86, 1], transition: { duration: 0.3, ease: "easeOut" } })
    void destello.start({ opacity: [0, 1, 0], transition: { duration: 0.55, ease: "easeOut" } })
    void icono.start({
      x: gesto.x ? [0, gesto.x, 0] : 0,
      rotate: gesto.rotate ? [0, gesto.rotate] : 0,
      transition: { duration: 0.35, ease: "easeOut" },
    })
    onClick?.()
  }

  const contenido = (
    <>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-1px] rounded-full border border-[#26FFDF]/80 bg-[#26FFDF]/25"
        initial={{ opacity: 0 }}
        animate={destello}
      />
      <motion.span animate={icono} className="relative flex">
        <Icono className="h-4 w-4" aria-hidden="true" />
      </motion.span>
    </>
  )

  return (
    <motion.span animate={boton} className="inline-flex rounded-full">
      {href ? (
        <Link href={href} aria-label={etiqueta} title={etiqueta} onClick={pulsar} className={botonRedondo}>
          {contenido}
        </Link>
      ) : (
        <button type="button" aria-label={etiqueta} onClick={pulsar} className={botonRedondo}>
          {contenido}
        </button>
      )}
    </motion.span>
  )
}

export default function ProyectosEnProduccion() {
  const carrusel = useRef<CarruselCurvoHandle>(null)
  const [ingresando, setIngresando] = useState(false)

  useSnapAnimations({
    sections: [".proyectos-produccion-section"],
    duration: 0.8,
    enableCircularNavigation: false,
    singleAnimation: true,
  })

  return (
    <section className="proyectos-produccion-section relative min-h-[100dvh] w-full overflow-hidden">
      {/* El lienzo cubre toda la sección para que el piso llegue al borde inferior. */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.15 }}
      >
        <CarruselCurvo ref={carrusel} proyectos={proyectos} onIngreso={setIngresando} className="h-full w-full" />
      </motion.div>

      <motion.div
        className="absolute inset-x-0 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-10 px-4 md:bottom-12"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Se ocultan mientras se entra a un proyecto. */}
        <div
          className={`flex items-center justify-center gap-3 transition-opacity duration-300 ${
            ingresando ? "pointer-events-none opacity-0" : ""
          }`}
        >
        <BotonControl etiqueta="Proyecto anterior" Icono={ArrowLeft} gesto={{ x: -4 }} onClick={() => carrusel.current?.mover(1)} />
        <BotonControl etiqueta="Ver todos los servicios" Icono={Plus} gesto={{ rotate: 90 }} href="/servicios" />
        <BotonControl etiqueta="Proyecto siguiente" Icono={ArrowRight} gesto={{ x: 4 }} onClick={() => carrusel.current?.mover(-1)} />
        </div>
      </motion.div>

      <h2 className="sr-only">Proyectos en producción</h2>

      {/* Enlaces accesibles: el lienzo no es navegable por teclado ni lector. */}
      <ul className="sr-only">
        {proyectos.map((p) => (
          <li key={p.title}>
            <a href={p.href} target="_blank" rel="noopener noreferrer">
              {p.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
