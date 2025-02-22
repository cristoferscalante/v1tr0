"use client"

import ServicesBanner from "@/src/components/home/shared/PortfolioBanner"

export default function DataAnalysisPortfolio() {
  const projects = [
    {
      id: 1,
      title: "Análisis de Ventas",
      description:
        "Dashboard interactivo para monitorear y analizar tendencias de ventas.",
        image: "/home/images/project/project1-data.png",
      tags: ["Python", "Pandas", "Tableau"],
      link: "/proyectos/analisis-ventas",
    },
    {
      id: 2,
      title: "Dashboard de Marketing",
      description:
        "Visualización en tiempo real de métricas clave de campañas publicitarias.",
        image: "/home/images/project/project2-data.png",
      tags: ["Power BI", "SQL", "DAX"],
      link: "/proyectos/dashboard-marketing",
    },
    {
      id: 3,
      title: "Optimización de Inventario",
      description:
        "Análisis predictivo para optimizar la gestión del stock y reducir costos.",
      image: "/portfolio/data3.jpg",
      tags: ["Machine Learning", "Python", "Scikit-learn"],
      link: "/proyectos/optimizacion-inventario",
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
