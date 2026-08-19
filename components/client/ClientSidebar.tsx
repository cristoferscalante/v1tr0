"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import {
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  CalendarClock,
  ShoppingBag,
  Store,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { TreeNav, type TreeGroup } from "@/components/shared/tree-nav"

// Árbol de navegación: cada rama representa una de las 3 áreas del cliente
// (lo que contrató, lo que compró, su cuenta), en el mismo orden que el
// menú de tarjetas de /client-dashboard.
const treeGroups: TreeGroup[] = [
  { id: "inicio", label: "Inicio", icon: LayoutDashboard, href: "/client-dashboard" },
  {
    id: "proyectos",
    label: "Mis Proyectos",
    icon: FolderOpen,
    children: [
      { id: "proyectos", label: "Proyectos", href: "/client-dashboard/projects", icon: FolderOpen },
      { id: "cotizaciones", label: "Cotizaciones", href: "/client-dashboard/quotes", icon: MessageSquare },
      { id: "reuniones", label: "Reuniones", href: "/client-dashboard/meetings", icon: CalendarClock },
    ],
  },
  {
    id: "compras",
    label: "Mis Compras",
    icon: ShoppingBag,
    children: [
      { id: "pedidos", label: "Pedidos", href: "/client-dashboard/orders", icon: ShoppingBag },
      { id: "tienda", label: "Ir a la tienda", href: "/tienda", icon: Store },
    ],
  },
  {
    id: "cuenta",
    label: "Mi Cuenta",
    icon: User,
    children: [{ id: "perfil", label: "Perfil", href: "/client-dashboard/profile", icon: User }],
  },
]

export default function ClientSidebar() {
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

      {/* Overlay móvil */}
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

      {/* Zona de revelado: franja invisible pegada al borde izquierdo, alta
          como la pantalla, que detecta el cursor y muestra el riel. Solo
          cubre el ancho del riel ya colapsado (left-12 + 80px), para que el
          cursor tenga que estar realmente cerca. El riel expandido sigue
          manteniendo el hover aunque sobresalga de esta franja: al ser
          descendiente del div, CSS conserva el estado `:hover` del padre
          mientras el cursor siga sobre el propio riel. Solo en escritorio:
          en móvil el riel se abre con el botón de hamburguesa. */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-32 z-40 group/reveal">
        {/* Riel flotante: alto ajustado a su contenido y centrado
            verticalmente. Oculto por defecto (opacity 0 + pointer-events
            none) y solo aparece con el cursor sobre la franja de revelado;
            colapsado a solo íconos, y se expande con `.group`+hover
            mostrando los nombres sin mover los íconos de lugar. */}
        <aside
          className="group absolute z-40 top-1/2 -translate-y-1/2 left-12 flex flex-col rounded-[20px] border border-[#26FFDF]/10 bg-black/30 backdrop-blur-xl shadow-2xl shadow-black/50 font-bricolage transition-[width,opacity] duration-300 ease-out w-20 hover:w-64 max-h-[85vh] opacity-0 pointer-events-none group-hover/reveal:opacity-100 group-hover/reveal:pointer-events-auto"
        >
          {/* Cuenta: barra flotante propia con foto real, nombre y correo */}
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
                <p className="text-sm font-medium text-[#e6f7f6] truncate">{userProfile?.name || "Cliente"}</p>
                <p className="text-[11px] text-[#26FFDF]/80 truncate">{userProfile?.email}</p>
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
      </div>

      {/* Riel móvil: cajón deslizable de siempre, abierto con el botón de
          hamburguesa (no participa del revelado por cursor de escritorio). */}
      <aside
        className={`lg:hidden fixed z-40 inset-y-0 left-0 h-[100dvh] w-[80vw] max-w-xs flex flex-col border-r border-[#26FFDF]/10 bg-black/60 backdrop-blur-xl shadow-2xl shadow-black/50 font-bricolage transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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
            <div className="ml-3 pr-3">
              <p className="text-sm font-medium text-[#e6f7f6] truncate">{userProfile?.name || "Cliente"}</p>
              <p className="text-[11px] text-[#26FFDF]/80 truncate">{userProfile?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 min-h-0 px-3 pb-1 overflow-y-auto overflow-x-hidden">
          <TreeNav groups={treeGroups} onNavigate={() => setIsOpen(false)} />
        </nav>

        <div className="p-3">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full py-1 rounded-full text-[#FF6B6B] hover:text-[#ff8a7f] transition-colors"
          >
            <span className="w-11 h-11 shrink-0 rounded-full bg-black/30 border border-[#FF6B6B]/25 flex items-center justify-center">
              <LogOut className="w-[18px] h-[18px]" />
            </span>
            <span className="ml-3 text-sm font-semibold">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}
