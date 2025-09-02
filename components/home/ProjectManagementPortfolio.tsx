"use client"

import ServicesBanner from "@/components/home/shared/PortfolioBanner"

export default function ProjectManagementPortfolio() {

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
    />
  )
}
