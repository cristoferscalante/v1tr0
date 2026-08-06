"use client"

import { ScrollVelocityContainer, ScrollVelocityRow } from "@/components/ui/scroll-based-velocity"

interface PromoCarouselProps {
  isDark: boolean
  speed?: number
  size?: "md" | "lg"
}

// Diseños genéricos de muestra — placeholders hasta tener capturas reales
// de páginas/proyectos por servicio. El layout (mockup de navegador +
// bloques de contenido) es el estándar a reutilizar cuando lleguen los
// diseños definitivos de cada servicio.
const PLACEHOLDER_DESIGNS = [
  { label: "Landing Page", accent: "#26FFDF" },
  { label: "E-commerce", accent: "#08A696" },
  { label: "Dashboard", accent: "#26FFDF" },
  { label: "App Móvil", accent: "#08A696" },
  { label: "Portal Web", accent: "#26FFDF" },
  { label: "Panel Admin", accent: "#08A696" },
] as const

function BrowserMockupCard({
  label,
  accent,
  isDark,
  size,
}: {
  label: string
  accent: string
  isDark: boolean
  size: "md" | "lg"
}) {
  const isLg = size === "lg"
  return (
    <div
      className={`${isLg ? "w-80 sm:w-96" : "w-64 sm:w-72"} rounded-2xl border overflow-hidden shrink-0 ${
        isDark ? "bg-[#02505931] border-[#08A696]/20" : "bg-[#e6f7f6] border-[#08A696]/30"
      }`}
    >
      {/* Barra de navegador */}
      <div className={`flex items-center gap-1.5 px-3 py-2 border-b ${isDark ? "border-[#08A696]/15" : "border-[#08A696]/20"}`}>
        <span className="w-2 h-2 rounded-full bg-red-400/70" />
        <span className="w-2 h-2 rounded-full bg-yellow-400/70" />
        <span className="w-2 h-2 rounded-full bg-green-400/70" />
      </div>

      {/* Contenido genérico */}
      <div className={isLg ? "p-5 space-y-3" : "p-4 space-y-2"}>
        <div
          className={isLg ? "h-36 rounded-lg" : "h-24 rounded-lg"}
          style={{
            background: `linear-gradient(135deg, ${accent}33, ${accent}0d)`,
            border: `1px solid ${accent}40`,
          }}
        />
        <div className={`${isLg ? "h-3" : "h-2.5"} w-3/4 rounded-full ${isDark ? "bg-[#08A696]/20" : "bg-[#08A696]/25"}`} />
        <div className={`${isLg ? "h-3" : "h-2.5"} w-1/2 rounded-full ${isDark ? "bg-[#08A696]/15" : "bg-[#08A696]/15"}`} />
      </div>

      <div className={`${isLg ? "px-5 pb-5 pt-1 text-sm" : "px-4 pb-4 pt-1 text-xs"} font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        {label}
      </div>
    </div>
  )
}

export default function PromoCarousel({ isDark, speed = 10, size = "md" }: PromoCarouselProps) {
  return (
    <div className={`relative w-full ${size === "lg" ? "h-80" : "h-64"} overflow-hidden`}>
      <ScrollVelocityContainer className="h-full flex items-center">
        <ScrollVelocityRow baseVelocity={speed} className="flex items-center">
          {PLACEHOLDER_DESIGNS.map((design, i) => (
            <BrowserMockupCard key={i} label={design.label} accent={design.accent} isDark={isDark} size={size} />
          ))}
        </ScrollVelocityRow>
      </ScrollVelocityContainer>

      <div className={`pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r ${isDark ? "from-background" : "from-background"} to-transparent`} />
      <div className={`pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l ${isDark ? "from-background" : "from-background"} to-transparent`} />
    </div>
  )
}
