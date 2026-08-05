"use client"

import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import AdminSidebar from "@/components/admin/AdminSidebar"
import BackgroundAnimation from "@/components/home/animations/BackgroundAnimation"
import { Loader2 } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoading, userRole } = useAuth()
  const pathname = usePathname()

  // Mostrar loading mientras se verifica autenticación
  // El middleware ya maneja la protección y redirección
  if (isLoading && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#08A696]" />
          <p className="text-textSecondary text-lg">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Si es la página de login, mostrar sin sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Defensa adicional del lado cliente: el middleware ya bloquea roles no
  // admin/team en el servidor, esto cubre navegaciones internas sin recarga.
  if (!isLoading && userRole !== "admin" && userRole !== "team") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <p className="text-textSecondary text-lg">Acceso denegado.</p>
      </div>
    )
  }

  // Layout normal con sidebar para usuarios admin
  return (
    <div className="min-h-screen relative">
      {/* Mismo fondo atenuado que el portal del cliente, para unificar ambos paneles */}
      <BackgroundAnimation density={0.22} intensity={0.55} />

      <AdminSidebar />

      {/* El riel flotante arranca en left-12 (48px, alineado con el botón de
          WhatsApp) y mide 80px colapsado; pl-36 deja el mismo respiro del
          otro lado. Al expandirse con el cursor queda flotando por encima
          del contenido (no empuja el layout). */}
      <div className="relative z-10 lg:pl-36 min-h-screen">
        <main>{children}</main>
      </div>
    </div>
  )
}
