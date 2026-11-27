import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portafolio de Proyectos de Software, Web e IoT en Producción",
  description:
    "Casos reales y proyectos de desarrollo de software a medida, plataformas SaaS, comercio electrónico, ciberseguridad y analítica construidos por V1TR0 desde Pitalito, Huila para Colombia.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portafolio de Proyectos de Software e Ingeniería | V1TR0",
    description:
      "Explora los sistemas empresariales, tiendas en línea y plataformas tecnológicas desarrolladas por V1TR0 en Colombia.",
    url: "https://v1tr0.com/portfolio",
    type: "website",
  },
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
