"use client"

import ServicesBanner from "@/components/home/shared/PortfolioBanner"
import { useState } from "react"
import Image from "next/image"

export default function DataAnalysisPortfolio() {
  const [glowingProjectId, setGlowingProjectId] = useState<number | null>(null)

  const handleProjectImageClick = (id: number) => {
    setGlowingProjectId(id)
    // Desactivar el efecto después de la duración de la animación
    setTimeout(() => setGlowingProjectId(null), 500)
  }

  const projects = [
    {
      id: 1,
      title: "Histórico de Desapariciones en Colombia",
      description:
        "Visualiza interactivamente el histórico de desapariciones en Colombia con un dashboard robusto que integra datos verificados y contextualizados desde 1948 hasta 2023.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/historico-desapariciones-ruxPrhVPiGv3LD4lE0nhPhXLSC8Xei.png",
      tags: ["Next.js", "D3.js", "Tableau"],
      link: "https://dashboard-aurora-one.vercel.app/",
    },
    {
      id: 2,
      title: "Presidentes de Colombia, 1810 - 2025",
      description:
        "Descubre la evolución del liderazgo en Colombia a lo largo de más de dos siglos. Esta línea temporal interactiva te permite conocer la trayectoria de cada presidente, desde los inicios de la república en 1810 hasta el año 2025.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/presidentes-awqPZzbe4oyBYcHniEnzBMn7kOyIpf.png",
      tags: ["JavaScript", "D3.js", "Next.js"],
      link: "https://presidents-timeline.vercel.app/",
    },
    {
      id: 3,
      title: "Plataforma de Personalización",
      description:
        "Sistema interactivo para la personalización de productos con visualización en tiempo real. Permite a los usuarios diseñar y previsualizar sus creaciones antes de realizar el pedido.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plataforma-k9Gj7GEJMxGGiLvpuB2pZKoDz6im7Y.png",
      tags: ["React", "Three.js", "WebGL"],
      link: "https://template-store-six.vercel.app/",
    },
  ]

  // Cambiar el gradiente para que coincida con el de SoftwarePortfolio
  const dataGradient = "from-custom-3/30 via-custom-2/20 to-custom-4/30"

  const modifiedProjects = projects.map((project) => ({
    ...project,
    imageComponent: (
      <Image
        key={project.id}
        src={project.image || `/placeholder.svg?height=300&width=500&query=${encodeURIComponent(project.title)}`}
        alt={project.title}
        width={500}
        height={300}
        onClick={() => handleProjectImageClick(project.id)}
        className={`w-full h-auto object-cover transition-all duration-700 ease-in-out hover:scale-105 animate-gentle-balance interactive-image ${glowingProjectId === project.id ? "animate-glow-pulse" : ""}`}
      />
    ),
  }))

  return (
    <ServicesBanner
      title="Análisis y Visualización de Datos"
      projects={modifiedProjects}
      portfolioLink="/portafolio/analisis-datos"
      gradientStyle={dataGradient}
    />
  )
}
