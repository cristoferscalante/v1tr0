"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  MessageSquare,
  FolderKanban,
  LogOut,
  Menu,
  X,
  CalendarClock,
  FileBarChart,
  Users,
  Package,
} from "lucide-react"
import { TreeNav, type TreeGroup } from "@/components/shared/tree-nav"

// Árbol de navegación: 3 ramas (Clientes / Tienda / Proyectos), sin mezclar
// productos con proyectos, más los accesos transversales Dashboard y Reportes.
const treeGroups: TreeGroup[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  {
    id: "clientes",
    label: "Clientes",
    icon: Users,
    children: [
      { id: "clientes", label: "Clientes", href: "/admin/clientes", icon: Users },
      { id: "cotizaciones", label: "Cotizaciones", href: "/admin/cotizaciones", icon: MessageSquare },
      { id: "reuniones", label: "Reuniones", href: "/admin/reuniones", icon: CalendarClock },
    ],
  },
  {
    id: "tienda",
    label: "Tienda",
    icon: ShoppingBag,
    children: [
      { id: "productos", label: "Productos", href: "/admin/productos", icon: ShoppingBag },
      { id: "paquetes", label: "Paquetes", href: "/admin/paquetes", icon: Package },
      { id: "pedidos", label: "Pedidos", href: "/admin/pedidos", icon: ClipboardList },
    ],
  },
  { id: "proyectos", label: "Proyectos", icon: FolderKanban, href: "/admin/proyectos" },
  { id: "reportes", label: "Reportes", icon: FileBarChart, href: "/admin/reportes" },
]

export default function AdminSidebar() {
  const { signOut, userProfile } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <>
      {/* Botón móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-black/40 backdrop-blur-sm border border-[#26FFDF]/15 text-[#26FFDF] transition-all duration-300 hover:border-[#26FFDF]/50 hover:shadow-lg"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay para móvil */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Riel flotante: alto ajustado a su contenido y centrado verticalmente
          (nada de espacio vacío estirado edge-to-edge). En escritorio queda
          fijo, colapsado a solo íconos, y se expande con `.group`+hover
          mostrando los nombres sin mover los íconos de lugar. En móvil sigue
          siendo el cajón deslizable de siempre, ya expandido por completo. */}
      <aside
        className={`group fixed z-40 top-1/2 -translate-y-1/2 left-4 lg:left-12 flex flex-col rounded-[28px] border border-[#26FFDF]/10 bg-black/30 backdrop-blur-xl shadow-2xl shadow-black/50 font-bricolage transition-[width,transform] duration-300 ease-out w-64 lg:w-20 lg:hover:w-64 max-h-[85vh] ${
          isOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)]"
        } lg:translate-x-0`}
      >
        {/* Cuenta: barra flotante propia con foto real, nombre y rol */}
        <div className="p-3">
          <div className="flex items-center rounded-full border border-[#26FFDF]/10 bg-black/20 p-1">
            <div className="w-11 h-11 shrink-0 rounded-full overflow-hidden border border-[#26FFDF]/30 bg-gradient-to-br from-[#08A696]/40 to-[#26FFDF]/20 flex items-center justify-center">
              {userProfile?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={userProfile.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-[#26FFDF]">
                  {(userProfile?.name ?? userProfile?.email ?? "?").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="ml-3 overflow-hidden whitespace-nowrap max-w-0 opacity-0 transition-all duration-300 group-hover:max-w-[10rem] group-hover:opacity-100 pr-3">
              <p className="text-sm font-medium text-[#e6f7f6] truncate">{userProfile?.name || "Admin"}</p>
              <p className="text-[11px] text-[#26FFDF]/80 truncate capitalize">{userProfile?.role}</p>
            </div>
          </div>
        </div>

        {/* Árbol de navegación */}
        <nav className="px-3 pb-1 overflow-y-auto overflow-x-hidden">
          <TreeNav groups={treeGroups} onNavigate={() => setIsOpen(false)} />
        </nav>

        {/* Cerrar sesión */}
        <div className="p-3">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full py-1 rounded-full text-[#FF6B6B] hover:text-[#ff8a7f] transition-colors"
          >
            <span className="w-11 h-11 shrink-0 rounded-full bg-black/30 border border-[#FF6B6B]/25 flex items-center justify-center">
              <LogOut className="w-[18px] h-[18px]" />
            </span>
            <span className="ml-3 overflow-hidden whitespace-nowrap max-w-0 opacity-0 transition-all duration-300 group-hover:max-w-[10rem] group-hover:opacity-100 text-sm font-semibold">
              Cerrar Sesión
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}
