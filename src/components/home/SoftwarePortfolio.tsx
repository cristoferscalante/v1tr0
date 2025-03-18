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
        "Personalizador de prendas para tiendas online, con integración de pagos y gestión de inventario.",
      image: "/home/images/project/project3.png",
      tags: ["Next.js","Supabase"],
      link: "https://template-store-six.vercel.app/",
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
