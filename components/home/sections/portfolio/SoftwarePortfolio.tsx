"use client"

import ServicesBanner from "@/components/home/shared/PortfolioBanner"

export default function SoftwarePortfolio() {

  const projects = [
    {
      id: 1,
      title: "Gestión Empresarial",
      description: "Plataforma integral para la gestión de recursos y procesos empresariales.",
      image: "/imagenes/home/project/gestion-empresarial.png",
      tags: ["Next.js", "Django", "PostgreSQL"],
      link: "https://dashboard-five-green.vercel.app/dashboard",
    },
    {
      id: 2,
      title: "Generador de Códigos QR",
      description: "Crea y personaliza tu QR al instante de forma gratuita.",
      image: "/imagenes/home/project/generador-qr.png",
      tags: ["React Native", "Python", "TensorFlow"],
      link: "https://qr-generator-eight-omega.vercel.app/",
    },
    {
      id: 3,
      title: "Plataforma E-commerce",
      description: "Personalizador de prendas para tiendas online, con integración de pagos y gestión de inventario.",
      image: "/imagenes/home/project/plataforma.png",
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
    />
  )
}
