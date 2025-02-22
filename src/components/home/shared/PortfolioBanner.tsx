"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ArrowRight, ExternalLink } from "lucide-react"

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
}

export default function PortfolioBanner({
  title,
  projects,
  portfolioLink = "/portafolio",
}: PortfolioBannerProps) {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-textPrimary mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="bg-custom-2/10 rounded-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              onHoverStart={() => setHoveredProject(project.id)}
              onHoverEnd={() => setHoveredProject(null)}
            >
              <div className="relative aspect-video">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-300 ease-in-out transform hover:scale-110 "
                />
                <AnimatePresence>
                  {hoveredProject === project.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-custom-2/80 backdrop-blur-sm flex items-center justify-center"
                    >
                      <a
                        href={project.link}
                        className="text-textPrimary hover:text-highlight transition-colors duration-300 flex items-center"
                      >
                        Ver Proyecto <ExternalLink className="ml-2 w-5 h-5" />
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-textPrimary mb-2">
                  {project.title}
                </h3>
                <p className="text-textMuted mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-custom-3/20 text-highlight px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <a
            href={portfolioLink}
            className="inline-flex items-center bg-primary text-textPrimary px-6 py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-colors duration-300"
          >
            Ver todos los proyectos
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
