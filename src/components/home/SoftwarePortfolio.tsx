"use client"

import ServicesBanner from "@/src/components/home/shared/PortfolioBanner"

export default function SoftwarePortfolio() {
  const projects = [
    {
      id: 1,
      title: "Gestión Empresarial",
      description:
        "Plataforma integral para la gestión de recursos y procesos empresariales.",
      image: "/home/images/project/project1.png",
      tags: ["Next.js","Django","PostgreSQL"],
      link: "https://dashboard-five-green.vercel.app/dashboard",
    },
    {
      id: 2,
      title: "Generador de Códigos QR",
      description:
        "Crea y personaliza tu QR al instante de forma gratuita.",
      image: "/home/images/project/project2.png",
      tags: ["React Native", "Python", "TensorFlow"],
      link: "https://qr-generator-eight-omega.vercel.app/",
    },
    {
      id: 3,
      title: "Plataforma E-commerce",
      description:
        "Aplicación web para la venta de productos y servicios en línea.",
      image: "/portfolio/project3.jpg",
      tags: ["Next.js","Supabase"],
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
