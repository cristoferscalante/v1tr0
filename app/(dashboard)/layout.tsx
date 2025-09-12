import type { ReactNode } from "react"
import "../../styles/globals.css"
import { SessionProvider } from "@/components/auth/session-provider"
import BackgroundAnimation from "@/components/home/animations/BackgroundAnimation"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <SessionProvider>
      <BackgroundAnimation />
      <div className="flex min-h-screen flex-col bg-transparent relative">
        {/* Content */}
        <div className="relative z-10 flex min-h-screen flex-col">
          <main className="flex-1 overflow-y-auto bg-transparent backdrop-blur-sm">{children}</main>
        </div>
      </div>
    </SessionProvider>
  )
}
