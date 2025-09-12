"use client"

import type React from "react"

import BackgroundAnimation from "@/components/home/animations/BackgroundAnimation"
import { motion } from "framer-motion"
import Image from "next/image"
import { ExternalLink, GitBranch, X, Send } from "lucide-react"
import { useState } from "react"

// Definimos categorías de proyectos
const categories = [
  { id: "all", name: "Todos" },
  { id: "software", name: "Desarrollo" },
  { id: "data", name: "Análisis de Datos" },
  { id: "pm", name: "Gestión de Proyectos" },
]

// Definimos los proyectos
const projects = [
  {
    id: 1,
    title: "Gestión Empresarial",
    description: "Plataforma integral para la gestión de recursos y procesos empresariales.",
    image: "/imagenes/home/project/gestion-empresarial.png",
    tags: ["Next.js", "Django", "PostgreSQL"],
    link: "https://dashboard-five-green.vercel.app/dashboard",
    category: "software",
  },
  {
    id: 2,
    title: "Generador de Códigos QR",
    description: "Crea y personaliza tu QR al instante de forma gratuita.",
    image: "/imagenes/home/project/generador-qr.png",
    tags: ["React Native", "Python", "TensorFlow"],
    link: "https://qr-generator-eight-omega.vercel.app/",
    category: "software",
  },
  {
    id: 3,
    title: "Plataforma E-commerce",
    description: "Personalizador de prendas para tiendas online, con integración de pagos y gestión de inventario.",
    image: "/imagenes/home/project/plataforma.png",
    tags: ["Next.js", "Supabase"],
    link: "https://template-store-six.vercel.app/",
    category: "software",
  },
  {
    id: 4,
    title: "Histórico de Desapariciones en Colombia",
    description:
      "Visualiza interactivamente el histórico de desapariciones en Colombia con un dashboard robusto que integra datos verificados y contextualizados desde 1948 hasta 2023.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/historico-desapariciones-ruxPrhVPiGv3LD4lE0nhPhXLSC8Xei.png",
    tags: ["Next.js", "D3.js", "Tableau"],
    link: "https://dashboard-aurora-one.vercel.app/",
    category: "data",
  },
  {
    id: 5,
    title: "Presidentes de Colombia, 1810 - 2025",
    description:
      "Descubre la evolución del liderazgo en Colombia a lo largo de más de dos siglos. Esta línea temporal interactiva te permite conocer la trayectoria de cada presidente, desde los inicios de la república en 1810 hasta el año 2025.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/presidentes-awqPZzbe4oyBYcHniEnzBMn7kOyIpf.png",
    tags: ["JavaScript", "D3.js", "Next.js"],
    link: "https://presidents-timeline.vercel.app/",
    category: "data",
  },
  {
    id: 6,
    title: "Gestión de Proyectos Empresariales",
    description: "Herramienta integral para la planificación y seguimiento de proyectos.",
    image: "/portfolio/pm1.jpg",
    tags: ["Scrum", "Kanban", "Jira"],
    link: "https://v1tr0-project-management.vercel.app/proyectos/gestion-empresarial",
    category: "pm",
  },
  {
    id: 7,
    title: "Coordinación de Equipos",
    description: "Sistema colaborativo para la administración y control de proyectos en equipo.",
    image: "/portfolio/pm2.jpg",
    tags: ["Trello", "Asana", "Slack"],
    link: "https://v1tr0-project-management.vercel.app/proyectos/gestion-equipos",
    category: "pm",
  },
  {
    id: 8,
    title: "Optimización de Procesos",
    description: "Plataforma para la mejora continua y optimización en la ejecución de proyectos.",
    image: "/portfolio/pm3.jpg",
    tags: ["Lean", "Six Sigma", "Gestión de Calidad"],
    link: "https://v1tr0-project-management.vercel.app/proyectos/optimizacion-procesos",
    category: "pm",
  },
]

export default function PortfolioPage() {
  // Añadir estado para la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState("all")
  // Añadir estado para controlar el popup de contacto
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    serviceArea: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío de datos
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mostrar mensaje de éxito
    setSubmitSuccess(true)
    setIsSubmitting(false)

    // Cerrar el popup después de 3 segundos
    setTimeout(() => {
      setIsContactPopupOpen(false)
      setSubmitSuccess(false)
      setFormData({ name: "", email: "", message: "", serviceArea: "" })
    }, 3000)
  }

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  // Filtrar proyectos según la categoría seleccionada
  const filteredProjects =
    selectedCategory === "all" ? projects : projects.filter((project) => project.category === selectedCategory)
  return (
    <>
      <BackgroundAnimation />
      <div className="min-h-screen pt-24 pb-16 px-4 relative">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full backdrop-blur-sm text-sm font-medium mb-4 bg-custom-1/30 text-highlight border border-custom-2/20">
              Nuestro Portafolio
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-textPrimary">
              Proyectos que Transforman Ideas en Realidad
            </h1>
            <p className="text-textMuted text-lg max-w-3xl mx-auto mb-8">
              Explora nuestra colección de proyectos innovadores que demuestran nuestro compromiso con la excelencia
              tecnológica y la resolución creativa de problemas.
            </p>
            <div className="w-24 h-1.5 rounded-full mx-auto bg-gradient-to-r from-custom-3 to-custom-4"></div>
          </motion.div>

          {/* Filtros de categoría */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                className={`px-5 py-2 rounded-full border transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-custom-2/50 text-highlight border-highlight"
                    : "bg-custom-1/30 text-highlight border-custom-2/20 hover:bg-custom-2/30"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </motion.button>
            ))}
          </motion.div>

          {/* Grid de proyectos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="relative h-full overflow-hidden rounded-2xl backdrop-blur-sm transition-all duration-500 group-hover:shadow-xl bg-custom-1/20 border border-custom-2/20">
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
                        project.image ||
                        `/placeholder.svg?height=300&width=500&query=${encodeURIComponent(project.title) || "/placeholder.svg"}`
                      }
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />

                    {/* Gradiente */}
                    <div
                      className="absolute inset-0 z-[5] bg-gradient-to-b from-black/50 to-transparent"
                      style={{ pointerEvents: "none" }}
                    ></div>

                    {/* Tags flotantes */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-[10]">
                      {project.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-custom-1/50 text-highlight border border-custom-2/30"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 2 && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-custom-1/50 text-highlight border border-custom-2/30">
                          +{project.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-textPrimary group-hover:text-highlight transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="mb-6 line-clamp-3 text-textMuted">{project.description}</p>

                    {/* Botón de enlace */}
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-highlight transition-colors cursor-pointer z-[15] relative"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(project.link, "_blank", "noopener,noreferrer")
                      }}
                    >
                      <span className="mr-2">Ver proyecto</span>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center transition-colors bg-custom-2/30">
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sección de contacto */}
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-textPrimary">¿Tienes un proyecto en mente?</h2>
            <p className="text-textMuted text-lg max-w-2xl mx-auto mb-8">
              Estamos listos para convertir tu visión en realidad. Contáctanos y descubre cómo podemos ayudarte a
              alcanzar tus objetivos.
            </p>
            <button
              onClick={() => setIsContactPopupOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 bg-gradient-to-r from-custom-3 to-custom-4 text-white"
            >
              <GitBranch className="w-5 h-5" />
              <span>Iniciar un proyecto</span>
            </button>
          </motion.div>
        </div>
      </div>
      {/* Popup de contacto */}
      {isContactPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-backgroundSecondary rounded-xl p-6 w-full max-w-md shadow-2xl border border-custom-2/30"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-textPrimary">Iniciar un Proyecto</h3>
              <button
                onClick={() => setIsContactPopupOpen(false)}
                className="p-1 rounded-full hover:bg-custom-1/50 transition-colors"
              >
                <X className="w-5 h-5 text-textMuted" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="text-lg font-semibold text-textPrimary mb-2">¡Mensaje enviado!</h4>
                <p className="text-textMuted">Nos pondremos en contacto contigo lo antes posible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-textMuted mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-custom-1/30 border border-custom-2/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight text-gray-500"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-textMuted mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-custom-1/30 border border-custom-2/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight text-gray-500"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="serviceArea" className="block text-sm font-medium text-textMuted mb-1">
                    Área de Interés
                  </label>
                  <select
                    id="serviceArea"
                    name="serviceArea"
                    value={formData.serviceArea}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-custom-1/30 border border-custom-2/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight text-gray-500 [&>option]:text-gray-500 dark:[&>option]:text-gray-400"
                  >
                    <option value="" disabled>
                      Selecciona un área
                    </option>
                    <option value="desarrollo">Desarrollo de Software</option>
                    <option value="gestion">Gestión de Proyectos</option>
                    <option value="datos">Ciencia de Datos y Análisis Avanzado</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-textMuted mb-1">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 bg-custom-1/30 border border-custom-2/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight resize-none text-gray-500"
                    placeholder="Cuéntanos sobre tu proyecto"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-custom-3 to-custom-4 text-white rounded-lg font-medium hover:from-highlight hover:to-custom-3 transition-all duration-300 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    "Enviar mensaje"
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </>
  )
}
