"use client"

import React, { useState, useEffect, useTransition, type ReactNode } from "react"
import { FileText, ChevronDown } from "lucide-react"
import { slugify, findElementByIdOrText, logAllHeadings } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

interface TableOfContentsProps {
  headings: {
    level: number
    text: string
    id: string
  }[]
  children?: ReactNode
}

export default function TableOfContents({ headings, children }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [, startTransition] = useTransition()
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Función para inicializar los IDs de encabezados
  const initializeHeadingIds = React.useCallback(() => {
    if (typeof document === "undefined") return

    // Recorrer todos los encabezados del documento
    const documentHeadings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")

    documentHeadings.forEach((heading) => {
      const headingText = heading.textContent?.trim() || ""
      if (!heading.id) {
        // Si el encabezado no tiene ID, asignarle uno basado en su texto
        heading.id = slugify(headingText)
      }
    })

    // Log para depuración en desarrollo
    if (process.env.NODE_ENV === "development") {
      logAllHeadings()
    }
  }, [])

  // Efecto para inicializar IDs
  useEffect(() => {
    // Retrasar la inicialización para dar tiempo a que el DOM se renderice
    const initTimeout = setTimeout(() => {
      initializeHeadingIds()
    }, 500)

    return () => clearTimeout(initTimeout)
  }, [initializeHeadingIds])

  // Efecto para configurar el observador de intersección
  useEffect(() => {
    // Retrasar la configuración del observador
    const observerTimeout = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startTransition(() => {
                setActiveId(entry.target.id)
              })
            }
          })
        },
        { rootMargin: "0% 0% -80% 0%" },
      )

      // Observar los encabezados
      headings.forEach(({ text, id }) => {
        const slugId = id || slugify(text)
        const element = document.getElementById(slugId)

        if (element) {
          observer.observe(element)
        }
      })

      return () => observer.disconnect()
    }, 800)

    return () => clearTimeout(observerTimeout)
  }, [headings])

  // Si no hay encabezados, no mostramos nada
  if (!headings || headings.length === 0) {
    return null
  }

  return (
    <div className="relative group">
      {/* Gradiente exterior igual a BlogCard */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${isDark ? "from-[#08a6961e] to-[#26ffde23]" : "from-[#08a69630] to-[#08a69620]"} rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all duration-300`}
      ></div>
      
      {/* Container principal con glassmorphism */}
      <div 
        className={`relative ${isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm"} rounded-2xl border ${isDark ? "border-[#08A696]/20" : "border-[#08A696]/30"} transition-all duration-300 transform scale-95 group-hover:scale-100 group-hover:border-[#08A696] ${isDark ? "group-hover:bg-[#02505950]" : "group-hover:bg-[#c5ebe7]"} shadow-lg group-hover:shadow-xl group-hover:shadow-[#08A696]/10 overflow-hidden`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center justify-between w-full p-4 font-medium transition-all duration-300 ${isDark ? "text-[#26FFDF] hover:text-[#26FFDF]" : "text-[#08A696] hover:text-[#08A696]"} ${isDark ? "bg-[#08A696]/10" : "bg-[#08A696]/5"} ${isDark ? "hover:bg-[#08A696]/20" : "hover:bg-[#08A696]/10"}`}
        >
          <div className="flex items-center">
            <FileText className={`w-4 h-4 mr-2 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`} />
            <h3 className="font-bold">Contenido</h3>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
        </button>

        <div
          className={`transition-all duration-300 ease-in-out toc-scroll ${isCollapsed ? "max-h-0 overflow-hidden" : "max-h-[500px] overflow-y-auto"}`}
        >
          <nav className="p-4">
            <ul className="space-y-2 text-sm">
              {headings.map(({ level, text, id }) => {
                const slugId = id || slugify(text)

                return (
                  <li
                    key={slugId}
                    style={{ paddingLeft: `${(level - 1) * 12}px` }}
                    className="transition-all duration-300"
                  >
                    <a
                      href={`#${slugId}`}
                      className={`block py-1 border-l-2 pl-3 transition-all duration-300 rounded-md ${
                        activeId === slugId
                          ? `${isDark ? "border-[#26FFDF] text-[#26FFDF]" : "border-[#08A696] text-[#08A696]"} font-medium ${isDark ? "bg-[#08A696]/10" : "bg-[#08A696]/5"}`
                          : `border-transparent ${isDark ? "text-[#a0a0a0] hover:text-[#26FFDF]" : "text-[#666666] hover:text-[#08A696]"} ${isDark ? "hover:border-[#08A696]/50 hover:bg-[#08A696]/5" : "hover:border-[#08A696]/30 hover:bg-[#08A696]/5"}`
                      }`}
                      onClick={(e) => {
                        e.preventDefault()

                        // Búsqueda inteligente de elementos
                        const targetElement = findElementByIdOrText(slugId, text)

                        if (targetElement) {
                          targetElement.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          })

                          // Asegurar que el elemento tenga ID
                          if (!targetElement.id) {
                            targetElement.id = slugId
                          }

                          // Actualizar URL y estado activo
                          window.history.pushState(null, "", `#${targetElement.id}`)
                          setActiveId(targetElement.id)
                        } else if (process.env.NODE_ENV === "development") {
                          console.error(`No se pudo encontrar ningún elemento para "${text}"`)
                        }
                      }}
                    >
                      {text}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
          {React.Children.map(children, (child) => child)}
        </div>
      </div>
    </div>
  )
}
