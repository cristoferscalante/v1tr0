import type React from "react"
import ModernFooter from "@/components/global/ModernFooter"
import NavBar from "@/components/global/NavBar"
// Importar el botón flotante
import { FloatingLoginButton } from "@/components/auth/FloatingLoginButton"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-16">{children}</main>
      <ModernFooter />
      <FloatingLoginButton /> {/* Añadir el botón flotante aquí */}
    </>
  )
}
