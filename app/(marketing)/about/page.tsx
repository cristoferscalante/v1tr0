import type { Metadata } from "next"
import About from "@/components/about/about"

export const metadata: Metadata = {
  title: "Acerca de V1TR0 — Casa de Ingeniería de Software en Pitalito, Huila",
  description:
    "Conoce al equipo de ingeniería de V1TR0 SAS en Pitalito, Huila. Desarrollamos software a medida, comercio electrónico, automatización e IoT para empresas de toda Colombia.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Acerca de V1TR0 SAS — Ingeniería de Software en Pitalito, Huila y Colombia",
    description:
      "Equipo propio de arquitectos y desarrolladores en Pitalito (Huila). Software a medida, web, e-commerce y hardware IoT con entrega de código fuente.",
    url: "https://v1tr0.com/about",
    type: "website",
  },
}

export default function AboutPage() {
  return (
    <main className="text-textPrimary">
      <About />
    </main>
  )
}
