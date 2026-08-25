import type React from "react"
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google"
import "../styles/globals.css"
import type { Metadata, Viewport } from "next"
import { Providers } from "./providers"
import { GsapErrorBoundary } from "../components/global/GsapErrorBoundary"
import { GsapProvider } from "../components/global/GsapProvider"

import ClientCursorWrapper from "../components/ui/ClientCursorWrapper"
import FloatingSocialButton from "@/components/global/FloatingSocialButton"
import MatrixPageTransition from "@/components/global/MatrixPageTransition"
import { JsonLd } from "@/components/global/JsonLd"
import { siteGraph } from "@/lib/seo/site-graph"
import { siteConfig } from "@/config/site"

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-bricolage-grotesque",
  display: "swap",
})

// Mono real para los datos de los paneles: referencias de tarea, chips de
// límite WIP, fechas y eyebrows. Antes caían a `ui-monospace`, que es una
// fuente distinta en cada sistema operativo — las columnas de cifras no
// alineaban igual en macOS que en Linux.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

// viewportFit: "cover" habilita las env(safe-area-inset-*) usadas por el shell
// para no quedar bajo el notch ni la home-indicator en iOS.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#020a0c",
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  // `template` deja que cada ruta ponga solo su nombre y herede la marca.
  title: {
    default: "V1TR0 | Desarrollo de software a medida en Pitalito, Huila",
    template: "%s | V1TR0",
  },
  description:
    "Empresa de desarrollo de software en Pitalito, Huila. Construimos aplicaciones web, comercio electrónico, hardware e IoT a medida para empresas de Colombia.",
  keywords: [...siteConfig.metadata.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.company.name, url: siteConfig.url }],
  creator: siteConfig.company.name,
  publisher: siteConfig.company.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "V1TR0 | Desarrollo de software a medida en Pitalito, Huila",
    description:
      "Empresa de desarrollo de software en Pitalito, Huila. Aplicaciones web, comercio electrónico, hardware e IoT a medida para empresas de Colombia.",
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.seo.twitter.site,
    title: "V1TR0 | Desarrollo de software a medida en Pitalito, Huila",
    description: "Aplicaciones web, comercio electrónico, hardware e IoT a medida. Pitalito, Huila, Colombia.",
  },
  robots: {
    index: true,
    follow: true,
    // `max-snippet:-1` autoriza fragmentos de largo ilimitado: es lo que
    // permite que un motor de respuesta cite un párrafo completo del sitio
    // en lugar de las dos líneas que toma por defecto.
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
  },
  generator: 'v0.dev',
  icons: {
    icon: '/imagenes/logos/v1tr01.ico',
    shortcut: '/imagenes/logos/v1tr01.ico',
    apple: '/imagenes/logos/v1tr01.ico',
  },
}

// El cursor personalizado ahora se importa desde un Client Component wrapper

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`dark ${bricolageGrotesque.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <JsonLd data={siteGraph} />
        <GsapErrorBoundary>
          <GsapProvider initialDelay={150} maxRetries={5}>
            <Providers>
              {children}
              <MatrixPageTransition />
              <ClientCursorWrapper />
              <FloatingSocialButton />
            </Providers>
          </GsapProvider>
        </GsapErrorBoundary>
  </body>
    </html>
  )
}
