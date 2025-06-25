"use client"

import type React from "react"
import NavBar from "@/src/components/global/NavBar"
import ModernFooter from "@/src/components/global/ModernFooter"
import { ThemeProvider } from "@/components/theme-provider"

export default function MarketingLayoutWithTheme({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="v1tr0-theme">
      <NavBar />
      <main className="min-h-screen pt-16">{children}</main>
      <ModernFooter />
    </ThemeProvider>
  )
}
