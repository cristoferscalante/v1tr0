"use client"

import { useEffect, useRef, type ComponentType } from "react"
import type { servicesData } from "@/components/home/sections/ServicesTabSection"

type Service = (typeof servicesData)[number]

interface ServiciosCategoryRailProps {
  services: Service[]
  activeIndex: number
  onSelect: (index: number) => void
  /** Subcategoría por la que se filtran los proyectos; null muestra todas. */
  activeSubcategory: string | null
  onFilter: (subcategoryId: string | null) => void
  /** Si la pestaña activa está desplegada. Lo controla el padre para acomodar la grilla. */
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  /** Ilustración animada de cada categoría, alineada por posición con `services`. */
  illustrations: readonly ComponentType<{ glow?: boolean }>[]
}

function projectCount(service: Service) {
  return service.subcategories.reduce((sum, sub) => sum + sub.examples.length, 0)
}

/**
 * La ilustración animada de la categoría en miniatura, como icono de la
 * pestaña. Se dibuja a su tamaño natural y se reduce con transform para que
 * conserve trazos y animaciones tal cual.
 */
function MiniIllustration({ Illustration, active }: { Illustration?: ComponentType<{ glow?: boolean }>; active: boolean }) {
  if (!Illustration) {
    return null
  }
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none relative block h-9 w-[45px] shrink-0 overflow-hidden transition-opacity duration-300 ${
        active ? "opacity-100" : "opacity-60 group-hover:opacity-90"
      }`}
    >
      <span className="absolute left-0 top-0 block h-[128px] w-[160px] origin-top-left scale-[0.28]">
        <Illustration glow={false} />
      </span>
    </span>
  )
}

/**
 * Marco pegado al borde derecho del que salen las categorías como pestañas.
 * En reposo solo asoma el icono; la activa se estira hacia la izquierda y
 * despliega, en acordeón, su ilustración y sus subcategorías.
 */
export function ServiciosCategoryRail({
  services,
  activeIndex,
  onSelect,
  activeSubcategory,
  onFilter,
  illustrations,
  expanded = true,
  onExpandedChange,
}: ServiciosCategoryRailProps) {
  // Un clic fuera del riel pliega todas las pestañas; un clic en una la
  // activa y la despliega.
  const setExpanded = (value: boolean) => onExpandedChange?.(value)
  const railRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!expanded) {
      return undefined
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (railRef.current && !railRef.current.contains(event.target as Node)) {
        onExpandedChange?.(false)
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [expanded, onExpandedChange])

  return (
    <div ref={railRef} className="relative flex items-stretch">
      {/* Pestañas: alineadas a la derecha para que crezcan hacia la izquierda */}
      <div className="relative z-10 flex flex-col items-end gap-2 py-6" role="tablist" aria-orientation="vertical" aria-label="Categorías de servicio">
        {services.map((service, index) => {
          const isActive = index === activeIndex
          const isOpen = isActive && expanded
          const Illustration = illustrations[index]
          const projects = projectCount(service)
          return (
            <div
              key={service.id}
              className={`group relative -mr-px flex justify-end overflow-hidden rounded-l-xl border border-r-0 text-left backdrop-blur-md transition-[width,background-color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen
                  ? "w-[18rem] xl:w-[20rem] bg-[#0b1212]/90 border-white/[0.12]"
                  : "w-[4.5rem] bg-[#0b1212]/70 border-white/[0.06] hover:border-white/[0.14]"
              }`}
            >
              {/* Contenido a ancho fijo: la pestaña lo recorta mientras crece */}
              <div className="w-[18rem] xl:w-[20rem] shrink-0">
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={service.title}
                  aria-expanded={isOpen}
                  onClick={() => {
                    onSelect(index)
                    setExpanded(true)
                  }}
                  className="flex h-14 w-full items-center justify-end gap-3 pl-6 pr-3 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#26FFDF]/50 rounded-l-xl"
                >
                  <span
                    className={`min-w-0 flex-1 truncate text-sm font-medium tracking-tight transition-opacity duration-300 ${
                      isOpen ? "opacity-100 delay-200 text-textPrimary" : "opacity-0 text-textMuted"
                    }`}
                  >
                    {service.title}
                  </span>
                  {/* Abierta, la ilustración grande está en el cuerpo: la mini se oculta */}
                  <span className={`transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`}>
                    <MiniIllustration Illustration={Illustration} active={isActive} />
                  </span>
                </button>

                {/* Acordeón: la fila pasa de 0fr a 1fr y el cuerpo aparece */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                  // Cerrado no debe recibir foco ni clics
                  inert={!isOpen}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="border-t border-white/[0.06] px-6 pb-6 pt-5">
                      {Illustration && (
                        <div className="relative h-28 w-full opacity-80">
                          <Illustration glow={false} />
                        </div>
                      )}
                      {/* Subcategorías: cada una filtra los proyectos; pulsar la activa quita el filtro */}
                      <ul className="mt-5 divide-y divide-white/[0.05]">
                        {service.subcategories.map((sub) => {
                          const isFiltered = activeSubcategory === sub.id
                          return (
                            <li key={sub.id}>
                              <button
                                type="button"
                                aria-pressed={isFiltered}
                                onClick={() => onFilter(isFiltered ? null : sub.id)}
                                className={`relative flex w-full items-center gap-3 py-2 text-left text-[13px] transition-colors duration-200 focus:outline-none focus-visible:text-textPrimary ${
                                  isFiltered ? "text-textPrimary" : "text-textMuted hover:text-textPrimary"
                                }`}
                              >
                                <span
                                  aria-hidden="true"
                                  className={`h-1 w-1 shrink-0 rounded-full transition-colors duration-200 ${
                                    isFiltered ? "bg-[#26FFDF]" : "bg-white/15"
                                  }`}
                                />
                                <span className="truncate">{sub.name}</span>
                                <span className={`ml-auto text-[11px] tabular-nums ${isFiltered ? "text-[#26FFDF]/80" : "text-white/35"}`}>
                                  {sub.examples.length > 0 ? String(sub.examples.length).padStart(2, "0") : "—"}
                                </span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                      <div className="mt-4 flex items-center justify-between gap-3 text-[11px] text-white/40">
                        <span>
                          {projects > 0 ? `${projects} ${projects === 1 ? "proyecto publicado" : "proyectos publicados"}` : "Proyectos en preparación"}
                        </span>
                        {activeSubcategory && (
                          <button
                            type="button"
                            onClick={() => onFilter(null)}
                            className="text-white/60 underline-offset-4 hover:text-textPrimary hover:underline focus:outline-none focus-visible:underline"
                          >
                            Ver todos
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marca de la pestaña activa: una línea fina contra el marco */}
              <span
                aria-hidden="true"
                className={`absolute right-0 top-3 bottom-3 w-[2px] rounded-full transition-opacity duration-300 ${
                  isActive ? "bg-[#26FFDF]/80 opacity-100" : "opacity-0"
                }`}
              />
            </div>
          )
        })}
      </div>

      {/* Marco: un riel sobrio de líneas finas */}
      <div aria-hidden="true" className="relative w-2.5 shrink-0 rounded-l-md border border-r-0 border-white/[0.1] bg-[#0b1212]/80">
        <span className="absolute inset-y-4 left-1/2 w-px -translate-x-1/2 bg-white/[0.08]" />
      </div>
    </div>
  )
}

/**
 * Versión móvil del riel: fila de pestañas donde la activa se estira y
 * muestra su nombre; las demás quedan como icono.
 */
export function ServiciosCategoryTabs({ services, activeIndex, onSelect, activeSubcategory, onFilter, illustrations }: ServiciosCategoryRailProps) {
  const activeService = services[activeIndex]
  return (
    <div className="flex w-full flex-col gap-3">
      <div
        className="flex w-full gap-2 rounded-2xl border border-[#26FFDF]/20 bg-[#031414]/70 p-1.5"
        role="tablist"
        aria-label="Categorías de servicio"
      >
        {services.map((service, index) => {
          const isActive = index === activeIndex
          return (
            <button
              key={service.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={service.title}
              onClick={() => onSelect(index)}
              className={`flex min-h-[44px] min-w-0 items-center justify-center gap-2 overflow-hidden rounded-xl border px-3 transition-[flex-grow,background-color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60 ${
                isActive
                  ? "flex-[1_1_0%] border-[#26FFDF]/50 bg-[#0d5d5d]/60 text-[#26FFDF]"
                  : "flex-[0_0_auto] border-transparent text-[#26FFDF]/60"
              }`}
            >
              <MiniIllustration Illustration={illustrations[index]} active={isActive} />
              {isActive && <span className="truncate text-sm font-semibold">{service.shortTitle}</span>}
            </button>
          )
        })}
      </div>

      {/* Filtro por subcategoría: fila deslizable de chips */}
      {activeService && (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[{ id: null, name: "Todos" }, ...activeService.subcategories].map((sub) => {
            const isFiltered = activeSubcategory === sub.id
            return (
              <button
                key={sub.id ?? "all"}
                type="button"
                aria-pressed={isFiltered}
                onClick={() => onFilter(sub.id)}
                className={`min-h-[36px] shrink-0 whitespace-nowrap rounded-full border px-3.5 text-xs font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60 ${
                  isFiltered
                    ? "border-[#26FFDF]/50 bg-[#0d5d5d]/60 text-[#26FFDF]"
                    : "border-white/10 text-textMuted"
                }`}
              >
                {sub.name}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
