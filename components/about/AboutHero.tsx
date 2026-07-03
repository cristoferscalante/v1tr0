"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { useIsMobile } from "@/hooks/use-mobile"

// 3D model — sin SSR
const VtrLogoPerfect3D = dynamic(
  () => import("@/components/3d/VtrLogoPerfect3D"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#08A696]/20 border-t-[#26FFDF] animate-spin" />
      </div>
    ),
  }
)

// ============================================================================
// DATOS DE STORYTELLING
// ============================================================================

const STORIES = [
  {
    id: "origen",
    tab: "Origen",
    year: "2025",
    headline: "Nacidos en el corazón del sur",
    body: "V1TR0 nació en 2025 desde el suroccidente colombiano con una convicción: que la tecnología de vanguardia no debería ser exclusiva de las grandes ciudades. Desde Popayán, decidimos construir soluciones que transforman organizaciones locales con herramientas de talla mundial.",
    tag: "Sur de Colombia · 2025",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
    stat: { value: "2025", label: "Fundación" },
  },
  {
    id: "mision",
    tab: "Misión",
    year: "HOY",
    headline: "Software que genera impacto real",
    body: "Nuestra misión es potenciar el rendimiento de toda organización —emprendedores, empresas en crecimiento, agencias internacionales e instituciones consolidadas— mediante soluciones de software hechas a medida que integran, automatizan y escalan con cada proyecto.",
    tag: "Software · Automatización · Datos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    stat: { value: "100%", label: "A medida" },
  },
  {
    id: "vision",
    tab: "Visión",
    year: "MAÑANA",
    headline: "Colombia lidera su propia transformación digital",
    body: "Vemos un futuro donde el talento del suroccidente colombiano compite con los mejores equipos del mundo. Somos el puente entre las necesidades reales de las organizaciones y las tecnologías que pueden resolverlas — hardware y software de vanguardia accesibles para todos.",
    tag: "Colombia · Desarrollo · Innovación",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
    stat: { value: "∞", label: "Escalabilidad" },
  },
  {
    id: "impacto",
    tab: "Impacto",
    year: "AHORA",
    headline: "Tecnología que llega donde más se necesita",
    body: "Desde sistemas de información para cooperación humanitaria hasta plataformas de gestión para pymes locales, V1TR0 construye puentes digitales. Cada línea de código que escribimos acorta la brecha tecnológica entre el sur de Colombia y el ecosistema global de innovación.",
    tag: "Brecha Digital · Acceso · Crecimiento",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
    stat: { value: "+10", label: "Proyectos vivos" },
  },
] as const

type StoryId = (typeof STORIES)[number]["id"]

// ============================================================================
// STATS STRIP
// ============================================================================

const STATS = [
  { value: "2025", label: "Fundados" },
  { value: "Col.", label: "Sur Colombia" },
  { value: "Full", label: "Stack" },
  { value: "24/7", label: "Soporte" },
]

// ============================================================================
// SHIELD BADGE (logo de V1TR0)
// ============================================================================

function ShieldBadge({ isDark }: { isDark: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 mb-6"
    >
      {/* Escudo / Imagotipo */}
      <div className="relative">
        <div className="absolute inset-0 blur-md bg-[#26FFDF]/30 rounded-full scale-150" />
        <div
          className={`relative w-12 h-12 rounded-xl flex items-center justify-center border ${
            isDark
              ? "bg-[#02505940] border-[#26FFDF]/30"
              : "bg-[#e6f7f6] border-[#08A696]/40"
          } shadow-lg shadow-[#08A696]/20`}
        >
          <Image
            src="/imagenes/logos/v1tr0_imagotipo.svg"
            alt="V1TR0 Shield"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
        </div>
      </div>

      {/* Label */}
      <div className="flex flex-col">
        <span
          className={`text-xs font-mono tracking-[0.25em] uppercase font-semibold ${
            isDark ? "text-[#26FFDF]" : "text-[#08A696]"
          }`}
        >
          V1TR0 Technologies
        </span>
        <span className="text-[10px] text-gray-500 tracking-wider font-mono">
          Sur de Colombia · Est. 2025
        </span>
      </div>
    </motion.div>
  )
}

// ============================================================================
// TAB BUTTONS
// ============================================================================

function StoryTabs({
  active,
  onChange,
  isDark,
}: {
  active: StoryId
  onChange: (id: StoryId) => void
  isDark: boolean
}) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {STORIES.map((s) => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 border ${
            active === s.id
              ? isDark
                ? "bg-[#08A696]/20 border-[#26FFDF]/60 text-[#26FFDF] shadow-lg shadow-[#08A696]/20"
                : "bg-[#08A696]/10 border-[#08A696]/60 text-[#08A696] shadow-lg shadow-[#08A696]/10"
              : isDark
              ? "bg-transparent border-[#08A696]/20 text-gray-500 hover:border-[#08A696]/40 hover:text-[#26FFDF]/70"
              : "bg-transparent border-[#08A696]/20 text-gray-400 hover:border-[#08A696]/40 hover:text-[#08A696]/70"
          }`}
        >
          {active === s.id && (
            <motion.span
              layoutId="active-tab-bg"
              className={`absolute inset-0 rounded-lg ${
                isDark ? "bg-[#08A696]/15" : "bg-[#08A696]/08"
              }`}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{s.tab}</span>
        </button>
      ))}
    </div>
  )
}

// ============================================================================
// STORY CONTENT (animated)
// ============================================================================

function StoryContent({
  story,
  isDark,
}: {
  story: (typeof STORIES)[number]
  isDark: boolean
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={story.id}
        initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4"
      >
        {/* Year chip + icon */}
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1.5 text-xs font-mono font-bold tracking-[0.2em] px-2.5 py-1 rounded-full border ${
              isDark
                ? "bg-[#02505940] border-[#26FFDF]/30 text-[#26FFDF]"
                : "bg-[#e6f7f6] border-[#08A696]/40 text-[#08A696]"
            }`}
          >
            <span className={isDark ? "text-[#26FFDF]" : "text-[#08A696]"}>
              {story.icon}
            </span>
            {story.year}
          </span>
          <span className="text-xs text-gray-500 font-mono">{story.tag}</span>
        </div>

        {/* Headline */}
        <h2
          className={`text-2xl md:text-3xl lg:text-[2.1rem] font-extrabold leading-[1.15] tracking-tight ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {story.headline}
        </h2>

        {/* Body */}
        <p
          className={`text-sm md:text-base leading-relaxed ${
            isDark ? "text-gray-400" : "text-gray-600"
          } max-w-lg`}
        >
          {story.body}
        </p>

        {/* Stat highlight */}
        <div
          className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-xl border ${
            isDark
              ? "bg-[#02505930] border-[#08A696]/25 text-[#26FFDF]"
              : "bg-[#e6f7f6] border-[#08A696]/30 text-[#08A696]"
          }`}
        >
          <span className="text-2xl font-black font-mono tracking-tight">
            {story.stat.value}
          </span>
          <span
            className={`text-xs font-semibold uppercase tracking-widest ${
              isDark ? "text-[#26FFDF]/70" : "text-[#08A696]/80"
            }`}
          >
            {story.stat.label}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================================================
// CTA BUTTONS
// ============================================================================

function CTAButtons({ isDark }: { isDark: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex flex-wrap gap-3 pt-2"
    >
      <a
        href="/servicios-referentes/new"
        className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
          isDark
            ? "bg-[#08A696] hover:bg-[#26FFDF] text-black shadow-lg shadow-[#08A696]/30 hover:shadow-[#26FFDF]/30"
            : "bg-[#08A696] hover:bg-[#06877a] text-white shadow-lg shadow-[#08A696]/30"
        }`}
      >
        <span className="relative z-10">Ver servicios →</span>
      </a>
      <a
        href="#team"
        className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
          isDark
            ? "border-[#08A696]/40 text-[#26FFDF]/80 hover:border-[#26FFDF]/70 hover:bg-[#08A696]/10"
            : "border-[#08A696]/40 text-[#08A696] hover:border-[#08A696] hover:bg-[#08A696]/5"
        }`}
      >
        Conoce el equipo
      </a>
    </motion.div>
  )
}

// ============================================================================
// STATS STRIP
// ============================================================================

function StatsStrip({ isDark }: { isDark: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className={`flex items-center gap-6 pt-4 border-t ${
        isDark ? "border-[#08A696]/15" : "border-[#08A696]/20"
      }`}
    >
      {STATS.map((s, i) => (
        <div key={i} className="flex flex-col items-start">
          <span
            className={`text-base font-black font-mono ${
              isDark ? "text-[#26FFDF]" : "text-[#08A696]"
            }`}
          >
            {s.value}
          </span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">
            {s.label}
          </span>
        </div>
      ))}
    </motion.div>
  )
}

// ============================================================================
// MOBILE LAYOUT
// ============================================================================

function MobileHero({
  activeStory,
  setActiveStory,
  isDark,
}: {
  activeStory: StoryId
  setActiveStory: (id: StoryId) => void
  isDark: boolean
}) {
  const story = STORIES.find((s) => s.id === activeStory)!

  return (
    <div className="flex flex-col gap-8 px-4 py-8 pt-24">
      <ShieldBadge isDark={isDark} />
      <StoryTabs active={activeStory} onChange={setActiveStory} isDark={isDark} />
      <StoryContent story={story} isDark={isDark} />

      {/* Modelo centrado en mobile */}
      <div className="w-full h-64 rounded-2xl overflow-hidden border border-[#08A696]/20 bg-black/20">
        <VtrLogoPerfect3D className="w-full h-full" />
      </div>

      <CTAButtons isDark={isDark} />
      <StatsStrip isDark={isDark} />
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AboutHero() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const isMobile = useIsMobile()
  const [activeStory, setActiveStory] = useState<StoryId>("origen")

  const handleStoryChange = useCallback((id: StoryId) => {
    setActiveStory(id)
  }, [])

  const story = STORIES.find((s) => s.id === activeStory)!

  if (isMobile) {
    return (
      <MobileHero
        activeStory={activeStory}
        setActiveStory={handleStoryChange}
        isDark={isDark}
      />
    )
  }

  return (
    <div className="relative w-full h-full flex items-center">
      {/* ── DECORACIÓN DE FONDO ─────────────────────────────────────────── */}
      {/* Glow teal detrás del modelo */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] h-[80%] pointer-events-none">
        <div className="absolute inset-0 rounded-full blur-[100px] bg-[#08A696]/12" />
        <div className="absolute inset-[15%] rounded-full blur-[60px] bg-[#26FFDF]/08" />
      </div>

      {/* Grid de puntos sutil */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #26FFDF 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── COLUMNA IZQUIERDA — TEXTO ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-[40%] flex flex-col justify-center gap-5 pl-8 xl:pl-14 pr-4"
      >
        {/* Shield badge */}
        <ShieldBadge isDark={isDark} />

        {/* Tabs */}
        <StoryTabs
          active={activeStory}
          onChange={handleStoryChange}
          isDark={isDark}
        />

        {/* Story content */}
        <StoryContent story={story} isDark={isDark} />

        {/* CTA */}
        <CTAButtons isDark={isDark} />

        {/* Stats */}
        <StatsStrip isDark={isDark} />
      </motion.div>

      {/* ── SEPARADOR VERTICAL ─────────────────────────────────────────── */}
      <div
        className={`absolute left-[40%] top-[10%] bottom-[10%] w-px pointer-events-none ${
          isDark
            ? "bg-gradient-to-b from-transparent via-[#08A696]/30 to-transparent"
            : "bg-gradient-to-b from-transparent via-[#08A696]/20 to-transparent"
        }`}
      />

      {/* ── COLUMNA DERECHA — MODELO 3D ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="absolute right-0 top-0 w-[62%] h-full"
      >
        <VtrLogoPerfect3D className="w-full h-full" />
      </motion.div>
    </div>
  )
}
