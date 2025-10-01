"use client"

import ServiceBanner from "@/components/home/shared/ServiceBanner"
import { SmartToyIcon, ZapIcon, SettingsIcon } from "@/lib/icons"

export default function TaskAutomationPage() {
  return (
    <ServiceBanner
      title="Automatización de Tareas"
      description="Optimizamos tus procesos empresariales mediante la automatización inteligente, liberando tiempo valioso y reduciendo errores humanos para maximizar la eficiencia operativa."
      features={[
        {
          icon: <SmartToyIcon className="w-6 h-6" />,
          text: "Implementación de bots y agentes IA para automatizar tareas repetitivas y procesos complejos.",
        },
        {
          icon: <ZapIcon className="w-6 h-6" />,
          text: "Workflows automatizados que integran múltiples sistemas y aplicaciones empresariales.",
        },
        {
          icon: <SettingsIcon className="w-6 h-6" />,
          text: "Configuración y optimización de procesos para mejorar la productividad y reducir costos operativos.",
        },
      ]}
      imageSrc="/imagenes/home/carrusel/automatizacion_de_tareas.webp"
      imageAlt="Especialista en automatización con elementos de IA, robots y workflows digitales en estilo neón"
      imageSize="xs"
      titleLink="/servicios-referentes/pm"
    />
  )
}