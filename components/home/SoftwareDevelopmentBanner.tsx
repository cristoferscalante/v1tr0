"use client"

import ServiceBanner from "@/components/home/shared/ServiceBanner"
import { CodeIcon, GitBranchIcon, ZapIcon } from "@/lib/icons"

export default function SoftwareDevelopmentBanner() {
  return (
    <ServiceBanner
      title="Desarrollo de Software a Medida"
      description="Creamos soluciones de software innovadoras y escalables para impulsar tu negocio hacia el futuro digital."
      features={[
        {
          icon: <CodeIcon className="w-6 h-6" />,
          text: "E-Commerce personalizados que se adaptan a tu modelo de negocio",
        },
        {
          icon: <GitBranchIcon className="w-6 h-6" />,
          text: "Control de versiones y colaboración eficiente en equipo",
        },
        {
          icon: <ZapIcon className="w-6 h-6" />,
          text: "Desarrollo ágil para una entrega rápida y flexible",
        },
      ]}
      imageSrc="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.%20Desarrollo%20de%20Software%20a%20Medida-rTvAkuBL4PHWAC9k5RdX1P8qRWXHHT.png"
      imageAlt="Desarrollador con elementos de programación y tecnología"
    />
  )
}
