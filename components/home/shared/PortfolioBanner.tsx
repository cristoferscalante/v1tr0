"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight, GitBranch } from "lucide-react" // Importamos directamente de lucide-react
import { useTheme } from "@/components/theme-provider"
import Link from "next/link"

// 1) Define la interfaz de cada proyecto
interface Project {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  link: string
}

// 2) Define las props que recibirá el componente genérico
interface PortfolioBannerProps {
  title: string
  projects: Project[]
  portfolioLink?: string
  gradientStyle?: string
}

export default function PortfolioBanner({
  title,
  projects,
  // portfolioLink = "/portafolio",
  // gradientStyle = "from-custom-3/30 via-custom-2/20 to-custom-4/30",
}: PortfolioBannerProps) {
  // const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Añadir este estado para controlar qué imagen está brillando
  const [glowingProjectId, setGlowingProjectId] = useState<number | null>(null)

  // Añadir esta función para manejar el clic en la imagen
  const handleImageClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation() // Evitar que el clic se propague al enlace
    setGlowingProjectId(id)
    // Desactivar el efecto después de la duración de la animación
    setTimeout(() => setGlowingProjectId(null), 500)
  }

  // Mapeo de estilos de gradiente a colores hexadecimales para modo oscuro
  // const darkGradientMap: Record<string, string> = {
  //   "from-custom-3/30 via-custom-2/20 to-custom-4/30": "linear-gradient(135deg, #08a69680, #025159, #1e7d7d80)", // Software
  //   "from-custom-2/30 via-custom-4/20 to-custom-3/30": "linear-gradient(135deg, #025159, #1e7d7d, #08a69680)", // PM
  //   "from-custom-4/30 via-custom-3/20 to-custom-2/30": "linear-gradient(135deg, #1e7d7d, #08a696, #02515980)", // Data
  //   // Gradiente por defecto
  //   default: "linear-gradient(135deg, #08a696, #025159, #1e7d7d)",
  // }

  // Mapeo de estilos de gradiente a colores hexadecimales para modo claro (grises)
  // const lightGradientMap: Record<string, string> = {
  //   "from-custom-3/30 via-custom-2/20 to-custom-4/30": "linear-gradient(135deg, #e0e0e080, #f0f0f0, #d0d0d080)", // Software
  //   "from-custom-2/30 via-custom-4/20 to-custom-3/30": "linear-gradient(135deg, #d8d8d8, #e8e8e8, #c8c8c880)", // PM
  //   "from-custom-4/30 via-custom-3/20 to-custom-2/30": "linear-gradient(135deg, #d0d0d0, #e0e0e0, #c0c0c080)", // Data
  //   // Gradiente por defecto
  //   default: "linear-gradient(135deg, #d8d8d8, #e8e8e8, #f0f0f0)",
  // }

  // Obtener el gradiente correspondiente según el tema
  // const backgroundGradient = isDark
  //   ? darkGradientMap[gradientStyle] || darkGradientMap["default"]
  //   : lightGradientMap[gradientStyle] || lightGradientMap["default"]

  // Colores base según el tema
  // const baseBackground = isDark ? "#050505" : "#f5f5f5" // Gris muy claro para modo claro
  const textColor = isDark ? "#ffffff" : "#333333" // Texto más oscuro para modo claro
  const mutedTextColor = isDark ? "#a0a0a0" : "#666666" // Texto secundario para modo claro
  const highlightColor = isDark ? "#26ffdf" : "#08a696" // Mantener el color de acento
  const borderColor = isDark ? "#02515950" : "#d0d0d080" // Borde gris para modo claro
  const cardBackground = isDark ? "#07070780" : "#ffffff80" // Fondo de tarjeta

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{
        background: "transparent", // Cambiado a transparente
      }}
    >
      {/* Fondo con gradiente personalizado */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "transparent", // Cambiado a transparente
          opacity: 1,
        }}
      />



      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full backdrop-blur-sm text-sm font-medium mb-4"
            style={{
              background: isDark ? "#07070780" : "#e0e0e080",
              color: highlightColor,
            }}
          >
            Nuestros Proyectos
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>
            {title}
          </h2>
          <div
            className="w-24 h-1.5 rounded-full mx-auto"
            style={{
              background: `linear-gradient(to right, ${isDark ? "#08a696" : "#08a696"}, ${isDark ? "#26ffdf" : "#1e7d7d"})`,
            }}
          ></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              // onHoverStart={() => setHoveredProject(project.id)}
              // onHoverEnd={() => setHoveredProject(null)}
            >
              {/* Card con efecto glassmorphism */}
              <div
                className="relative overflow-hidden rounded-2xl backdrop-blur-sm transition-all duration-500 group-hover:shadow-xl cursor-pointer group"
                style={{
                  background: cardBackground,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: borderColor,
                  boxShadow: isDark ? "0 10px 30px rgba(0, 0, 0, 0.2)" : "0 10px 30px rgba(0, 0, 0, 0.05)",
                }}
              >
                {/* Hacer toda la tarjeta clickable */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-[1] cursor-pointer"
                  aria-label={`Ver proyecto: ${project.title}`}
                ></a>
                {/* Imagen con overlay */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={
                      project.image && project.image.trim() !== ""
                        ? project.image
                        : `/imagenes/icons/svg/placeholder.svg?height=300&width=500&query=${encodeURIComponent(project.title)}`
                    }
                    alt={project.title || "Proyecto"}
                    fill
                    onClick={(e) => handleImageClick(project.id, e)}
                    className={`object-cover animate-gentle-balance interactive-image transition-transform duration-700 ease-out group-hover:scale-110 ${
                      glowingProjectId === project.id ? "animate-glow-pulse" : ""
                    }`}
                  />

                  {/* Gradiente más intenso y con z-index alto */}
                  <div
                    className="absolute inset-0 z-[5]"
                    style={{
                      background: isDark
                        ? "linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0) 100%)"
                        : "linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0) 100%)",
                      pointerEvents: "none",
                    }}
                  ></div>

                  {/* Tags flotantes - Aseguramos que estén por encima del gradiente */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-[10]">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                        style={{
                          background: "#07070780", // Mismo fondo para ambos modos
                          color: "#26ffdf", // Verde turquesa fijo para ambos modos
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderColor: "#08a69650", // Mismo borde para ambos modos
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 2 && (
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                        style={{
                          background: "#07070780", // Mismo fondo para ambos modos
                          color: "#26ffdf", // Verde turquesa fijo para ambos modos
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderColor: "#08a69650", // Mismo borde para ambos modos
                        }}
                      >
                        +{project.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <h3
                    className="text-xl font-bold mb-3 transition-colors duration-300"
                    style={{
                      color: textColor,
                    }}
                  >
                    {project.title}
                  </h3>
                  <p className="mb-6 line-clamp-3" style={{ color: mutedTextColor }}>
                    {project.description}
                  </p>

                  {/* Botón de enlace - Versión mejorada con mayor área clickable */}
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium transition-colors cursor-pointer z-[15] relative"
                    style={{ color: highlightColor }}
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(project.link, "_blank", "noopener,noreferrer")
                    }}
                  >
                    <span className="mr-2">Ver proyecto</span>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                      style={{
                        background: isDark ? "#02515950" : "#d8d8d880",
                      }}
                    >
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Link
            href="/portfolio"
            className={`inline-flex items-center gap-2 px-8 py-4 ${isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm"} rounded-2xl border ${isDark ? "border-[#08A696]/20" : "border-[#08A696]/30"} font-medium transition-all duration-300 transform scale-95 hover:scale-100 hover:border-[#08A696] ${isDark ? "hover:bg-[#02505950]" : "hover:bg-[#c5ebe7]"}`}
          >
            <GitBranch className={`w-5 h-5 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`} />
            <span className={`${isDark ? "text-[#26FFDF]" : "text-[#08A696]"} transition-colors duration-300`}>
              Explorar todos los proyectos
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
