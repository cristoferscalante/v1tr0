"use client"
import HeroNavCards from "@/components/home/sections/banner/HeroNavCards"
import { useTheme } from "@/components/theme-provider"
import { motion } from "framer-motion"
import TextType from "@/components/home/hero/TextType"
import Link from "next/link"

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
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden flex flex-col justify-center items-center px-4 py-8 md:py-0">
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 z-0" />

      <motion.div 
        className="max-w-5xl mx-auto z-10 flex flex-col items-center text-center w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero animado con efecto typewriter y color personalizado en la segunda línea */}
        <motion.div
          className="mb-16 md:mb-20 max-w-5xl px-2 sm:px-4"
          variants={itemVariants}
        >
          <TextType
            text={[
              "Transformamos tu potencial\nen innovación y resultados",
              "Las estructuras basadas en codigo\nno paran de crecer",
              "Tu futuro te lo dicen tus datos\nSe soberano de tu información",
              "Libera tu tiempo\nAutomatiza tus procesos, y tareas",
              "Inaugura tu tienda virtual\nvende tus productos a todos",
              "Tus clientes necesitan visitarte\n¡Vive digital!",
              "Sistemas de información\nGestiona y centraliza tus datos",
              "Portafolios interactivos\n¡Posiciona tu talento!",
              "Infraestructura web\nUnifica procesos, sistemas, y tareas",
              "Integra Inteligencia Artificial\ny potencia tus herramientas",
            ]}
            typingSpeed={60}
            pauseDuration={1500}
            deletingSpeed={10}
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-center min-h-[2.5em] ${isDark ? 'text-white' : 'text-[#08a696]'}`}
          />
        </motion.div>

        {/* Tarjetas de navegación: Servicios, Tienda y Blog */}
        <motion.div className="w-full" variants={itemVariants}>
          <HeroNavCards />
        </motion.div>
        {/* Badge */}
        <motion.div variants={itemVariants} className="mt-8 md:mt-10">
        <Link
          href="/about"
          aria-label="Ir a la página de V1TR0"
          className="relative group inline-flex items-center mx-2"
        >
          {/* Badge principal */}
          <div className={`relative ${isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm"} px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border ${isDark ? "border-[#08A696]/30" : "border-[#08A696]/40"} text-xs sm:text-sm font-semibold transition-all duration-300 group-hover:border-[#08A696] ${isDark ? "group-hover:bg-[#02505950]" : "group-hover:bg-[#c5ebe7]"} transform group-hover:scale-[1.03]`}>
            <span className={`${isDark ? "text-[#26FFDF]" : "text-[#08A696]"} transition-colors duration-300`}>
              V1TR0 Technologies
            </span>
            <span className={`ml-2 sm:ml-3 inline-block transition-transform duration-300 group-hover:translate-x-1 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
              →
            </span>
          </div>
        </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
