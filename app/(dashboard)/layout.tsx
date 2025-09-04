import type { ReactNode } from "react"
import "../../styles/globals.css"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import SessionProvider from "@/components/auth/session-provider"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SessionProvider>
  )
}
