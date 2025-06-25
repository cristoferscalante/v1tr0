"use client"

import ServicesBanner from "@/components/home/shared/PortfolioBanner"
import { useState } from "react"
import Image from "next/image"

export default function SoftwarePortfolio() {
  const [glowingProjectId, setGlowingProjectId] = useState<number | null>(null)

  const handleProjectImageClick = (id: number) => {
    setGlowingProjectId(id)
    // Desactivar el efecto después de la duración de la animación
    setTimeout(() => setGlowingProjectId(null), 500)
  }

  const projects = [
    {
      id: 1,
      title: "Gestión Empresarial",
      description: "Plataforma integral para la gestión de recursos y procesos empresariales.",
      image: "/home/images/project/gestion-empresarial.png",
      tags: ["Next.js", "Django", "PostgreSQL"],
      link: "https://dashboard-five-green.vercel.app/dashboard",
    },
    {
      id: 2,
      title: "Generador de Códigos QR",
      description: "Crea y personaliza tu QR al instante de forma gratuita.",
      image: "/home/images/project/generador-qr.png",
      tags: ["React Native", "Python", "TensorFlow"],
      link: "https://qr-generator-eight-omega.vercel.app/",
    },
    {
      id: 3,
      title: "Plataforma E-commerce",
      description: "Personalizador de prendas para tiendas online, con integración de pagos y gestión de inventario.",
      image: "/home/images/project/plataforma.png",
      tags: ["Next.js", "Supabase"],
      link: "https://template-store-six.vercel.app/",
    },
  ]

  // Gradiente específico para Software Development
  const softwareGradient = "from-custom-3/30 via-custom-2/20 to-custom-4/30"

  return (
    <ServicesBanner
      title="Desarrollo de Software a Medida"
      projects={projects}
      portfolioLink="/portafolio/software"
      gradientStyle={softwareGradient}
      renderProjectImage={(project) => (
        <Image
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
