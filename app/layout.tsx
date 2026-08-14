import type React from "react"
import { Bricolage_Grotesque } from "next/font/google"
import "../styles/globals.css"
import type { Metadata, Viewport } from "next"
import { Providers } from "./providers"
import { GsapErrorBoundary } from "../components/global/GsapErrorBoundary"
import { GsapProvider } from "../components/global/GsapProvider"

import ClientCursorWrapper from "../components/ui/ClientCursorWrapper"
import FloatingSocialButton from "@/components/global/FloatingSocialButton"
import MatrixPageTransition from "@/components/global/MatrixPageTransition"

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-bricolage-grotesque",
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "V1tr0",
  description: "Desarrollo de software a medida",
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
    <html lang="es" className={`dark ${bricolageGrotesque.variable}`} suppressHydrationWarning>
      <body>
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
