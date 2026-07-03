"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ExternalLink, Github } from 'lucide-react'

interface Project {
  id: number
  title: string
  description: string
  category: string
  technologies: string[]
  image: string
  liveUrl?: string
  githubUrl?: string
  year: string
}

interface ProjectBankProps {
  isOpen: boolean
  onClose: () => void
  selectedCategory?: string
}

// Datos de ejemplo - Reemplazar con datos reales
const projectsData: Project[] = [
  {
    id: 1,
    title: "E-commerce Fashionista",
    description: "Plataforma de comercio electrónico para moda con sistema de recomendaciones AI",
    category: "E-commerce",
    technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    image: "/imagenes/proyectos/proyecto1.jpg",
    liveUrl: "https://ejemplo.com",
    githubUrl: "https://github.com",
    year: "2024"
  },
  {
    id: 2,
    title: "Portfolio Creativo",
    description: "Portfolio interactivo con animaciones 3D y transiciones fluidas",
    category: "Portfolio",
    technologies: ["React", "Three.js", "Framer Motion", "Tailwind"],
    image: "/imagenes/proyectos/proyecto2.jpg",
    liveUrl: "https://ejemplo.com",
    year: "2024"
  },
  {
    id: 3,
    title: "Landing SaaS",
    description: "Landing page para startup SaaS con optimización de conversión",
    category: "Landing Pages",
    technologies: ["Next.js", "TypeScript", "Analytics", "SEO"],
    image: "/imagenes/proyectos/proyecto3.jpg",
    liveUrl: "https://ejemplo.com",
    year: "2024"
  },
  {
    id: 4,
    title: "Dashboard Analytics",
    description: "Panel de analíticas en tiempo real con visualización de datos",
    category: "Personalizada",
    technologies: ["React", "D3.js", "WebSocket", "Node.js"],
    image: "/imagenes/proyectos/proyecto4.jpg",
    liveUrl: "https://ejemplo.com",
    year: "2024"
  },
  {
    id: 5,
    title: "Marketplace Digital",
    description: "Marketplace para productos digitales con sistema de pagos",
    category: "E-commerce",
    technologies: ["Next.js", "Prisma", "Stripe", "AWS"],
    image: "/imagenes/proyectos/proyecto5.jpg",
    liveUrl: "https://ejemplo.com",
    year: "2023"
  },
  {
    id: 6,
    title: "Blog Minimalista",
    description: "Blog personal con CMS headless y optimización SEO",
    category: "Portfolio",
    technologies: ["Next.js", "MDX", "Sanity", "Vercel"],
    image: "/imagenes/proyectos/proyecto6.jpg",
    liveUrl: "https://ejemplo.com",
    year: "2023"
  },
  {
    id: 7,
    title: "Landing Inmobiliaria",
    description: "Landing page para agencia inmobiliaria con tour virtual",
    category: "Landing Pages",
    technologies: ["React", "Three.js", "Maps API", "Firebase"],
    image: "/imagenes/proyectos/proyecto7.jpg",
    liveUrl: "https://ejemplo.com",
    year: "2023"
  },
  {
    id: 8,
    title: "Sistema de Reservas",
    description: "Plataforma de reservas para hoteles con gestión completa",
    category: "Personalizada",
    technologies: ["Next.js", "PostgreSQL", "Redis", "Docker"],
    image: "/imagenes/proyectos/proyecto8.jpg",
    liveUrl: "https://ejemplo.com",
    year: "2023"
  },
  {
    id: 9,
    title: "Tienda de Tecnología",
    description: "E-commerce especializado en productos tecnológicos",
    category: "E-commerce",
    technologies: ["Next.js", "GraphQL", "Shopify", "TypeScript"],
    image: "/imagenes/proyectos/proyecto9.jpg",
    liveUrl: "https://ejemplo.com",
    year: "2023"
  },
  {
    id: 10,
    title: "Portfolio Fotográfico",
    description: "Portfolio para fotógrafo profesional con galería interactiva",
    category: "Portfolio",
    technologies: ["Next.js", "Cloudinary", "Lightbox", "Framer"],
    image: "/imagenes/proyectos/proyecto10.jpg",
    liveUrl: "https://ejemplo.com",
    year: "2023"
  }
]

const categories = ["Todas", "Landing Pages", "E-commerce", "Portfolio", "Personalizada"]

const PROJECTS_PER_PAGE = 9

export default function ProjectBank({ isOpen, onClose, selectedCategory = "Todas" }: ProjectBankProps) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory)
  const [currentPage, setCurrentPage] = useState(1)

  // Filtrar proyectos por categoría
  const filteredProjects = activeCategory === "Todas" 
    ? projectsData 
    : projectsData.filter(project => project.category === activeCategory)

  // Paginación
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE
  const endIndex = startIndex + PROJECTS_PER_PAGE
  const currentProjects = filteredProjects.slice(startIndex, endIndex)

  // Cambiar página
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll suave al inicio del grid
    const gridElement = document.getElementById('projects-grid')
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Cambiar categoría
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setCurrentPage(1) // Reset a la primera página
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-7xl bg-background border border-custom-2/30 overflow-hidden"
            style={{ borderRadius: 0 }} // Sin bordes redondeados
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-custom-3/20 via-custom-2/20 to-custom-4/20 p-6 border-b border-custom-2/30">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-textPrimary mb-2">
                      Banco de Proyectos
                    </h2>
                    <p className="text-textMuted">
                      Descubre nuestro trabajo y soluciones desarrolladas
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-custom-2/20 transition-colors"
                    aria-label="Cerrar"
                  >
                    <svg
                      className="w-6 h-6 text-textPrimary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Botones de categoría tecnológica */}
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-5 py-2 font-medium transition-all duration-300 ${
                        activeCategory === category
                          ? 'bg-custom-3 text-white border-2 border-custom-3'
                          : 'bg-white/10 dark:bg-white/5 text-textPrimary border-2 border-custom-2/30 hover:border-custom-3/50'
                      }`}
                      style={{ borderRadius: 0 }} // Sin bordes redondeados
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content - Grid de proyectos */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="max-w-6xl mx-auto">
                <div id="projects-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {currentProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      className="group relative bg-surface border border-custom-2/30 overflow-hidden hover:border-custom-3 transition-all duration-300"
                      style={{ borderRadius: 0 }} // Sin bordes redondeados
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {/* Imagen del proyecto */}
                      <div className="relative h-48 bg-gradient-to-br from-custom-3/20 to-custom-4/20 overflow-hidden">
                        {/* Placeholder para imagen */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-6xl font-bold text-custom-2/20">
                            {project.title.charAt(0)}
                          </div>
                        </div>
                        
                        {/* Overlay en hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4 gap-3">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white/90 hover:bg-white transition-colors"
                              style={{ borderRadius: 0 }}
                            >
                              <ExternalLink className="w-5 h-5 text-custom-3" />
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white/90 hover:bg-white transition-colors"
                              style={{ borderRadius: 0 }}
                            >
                              <Github className="w-5 h-5 text-custom-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Contenido */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-custom-3">
                            {project.category}
                          </span>
                          <span className="text-xs text-textMuted">
                            {project.year}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-textPrimary mb-2 line-clamp-1">
                          {project.title}
                        </h3>
                        
                        <p className="text-sm text-textMuted mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        
                        {/* Tecnologías */}
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs bg-custom-2/10 text-custom-3 border border-custom-2/20"
                              style={{ borderRadius: 0 }}
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="px-2 py-1 text-xs text-textMuted">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 border border-custom-2/30 hover:border-custom-3 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      style={{ borderRadius: 0 }}
                    >
                      <ChevronLeft className="w-5 h-5 text-textPrimary" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 border transition-colors ${
                          currentPage === page
                            ? 'bg-custom-3 text-white border-custom-3'
                            : 'border-custom-2/30 hover:border-custom-3 text-textPrimary'
                        }`}
                        style={{ borderRadius: 0 }}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-custom-2/30 hover:border-custom-3 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      style={{ borderRadius: 0 }}
                    >
                      <ChevronRight className="w-5 h-5 text-textPrimary" />
                    </button>
                  </div>
                )}

                {/* Mensaje si no hay proyectos */}
                {filteredProjects.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-textMuted text-lg">
                      No hay proyectos disponibles en esta categoría
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
