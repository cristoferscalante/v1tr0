"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
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
  ChevronDown,
} from "lucide-react"
import type { TreeGroup } from "@/components/shared/tree-nav"

// Árbol de navegación: 3 ramas (Clientes / Tienda / Proyectos), sin mezclar
// productos con proyectos, más los accesos transversales Dashboard y Reportes.
// Mismos 5 grupos / 6 hijos de siempre — nada duplicado, solo se reordena en
// horizontal en vez de vertical (ver nota en AdminLayout sobre por qué).
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

/** Altura real de la barra — AdminLayout la usa para reservarle espacio al
 *  contenido (pt-16), ya no flota encima tapando lo que hay debajo. */
export const ADMIN_NAVBAR_HEIGHT = 64

export default function AdminSidebar() {
  const { signOut, userProfile } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  const isGroupActive = (group: TreeGroup) =>
    group.href === pathname || group.children?.some((c) => c.href === pathname)

  return (
    <>
      {/* Barra horizontal fija arriba: siempre visible, reserva su propio
          espacio (AdminLayout le da pt-16 al contenido) en vez de flotar por
          encima — así nunca vuelve a tapar tarjetas al pasar el cursor cerca
          del borde, que era el problema con el riel vertical anterior. */}
      <header
        className="fixed top-0 inset-x-0 z-40 border-b border-[#26FFDF]/10 bg-[#050c0b]/80 backdrop-blur-xl font-bricolage"
        style={{ height: ADMIN_NAVBAR_HEIGHT }}
      >
        <div className="h-full flex items-center justify-between gap-3 px-4 lg:px-6">
          <div className="flex items-center gap-6 min-w-0">
            <Link href="/admin" className="shrink-0 flex items-center">
              <Image
                src="/imagenes/logos/v1tr0-logo.svg"
                alt="V1TR0"
                width={36}
                height={36}
                className="h-9 w-auto filter brightness-110 hover:brightness-125 transition-all duration-300"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {treeGroups.map((group) => {
                const Icon = group.icon
                const active = isGroupActive(group)
                const itemClass = `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#0d5d5d]/70 text-[#26FFDF] border border-[#26FFDF]/40"
                    : "text-[#b2fff6]/80 border border-transparent hover:text-[#26FFDF] hover:bg-white/5"
                }`

                if (!group.children) {
                  return (
                    <Link key={group.id} href={group.href!} className={itemClass}>
                      <Icon className="w-4 h-4" /> {group.label}
                    </Link>
                  )
                }

                return (
                  <div key={group.id} className="relative group/nav">
                    <button type="button" className={`${itemClass} cursor-pointer`}>
                      <Icon className="w-4 h-4" /> {group.label}
                      <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover/nav:rotate-180 transition-transform" />
                    </button>
                    {/* Dropdown: mismo patrón de revelado por hover que el
                        resto de la app, sin JS extra ni estado por grupo. */}
                    <div className="absolute left-0 top-full pt-2 opacity-0 invisible translate-y-1 group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0 transition-all duration-200">
                      <div className="min-w-[11rem] rounded-xl border border-[#26FFDF]/10 bg-[#0a1614]/95 backdrop-blur-xl shadow-2xl shadow-black/50 p-1.5">
                        {group.children.map((leaf) => {
                          const LeafIcon = leaf.icon
                          const leafActive = leaf.href === pathname
                          return (
                            <Link
                              key={leaf.id}
                              href={leaf.href}
                              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
                                leafActive ? "text-[#26FFDF] bg-white/5" : "text-[#b2fff6]/80 hover:text-[#26FFDF] hover:bg-white/5"
                              }`}
                            >
                              <LeafIcon className="w-3.5 h-3.5 shrink-0" /> {leaf.label}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </nav>
          </div>

          {/* Cuenta + salir: con la barra horizontal ya hay espacio de sobra,
              no hace falta ocultar el nombre hasta el hover como en el riel. */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-[#26FFDF]/10 bg-black/20">
              <div className="w-7 h-7 shrink-0 rounded-full overflow-hidden border border-[#26FFDF]/30 bg-gradient-to-br from-[#08A696]/40 to-[#26FFDF]/20 flex items-center justify-center">
                {userProfile?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={userProfile.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[11px] font-bold text-[#26FFDF]">
                    {(userProfile?.name ?? userProfile?.email ?? "?").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 leading-tight">
                <p className="text-xs font-medium text-[#e6f7f6] truncate max-w-[8rem]">{userProfile?.name || "Admin"}</p>
                <p className="text-[10px] text-[#26FFDF]/70 truncate capitalize">{userProfile?.role}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              title="Cerrar sesión"
              className="w-8 h-8 shrink-0 rounded-full bg-black/30 border border-[#FF6B6B]/25 text-[#FF6B6B] hover:text-[#ff8a7f] hover:border-[#FF6B6B]/50 transition-colors flex items-center justify-center"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Botón móvil */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 min-w-11 min-h-11 flex items-center justify-center rounded-xl bg-black/40 border border-[#26FFDF]/15 text-[#26FFDF] transition-all duration-300 hover:border-[#26FFDF]/50"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Menú móvil: cajón desplegado justo debajo de la barra. */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
              style={{ top: ADMIN_NAVBAR_HEIGHT }}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="lg:hidden fixed inset-x-0 z-40 mx-3 rounded-2xl border border-[#26FFDF]/10 bg-[#0a1614]/95 backdrop-blur-xl shadow-2xl shadow-black/50 p-2 max-h-[70dvh] overflow-y-auto"
              style={{ top: ADMIN_NAVBAR_HEIGHT + 8 }}
            >
              {treeGroups.map((group) => {
                const Icon = group.icon
                const active = isGroupActive(group)
                return (
                  <div key={group.id} className="mb-1 last:mb-0">
                    {group.href && !group.children ? (
                      <Link
                        href={group.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium ${
                          active ? "text-[#26FFDF] bg-white/5" : "text-[#b2fff6]/80"
                        }`}
                      >
                        <Icon className="w-4 h-4" /> {group.label}
                      </Link>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-white/70">
                          <Icon className="w-4 h-4" /> {group.label}
                        </div>
                        <div className="pl-6 space-y-0.5">
                          {group.children!.map((leaf) => {
                            const LeafIcon = leaf.icon
                            const leafActive = leaf.href === pathname
                            return (
                              <Link
                                key={leaf.id}
                                href={leaf.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                                  leafActive ? "text-[#26FFDF] bg-white/5" : "text-[#b2fff6]/70"
                                }`}
                              >
                                <LeafIcon className="w-3.5 h-3.5" /> {leaf.label}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-semibold text-[#FF6B6B]"
              >
                <LogOut className="w-4 h-4" /> Cerrar Sesión
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
