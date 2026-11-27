import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tienda de Software, Sistema POS y Hardware IoT en Colombia",
  description:
    "Paquetes de software, licencias de V1TR0 POS, kits de sensores IoT LoRaWAN y soluciones tecnológicas con precios en pesos colombianos y envíos a todo el país desde Pitalito, Huila.",
  alternates: { canonical: "/tienda" },
  openGraph: {
    title: "Tienda V1TR0 — Software, Sistema POS y Hardware IoT en Colombia",
    description:
      "Adquiere paquetes de punto de venta V1TR0 POS, hardware de telemetría LoRaWAN y soluciones digitales listas para operar en Colombia.",
    url: "https://v1tr0.com/tienda",
    type: "website",
  },
}

export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
