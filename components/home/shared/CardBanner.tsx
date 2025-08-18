"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"

interface CardBannerProps {
  icon: string // Ruta del archivo SVG
  title: string
  onClick?: () => void // Función para manejar el clic (opcional ahora)
  href?: string // URL para navegación (opcional)
}

export default function CardBanner({ icon, title, onClick, href }: CardBannerProps) {
  // Obtener el tema actual
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Contenido interno del card que se reutiliza
  const cardContent = (
    <>
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${isDark ? "from-[#08a6961e] to-[#26ffde23]" : "from-[#08a69630] to-[#08a69620]"} rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all duration-300`}
      ></div>
      <div
        className={`relative ${isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm"} p-6 rounded-2xl border ${isDark ? "border-[#08A696]/20" : "border-[#08A696]/30"} flex flex-row items-center justify-start transition-all duration-300 transform scale-95 group-hover:scale-100 group-hover:border-[#08A696] ${isDark ? "group-hover:bg-[#02505950]" : "group-hover:bg-[#c5ebe7]"} min-h-[140px] w-full h-full shadow-lg group-hover:shadow-xl group-hover:shadow-[#08A696]/10`}
      >
        <div className="flex-shrink-0 flex items-center justify-center mr-3 transition-transform duration-300 group-hover:scale-110">
          <div className={`p-2 rounded-xl ${isDark ? "bg-[#08A696]/10" : "bg-[#08A696]/5"} group-hover:bg-[#08A696]/20 transition-all duration-300`}>
            <Image src={icon || "/placeholder.svg"} alt="" height={40} width={40} className="transition-transform duration-300 group-hover:rotate-3" />
          </div>
        </div>
        <h3 className={`flex-1 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"} font-semibold text-base leading-tight transition-colors duration-300 group-hover:text-[#08A696] ${isDark ? "group-hover:text-[#26FFDF]" : ""} text-left whitespace-nowrap overflow-hidden text-ellipsis`}>
          {title}
        </h3>
      </div>
    </>
  )

  // Si se proporciona href, renderizar como Link
  if (href) {
    return (
      <Link
        href={href}
        className="relative group w-full text-left focus:outline-none focus:ring-2 focus:ring-[#08A696] focus:ring-opacity-50 focus:ring-offset-2 rounded-2xl block transition-all duration-300 hover:transform hover:-translate-y-1"
        aria-label={title}
      >
        {cardContent}
      </Link>
    )
  }

  // Si no hay href, renderizar como botón con onClick
  return (
    <button
      onClick={onClick}
      className="relative group w-full text-left focus:outline-none focus:ring-2 focus:ring-[#08A696] focus:ring-opacity-50 focus:ring-offset-2 rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-1"
      aria-label={title}
    >
      {cardContent}
    </button>
  )
}
