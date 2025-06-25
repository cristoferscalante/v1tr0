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
  metadataBase: new URL("http://localhost:3000"),
  title: "V1tr0",
  description: "Desarrollo de software a medida",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={bricolageGrotesque.variable} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
