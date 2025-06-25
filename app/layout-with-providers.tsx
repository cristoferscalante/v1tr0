import type React from "react"
import { Bricolage_Grotesque } from "next/font/google"
import "../styles/globals.css"
import type { Metadata } from "next"
import { Providers } from "./providers"

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-bricolage-grotesque",
})

export const metadata: Metadata = {
  // Usar directamente localhost para desarrollo local
  metadataBase: new URL("http://localhost:3000"),
  title: "V1tr0 - Desarrollo de Software a Medida",
  description: "Soluciones digitales innovadoras para impulsar tu negocio al siguiente nivel",
}

export default function RootLayoutWithProviders({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={bricolageGrotesque.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-textPrimary">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
