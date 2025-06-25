"use client"

import ServiceBanner from "@/components/home/shared/ServiceBanner"
import { BarChartIcon, PieChartIcon, TrendingUpIcon } from "@/lib/icons"

export default function DataAnalysisPage() {
  // Aquí puedes editar los textos relacionados con Análisis de Datos
  const serviceData = {
    title: "¡Potencia tu estrategia, automatiza tu información!", // ← EDITA ESTE TÍTULO
    description:
      "Los datos son un activo estratégico. Comprenderlos, gestionarlos y convertirlos en decisiones inteligentes es lo que marca la diferencia. ¿Cómo se logra esto? Construyendo una infraestructura de datos robusta: desde fomentar una cultura de datos, a la identificación de insights o patrones. Ello permite llegar a automatizar el proceso con reportes que revelen lo que está ocurriendo mes a mes en tu entorno organizativo o sistema de trabajo.", // ← EDITA ESTA DESCRIPCIÓN
    features: [
      {
        icon: <BarChartIcon className="w-6 h-6" />,
        text: "Consultoría en cultura de datos & análisis avanzados.",
      },
      {
        icon: <PieChartIcon className="w-6 h-6" />,
        text: "Automatización de reportes de Análisis y Visualización de datos",
      },
      {
        icon: <TrendingUpIcon className="w-6 h-6" />,
        text: "Automatización de tareas e implementacion de agentes IA",
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
