"use client"

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ExternalLink, Github, Code, Database, Zap } from 'lucide-react'
import { useTheme } from "@/components/theme-provider"
import useSnapAnimations from '@/hooks/use-snap-animations'
import { projectsData } from '@/data/projects'
import Image from 'next/image'

// Categorías con iconos
const categories = [
  { name: "Desarrollo de Software", icon: Code },
  { name: "Sistemas de Información", icon: Database },
  { name: "Automatización de Tareas", icon: Zap }
]

const PROJECTS_PER_PAGE = 6 // Grid 3x2

// Variantes de animación
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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
      duration: 0.5
    }
  }
}

export default function ProjectBankSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [activeCategoriesTags, setActiveCategoriesTags] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  // Configurar animaciones de entrada para esta sección
  useSnapAnimations({
    sections: ['.project-bank-section'],
    duration: 0.8,
    enableCircularNavigation: false,
    singleAnimation: true,
    onSnapComplete: () => {
      // Animation completed
    }
  })

  // Toggle category tag
  const toggleCategory = (categoryName: string) => {
    setActiveCategoriesTags(prev => {
      if (prev.includes(categoryName)) {
        return prev.filter(c => c !== categoryName)
      } else {
        return [...prev, categoryName]
      }
    })
    setCurrentPage(1)
  }

  // Filtrar proyectos por categorías activas
  const filteredProjects = activeCategoriesTags.length === 0 
    ? projectsData 
    : projectsData.filter(project => activeCategoriesTags.includes(project.category))

  // Paginación
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE
  const endIndex = startIndex + PROJECTS_PER_PAGE
  const currentProjects = filteredProjects.slice(startIndex, endIndex)

  // Cambiar página
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <section 
      ref={sectionRef} 
      className="project-bank-section relative min-h-screen w-full flex items-center justify-center py-12 px-4"
    >
      <motion.div 
        className="max-w-7xl mx-auto z-10 flex flex-col items-center w-full"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          variants={itemVariants}
        >
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#08a696]'}`}>
            Banco de Proyectos
          </h2>
          <p className={`text-sm md:text-base max-w-2xl mx-auto ${isDark ? 'text-[#a0a0a0]' : 'text-[#6b7280]'}`}>
            Descubre nuestro trabajo y soluciones tecnológicas desarrolladas
          </p>
        </motion.div>

        {/* Tags de categorías minimalistas */}
        <motion.div
          className="flex flex-wrap gap-2 justify-center mb-8"
          variants={itemVariants}
        >
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = activeCategoriesTags.includes(category.name)
            
            return (
              <motion.button
                key={category.name}
                onClick={() => toggleCategory(category.name)}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                  transition-all duration-300 border
                  ${isActive 
                    ? isDark 
                      ? 'bg-[#08A696] text-white border-[#08A696]' 
                      : 'bg-[#08A696] text-white border-[#08A696]'
                    : isDark
                      ? 'bg-transparent text-[#26FFDF] border-[#08A696]/30 hover:border-[#08A696] hover:bg-[#08A696]/10'
                      : 'bg-transparent text-[#08A696] border-[#08A696]/30 hover:border-[#08A696] hover:bg-[#08A696]/10'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{category.name}</span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Grid de proyectos 3x2 - Estilo CardBanner */}
        <motion.div 
          key={activeCategoriesTags.join('-')}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {currentProjects.map((project) => (
            <motion.div
              key={project.id}
              className="relative group w-full"
              variants={itemVariants}
            >
              {/* Gradiente de fondo con blur - igual que CardBanner */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${isDark ? "from-[#08a6961e] to-[#26ffde23]" : "from-[#08a69630] to-[#08a69620]"} rounded-xl blur opacity-30 group-hover:opacity-60 transition-all duration-300`}
              />
              
              {/* Card principal - igual que CardBanner */}
              <div
                className={`relative ${isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm"} p-4 rounded-xl border ${isDark ? "border-[#08A696]/20" : "border-[#08A696]/30"} flex flex-col transition-all duration-300 transform scale-95 group-hover:scale-98 group-hover:border-[#08A696] ${isDark ? "group-hover:bg-[#02505950]" : "group-hover:bg-[#c5ebe7]"} min-h-[200px] w-full h-full shadow-md group-hover:shadow-lg group-hover:shadow-[#08A696]/10`}
              >
                {/* Header con categoría y año */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${isDark ? "bg-[#08A696]/10 text-[#26FFDF]" : "bg-[#08A696]/10 text-[#08A696]"} transition-all duration-300 group-hover:bg-[#08A696]/20`}>
                    {project.subcategory}
                  </span>
                  <span className={`text-xs ${isDark ? "text-[#a0a0a0]" : "text-[#6b7280]"}`}>
                    {project.year}
                  </span>
                </div>
                
                {/* Video o Imagen del proyecto */}
                <div className="flex-shrink-0 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-105 overflow-hidden rounded-lg">
                  <div className={`relative w-full h-32 ${isDark ? "bg-[#08A696]/10" : "bg-[#08A696]/10"} group-hover:bg-[#08A696]/20 transition-all duration-300`}>
                    {project.video ? (
                      <video
                        src={project.video}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className={`text-4xl font-bold ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                          {project.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Título */}
                <h3 className={`${isDark ? "text-[#26FFDF]" : "text-[#08A696]"} font-semibold text-base mb-2 transition-all duration-300 transform-gpu line-clamp-1`}>
                  {project.title}
                </h3>
                
                {/* Descripción */}
                <p className={`text-xs mb-3 line-clamp-2 flex-1 ${isDark ? "text-[#a0a0a0]" : "text-[#6b7280]"}`}>
                  {project.description}
                </p>
                
                {/* Tecnologías */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.technologies.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className={`px-1.5 py-0.5 text-xs rounded-md ${isDark ? "bg-[#08A696]/5 text-[#26FFDF]/80" : "bg-[#08A696]/5 text-[#08A696]"} border ${isDark ? "border-[#08A696]/10" : "border-[#08A696]/10"}`}
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className={`px-1.5 py-0.5 text-xs ${isDark ? "text-[#a0a0a0]" : "text-[#6b7280]"}`}>
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
                
                {/* Botones de acción */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg ${isDark ? "bg-[#08A696]/10 hover:bg-[#08A696]/20 text-[#26FFDF]" : "bg-[#08A696]/10 hover:bg-[#08A696]/20 text-[#08A696]"} transition-all duration-300 text-xs font-medium`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Ver</span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg ${isDark ? "bg-[#08A696]/10 hover:bg-[#08A696]/20 text-[#26FFDF]" : "bg-[#08A696]/10 hover:bg-[#08A696]/20 text-[#08A696]"} transition-all duration-300 text-xs font-medium`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-3 h-3" />
                      <span>Code</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Paginación - Estilo Hero Badge */}
        {totalPages > 1 && (
          <motion.div
            className="flex items-center justify-center gap-1.5 flex-wrap"
            variants={itemVariants}
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative group inline-flex items-center disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 ${currentPage === 1 ? 'scale-90' : 'hover:scale-95'}`}
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${isDark ? "from-[#08a6961e] to-[#26ffde23]" : "from-[#08a69630] to-[#08a69620]"} rounded-lg blur opacity-30 group-hover:opacity-60 transition-all duration-300`} />
              <div className={`relative ${isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm"} p-1.5 rounded-lg border ${isDark ? "border-[#08A696]/20" : "border-[#08A696]/30"} transition-all duration-300 group-hover:border-[#08A696] ${isDark ? "group-hover:bg-[#02505950]" : "group-hover:bg-[#c5ebe7]"} shadow-md group-hover:shadow-lg`}>
                <ChevronLeft className={`w-4 h-4 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`} />
              </div>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`relative group inline-flex items-center ${currentPage === page ? 'scale-100' : 'scale-90 hover:scale-95'} transition-all duration-300`}
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${
                  currentPage === page 
                    ? isDark ? "from-[#08a696] to-[#26ffde]" : "from-[#08a696] to-[#08a696]"
                    : isDark ? "from-[#08a6961e] to-[#26ffde23]" : "from-[#08a69630] to-[#08a69620]"
                } rounded-lg blur ${
                  currentPage === page ? 'opacity-60' : 'opacity-30 group-hover:opacity-60'
                } transition-all duration-300`} />
                <div className={`relative ${
                  currentPage === page
                    ? isDark ? "bg-[#08A696]/20 border-[#08A696]" : "bg-[#c5ebe7] border-[#08A696]"
                    : isDark ? "bg-[#02505931] backdrop-blur-sm border-[#08A696]/20" : "bg-[#e6f7f6] backdrop-blur-sm border-[#08A696]/30"
                } px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                  currentPage === page ? '' : 'group-hover:border-[#08A696]'
                } ${
                  currentPage === page 
                    ? '' 
                    : isDark ? 'group-hover:bg-[#02505950]' : 'group-hover:bg-[#c5ebe7]'
                } shadow-md group-hover:shadow-lg`}>
                  <span className={`text-xs font-semibold ${
                    currentPage === page
                      ? isDark ? "text-[#26FFDF]" : "text-[#08A696]"
                      : isDark ? "text-[#26FFDF]" : "text-[#08A696]"
                  }`}>
                    {page}
                  </span>
                </div>
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative group inline-flex items-center disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 ${currentPage === totalPages ? 'scale-90' : 'hover:scale-95'}`}
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${isDark ? "from-[#08a6961e] to-[#26ffde23]" : "from-[#08a69630] to-[#08a69620]"} rounded-lg blur opacity-30 group-hover:opacity-60 transition-all duration-300`} />
              <div className={`relative ${isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm"} p-1.5 rounded-lg border ${isDark ? "border-[#08A696]/20" : "border-[#08A696]/30"} transition-all duration-300 group-hover:border-[#08A696] ${isDark ? "group-hover:bg-[#02505950]" : "group-hover:bg-[#c5ebe7]"} shadow-md group-hover:shadow-lg`}>
                <ChevronRight className={`w-4 h-4 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`} />
              </div>
            </button>
          </motion.div>
        )}

        {/* Mensaje si no hay proyectos */}
        {filteredProjects.length === 0 && (
          <motion.div 
            className="text-center py-8"
            variants={itemVariants}
          >
            <p className={`text-base ${isDark ? 'text-[#a0a0a0]' : 'text-[#6b7280]'}`}>
              No hay proyectos disponibles en esta categoría
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
