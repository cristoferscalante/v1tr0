"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2, Network, LineChart, Bot, ShoppingCart, Globe, Smartphone, Settings } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { servicesData } from "@/components/home/sections/ServicesTabSection"

const AUTOPLAY_MS = 6000
const CARD_EXAMPLE_MS = 2800

// Contenido propio del hero: un titular con una palabra acentuada
// y 3 features rápidas por servicio.
// Alineado por posición con servicesData (desarrollo, sistemas, automatizacion).
const SLIDE_COPY = [
  {
    prefix: "Desarrollo de",
    accent: "Software",
    suffix: "a tu medida.",
    icon: Network,
  },
  {
    prefix: "Sistemas de",
    accent: "Información",
    suffix: "que iluminan decisiones.",
    icon: LineChart,
  },
  {
    prefix: "",
    accent: "Automatización",
    suffix: "de tareas que libera tiempo.",
    icon: Bot,
  },
] as const

// ============================================================================
// ILUSTRACIONES ANIMADAS POR TARJETA
// ============================================================================

const DEV_NODE_ICONS = [ShoppingCart, Globe, Smartphone] as const

export function DevIllustration({ isDark, glow = true }: { isDark: boolean; glow?: boolean }) {
  const stroke = isDark ? "#26FFDF" : "#08A696"
  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden">
      {glow && (
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full blur-2xl pointer-events-none"
          style={{ backgroundColor: stroke, opacity: isDark ? 0.18 : 0.22 }}
        />
      )}
      <svg viewBox="0 0 200 100" className="relative w-full h-full">
        {[20, 20, 20].map((_, i) => (
          <line
            key={i}
            x1="36"
            y1={22 + i * 28}
            x2="140"
            y2="50"
            stroke={stroke}
            strokeOpacity="0.4"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="dev-line"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
        {[22, 50, 78].map((y, i) => {
          const NodeIcon = DEV_NODE_ICONS[i]!
          return (
            <g key={i}>
              <rect
                x="20"
                y={y - 9}
                width="18"
                height="18"
                rx="5"
                fill={stroke}
                fillOpacity="0.18"
                stroke={stroke}
                strokeOpacity="0.6"
              />
              <foreignObject x="23" y={y - 6} width="12" height="12">
                <NodeIcon
                  width={12}
                  height={12}
                  color={stroke}
                  strokeWidth={2}
                />
              </foreignObject>
            </g>
          )
        })}
        <circle cx="150" cy="50" r="16" fill={stroke} fillOpacity="0.22" stroke={stroke} strokeWidth="1.5" className="dev-hub" style={glow ? { filter: `drop-shadow(0 0 6px ${stroke})` } : undefined} />
        <foreignObject x="142" y="42" width="16" height="16" className="dev-hub-core" style={{ transformOrigin: "150px 50px", ...(glow ? { filter: `drop-shadow(0 0 4px ${stroke})` } : {}) }}>
          <Settings width={16} height={16} color={stroke} strokeWidth={2} />
        </foreignObject>
      </svg>
      <style jsx>{`
        .dev-line {
          animation: devFlow 2.4s linear infinite;
        }
        .dev-hub {
          transform-origin: 150px 50px;
          animation: devPulse 2.4s ease-in-out infinite;
        }
        .dev-hub-core {
          animation: devGearSpin 6s linear infinite;
        }
        @keyframes devFlow {
          to {
            stroke-dashoffset: -16;
          }
        }
        @keyframes devPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.15);
            opacity: 1;
          }
        }
        @keyframes devGearSpin {
          to {
            transform: rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .dev-line,
          .dev-hub,
          .dev-hub-core {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

function DataIllustration({ isDark }: { isDark: boolean }) {
  const stroke = isDark ? "#26FFDF" : "#08A696"
  const bars = [30, 55, 40, 70, 50, 85]
  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden flex items-center justify-center">
      <div
        className="absolute right-4 top-3 w-16 h-16 rounded-full blur-2xl pointer-events-none"
        style={{ backgroundColor: stroke, opacity: isDark ? 0.18 : 0.22 }}
      />
      {/* Escala contenida: la gráfica mantiene su proporción en vez de estirarse a toda la tarjeta */}
      <svg viewBox="0 0 200 100" className="relative w-full h-auto max-h-full" preserveAspectRatio="xMidYMid meet">
        {bars.map((h, i) => (
          <rect
            key={i}
            x={20 + i * 27}
            width="16"
            y={90 - h}
            height={h}
            rx="3"
            fill={stroke}
            fillOpacity="0.25"
            className="data-bar"
            style={{ animationDelay: `${i * 0.15}s`, transformOrigin: `${28 + i * 27}px 90px` }}
          />
        ))}
        <polyline
          points="28,60 55,45 82,58 109,30 136,42 163,20"
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="data-line"
          style={{ filter: `drop-shadow(0 0 5px ${stroke})` }}
        />
        <circle cx="163" cy="20" r="3.5" fill={stroke} className="data-dot" style={{ filter: `drop-shadow(0 0 5px ${stroke})`, transformOrigin: "163px 20px" }} />
      </svg>
      <style jsx>{`
        .data-bar {
          animation: dataGrow 2.2s ease-in-out infinite;
        }
        .data-line {
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
          animation: dataDraw 3s ease-in-out infinite;
        }
        .data-dot {
          animation: dataDotPulse 3s ease-in-out infinite;
        }
        @keyframes dataDotPulse {
          0%,
          15% {
            opacity: 0;
            transform: scale(0.6);
          }
          30%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes dataGrow {
          0%,
          100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.15);
          }
        }
        @keyframes dataDraw {
          0% {
            stroke-dashoffset: 220;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          60%,
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .data-bar,
          .data-line,
          .data-dot {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

function AutomationIllustration({ isDark }: { isDark: boolean }) {
  const stroke = isDark ? "#26FFDF" : "#08A696"
  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden flex items-center justify-center">
      <div
        className="absolute w-24 h-24 rounded-full blur-2xl pointer-events-none"
        style={{ backgroundColor: stroke, opacity: isDark ? 0.16 : 0.2 }}
      />
      <svg viewBox="0 0 100 100" className="relative w-32 h-32">
        <circle cx="50" cy="50" r="42" fill="none" stroke={stroke} strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="4 5" className="auto-ring-outer" />
        <circle cx="50" cy="50" r="29" fill="none" stroke={stroke} strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="3 4" className="auto-ring-inner" />
        {[0, 90, 180, 270].map((deg) => (
          <circle
            key={deg}
            cx={50 + 42 * Math.cos((deg * Math.PI) / 180)}
            cy={50 + 42 * Math.sin((deg * Math.PI) / 180)}
            r="3"
            fill={stroke}
            className="auto-node"
            style={{ filter: `drop-shadow(0 0 4px ${stroke})` }}
          />
        ))}
        <circle cx="50" cy="50" r="14" fill={stroke} fillOpacity="0.22" stroke={stroke} strokeWidth="1.5" />
        <foreignObject x="42" y="42" width="16" height="16" className="auto-core" style={{ transformOrigin: "50px 50px", filter: `drop-shadow(0 0 6px ${stroke})` }}>
          <Bot width={16} height={16} color={stroke} strokeWidth={2} />
        </foreignObject>
      </svg>
      <style jsx>{`
        .auto-ring-outer {
          transform-origin: 50px 50px;
          animation: spinCw 12s linear infinite;
        }
        .auto-ring-inner {
          transform-origin: 50px 50px;
          animation: spinCcw 8s linear infinite;
        }
        .auto-node {
          animation: nodeBlink 2.4s ease-in-out infinite;
        }
        .auto-core {
          transform-origin: 50px 50px;
          animation: corePulse 2.4s ease-in-out infinite;
        }
        @keyframes spinCw {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spinCcw {
          to {
            transform: rotate(-360deg);
          }
        }
        @keyframes nodeBlink {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes corePulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.12);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .auto-ring-outer,
          .auto-ring-inner,
          .auto-node,
          .auto-core {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

const CARD_ILLUSTRATIONS = [DevIllustration, DataIllustration, AutomationIllustration] as const

export interface ProjectExample {
  title: string
  description: string
  subcategory: string
}

// Insignia flotante sobre la ilustración, al estilo de la etiqueta "↑32%"
// del ejemplo de referencia: muestra en loop los proyectos reales del servicio.
export function ServiceProjectsBadge({ examples, isDark }: { examples: ProjectExample[]; isDark: boolean }) {
  const [exampleIndex, setExampleIndex] = useState(0)

  useEffect(() => {
    if (examples.length <= 1) {
      return
    }
    const interval = setInterval(() => {
      setExampleIndex((i) => (i + 1) % examples.length)
    }, CARD_EXAMPLE_MS)
    return () => clearInterval(interval)
  }, [examples.length])

  // Un servicio puede no tener proyectos publicados todavía: sin ejemplos no
  // hay insignia que mostrar.
  if (examples.length === 0) {
    return null
  }

  const example = examples[exampleIndex % examples.length]!

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 max-w-[80%] px-2.5 py-1 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={exampleIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
        >
          <span className={`block text-[9px] font-medium uppercase tracking-wider ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
            {example.subcategory}
          </span>
          <span className={`block text-xs font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>
            {example.title}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function ServiciosHero() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [activeIndex, setActiveIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const safeIndex = activeIndex % servicesData.length
  const activeService = servicesData[safeIndex]!
  const activeCopy = SLIDE_COPY[safeIndex]!

  const restartAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    timerRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % servicesData.length)
    }, AUTOPLAY_MS)
  }, [])

  useEffect(() => {
    restartAutoplay()
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [restartAutoplay])

  const goTo = (index: number) => {
    setActiveIndex(index)
    restartAutoplay()
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center px-4 pb-16 pt-28 sm:pt-32 lg:pt-36">
      {/* Glow de fondo */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute left-1/2 top-[15%] -translate-x-1/2 w-[70%] h-[50%] rounded-full blur-[120px] ${isDark ? "bg-[#08A696]/10" : "bg-[#08A696]/15"}`} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center">
        {/* Título dinámico + subtítulo (crossfade entre servicios) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeService.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <h1 className={`max-w-3xl mx-auto text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-bold leading-[1.1] tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
              {activeCopy.prefix ? `${activeCopy.prefix} ` : ""}
              <em className={`font-serif italic ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                {activeCopy.accent}
              </em>{" "}
              {activeCopy.suffix}
            </h1>

            {/* Checkmarks */}
            <div className={`mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {activeService.subcategories.slice(0, 3).map((sub) => (
                <span key={sub.id} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className={`w-4 h-4 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`} />
                  {sub.name}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>


        {/* Tarjetas de los 3 servicios — cada una con un mini carrusel de proyectos */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full">
          {servicesData.map((service, index) => {
            const Illustration = CARD_ILLUSTRATIONS[index]!
            const isActive = index === safeIndex
            const examples: ProjectExample[] = service.subcategories.flatMap((sub) =>
              sub.examples.map((ex) => ({ ...ex, subcategory: sub.name }))
            )

            return (
              <div
                key={service.id}
                role="button"
                tabIndex={0}
                onClick={() => goTo(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    goTo(index)
                  }
                }}
                className={`relative flex flex-col min-h-[400px] text-left rounded-3xl border p-6 cursor-pointer transition-all duration-300 ${
                  isActive
                    ? isDark
                      ? "bg-[#02505950] border-[#26FFDF]/60 shadow-lg shadow-[#08A696]/20"
                      : "bg-[#c5ebe7] border-[#08A696]/60 shadow-lg shadow-[#08A696]/20"
                    : isDark
                    ? "bg-[#02505920] border-[#08A696]/15 hover:border-[#08A696]/40"
                    : "bg-white/60 border-[#08A696]/20 hover:border-[#08A696]/40"
                }`}
              >
                <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}>
                  {service.title}
                </h3>

                <div className="relative flex-1 min-h-[140px] mt-3">
                  <Illustration isDark={isDark} />
                  <ServiceProjectsBadge examples={examples} isDark={isDark} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
