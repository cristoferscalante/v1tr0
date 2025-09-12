"use client"

import ServiceBanner from "@/components/home/shared/ServiceBanner"
import { CalendarIcon, CheckBoxIcon, PeopleIcon } from "@/lib/icons"

export default function ProjectManagementPage() {
  // Aquí puedes editar los textos relacionados con Gestión de Proyectos
  const serviceData = {
    title: "Gestión de Proyectos", // ← EDITA ESTE TÍTULO
    description:
      "Organizamos y coordinamos cada fase de tus proyectos, garantizando el cumplimiento de objetivos y optimizando recursos para el éxito de tu negocio.", // ← EDITA ESTA DESCRIPCIÓN
    features: [
      {
        icon: <CalendarIcon className="w-6 h-6" />,
        text: "Planificación detallada y seguimiento continuo",
      },
      {
        icon: <CheckBoxIcon className="w-6 h-6" />,
        text: "Ejecución y control para asegurar resultados",
      },
      {
        icon: <PeopleIcon className="w-6 h-6" />,
        text: "Colaboración eficaz entre equipos multidisciplinarios",
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
