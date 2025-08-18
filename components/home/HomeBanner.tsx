"use client"
import CardBanner from "@/components/home/shared/CardBanner"
import { useTheme } from "@/components/theme-provider"
import { motion } from "framer-motion"

// Rutas a los archivos SVG
const devSvg = "/dev.svg"
const dataSvg = "/data.svg"
const pmSvg = "/pm.svg"

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
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center items-center px-4 py-8 md:py-0">
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 z-0" />

      <motion.div 
        className="max-w-6xl mx-auto z-10 flex flex-col items-center text-center w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Título principal */}
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 leading-tight max-w-5xl px-2 sm:px-4"
          variants={itemVariants}
        >
          <span className="block text-textPrimary mb-2 sm:mb-1">Transformamos tu potencial</span>
          <span className={`block ${isDark ? "text-highlight" : "text-primary"}`}>en innovación y resultados</span>
        </motion.h1>

        {/* Badge */}
        <motion.div 
          className="relative group mb-8 md:mb-10 inline-flex items-center mx-2"
          variants={itemVariants}
        >
          {/* Gradiente de fondo con blur */}
          <div className={`absolute -inset-0.5 bg-gradient-to-r ${isDark ? "from-[#08a6961e] to-[#26ffde23]" : "from-[#08a69630] to-[#08a69620]"} rounded-2xl blur opacity-40 group-hover:opacity-60 transition-all duration-300`} />
          
          {/* Badge principal */}
          <div className={`relative ${isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm"} px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border ${isDark ? "border-[#08A696]/30" : "border-[#08A696]/40"} text-xs sm:text-sm font-semibold transition-all duration-300 group-hover:border-[#08A696] ${isDark ? "group-hover:bg-[#02505950]" : "group-hover:bg-[#c5ebe7]"} shadow-lg group-hover:shadow-xl group-hover:shadow-[#08A696]/10 transform group-hover:scale-105`}>
            <span className={`${isDark ? "text-[#26FFDF]" : "text-[#08A696]"} transition-colors duration-300`}>
              V1TR0 Technologies
            </span>
            <span className={`ml-2 sm:ml-3 inline-block transition-transform duration-300 group-hover:translate-x-1 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
              →
            </span>
          </div>
        </motion.div>



        {/* Tarjetas con servicios */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full px-2 sm:px-4"
          variants={itemVariants}
        >
          <CardBanner icon={devSvg} title="Desarrollo de Software" href="/services/dev" />
          <CardBanner icon={dataSvg} title="Sistemas de Información" href="/services/new" />
          <CardBanner icon={pmSvg} title="Automatización de Tareas" href="/services/pm" />
        </motion.div>
      </motion.div>
    </section>
  )
}
