'use client'

import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface ConsultationAndDemosSectionProps {
  setIsUnifiedModalOpen: (isOpen: boolean) => void
}

export default function ConsultationAndDemosSection({ setIsUnifiedModalOpen }: ConsultationAndDemosSectionProps) {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Título Principal */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-textPrimary mb-6">
            ¿Listo para transformar tu negocio?
          </h2>
          <p className="text-textMuted text-lg mb-8 max-w-2xl mx-auto">
            Solicita una consulta personalizada y descubre cómo podemos ayudarte a alcanzar tus objetivos.
          </p>
        </div>

        {/* Grid de Demos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Demo Landing Page */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative bg-[#02505931] backdrop-blur-sm rounded-3xl border border-[#08A696]/20 p-6 transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:scale-105 flex flex-col min-h-[200px]"
          >
            {/* Efecto de respiración */}
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-3xl"
            />
            
            {/* Pulso de luz en los bordes */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 rounded-3xl border-2 border-[#26FFDF]/30 animate-pulse" />
              <motion.div
                className="absolute inset-0 rounded-3xl"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(38, 255, 223, 0)",
                    "0 0 0 4px rgba(38, 255, 223, 0.1)",
                    "0 0 0 0 rgba(38, 255, 223, 0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            
            {/* Partículas flotantes */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-[#26FFDF] rounded-full"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${30 + i * 20}%`
                  }}
                  animate={{
                    y: [-10, -20, -10],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                />
              ))}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-[#08A696]/5 to-[#26FFDF]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Contenido centrado */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center">
              <motion.div 
                 className="w-20 h-24 rounded-xl flex items-center justify-center mb-4 overflow-hidden"
                 whileHover={{ rotate: 360 }}
                 transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <Image
                    src="/imagenes/home/negocios/landing.png" 
                    alt="Landing Page" 
                    width={80} 
                    height={96} 
                    className="w-full h-full object-cover"
                  />
              </motion.div>
              <h3 className="text-[#26FFDF] font-semibold text-lg mb-2">Landing Page</h3>
              <p className="text-[#26FFDF]/70 text-sm mb-4">Demo profesional para captar leads</p>
              
              {/* Precio/GRATIS en la parte inferior */}
              <motion.div 
                className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-transparent bg-clip-text font-bold relative overflow-hidden"
                whileHover={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ backgroundSize: "200% 100%" }}
              >
                DEMO GRATIS
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Demo E-commerce */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative bg-[#02505931] backdrop-blur-sm rounded-3xl border border-[#08A696]/20 p-6 transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:scale-105 flex flex-col min-h-[200px]"
          >
            {/* Efecto de respiración */}
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-3xl"
            />
            
            {/* Pulso de luz en los bordes */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 rounded-3xl border-2 border-[#26FFDF]/30 animate-pulse" />
              <motion.div
                className="absolute inset-0 rounded-3xl"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(38, 255, 223, 0)",
                    "0 0 0 4px rgba(38, 255, 223, 0.1)",
                    "0 0 0 0 rgba(38, 255, 223, 0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
            </div>
            
            {/* Partículas flotantes */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-[#26FFDF] rounded-full"
                  style={{
                    left: `${25 + i * 25}%`,
                    top: `${40 + i * 15}%`
                  }}
                  animate={{
                    y: [-10, -20, -10],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 3.5 + i,
                    repeat: Infinity,
                    delay: i * 0.7
                  }}
                />
              ))}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-[#08A696]/5 to-[#26FFDF]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Contenido centrado */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center">
              <motion.div 
                 className="w-20 h-24 rounded-xl flex items-center justify-center mb-4 overflow-hidden"
                 whileHover={{ rotate: 360 }}
                 transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <Image
                    src="/imagenes/home/negocios/e-comerce.png" 
                    alt="E-commerce" 
                    width={80} 
                    height={96} 
                    className="w-full h-full object-cover"
                  />
              </motion.div>
              <h3 className="text-[#26FFDF] font-semibold text-lg mb-2">E-commerce</h3>
              <p className="text-[#26FFDF]/70 text-sm mb-4">Tienda online completa</p>
              
              {/* Precio/GRATIS en la parte inferior */}
              <motion.div 
                className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-transparent bg-clip-text font-bold relative overflow-hidden"
                whileHover={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ backgroundSize: "200% 100%" }}
              >
                DEMO GRATIS
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.3 }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Demo Portafolio */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group relative bg-[#02505931] backdrop-blur-sm rounded-3xl border border-[#08A696]/20 p-6 transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:scale-105 flex flex-col min-h-[200px]"
          >
            {/* Efecto de respiración */}
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-3xl"
            />
            
            {/* Pulso de luz en los bordes */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 rounded-3xl border-2 border-[#26FFDF]/30 animate-pulse" />
              <motion.div
                className="absolute inset-0 rounded-3xl"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(38, 255, 223, 0)",
                    "0 0 0 4px rgba(38, 255, 223, 0.1)",
                    "0 0 0 0 rgba(38, 255, 223, 0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              />
            </div>
            
            {/* Partículas flotantes */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-[#26FFDF] rounded-full"
                  style={{
                    left: `${30 + i * 20}%`,
                    top: `${35 + i * 25}%`
                  }}
                  animate={{
                    y: [-10, -20, -10],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    delay: i * 0.9
                  }}
                />
              ))}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-[#08A696]/5 to-[#26FFDF]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Contenido centrado */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center">
              <motion.div 
                 className="w-20 h-24 rounded-xl flex items-center justify-center mb-4 overflow-hidden"
                 whileHover={{ rotate: 360 }}
                 transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <Image
                    src="/imagenes/home/negocios/portafolio.png" 
                    alt="Portafolio" 
                    width={80} 
                    height={96} 
                    className="w-full h-full object-cover"
                  />
              </motion.div>
              <h3 className="text-[#26FFDF] font-semibold text-lg mb-2">Portafolio</h3>
              <p className="text-[#26FFDF]/70 text-sm mb-4">Muestra tu trabajo profesional</p>
              
              {/* Precio/GRATIS en la parte inferior */}
              <motion.div 
                className="bg-gradient-to-r from-[#08A696] to-[#26FFDF] text-transparent bg-clip-text font-bold relative overflow-hidden"
                whileHover={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ backgroundSize: "200% 100%" }}
              >
                DEMO GRATIS
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.6 }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Demo Personalizada */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="group relative bg-[#02505931] backdrop-blur-sm rounded-3xl border border-[#08A696]/20 p-6 transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] hover:scale-105 flex flex-col min-h-[200px]"
          >
            {/* Efecto de respiración */}
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-3xl"
            />
            
            {/* Pulso de luz en los bordes */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 rounded-3xl border-2 border-[#26FFDF]/30 animate-pulse" />
              <motion.div
                className="absolute inset-0 rounded-3xl"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(38, 255, 223, 0)",
                    "0 0 0 4px rgba(38, 255, 223, 0.1)",
                    "0 0 0 0 rgba(38, 255, 223, 0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
              />
            </div>
            
            {/* Partículas flotantes */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-[#26FFDF] rounded-full"
                  style={{
                    left: `${15 + i * 25}%`,
                    top: `${25 + i * 20}%`
                  }}
                  animate={{
                    y: [-10, -20, -10],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 4.5 + i,
                    repeat: Infinity,
                    delay: i * 0.4
                  }}
                />
              ))}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-[#08A696]/5 to-[#26FFDF]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Contenido centrado */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center">
              <motion.div 
                 className="w-20 h-24 rounded-xl flex items-center justify-center mb-4 overflow-hidden"
                 whileHover={{ rotate: 360 }}
                 transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <Image
                    src="/imagenes/home/negocios/personalizada.png" 
                    alt="Personalizada" 
                    width={80} 
                    height={96} 
                    className="w-full h-full object-cover"
                  />
              </motion.div>
              <h3 className="text-[#26FFDF] font-semibold text-lg mb-2">Personalizada</h3>
              <p className="text-[#26FFDF]/70 text-sm mb-4">Demo adaptada a tu negocio</p>
              
              {/* Precio en la parte inferior */}
              <motion.div 
                className="text-[#26FFDF] font-bold relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                $150,000 COP
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#26FFDF]/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 2 }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Botones Principales */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setIsUnifiedModalOpen(true)}
              className="group relative bg-[#02505931] backdrop-blur-sm rounded-2xl border border-[#08A696]/20 transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] inline-flex items-center px-8 py-4 text-lg font-semibold hover:scale-105 shadow-[0_0_20px_rgba(8,166,150,0.2)] hover:shadow-[0_0_30px_rgba(8,166,150,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#08A696]/10 to-[#26FFDF]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 text-[#26FFDF] transition-colors duration-300">Solicita una consulta</span>
              <ArrowRightIcon className="relative z-10 ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 text-[#26FFDF]" />
            </button>
            
            <button
              onClick={() => window.location.href = '/agendar-reunion'}
              className="group relative bg-[#02505931] backdrop-blur-sm rounded-2xl border border-[#26FFDF]/20 transition-all duration-300 hover:border-[#26FFDF] hover:bg-[#02505950] inline-flex items-center px-8 py-4 text-lg font-semibold hover:scale-105 shadow-[0_0_20px_rgba(38,255,223,0.2)] hover:shadow-[0_0_30px_rgba(38,255,223,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#26FFDF]/10 to-[#08A696]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 text-[#26FFDF] transition-colors duration-300">Agendar Reunión</span>
              <svg className="relative z-10 ml-3 w-5 h-5 transition-transform duration-300 group-hover:scale-110 text-[#26FFDF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          
          <p className="text-[#26FFDF]/60 text-sm mt-4">
            Respuesta en menos de 24 horas • Consulta gratuita • Reuniones disponibles L-V 2pm-6pm
          </p>
        </div>
      </div>
    </section>
  )
}