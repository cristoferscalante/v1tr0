"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import type { servicesData } from "@/components/home/sections/ServicesTabSection"
import PromoCarousel from "@/components/servicios/PromoCarousel"

type Service = (typeof servicesData)[number]

interface ServicioSnapSectionProps {
  service: Service
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

export default function ServicioSnapSection({ service }: ServicioSnapSectionProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <section
      id={service.id}
      className="relative min-h-screen w-full flex items-center justify-center px-4 py-16"
    >
      <motion.div
        className="max-w-6xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div className="text-center mb-10" variants={itemVariants}>
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {service.title}
          </h2>
        </motion.div>

        <motion.div variants={itemVariants}>
          <PromoCarousel isDark={isDark} size="lg" />
          <p className={`text-center text-xs font-semibold uppercase tracking-widest mt-4 opacity-30 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            Algunos diseños que hemos construido
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}
