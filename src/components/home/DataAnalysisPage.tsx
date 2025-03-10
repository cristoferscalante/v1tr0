"use client"

import ServiceBanner from "@/src/components/home/shared/ServiceBanner"
import { BarChart2, PieChart, TrendingUp } from "lucide-react"
import analisisVisualizacion from "@/public/home/images/analisis-visualizacion.webp"

export default function DataAnalysisPage() {
  const serviceData = {
    title: "Potencia tu Estrategia con Ciencia de Datos",
    description:
      "Implementamos un proceso técnico integral: desde la ingesta y limpieza de datos hasta su modelización y visualización, respaldado por prácticas DataOps y MLOps para garantizar calidad, seguridad y escalabilidad.",
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
        text: "Sistematización de Procesos de ETL y Análisis Predictivo",
      },
    ],
    imageSrc: analisisVisualizacion,
    imageAlt: "Análisis y Visualización de Datos",
    ctaLink: "/contacto",
    ctaText: "Solicita una consulta",
  }

  return <ServiceBanner {...serviceData} />
}
