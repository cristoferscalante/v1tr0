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
  const { isLoading } = useAuth()
  const pathname = usePathname()

  // Mostrar loading mientras se verifica autenticación
  // El middleware ya maneja la protección y redirección
  if (isLoading && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#08A696]" />
          <p className="text-gray-400 text-lg">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Si es la página de login, mostrar sin sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Layout normal con sidebar para usuarios admin
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="lg:pl-72 min-h-screen">
        <main className="p-4 lg:p-8">
          {/* Content Container with backdrop blur */}
          <div className="bg-black/20 backdrop-blur-sm border border-[#08A696]/10 rounded-xl p-6 lg:p-8 min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-4rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
