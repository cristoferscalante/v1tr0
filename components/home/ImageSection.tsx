"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function ImageSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 lg:py-40 mb-20 md:mb-32 lg:mb-40" style={{height: '100vh', minHeight: '700px'}}>
      {/* Fondo transparente con patrón de grid */}
      <div className="absolute inset-0 bg-grid-pattern" style={{height: '400%', top: '-150%', opacity: '0.05'}}></div>
      
      <div className="max-w-7xl mx-auto relative z-10 h-full px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center items-center h-full"
        >
          <Image
            alt="Gestora de proyectos con gráfico de red y visualización de datos, rodeada de elementos digitales en color turquesa"
            loading="lazy"
            width={600}
            height={600}
            decoding="async"
            data-nimg="1"
            className="w-full h-auto max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl object-cover transition-all duration-700 ease-in-out hover:scale-105"
            src="/service/proximamente_gestor.png"
            style={{ color: "transparent", cursor: "pointer", opacity: "0.9" }}
          />
        </motion.div>
      </div>
    </section>
  )
}