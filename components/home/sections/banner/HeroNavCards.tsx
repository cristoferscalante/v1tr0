"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { servicesData } from "@/components/home/sections/ServicesTabSection"
import { accentText } from "@/components/home/shared/surface"
import { MiniWindow } from "@/components/home/sections/SubcategoryGalleryTile"
import { HeroTurntableCharacter } from "@/components/shop/hero/HeroTurntableCharacter"

// ============================================================================
// ILUSTRACIONES ANIMADAS POR TARJETA
// Mismo lenguaje visual que las tarjetas de /servicios: SVG plano, un solo
// color de marca y animaciones sutiles que se desactivan con reduced-motion.
// ============================================================================

/** Blog: artículo con líneas de texto que se van escribiendo. */
function BlogIllustration({ }: { glow?: boolean }) {
  const stroke = "#26FFDF"
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

/** Proyectos publicados (con enlace) de todas las subcategorías de servicios. */
const allLiveSites = servicesData.flatMap((service) =>
  service.subcategories.flatMap((subcat) => subcat.examples.filter((example) => example.href)),
)

/** Webs del mazo por título: [frente, izquierda, derecha]. */
const DECK_TITLES = ["Megudan", "Pet Gourmet", "Portafolio"]
const deckSites = DECK_TITLES.map((title) => allLiveSites.find((site) => site.title === title))

/** Poses fijas del mazo: [frente, izquierda, derecha]. */
const DECK_POSES = [
  { x: 0, y: 0, rotate: 0, scale: 1 },
  { x: -42, y: 6, rotate: -9, scale: 0.88 },
  { x: 42, y: 6, rotate: 9, scale: 0.88 },
]

/** Poses fijas del carrusel de productos: [medio, izquierda, derecha]. */
const SHELF_POSES = [
  { x: "0%", scale: 1, opacity: 1 },
  { x: "-78%", scale: 0.6, opacity: 0.45 },
  { x: "78%", scale: 0.6, opacity: 0.45 },
]

/**
 * Servicios: mazo fijo de mini-navegadores con webs publicadas, Megudan al
 * frente. No rota ni reacciona al cursor: en la tarjeta solo se mueve el personaje.
 */
function WebDeckIllustration({ }: { glow?: boolean }) {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <div className="relative h-[60%] aspect-[16/10]">
        {[2, 1, 0].map((slot) => {
          const site = deckSites[slot]
          const { x, y, rotate, scale } = DECK_POSES[slot]!
          return (
            <div
              key={slot}
              className="absolute inset-0"
              style={{ zIndex: 3 - slot, transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})` }}
            >
              <MiniWindow ghost={!site}>
                {site && (
                  <Image
                    src={site.image}
                    alt=""
                    fill
                    sizes="200px"
                    className={`object-cover object-top ${slot === 0 ? "" : "opacity-90"}`}
                  />
                )}
                {slot === 0 && site && (
                  <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/85 to-transparent px-2 pt-4 pb-1 text-left text-[10px] font-medium tracking-wide text-[#26FFDF]">
                    {site.title}
                  </span>
                )}
              </MiniWindow>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Productos del carrusel de Tienda: [medio, izquierda, derecha]. */
const SHELF_SLUGS = ["m5stack-cardputer-adv", "lilygo-t-beam-1w", "lilygo-t-deck"]

/** Producto de la tienda tal como llega de /api/products (solo lo que usa el carrusel). */
interface DeckProduct {
  slug: string
  images: string[] | null
}

/**
 * Tienda: carrusel fijo con tres productos del catálogo (fotos desde
 * /api/products). El del medio va al frente y en grande. No rota ni reacciona
 * al cursor: en la tarjeta solo se mueve el personaje.
 */
function ProductDeckIllustration({ }: { glow?: boolean }) {
  const [images, setImages] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: { products: DeckProduct[] }) => {
        if (cancelled) { return }
        setImages(
          Object.fromEntries(
            data.products.flatMap((p) => (p.images?.[0] ? [[p.slug, p.images[0]]] : [])),
          ),
        )
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {/* Todas las fotos comparten caja cuadrada y el mismo lienzo recortado:
          el tamaño lo decide solo la posición. */}
      {[1, 2, 0].map((slot) => {
        const src = images[SHELF_SLUGS[slot]!]
        const { x, scale, opacity } = SHELF_POSES[slot]!
        return (
          <div
            key={slot}
            className="absolute h-[82%] aspect-square transition-opacity duration-500"
            style={{
              zIndex: slot === 0 ? 3 : 1,
              transform: `translateX(${x}) scale(${scale})`,
              opacity: src ? opacity : 0,
            }}
          >
            {src && (
              <Image
                src={src}
                alt=""
                fill
                sizes="140px"
                className="object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.6)]"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================

// Cada tarjeta lleva la figura de una de las tres categorías de servicios.
const [devService, dataService, autoService] = servicesData

// La tarjeta de Tienda usa el personaje del POS del hero de /tienda, con su
// secuencia de giro: mira hacia donde está el cursor.
const POS_FRONT_FRAME = 40
const posTurnFrames = Array.from(
  { length: 68 },
  (_, i) => `/imagenes/tienda/pos-turn/pos-${String(i).padStart(2, "0")}.webp`,
)

// La tarjeta de Servicios usa a Odiseo: al pasar el cursor levanta la mano y
// aparece el </> sobre la palma. Fotogramas del video odiseo.mp4 (branding).
const odiseoFrames = Array.from(
  { length: 47 },
  (_, i) => `/imagenes/home/odiseo/odiseo-${String(i).padStart(2, "0")}.webp`,
)

/**
 * Secuencia de fotogramas que avanza mientras `active` es true y retrocede
 * cuando deja de serlo. El avance es por tiempo, no por fotograma, así que el
 * gesto dura lo mismo sin importar la tasa de refresco; al retroceder va más
 * rápido para que la figura vuelva al reposo sin hacerse esperar.
 *
 * Sin hover (táctil) o con reduced-motion se queda en el último fotograma, el
 * que muestra el gesto completo.
 */
export function HoverFrameSequence({
  frames,
  active,
  alt,
}: {
  frames: string[]
  active: boolean
  alt: string
}) {
  const last = frames.length - 1
  const [frame, setFrame] = useState(last)
  const [animated, setAnimated] = useState(false)
  const activeRef = useRef(active)
  activeRef.current = active

  useEffect(() => {
    const enabled =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!enabled) {
      return
    }
    setAnimated(true)
    setFrame(0)

    const FORWARD_MS = 1400
    const BACKWARD_MS = 800
    let progress = 0
    let prev = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const dt = now - prev
      prev = now
      progress = activeRef.current
        ? Math.min(1, progress + dt / FORWARD_MS)
        : Math.max(0, progress - dt / BACKWARD_MS)
      const index = Math.round(progress * last)
      setFrame((p) => (p === index ? p : index))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [last])

  return (
    <div className="relative h-full w-full">
      {frames.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === last ? alt : ""}
          aria-hidden={i !== last}
          fill
          sizes="(min-width: 768px) 33vw, 50vw"
          // Todos montados y solo cambia cuál se ve: alternar el `src` parpadea.
          className={`object-contain ${i === frame ? "opacity-100" : "opacity-0"}`}
          // Solo se precarga el fotograma que se muestra primero.
          priority={i === (animated ? 0 : last)}
        />
      ))}
    </div>
  )
}

const CARDS = [
  {
    href: "/servicios",
    title: "Desarrollo de software",
    Illustration: WebDeckIllustration,
    figure: devService,
    sequence: { frames: odiseoFrames },
  },
  {
    href: "/tienda",
    title: "Tienda",
    Illustration: ProductDeckIllustration,
    figure: dataService,
    turntable: { frames: posTurnFrames, frontIndex: POS_FRONT_FRAME },
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
function HeroNavCard({ card, primed, asLink = true }: { card: HeroCard; primed: boolean; asLink?: boolean }) {
  const { href, title, Illustration, figure, turntable, sequence } = card
  const [hovered, setHovered] = useState(false)

  // La figura sólo crece: no se desplaza, para que siga centrada.
  // Cuanto más cerca del centro está el cursor, un poco más grande se hace.
  const hoverScale = useMotionValue(1)
  const scale = useSpring(hoverScale, { stiffness: 220, damping: 22, mass: 0.4 })

  const handlePointerMove = (event: React.MouseEvent<HTMLElement>) => {
    // Fuera del hero la figura no crece: solo hace su gesto.
    if (!asLink) {
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = (event.clientX - rect.left) / rect.width - 0.5
    const dy = (event.clientY - rect.top) / rect.height - 0.5
    const distance = Math.min(Math.hypot(dx, dy) / 0.7, 1)
    hoverScale.set(1.1 - distance * 0.05)
  }

  const handlePointerLeave = () => {
    hoverScale.set(1)
    setHovered(false)
  }

  // Fuera del hero (p. ej. en /servicios) la tarjeta es solo la figura: sin
  // mockups ni título, y sin enlace a la página en la que ya estás.
  const Wrapper = asLink ? Link : "div"

  return (
    <Wrapper
      href={href}
      aria-label={title}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      // El personaje de Tienda solo sigue al cursor dentro de su tarjeta.
      data-turntable-area=""
      // En la home la tarjeta cambia de forma según el ancho: en móvil es una
      // fila (figura a la izquierda, animación y título a la derecha) para no
      // apilar tres tarjetas altas; desde md vuelve a ser columna, con la
      // figura a una altura acotada por el viewport y no estirada a pantalla.
      className={
        asLink
          ? "relative overflow-hidden grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] items-center gap-3 md:flex md:flex-col md:items-stretch text-left rounded-[2rem] md:rounded-[2.5rem] border border-white/[0.07] bg-white/[0.015] p-4 md:p-5 lg:p-6 transition-colors duration-300 hover:border-white/15 hover:bg-white/[0.03] hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60"
          : "relative flex flex-col h-full min-h-[200px] sm:min-h-[215px]"
      }
    >
      {/* Figura de la categoría. En la home queda dentro de la tarjeta, con alto
          acotado; fuera de ella ocupa el espacio libre y asoma por arriba. El
          transform de motion va dentro para no pisar los márgenes del contenedor. */}
      {figure && (
        <div
          className={`pointer-events-none relative z-10 ${
            asLink
              ? "h-[200px] mt-2 md:h-[clamp(220px,36vh,360px)] md:mt-5 lg:mt-7"
              : "flex-1 min-h-[200px] -mt-12 sm:-mt-16 -mx-2 sm:-mx-4"
          }`}
        >
          <motion.div
            style={{ scale }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full h-full motion-reduce:animate-none"
          >
            {turntable ? (
              // Los fotogramas cortan el cuerpo a media altura: se desvanece
              // el borde inferior, igual que en el hero de la tienda.
              <div
                className="relative w-full h-full"
                style={{
                  maskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
                }}
              >
                <HeroTurntableCharacter
                  frames={primed ? turntable.frames : [turntable.frames[turntable.frontIndex]!]}
                  frontIndex={primed ? turntable.frontIndex : 0}
                  alt={title}
                  sizes="(min-width: 768px) 33vw, 50vw"
                  area="[data-turntable-area]"
                  className="h-full w-full"
                />
              </div>
            ) : sequence ? (
              <HoverFrameSequence
                frames={primed ? sequence.frames : [sequence.frames[sequence.frames.length - 1]!]}
                active={hovered}
                alt={figure.imageAlt}
              />
            ) : (
              <Image
                src={figure.imageSrc}
                alt={figure.imageAlt}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-contain"
              />
            )}
          </motion.div>
        </div>
      )}

      {asLink && (
        // Animación y título: columna derecha en móvil, pie de la tarjeta desde md
        <div className="flex flex-col items-center md:mt-3">
          <div className="w-full max-w-[240px] aspect-[2/1]">
            <Illustration glow={false} />
          </div>
          <h3 className={`mt-3 md:mt-4 text-center text-base md:text-lg font-bold ${accentText}`}>{title}</h3>
        </div>
      )}
    </Wrapper>
  )
}

/**
 * Las secuencias suman decenas de fotogramas. Hasta que el elemento se ve,
 * cada figura carga solo su fotograma de reposo.
 */
function usePrimed(ref: React.RefObject<HTMLElement | null>) {
  const [primed, setPrimed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || primed) {
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPrimed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, primed])

  return primed
}

/** La figura de Desarrollo de software del hero (solo Odiseo), para reutilizarla. */
export function DevServiceCard({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const primed = usePrimed(ref)
  return (
    <div ref={ref} className={className}>
      <HeroNavCard card={CARDS[0]!} primed={primed} asLink={false} />
    </div>
  )
}

export default function HeroNavCards() {
  // Priming diferido: así los fotogramas no compiten con la intro del hero,
  // que está justo encima.
  const gridRef = useRef<HTMLDivElement>(null)
  const primed = usePrimed(gridRef)

  return (
    // Una columna de filas hasta md; tres columnas desde ahí. Entre 640 y
    // 768 px tres tarjetas verticales quedaban de ~190 px de ancho.
    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-5 lg:gap-x-6 w-full">
      {CARDS.map((card) => (
        <HeroNavCard key={card.href} card={card} primed={primed} />
      ))}
    </div>
  )
}
