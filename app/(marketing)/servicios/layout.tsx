import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Servicios de Desarrollo de Software a Medida, Web, E-commerce e IoT",
  description:
    "Servicios de ingeniería de software en Pitalito, el Huila y toda Colombia: aplicaciones web empresariales, tiendas virtuales con Wompi/PSE/Nequi, landing pages, automatización y hardware IoT.",
  alternates: { canonical: "/servicios" },
  openGraph: {
    title: "Servicios de Ingeniería y Desarrollo de Software | V1TR0",
    description:
      "Construimos software empresarial a medida, e-commerce y telemetría IoT en Pitalito, Huila para empresas de toda Colombia, con entrega de código fuente.",
    url: "https://v1tr0.com/servicios",
    type: "website",
  },
}

export default function ServiciosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
