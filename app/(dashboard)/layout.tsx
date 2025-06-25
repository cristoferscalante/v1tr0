import type { ReactNode } from "react"
import { Providers } from "../providers"
import { Bricolage_Grotesque } from "next/font/google"
import "../../styles/globals.css"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-bricolage-grotesque",
})

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="es" className={bricolageGrotesque.variable} suppressHydrationWarning>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <DashboardHeader />
            <div className="flex flex-1">
              <DashboardSidebar />
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
