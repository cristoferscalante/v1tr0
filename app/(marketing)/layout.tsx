"use client"

import type React from "react"
import ModernFooter from "@/components/global/ModernFooter"
import NavBar from "@/components/global/NavBar"
// Importar el botón flotante
import { FloatingLoginButton } from "@/components/auth/FloatingLoginButton"
import { usePathname } from "next/navigation"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isServicesNewPage = pathname === '/services/new'

  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-16">{children}</main>
      {!isServicesNewPage && <ModernFooter />}
      <FloatingLoginButton /> {/* Añadir el botón flotante aquí */}
    </>
  )
}
