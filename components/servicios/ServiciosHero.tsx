"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bot, ShoppingCart, Globe, Smartphone, Settings } from "lucide-react"
import { servicesData } from "@/components/home/sections/ServicesTabSection"
import { ServiciosCategoryRail, ServiciosCategoryTabs } from "@/components/servicios/ServiciosCategoryRail"
import ServiceProjectsGrid from "@/components/servicios/ServiceProjectsGrid"

const AUTOPLAY_MS = 6000
const CARD_EXAMPLE_MS = 2800

// ============================================================================
// ILUSTRACIONES ANIMADAS POR TARJETA
// ============================================================================

const DEV_NODE_ICONS = [ShoppingCart, Globe, Smartphone] as const

export function DevIllustration({ glow = true }: { glow?: boolean }) {
  const stroke = "#26FFDF"
  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden">
      {glow && (
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full blur-2xl pointer-events-none"
          style={{ backgroundColor: stroke, opacity: 0.18 }}
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

function DataIllustration() {
  const stroke = "#26FFDF"
  const bars = [30, 55, 40, 70, 50, 85]
  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden flex items-center justify-center">
      <div
        className="absolute right-4 top-3 w-16 h-16 rounded-full blur-2xl pointer-events-none"
        style={{ backgroundColor: stroke, opacity: 0.18 }}
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

function AutomationIllustration() {
  const stroke = "#26FFDF"
  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden flex items-center justify-center">
      <div
        className="absolute w-24 h-24 rounded-full blur-2xl pointer-events-none"
        style={{ backgroundColor: stroke, opacity: 0.16 }}
      />
      <svg viewBox="0 0 100 100" className="relative h-full max-h-32 w-auto aspect-square">
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
export function ServiceProjectsBadge({ examples }: { examples: ProjectExample[] }) {
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
          <span className={`block text-[9px] font-medium uppercase tracking-wider text-[#26FFDF]`}>
            {example.subcategory}
          </span>
          <span className={`block text-xs font-medium truncate text-white`}>
            {example.title}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function ServiciosHero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Filtro por subcategoría; se guarda con su categoría para que al cambiar
  // de categoría (a mano o por el autoplay) deje de aplicar solo.
  const [filter, setFilter] = useState<{ serviceIndex: number; subcategoryId: string } | null>(null)

  const [railExpanded, setRailExpanded] = useState(true)

  const safeIndex = activeIndex % servicesData.length
  const activeSubcategory = filter?.serviceIndex === safeIndex ? filter.subcategoryId : null
  const handleFilter = (subcategoryId: string | null) =>
    setFilter(subcategoryId ? { serviceIndex: safeIndex, subcategoryId } : null)
  const activeService = servicesData[safeIndex]!

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

  const pausedRef = useRef(false)

  const pauseAutoplay = () => {
    pausedRef.current = true
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const resumeAutoplay = () => {
    pausedRef.current = false
    restartAutoplay()
  }

  const goTo = (index: number) => {
    setActiveIndex(index)
    if (!pausedRef.current) {
      restartAutoplay()
    }
  }

  return (
    <section
      // overflow-x-clip y no overflow-hidden: este último rompe el sticky del riel
      className="relative min-h-screen w-full overflow-x-clip border-t border-white/[0.06] px-4 pb-20 pt-24 sm:pt-28 lg:pt-32 lg:px-0"
      // Mientras el usuario recorre los proyectos, la categoría no cambia sola
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      onFocusCapture={pauseAutoplay}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          resumeAutoplay()
        }
      }}
    >
      {/* Glow de fondo */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute left-1/2 top-[15%] -translate-x-1/2 w-[70%] h-[50%] rounded-full blur-[120px] bg-[#08A696]/10`} />
      </div>

      {/* Con el riel plegado el contenido se centra en toda la pantalla; al
          desplegarse se corre a la izquierda para dejarle sitio. */}
      <div
        className={`relative z-10 w-full transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          railExpanded ? "lg:pl-8 lg:pr-[23rem] xl:pr-[25rem]" : "lg:px-28"
        }`}
      >
        <div className="max-w-5xl mx-auto w-full flex flex-col items-center text-center min-w-0">
          {/* Encabezado de sección, con el mismo formato que el resto del recorrido */}
          <div className="mb-10 flex w-full flex-col gap-3 text-left sm:flex-row sm:items-baseline sm:justify-between">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">
              <span className="text-white/30">01</span>&nbsp;&nbsp;Catálogo
            </p>
            <p className="max-w-md text-sm leading-relaxed text-textMuted">
              Elige una línea de desarrollo y filtra por especialidad. Lo que aún no tiene proyecto publicado aparece como maqueta.
            </p>
          </div>
          {/* Móvil y tablet: las categorías van en una fila sobre los proyectos */}
          <div className="w-full lg:hidden">
            <ServiciosCategoryTabs
              services={servicesData}
              activeIndex={safeIndex}
              onSelect={goTo}
              activeSubcategory={activeSubcategory}
              onFilter={handleFilter}
              illustrations={CARD_ILLUSTRATIONS}
            />
          </div>

          {/* Proyectos de la categoría activa; maquetas donde aún no hay */}
          <div className="mt-6 lg:mt-0 w-full">
            <ServiceProjectsGrid service={activeService} subcategoryId={activeSubcategory} />
          </div>
        </div>
      </div>

      {/* Escritorio: marco pegado al borde derecho. Se ancla por arriba para
          que al desplegarse crezca hacia abajo y no se mueva: plegado (~15rem)
          queda centrado, y el tope se limita para que desplegado (~39rem)
          siga cabiendo en la ventana sin pasar por debajo del header. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden lg:block">
        <div className="pointer-events-auto sticky top-[clamp(6.5rem,calc(50vh-7.5rem),calc(100vh-39.5rem))]">
          <ServiciosCategoryRail
            services={servicesData}
            activeIndex={safeIndex}
            onSelect={goTo}
            activeSubcategory={activeSubcategory}
            onFilter={handleFilter}
            illustrations={CARD_ILLUSTRATIONS}
            expanded={railExpanded}
            onExpandedChange={setRailExpanded}
          />
        </div>
      </div>
    </section>
  )
}
