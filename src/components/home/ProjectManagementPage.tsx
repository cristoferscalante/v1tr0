"use client"

import ServiceBanner from "@/src/components/home/shared/ServiceBanner"
import { Calendar, CheckSquare, Users } from "lucide-react"
import gestionProyectos from "@/public/home/images/gestion-proyectos.png"

export default function ProjectManagementPage() {
  const serviceData = {
    title: "Gestión de Proyectos",
    description:
      "Organizamos y coordinamos cada fase de tus proyectos, garantizando el cumplimiento de objetivos y optimizando recursos para el éxito de tu negocio.",
    features: [
      {
        icon: <Calendar className="w-6 h-6" />,
        text: "Planificación detallada y seguimiento continuo",
      },
      {
        icon: <CheckSquare className="w-6 h-6" />,
        text: "Ejecución y control para asegurar resultados",
      },
      {
        icon: <Users className="w-6 h-6" />,
        text: "Colaboración eficaz entre equipos multidisciplinarios",
      },
    ],
    imageSrc: gestionProyectos,
    imageAlt: "Gestión de Proyectos",
    ctaLink: "/contacto",
    ctaText: "Solicita una consulta",
  }

  return <ServiceBanner {...serviceData} />
}
