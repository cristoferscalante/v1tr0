"use client"

import ServicesBanner from "@/src/components/home/shared/PortfolioBanner"

export default function DataAnalysisPortfolio() {
  const projects = [
    {
      id: 1,
      title: "Densidad forestal, 2000 - 2022",
      description:
        "Esta animación para visualizar y comparar la densidad forestal en distintos territorios entre los años 2000 y 2020.",
        image: "/home/images/project/project1-data.png",
      tags: ["Next.js", "Python", "D3.js"],
      link: "https://forest-density-globe.vercel.app/",
    },
    {
      id: 2,
      title: "Presidentes de Colombia, 1810 - 2025",
      description:
        "Visualiza de forma interactiva la línea temporal de presidentes de Colombia desde 1810 hasta 2025",
        image: "/home/images/project/project2-data.png",
      tags: ["JavaScript", "D3.js", "Next.js"],
      link: "https://presidents-timeline.vercel.app/",
    },
    {
      id: 3,
      title: "Histórico de desapariciones en Colombia",
      description:
        "Visualiza interactivamente el histórico de desapariciones en Colombia con un dashboard robusto que integra datos verificados y contextualizados a lo largo del tiempo.",
      image: "/home/images/project/project3-data.png",
      tags: ["JavaScript", "Tableau", "Next.js"],
      link: "https://dashboard-aurora-one.vercel.app/",
    },
  ]

  return (
    <ServicesBanner
      title="Análisis y Visualización de Datos"
      projects={projects}
      portfolioLink="/portafolio/analisis-datos"
    />
  )
}
