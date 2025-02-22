"use client"

import ServiceBanner from "@/src/components/home/shared/ServiceBanner"
import { Code, GitBranch, Zap } from "lucide-react"
import desarrolloAMedida from "@/public/home/images/desarrollo-a-medida.png"

export default function SoftwareDevelopmentPage() {
  const serviceData = {
    title: "Desarrollo de Software a Medida",
    description:
      "Creamos soluciones de software innovadoras y escalables para impulsar tu negocio hacia el futuro digital.",
    features: [
      {
        icon: <Code className="w-6 h-6" />,
        text: "Soluciones personalizadas que se adaptan a tus necesidades específicas",
      },
      {
        icon: <GitBranch className="w-6 h-6" />,
        text: "Control de versiones y colaboración eficiente en equipo",
      },
      {
        icon: <Zap className="w-6 h-6" />,
        text: "Desarrollo ágil para una entrega rápida y flexible",
      },
    ],
    imageSrc: desarrolloAMedida,
    imageAlt: "Desarrollo de Software",
    ctaLink: "/contacto",
    ctaText: "Solicita una consulta",
  }

  return <ServiceBanner {...serviceData} />
}
