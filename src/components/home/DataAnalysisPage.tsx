"use client"

import ServiceBanner from "@/src/components/home/shared/ServiceBanner"
import { BarChart2, PieChart, TrendingUp } from "lucide-react"
import analisisVisualizacion from "@/public/home/images/analisis-visualizacion.webp"

export default function DataAnalysisPage() {
  const serviceData = {
    title: "Análisis y Visualización de Datos",
    description:
      "Transformamos datos en insights poderosos a través de análisis avanzados y visualizaciones impactantes que impulsan la toma de decisiones.",
    features: [
      {
        icon: <BarChart2 className="w-6 h-6" />,
        text: "Dashboards interactivos para monitorear tus KPIs",
      },
      {
        icon: <PieChart className="w-6 h-6" />,
        text: "Visualizaciones que simplifican datos complejos",
      },
      {
        icon: <TrendingUp className="w-6 h-6" />,
        text: "Análisis predictivo para anticipar tendencias y oportunidades",
      },
    ],
    imageSrc: analisisVisualizacion,
    imageAlt: "Análisis y Visualización de Datos",
    ctaLink: "/contacto",
    ctaText: "Solicita una consulta",
  }

  return <ServiceBanner {...serviceData} />
}
