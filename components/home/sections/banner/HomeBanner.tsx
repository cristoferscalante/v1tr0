"use client"
import HeroNavCards from "@/components/home/sections/banner/HeroNavCards"
import { motion } from "framer-motion"

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
    // pb amplio: los botones flotantes (WhatsApp, sonido) viven en las esquinas
    // de abajo y las tarjetas no deben quedar detrás de ellos
    <section
      className="relative min-h-[100svh] md:min-h-[100dvh] w-full overflow-hidden grid grid-rows-[var(--header-safe)_1fr] px-4 sm:px-6 pb-24 md:pb-28"
    >
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 z-0" />

      {/* Fila 1 del grid: espacio reservado para el header flotante. */}
      <div aria-hidden="true" className="row-start-1" />

      <motion.div
        className="row-start-2 max-w-7xl 2xl:max-w-[88rem] mx-auto z-10 flex flex-col items-center justify-center text-center w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Tarjetas de navegación: Servicios, Tienda y Blog. Toman su alto del
            contenido y se centran; el texto dinámico vive en la sección 2. */}
        <motion.div className="w-full pt-4 sm:pt-6" variants={itemVariants}>
          <HeroNavCards />
        </motion.div>
      </motion.div>
    </section>
  )
}
