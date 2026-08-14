"use client"

import Link from "next/link"
import { useTheme } from "@/components/theme-provider"
import Image from "next/image"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { DevIllustration } from "@/components/servicios/ServiciosHero"
import { servicesData } from "@/components/home/sections/ServicesTabSection"
import { accentText } from "@/components/home/shared/surface"

// ============================================================================
// ILUSTRACIONES ANIMADAS POR TARJETA
// Mismo lenguaje visual que las tarjetas de /servicios: SVG plano, un solo
// color de marca y animaciones sutiles que se desactivan con reduced-motion.
// ============================================================================

/** Tienda: vitrina de productos que respira. */
function TiendaIllustration({ isDark }: { isDark: boolean; glow?: boolean }) {
  const stroke = isDark ? "#26FFDF" : "#08A696"
  const tiles = [
    { x: 20, y: 18 },
    { x: 76, y: 18 },
    { x: 132, y: 18 },
    { x: 20, y: 58 },
    { x: 76, y: 58 },
    { x: 132, y: 58 },
  ]
  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden">
      <svg viewBox="0 0 200 100" className="relative w-full h-full">
        {tiles.map((t, i) => (
          <g key={i} className="shop-tile" style={{ animationDelay: `${i * 0.25}s` }}>
            <rect
              x={t.x}
              y={t.y}
              width="48"
              height="30"
              rx="7"
              fill={stroke}
              fillOpacity="0.12"
              stroke={stroke}
              strokeOpacity="0.55"
              strokeWidth="1.5"
            />
            <rect x={t.x + 8} y={t.y + 20} width="20" height="3" rx="1.5" fill={stroke} fillOpacity="0.5" />
            <circle cx={t.x + 16} cy={t.y + 12} r="5" fill={stroke} fillOpacity="0.35" />
          </g>
        ))}
      </svg>
      <style jsx>{`
        .shop-tile {
          animation: shopFade 3s ease-in-out infinite;
        }
        @keyframes shopFade {
          0%,
          100% {
            opacity: 0.55;
          }
          50% {
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .shop-tile {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

/** Blog: artículo con líneas de texto que se van escribiendo. */
function BlogIllustration({ isDark }: { isDark: boolean; glow?: boolean }) {
  const stroke = isDark ? "#26FFDF" : "#08A696"
  const lines = [96, 76, 88, 60]
  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden">
      <svg viewBox="0 0 200 100" className="relative w-full h-full">
        <rect
          x="18"
          y="16"
          width="58"
          height="68"
          rx="8"
          fill={stroke}
          fillOpacity="0.14"
          stroke={stroke}
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
        <circle cx="47" cy="42" r="10" fill={stroke} fillOpacity="0.3" />
        <rect x="28" y="60" width="38" height="4" rx="2" fill={stroke} fillOpacity="0.45" />
        <rect x="28" y="69" width="24" height="4" rx="2" fill={stroke} fillOpacity="0.3" />
        {lines.map((w, i) => (
          <rect
            key={i}
            x="90"
            y={22 + i * 16}
            width={w}
            height="6"
            rx="3"
            fill={stroke}
            fillOpacity={i === 0 ? "0.6" : "0.32"}
            className="blog-line"
            style={{ transformOrigin: "90px center", animationDelay: `${i * 0.35}s` }}
          />
        ))}
      </svg>
      <style jsx>{`
        .blog-line {
          animation: blogType 3.2s ease-in-out infinite;
        }
        @keyframes blogType {
          0%,
          100% {
            transform: scaleX(0.55);
            opacity: 0.5;
          }
          50% {
            transform: scaleX(1);
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .blog-line {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

// ============================================================================

// Cada tarjeta lleva la figura de una de las tres categorías de servicios.
const [devService, dataService, autoService] = servicesData

const CARDS = [
  {
    href: "/servicios",
    title: "Servicios",
    Illustration: DevIllustration,
    figure: devService,
  },
  {
    href: "/tienda",
    title: "Tienda",
    Illustration: TiendaIllustration,
    figure: dataService,
  },
  {
    href: "/blog",
    title: "Blog",
    Illustration: BlogIllustration,
    figure: autoService,
  },
]

type HeroCard = (typeof CARDS)[number]

/**
 * Tarjeta del hero. La figura reacciona al cursor: crece un poco y se inclina
 * hacia el lado donde está el puntero dentro de la tarjeta.
 */
function HeroNavCard({ card, isDark }: { card: HeroCard; isDark: boolean }) {
  const { href, title, Illustration, figure } = card

  // La figura sólo crece: no se desplaza, para que siga centrada.
  // Cuanto más cerca del centro está el cursor, un poco más grande se hace.
  const hoverScale = useMotionValue(1)
  const scale = useSpring(hoverScale, { stiffness: 220, damping: 22, mass: 0.4 })

  const handlePointerMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = (event.clientX - rect.left) / rect.width - 0.5
    const dy = (event.clientY - rect.top) / rect.height - 0.5
    const distance = Math.min(Math.hypot(dx, dy) / 0.7, 1)
    hoverScale.set(1.1 - distance * 0.05)
  }

  const handlePointerLeave = () => hoverScale.set(1)

  return (
    <Link
      href={href}
      aria-label={title}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className={`relative flex flex-col min-h-[400px] text-left rounded-3xl border p-6 transition-all duration-300 ${
        isDark
          ? "bg-[#02505920] border-[#08A696]/15 hover:bg-[#02505950] hover:border-[#26FFDF]/60 hover:shadow-lg hover:shadow-[#08A696]/20"
          : "bg-white/60 border-[#08A696]/20 hover:bg-[#c5ebe7] hover:border-[#08A696]/60 hover:shadow-lg hover:shadow-[#08A696]/20"
      } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60`}
    >
      {/* Figura de la categoría: centrada, 85% dentro de la tarjeta y 15% asomando.
          El contenedor posiciona con clases y el transform de motion va dentro:
          si `scale` viviera aquí, pisaría los translate de Tailwind y la descentraría. */}
      {figure && (
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[15%] w-52 sm:w-60 lg:w-64 aspect-square z-10">
          <motion.div
            style={{ scale }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full h-full motion-reduce:animate-none"
          >
            <Image
              src={figure.imageSrc}
              alt={figure.imageAlt}
              fill
              sizes="256px"
              className="object-contain"
            />
          </motion.div>
        </div>
      )}

      {/* La animación baja del centro y queda bajo la figura */}
      <div className="relative flex-1 mt-3 flex items-end justify-center">
        <div className="w-full max-w-[280px] aspect-[2/1]">
          <Illustration isDark={isDark} glow={false} />
        </div>
      </div>

      {/* Título al pie, centrado bajo el gráfico */}
      <h3 className={`mt-4 text-center text-lg font-bold ${accentText}`}>{title}</h3>
    </Link>
  )
}

export default function HeroNavCards() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full">
      {CARDS.map((card) => (
        <HeroNavCard key={card.href} card={card} isDark={isDark} />
      ))}
    </div>
  )
}
