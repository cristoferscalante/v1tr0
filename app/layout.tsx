import type React from "react"
import { Bricolage_Grotesque } from "next/font/google"
import "../styles/globals.css"
import type { Metadata } from "next"
import { Providers } from "./providers"
import { GsapErrorBoundary } from "../components/global/GsapErrorBoundary"
import { GsapProvider } from "../components/global/GsapProvider"
import { GlobalErrorHandler } from "../components/global/GlobalErrorHandler"

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-bricolage-grotesque",
})

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "V1tr0",
  description: "Desarrollo de software a medida",
  generator: 'v0.dev',
  icons: {
    icon: '/v1tr0.ico',
    shortcut: '/v1tr0.ico',
    apple: '/v1tr0.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={bricolageGrotesque.variable} suppressHydrationWarning>
      <body>
        <GsapErrorBoundary>
          <GsapProvider initialDelay={200} maxRetries={5} showProgress={true}>
            <Providers>{children}</Providers>
          </GsapProvider>
        </GsapErrorBoundary>
      </body>
    </html>
  )
}
