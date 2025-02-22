"use client"

import ServicesBanner from "@/src/components/home/shared/PortfolioBanner"

export default function SoftwarePortfolio() {
  const projects = [
    {
      id: 1,
      title: "Sistema de Gestión Empresarial",
      description:
        "Plataforma integral para la gestión de recursos y procesos empresariales.",
      image: "/home/images/project/project1.png",
      tags: ["React", "Node.js", "MongoDB"],
      link: "/home/images/project/project1.png",
    },
    {
      id: 2,
      title: "App de Análisis de Datos",
      description:
        "Aplicación móvil para visualización y análisis de datos en tiempo real.",
      image: "/home/images/project/project2.png",
      tags: ["React Native", "Python", "TensorFlow"],
      link: "/proyectos/analisis-datos",
    },
    {
      id: 3,
      title: "Plataforma E-learning",
      description:
        "Sistema de aprendizaje en línea con cursos interactivos y seguimiento de progreso.",
      image: "/portfolio/project3.jpg",
      tags: ["Vue.js", "Laravel", "MySQL"],
      link: "/proyectos/e-learning",
    },
  ]

  return (
    <ServicesBanner
      title="Desarrollo de Software a Medida"
      projects={projects}
      portfolioLink="/portafolio/software"
    />
  )
}
