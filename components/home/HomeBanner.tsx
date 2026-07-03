"use client"

import dynamic from "next/dynamic"
import CardBanner from "@/components/home/shared/CardBanner"
import { useTheme } from "@/components/theme-provider"
import { motion } from "framer-motion"

// Rutas a los archivos SVG
const devSvg = "/imagenes/icons/svg/dev.svg"
const dataSvg = "/imagenes/icons/svg/data.svg"
const pmSvg  = "/imagenes/icons/svg/pm.svg"

// Carga dinámica sin SSR del modelo 3D
const VtrLogoPerfect3D = dynamic(
  () => import("@/components/3d/VtrLogoPerfect3D"),
  { ssr: false }
)

// ============================================================================
// VARIANTES DE ANIMACIÓN
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden:   { opacity: 0, y: 30 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

// ============================================================================
// COMPONENTE
// ============================================================================

export default function HomeBanner() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between items-center px-4 py-10 md:py-14">
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 z-0" />

      <motion.div
        className="w-full max-w-6xl mx-auto z-10 flex flex-col items-center text-center gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ---- Título + badge ---- */}
        <motion.div className="flex flex-col items-center gap-4" variants={itemVariants}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-5xl px-2 sm:px-4">
            <span className="block text-highlight mb-1">Transformamos tu potencial</span>
            <span className="block text-highlight">en innovación y resultados</span>
          </h1>

          {/* Badge */}
          <div className="relative group inline-flex items-center">
            <div
              className={`absolute -inset-0.5 bg-gradient-to-r ${
                isDark ? "from-[#08a6961e] to-[#26ffde23]" : "from-[#08a69630] to-[#08a69620]"
              } rounded-2xl blur opacity-40 group-hover:opacity-60 transition-all duration-300`}
            />
            <div
              className={`relative ${
                isDark ? "bg-[#02505931]" : "bg-[#e6f7f6]"
              } backdrop-blur-sm px-5 py-2 rounded-2xl border ${
                isDark ? "border-[#08A696]/30" : "border-[#08A696]/40"
              } text-xs sm:text-sm font-semibold transition-all duration-300 group-hover:border-[#08A696] ${
                isDark ? "group-hover:bg-[#02505950]" : "group-hover:bg-[#c5ebe7]"
              } shadow-lg group-hover:shadow-xl group-hover:shadow-[#08A696]/10 transform group-hover:scale-105`}
            >
              <span className={`${isDark ? "text-[#26FFDF]" : "text-[#08A696]"} transition-colors duration-300`}>
                V1TR0 Technologies
              </span>
              <span
                className={`ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1 ${
                  isDark ? "text-[#26FFDF]" : "text-[#08A696]"
                }`}
              >
                →
              </span>
            </div>
          </div>
        </motion.div>

        {/* ---- Modelo 3D centrado ---- */}
        <motion.div
          className="w-full flex justify-center items-center"
          style={{ height: "clamp(240px, 42vh, 480px)" }}
          variants={itemVariants}
        >
          <VtrLogoPerfect3D className="w-full h-full max-w-2xl mx-auto" />
        </motion.div>

        {/* ---- Tarjetas con servicios ---- */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full px-2 sm:px-4"
          variants={itemVariants}
        >
          <CardBanner icon={devSvg} title="Desarrollo de Software"    href="/servicios-referentes/new" />
          <CardBanner icon={dataSvg} title="Sistemas de Información"   href="/servicios-referentes/new" />
          <CardBanner icon={pmSvg}  title="Automatización de Tareas"  href="/servicios-referentes/pm"  />
        </motion.div>
      </motion.div>
    </section>
  )
}
