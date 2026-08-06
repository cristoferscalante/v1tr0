"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { ChevronDown } from "lucide-react"

export interface TreeLeaf {
  id: string
  label: string
  href: string
  icon: LucideIcon
}

export interface TreeGroup {
  id: string
  label: string
  icon: LucideIcon
  /** Si no tiene hijos, el nodo raíz navega directo a href al hacer click. */
  href?: string
  children?: TreeLeaf[]
}

/** Segmento de "espina": solo ocupa el hueco real entre dos nodos, en vez de
 *  una línea continua que atraviesa los círculos por detrás. */
function Connector() {
  return (
    <div className="w-11 flex justify-center py-0.5" aria-hidden>
      <div className="w-px h-3 bg-gradient-to-b from-[#08A696]/60 to-[#08A696]/10 rounded-full" />
    </div>
  )
}

/**
 * Riel de navegación tipo árbol de habilidades: columna de nodos circulares
 * conectados por segmentos cortos. Colapsado muestra solo íconos (ancho fijo
 * del contenedor); el texto vive en una etiqueta con max-width 0 que el
 * padre `.group` expande al pasar el cursor — así el ícono nunca se mueve.
 */
export function TreeNav({
  groups,
  onNavigate = () => {},
}: {
  groups: TreeGroup[]
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  const activeGroupId = groups.find(
    (g) => g.href === pathname || g.children?.some((c) => c.href === pathname),
  )?.id

  return (
    <div className="space-y-0">
      {groups.map((group, index) => {
        const isActiveGroup = group.id === activeGroupId
        const hasChildren = (group.children?.length ?? 0) > 0
        const GroupIcon = group.icon

        const nodeButton = (
          <button
            type="button"
            onClick={() => {
              if (!hasChildren) {onNavigate?.()}
            }}
            className="relative flex items-center w-full py-1.5 group/node text-left"
          >
            {/* Halo difuminado detrás del nodo activo, igual al de las
                píldoras del panel de servicios del home */}
            {isActiveGroup && (
              <span className="absolute left-0 w-11 h-11 rounded-full bg-gradient-to-br from-[#08A696]/50 to-[#26FFDF]/40 blur-md opacity-70" />
            )}

            {/* Nodo circular: tamaño fijo, nunca se mueve al expandir el riel */}
            <span
              className={`relative shrink-0 flex items-center justify-center w-11 h-11 rounded-full border backdrop-blur-md transition-all duration-300 ${
                isActiveGroup
                  ? "bg-[#0d5d5d]/70 border-[#26FFDF]/70"
                  : "bg-black/30 border-[#26FFDF]/15 group-hover/node:border-[#26FFDF]/50 group-hover/node:bg-black/40"
              }`}
            >
              {isActiveGroup && (
                <motion.span
                  className="absolute inset-0 rounded-full border border-[#26FFDF]/60"
                  animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <GroupIcon
                className={`w-[18px] h-[18px] relative ${
                  isActiveGroup ? "text-[#26FFDF]" : "text-[#b2fff6]/80 group-hover/node:text-[#26FFDF]/80"
                }`}
              />
            </span>

            {/* Etiqueta: ancho 0 y sin opacidad por defecto, el `.group`
                exterior (el <aside>) la revela al pasar el cursor */}
            <span
              className={`ml-3 overflow-hidden whitespace-nowrap max-w-0 opacity-0 transition-all duration-300 group-hover:max-w-[10rem] group-hover:opacity-100 text-sm font-semibold ${
                isActiveGroup ? "text-[#26FFDF]" : "text-[#b2fff6]"
              }`}
            >
              {group.label}
            </span>

            {hasChildren && (
              <ChevronDown
                className="ml-auto w-4 h-4 shrink-0 overflow-hidden max-w-0 opacity-0 transition-all duration-300 group-hover:max-w-[1rem] group-hover:opacity-100 group-hover/branch:rotate-180 text-[#08A696]/70"
              />
            )}
          </button>
        )

        return (
          <div key={group.id} className="group/branch">
            {index > 0 && <Connector />}

            {group.href && !hasChildren ? (
              <Link href={group.href} onClick={onNavigate} className="block">
                {nodeButton}
              </Link>
            ) : (
              nodeButton
            )}

            {hasChildren && (
              <div className="grid grid-rows-[0fr] group-hover/branch:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                <div className="overflow-hidden">
                  <div className="pt-1 pb-1.5 space-y-0.5">
                    {group.children!.map((leaf) => {
                      const LeafIcon = leaf.icon
                      const isActiveLeaf = leaf.href === pathname
                      return (
                        <Link
                          key={leaf.id}
                          href={leaf.href}
                          onClick={onNavigate}
                          className="relative flex items-center py-1 rounded-lg transition-colors duration-200 group/leaf"
                        >
                          {/* Rama corta: del tronco (bajo el nodo padre) al nodo hijo */}
                          <span className="w-7 shrink-0 flex justify-center" aria-hidden>
                            <span className="w-px h-6 bg-[#08A696]/25 rounded-full block" />
                          </span>
                          <span
                            className={`relative shrink-0 flex items-center justify-center w-7 h-7 rounded-full border backdrop-blur-md transition-colors duration-200 ${
                              isActiveLeaf
                                ? "bg-[#0d5d5d]/70 border-[#26FFDF]/70 text-[#26FFDF]"
                                : "bg-black/30 border-[#26FFDF]/15 text-[#b2fff6]/70 group-hover/leaf:border-[#26FFDF]/50 group-hover/leaf:text-[#26FFDF]"
                            }`}
                          >
                            <LeafIcon className="w-3.5 h-3.5" />
                          </span>
                          <span
                            className={`ml-2.5 overflow-hidden whitespace-nowrap max-w-0 opacity-0 transition-all duration-300 group-hover:max-w-[9rem] group-hover:opacity-100 text-sm ${
                              isActiveLeaf
                                ? "text-[#26FFDF] font-medium"
                                : "text-[#b2fff6]/80 group-hover/leaf:text-[#26FFDF]"
                            }`}
                          >
                            {leaf.label}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
