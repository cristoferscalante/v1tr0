"use client"

import ServicesBanner from "@/components/home/shared/PortfolioBanner"
import { useState } from "react"
import Image from "next/image"

export default function ProjectManagementPortfolio() {
  const [glowingProjectId, setGlowingProjectId] = useState<number | null>(null)

  const handleProjectImageClick = (id: number) => {
    setGlowingProjectId(id)
    // Desactivar el efecto después de la duración de la animación
    setTimeout(() => setGlowingProjectId(null), 500)
  }

  const projects = [
    {
      id: 1,
      title: "Gestión de Proyectos Empresariales",
      description: "Herramienta integral para la planificación y seguimiento de proyectos.",
      image: "/portfolio/pm1.jpg",
      tags: ["Scrum", "Kanban", "Jira"],
      link: "https://v1tr0-project-management.vercel.app/proyectos/gestion-empresarial",
    },
    {
      id: 2,
      title: "Coordinación de Equipos",
      description: "Sistema colaborativo para la administración y control de proyectos en equipo.",
      image: "/portfolio/pm2.jpg",
      tags: ["Trello", "Asana", "Slack"],
      link: "https://v1tr0-project-management.vercel.app/proyectos/gestion-equipos",
    },
    {
      id: 3,
      title: "Optimización de Procesos",
      description: "Plataforma para la mejora continua y optimización en la ejecución de proyectos.",
      image: "/portfolio/pm3.jpg",
      tags: ["Lean", "Six Sigma", "Gestión de Calidad"],
      link: "https://v1tr0-project-management.vercel.app/proyectos/optimizacion-procesos",
    },
  ]

  // Cambiar el gradiente para que coincida con el de SoftwarePortfolio
  const pmGradient = "from-custom-3/30 via-custom-2/20 to-custom-4/30"

  return (
    <ServicesBanner
      title="Gestión de Proyectos"
      projects={projects}
      portfolioLink="/portafolio/gestion-proyectos"
      gradientStyle={pmGradient}
      renderProjectImage={(project) => (
        <Image
          key={project.id}
          src={project.image || `/placeholder.svg?height=300&width=500&query=${encodeURIComponent(project.title)}`}
          alt={project.title}
          width={500}
          height={300}
          onClick={() => handleProjectImageClick(project.id)}
          className={`w-full h-auto object-cover transition-all duration-700 ease-in-out hover:scale-105 animate-gentle-balance interactive-image ${glowingProjectId === project.id ? "animate-glow-pulse" : ""}`}
        />
      )}
    />
  )
}
