"use client"

import ServiceBanner from "@/components/home/shared/ServiceBanner"
import { BarChartIcon, PieChartIcon, TrendingUpIcon } from "@/lib/icons"

export default function DataAnalysisPage() {
  // Aquí puedes editar los textos relacionados con Análisis de Datos
  const serviceData = {
    title: "¡Potencia tu estrategia, automatiza tu información!", // ← EDITA ESTE TÍTULO
    description:
      "Los datos son un activo estratégico. Comprenderlos, gestionarlos y convertirlos en decisiones inteligentes es lo que marca la diferencia.", // ← EDITA ESTA DESCRIPCIÓN
    features: [
      {
        icon: <BarChartIcon className="w-6 h-6" />,
        text: "Sistemas de gestión de datos institucionales, agenciales & comerciales.",
      },
      {
        icon: <PieChartIcon className="w-6 h-6" />,

        text: "Análisis avanzado & Visualización de estructuras de datos jerárquicas, relacionales, espaciales y temporales.",

      },
      {
        icon: <TrendingUpIcon className="w-6 h-6" />,
        text: "Diseño de dashboards e informes interactivos para la toma de decisiones.",
      },
    ],
    imageSrc:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.%20%C2%A1Potencia%20tu%20estrategia%2C%20automatiza%20tu%20informaci%C3%B3n%21-9D5wtuARJ7clWe9uK7UWmXN6Sd1HLj.png",
    imageAlt: "Analista de datos entusiasta con visualizaciones, gráficos y elementos de IA en estilo digital neón",
    ctaLink: "/contacto",
    ctaText: "Solicita una consulta",
  }

  return <ServiceBanner {...serviceData} />
}
