"use client"

import React, { useState, useEffect, useTransition, type ReactNode } from "react"
import { FileText, ChevronDown } from "lucide-react"
import { slugify, findElementByIdOrText, logAllHeadings } from "@/src/lib/utils"

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
    <div className="bg-backgroundSecondary rounded-xl shadow-md overflow-hidden border border-custom-2/20 transition-all duration-300 hover:shadow-lg">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between w-full p-4 font-medium text-highlight bg-custom-1/30"
      >
        <div className="flex items-center">
          <FileText className="w-4 h-4 mr-2 text-primary" />
          <h3 className="font-bold">Contenido</h3>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? "max-h-0" : "max-h-[500px]"}`}
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
                    className={`block py-1 border-l-2 pl-3 hover:text-highlight transition-all duration-300 ${
                      activeId === slugId
                        ? "border-highlight text-highlight font-medium"
                        : "border-transparent text-textMuted hover:border-custom-2/50"
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
  )
}

