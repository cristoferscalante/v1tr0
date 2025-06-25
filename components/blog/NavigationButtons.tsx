"use client"

import { useCallback, useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

interface NavigationButtonsProps {
  direction: "up" | "down"
}

export default function NavigationButtons({ direction }: NavigationButtonsProps) {
  const [isScrolling, setIsScrolling] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const handleScroll = useCallback(() => {
    setIsScrolling(true)
    try {
      if (direction === "down") {
        const postsGrid = document.getElementById("posts-grid")
        if (postsGrid) {
          postsGrid.scrollIntoView({ behavior: "smooth", block: "start" })
        } else {
          const scrollAmount = window.innerHeight * 0.8
          window.scrollBy({
            top: scrollAmount,
            behavior: "smooth",
          })
        }
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
    } catch (error) {
      console.error("Error al realizar el scroll:", error)
      if (direction === "down") {
        window.scrollBy(0, 500)
      } else {
        window.scrollTo(0, 0)
      }
    }
    setTimeout(() => setIsScrolling(false), 1000)
  }, [direction])

  return (
    <div className="relative group inline-block">
      {/* Gradiente exterior */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${isDark ? "from-[#08a6961e] to-[#26ffde23]" : "from-[#08a69630] to-[#08a69620]"} rounded-full blur opacity-30 group-hover:opacity-60 transition-all duration-300`}
      ></div>
      
      {/* Botón con glassmorphism */}
      <button 
        onClick={handleScroll} 
        disabled={isScrolling}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 transform scale-95 group-hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? "bg-[#02505931] backdrop-blur-sm border-[#08A696]/20 text-[#26FFDF] hover:bg-[#02505950] hover:border-[#08A696]" : "bg-[#e6f7f6] backdrop-blur-sm border-[#08A696]/30 text-[#08A696] hover:bg-[#c5ebe7] hover:border-[#08A696]"} border shadow-lg group-hover:shadow-xl group-hover:shadow-[#08A696]/10`}
      >
        {direction === "up" ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Volver arriba
          </>
        ) : (
          <>
            Ver post
            <ChevronDown className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  )
}
