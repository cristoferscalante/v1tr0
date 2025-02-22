"use client"

import ServicesBanner from "@/src/components/home/shared/PortfolioBanner"

export default function ProjectManagementPortfolio() {
  const projects = [
    {
      id: 1,
      title: "Gestión de Proyectos Empresariales",
      description:
        "Herramienta integral para la planificación y seguimiento de proyectos.",
      image: "/portfolio/pm1.jpg",
      tags: ["Scrum", "Kanban", "Jira"],
      link: "/proyectos/gestion-empresarial",
    },
    {
      id: 2,
      title: "Coordinación de Equipos",
      description:
        "Sistema colaborativo para la administración y control de proyectos en equipo.",
      image: "/portfolio/pm2.jpg",
      tags: ["Trello", "Asana", "Slack"],
      link: "/proyectos/gestion-equipos",
    },
    {
      id: 3,
      title: "Optimización de Procesos",
      description:
        "Plataforma para la mejora continua y optimización en la ejecución de proyectos.",
      image: "/portfolio/pm3.jpg",
      tags: ["Lean", "Six Sigma", "Gestión de Calidad"],
      link: "/proyectos/optimizacion-procesos",
    },
  ]

  return (
    <ServicesBanner
      title="Gestión de Proyectos"
      projects={projects}
      portfolioLink="/portafolio/gestion-proyectos"
    />
  )
}
