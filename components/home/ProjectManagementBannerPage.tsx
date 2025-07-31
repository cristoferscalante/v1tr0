"use client"

import ServiceBanner from "@/components/home/shared/ServiceBanner"
import { CalendarIcon, CheckBoxIcon, PeopleIcon } from "@/lib/icons"

export default function ProjectManagementBannerPage() {
  // Datos del servicio de Gestión de Proyectos
  const serviceData = {
    title: "Gestión de Proyectos",
    description:
      "Organizamos y coordinamos cada fase de tus proyectos tecnológicos, garantizando el cumplimiento de objetivos, optimizando recursos y asegurando la entrega exitosa de resultados medibles.",
    features: [
      {
        icon: <CalendarIcon className="w-6 h-6" />,
        text: "Planificación estratégica y seguimiento continuo de hitos",
      },
      {
        icon: <CheckBoxIcon className="w-6 h-6" />,
        text: "Metodologías ágiles y control de calidad integrado",
      },
      {
        icon: <PeopleIcon className="w-6 h-6" />,
        text: "Coordinación eficaz de equipos multidisciplinarios",
      },
    ],
    imageSrc:
      "/service/proximamente_gestor.png",
    imageAlt:
      "Gestora de proyectos con gráfico de red y visualización de datos, rodeada de elementos digitales en color turquesa",
    ctaLink: "/contacto",
    ctaText: "Solicita una consulta",
  }

  return <ServiceBanner {...serviceData} />
}