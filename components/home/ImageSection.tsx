"use client"

import { motion } from "framer-motion"
import V1tr0Logo3D from "../3d/V1tr0Logo3D"

export default function ImageSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 lg:py-40 mb-20 md:mb-32 lg:mb-40" style={{height: '100vh', minHeight: '700px'}}>
      {/* Fondo transparente con patrón de grid */}
      <div className="absolute inset-0 bg-grid-pattern" style={{height: '400%', top: '-150%', opacity: '0.05'}}></div>
      
      <div className="max-w-7xl mx-auto relative z-10 h-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-full">
          <V1tr0Logo3D />
        </div>
      </div>
    </section>
  )
}