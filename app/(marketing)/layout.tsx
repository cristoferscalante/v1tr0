"use client"

import type React from "react"
import FooterSection from "@/components/global/FooterSection"
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
  const isAboutPage = pathname === '/about'

  return (
    <>
      <FloatingHeader />
      <main className="min-h-screen">{children}</main>
      {!isServicesNewPage && !isAboutPage && <FooterSection />}
      <FloatingLoginButton /> {/* Añadir el botón flotante aquí */}
    </>
  )
}
