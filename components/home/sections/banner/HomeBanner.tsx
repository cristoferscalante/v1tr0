"use client"
import HeroNavCards from "@/components/home/sections/banner/HeroNavCards"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

// Variantes de animación
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
}

export default function HomeBanner() {

  return (
    <section
      className="relative min-h-[100svh] md:min-h-[100dvh] w-full overflow-hidden grid grid-rows-[var(--header-safe)_1fr] px-4 sm:px-6 pb-10 md:pb-12"
    >
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 z-0" />

      {/* Fila 1 del grid: espacio reservado para el header flotante. */}
      <div aria-hidden="true" className="row-start-1" />

      <motion.div
        className="row-start-2 max-w-5xl mx-auto z-10 flex flex-col items-center gap-6 sm:gap-8 text-center w-full min-h-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Tarjetas de navegación: Servicios, Tienda y Blog. Ocupan todo el
            alto que deja el botón; el texto dinámico vive en la sección 2. */}
        <motion.div className="w-full flex-1 min-h-0 flex flex-col pt-10 sm:pt-14" variants={itemVariants}>
          <HeroNavCards />
        </motion.div>
        {/* Escudo de V1TR0: lleva a /about y muestra "Sobre nosotros" debajo al pasar el cursor */}
        <motion.div variants={itemVariants}>
          <Link
            href="/about"
            aria-label="Sobre nosotros"
            className="relative group inline-flex flex-col items-center rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60"
          >
            <Image
              src="/imagenes/logos/escudo-logo.png"
              alt=""
              width={551}
              height={634}
              className="h-16 sm:h-20 w-auto transition-all duration-300 group-hover:scale-110"
            />
            <span
              role="tooltip"
              className="pointer-events-none absolute top-full mt-2 whitespace-nowrap rounded-full border border-[#08A696]/30 bg-[#02505980] backdrop-blur-sm px-3 py-1 text-xs font-semibold text-[#26FFDF] opacity-0 -translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0"
            >
              Sobre nosotros
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
