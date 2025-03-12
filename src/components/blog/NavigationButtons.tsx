"use client"

import type React from "react"

import { useCallback, useState } from "react"
import type { ReactNode } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

interface NavigationButtonsProps {
  direction: "up" | "down"
}

export default function NavigationButtons({ direction }: NavigationButtonsProps): ReactNode {
  const [isScrolling, setIsScrolling] = useState(false)

  const handleScroll = useCallback(() => {
    setIsScrolling(true)
    try {
      if (direction === "down") {
        const postsGrid = document.querySelector("#posts-grid")
        if (postsGrid) {
          postsGrid.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      setTimeout(() => setIsScrolling(false), 1000)
    } catch (error) {
      console.error("Error al realizar el scroll:", error)
      setIsScrolling(false)
    }
  }, [direction])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        handleScroll()
      }
    },
    [handleScroll],
  )

  return (
    <button
      onClick={handleScroll}
      onKeyDown={handleKeyDown}
      className={`
        inline-flex items-center gap-2 px-5 py-2.5 
        bg-custom-2/20 text-highlight 
        hover:bg-custom-2/40 active:bg-custom-2/60 
        transition-all duration-300 ease-in-out 
        rounded-full font-medium 
        focus:outline-none focus:ring-2 focus:ring-highlight focus:ring-offset-2 
        dark:focus:ring-offset-gray-900 
        hover:scale-105 active:scale-95 
        shadow-sm hover:shadow
        ${isScrolling ? "opacity-50 cursor-wait transform scale-90" : ""}
      `}
      disabled={isScrolling}
      aria-label={direction === "down" ? "Ver artículos" : "Volver arriba"}
      title={direction === "down" ? "Ir a la lista de artículos" : "Volver al inicio de la página"}
      aria-busy={isScrolling}
      aria-pressed={isScrolling}
    >
      {direction === "down" ? (
        <>
          Ver artículos
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isScrolling ? "translate-y-1" : ""}`} />
        </>
      ) : (
        <>
          Volver arriba
          <ChevronUp className={`w-4 h-4 transition-transform duration-300 ${isScrolling ? "-translate-y-1" : ""}`} />
        </>
      )}
    </button>
  )
}

