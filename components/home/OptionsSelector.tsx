"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface OptionData {
  id: number
  title: string
  subtitle: string
  description: string
  features: string[]
  icon: React.ReactElement
  color: string
  gradient: string
  image: string
}

interface OptionsSelectorProps {
  setIsUnifiedModalOpen?: (isOpen: boolean) => void
}

const optionsData: OptionData[] = [
  {
    id: 1,
    title: "Landing Pages",
    subtitle: "Convierte visitantes en clientes",
    description: "Páginas de aterrizaje optimizadas para conversión con diseño atractivo y llamadas a la acción efectivas.",
    features: [
      "Diseño responsive y moderno",
      "Optimización para conversiones",
      "Integración con analytics",
      "Formularios de contacto avanzados"
    ],
    icon: <div className="w-6 h-6" />,
    color: "#08a696",
    gradient: "from-custom-3/30 via-custom-2/20 to-custom-4/30",
    image: "/imagenes/home/negocios/landing.png"
  },
  {
    id: 2,
    title: "E-commerce",
    subtitle: "Vende online sin límites",
    description: "Tiendas online completas con gestión de inventario, pagos seguros y experiencia de compra excepcional.",
    features: [
      "Catálogo de productos dinámico",
      "Pasarelas de pago integradas",
      "Panel de administración",
      "Sistema de inventario"
    ],
    icon: <div className="w-6 h-6" />,
    color: "#26ffdf",
    gradient: "from-custom-4/30 via-custom-3/20 to-custom-2/30",
    image: "/imagenes/home/negocios/e-comerce.png"
  },
  {
    id: 3,
    title: "Portfolio",
    subtitle: "Muestra tu mejor trabajo",
    description: "Portafolios profesionales que destacan tu trabajo y atraen a clientes potenciales con diseño impactante.",
    features: [
      "Galería de proyectos interactiva",
      "Secciones personalizables",
      "Optimización SEO",
      "Formulario de contacto"
    ],
    icon: <div className="w-6 h-6" />,
    color: "#1e7d7d",
    gradient: "from-custom-2/30 via-custom-4/20 to-custom-3/30",
    image: "/imagenes/home/negocios/portafolio.png"
  },
  {
    id: 4,
    title: "Personalizada",
    subtitle: "Tu visión hecha realidad",
    description: "Soluciones web completamente personalizadas adaptadas a tus necesidades específicas y objetivos únicos.",
    features: [
      "Desarrollo a medida",
      "Funcionalidades específicas",
      "Integración con sistemas",
      "Soporte técnico completo"
    ],
    icon: <div className="w-6 h-6" />,
    color: "#025159",
    gradient: "from-custom-1/30 via-custom-3/20 to-custom-4/30",
    image: "/imagenes/home/negocios/personalizada.png"
  }
]

export default function OptionsSelector({ setIsUnifiedModalOpen }: OptionsSelectorProps = {}) {
  const [activeOption, setActiveOptionState] = useState<number>(0)

  const handleOptionClick = (id: number) => {
    setActiveOptionState(activeOption === id ? 0 : id)
  }

  return (
    <section className="w-full py-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
            ¿Listo para transformar tu negocio?
          </h2>
          <p className="text-lg text-textMuted max-w-2xl mx-auto">
            Elige la solución perfecta para llevar tu proyecto al siguiente nivel
          </p>
        </motion.div>

        {/* Desktop Layout - Horizontal Accordion */}
        <div className="hidden lg:block">
          <div className="flex h-[280px] gap-4 rounded-2xl overflow-hidden">
            {optionsData.map((option) => (
              <motion.div
                key={option.id}
                className={`relative cursor-pointer transition-all duration-700 ease-out rounded-xl overflow-hidden ${
                  activeOption === option.id ? 'flex-[3]' : 'flex-1'
                }`}
                onClick={() => handleOptionClick(option.id)}
                whileHover={{ 
                  borderColor: `${option.color}80`,
                  boxShadow: `0 0 20px ${option.color}30`
                }}
                style={{
                  border: `1px solid ${option.color}60`,
                  backgroundColor: `${option.color}10`
                }}
              >
                {/* Full Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${option.image})`,
                  }}
                />

                {/* Blur Overlay - Solo cuando está expandida */}
                {activeOption === option.id && (
                  <div className="absolute inset-0 backdrop-blur-sm bg-black/40 transition-all duration-700" />
                )}

                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                  {/* Icon - Siempre visible, tamaño adaptativo */}
                  <motion.div 
                    className={`${activeOption !== option.id ? 'flex-1 flex items-center justify-center' : 'flex items-center gap-4 mb-6'}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      transition: { duration: 0.4, ease: "easeOut" }
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {option.icon}
                    {/* Title - Solo visible cuando está activa */}
                    {activeOption === option.id && (
                      <div>
                        <h3 className="text-xl font-bold text-white drop-shadow-lg">
                          {option.title}
                        </h3>
                      </div>
                    )}
                  </motion.div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {activeOption === option.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="flex-1 flex flex-col justify-between"
                      >
                        <div className="px-2">
                          <p className="text-white mb-4 leading-relaxed text-sm drop-shadow-lg">
                            {option.description}
                          </p>
                          
                          <div className="space-y-2 mb-6">
                            {option.features.map((feature, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-3"
                              >
                                <div
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: option.color }}
                                />
                                <span className="text-xs text-white drop-shadow-lg">
                                  {feature}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Layout - Vertical Accordion */}
        <div className="lg:hidden space-y-4">
          {optionsData.map((option) => (
            <motion.div
              key={option.id}
              className="rounded-xl overflow-hidden border relative"
              style={{
                backgroundColor: `${option.color}10`,
                borderColor: `${option.color}60`
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {/* Full Background Image for Mobile */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${option.image})`,
                }}
              />

              {/* Blur Overlay - Solo cuando está expandida */}
              {activeOption === option.id && (
                <div className="absolute inset-0 backdrop-blur-sm bg-black/40 transition-all duration-700" />
              )}
              {/* Header - Always Visible */}
              <div
                className="p-5 cursor-pointer relative z-10"
                onClick={() => handleOptionClick(option.id)}
              >
                <div className="flex items-center justify-between">
                  {/* Solo mostrar título e icono cuando está expandida en móvil */}
                  {activeOption === option.id && (
                    <motion.div 
                      className="flex items-center gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {option.icon}
                      <div>
                        <h3 className="text-lg font-bold text-white drop-shadow-lg">
                          {option.title}
                        </h3>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Mostrar solo el icono cuando está colapsada - centrado */}
                  {activeOption !== option.id && (
                    <motion.div 
                      className="flex items-center justify-center flex-1"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {option.icon}
                    </motion.div>
                  )}
                  
                  <motion.div
                    animate={{ rotate: activeOption === option.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight
                      className="w-5 h-5 text-textMuted transform rotate-90"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {activeOption === option.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 border-t border-custom-2/20 relative z-10">
                      <p className="text-white mb-4 leading-relaxed text-sm drop-shadow-lg">
                        {option.description}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                        {option.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3"
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: option.color }}
                            />
                            <span className="text-xs text-white drop-shadow-lg">
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        {/* Botones independientes fuera del acordeón */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={() => {
              // Lógica para abrir modal de consulta
              if (setIsUnifiedModalOpen) {
                setIsUnifiedModalOpen(true)
              }
            }}
            className="w-full sm:flex-1 bg-white/90 dark:bg-[#02505931] backdrop-blur-sm border border-[#08A696]/60 dark:border-[#08A696]/30 rounded-2xl px-6 py-3 font-semibold transition-all duration-300 hover:bg-[#08A696]/10 dark:hover:bg-background/20 hover:border-[#08A696] text-[#08A696] dark:text-[#26FFDF] flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Solicitar consulta</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            onClick={() => {
              // Lógica para abrir modal de agendar reunión
              window.open('/agendar-reunion', '_blank')
            }}
            className="w-full sm:flex-1 bg-white/90 dark:bg-[#02505931] backdrop-blur-sm border border-[#08A696]/60 dark:border-[#08A696]/30 rounded-2xl px-6 py-3 font-semibold transition-all duration-300 hover:bg-[#08A696]/10 dark:hover:bg-background/20 hover:border-[#08A696] text-[#08A696] dark:text-[#26FFDF] flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Agendar Reunión</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}