"use client"

import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import AdminSidebar from "@/components/admin/AdminSidebar"
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
    <div className="tech-ground relative min-h-screen">
      {/* Papel técnico en vez del campo de partículas del sitio público: una
          retícula estática de cruces cada 48px. Da profundidad sin un canvas
          animándose detrás de una tabla de datos, y es el registro de dibujo
          de ingeniería que pidieron las referencias. */}

      <AdminSidebar />

      {/* La barra ahora es horizontal y fija arriba (ver AdminSidebar): ya
          no flota encima del contenido tapándolo al pasar el cursor cerca
          del borde izquierdo (ese era el problema con el riel vertical
          anterior en tableros con tarjetas pegadas a ese borde), así que
          reserva su propia altura en vez de superponerse. */}
      <div className="relative z-10 min-h-screen">
        <main className="pt-16">{children}</main>
      </div>
    </div>
  )
}
