"use client"

import type React from "react"
import ModernFooter from "@/components/global/ModernFooter"
import FloatingHeader from "@/components/global/FloatingHeader"
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
  const isHomePage = pathname === '/'

  return (
    <>
      <FloatingHeader />
      <main className="min-h-screen">{children}</main>
      {!isServicesNewPage && !isHomePage && <ModernFooter />}
      <FloatingLoginButton /> {/* Añadir el botón flotante aquí */}
    </>
  )
}
