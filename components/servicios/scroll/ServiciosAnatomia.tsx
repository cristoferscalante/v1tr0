"use client"

import { useRef, useState, type CSSProperties } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Nivel de uso de cada capa: etiqueta y cuánto de la barra de 3 segmentos llena. */
const LEVELS = {
  diario: { label: "Uso diario", fill: 3 },
  produccion: { label: "En producción", fill: 2.5 },
  crecimiento: { label: "En crecimiento", fill: 1.5 },
} as const

type Layer = {
  title: string
  text: string
  level: keyof typeof LEVELS
  tools: string
  color: string
  /** Altura del nodo sobre la figura, en fracción de su alto. */
  y: number
  side: "left" | "right"
}

/**
 * Las capas de un proyecto de software, de arriba (la más especializada) a
 * abajo (la base). Las herramientas son las que usa este mismo sitio.
 * Colores de la marca: turquesas a la derecha y grises a la izquierda, así
 * alternan a lo largo de la figura.
 */
const LAYERS: Layer[] = [
  {
    title: "Automatización e IA",
    text: "Bots, flujos e integraciones conectados a tu operación",
    level: "crecimiento",
    tools: "Webhooks · React Flow · Socket.io",
    color: "#26FFDF",
    y: 0.21,
    side: "right",
  },
  {
    title: "Accesibilidad y SEO",
    text: "Usable por todos, encontrable en buscadores",
    level: "produccion",
    tools: "Radix UI · metadatos · sitemaps",
    color: "#E4E4E7",
    y: 0.295,
    side: "left",
  },
  {
    title: "Diseño de interfaz",
    text: "Jerarquía, tipografía y prototipo antes del código",
    level: "diario",
    tools: "Sistemas de diseño · Tailwind",
    color: "#81D3CB",
    y: 0.38,
    side: "right",
  },
  {
    title: "Frontend",
    text: "Interfaces rápidas, animadas y listas para crecer",
    level: "diario",
    tools: "Next.js · React · GSAP",
    color: "#A1A1AA",
    y: 0.465,
    side: "left",
  },
  {
    title: "Backend y APIs",
    text: "Autenticación, pagos e integraciones seguras",
    level: "produccion",
    tools: "Rutas API · NextAuth · Zod",
    color: "#08A696",
    y: 0.55,
    side: "right",
  },
  {
    title: "Datos",
    text: "Modelado, consultas y reportes que escalan",
    level: "produccion",
    tools: "Postgres · Drizzle · Recharts",
    color: "#D4D4D8",
    y: 0.635,
    side: "left",
  },
  {
    title: "Infraestructura",
    text: "Despliegue, dominios, archivos y monitoreo",
    level: "diario",
    tools: "Vercel · Neon · Uploadthing",
    color: "#C5EBE7",
    y: 0.72,
    side: "right",
  },
]

/** Posición horizontal del eje del cuerpo de Odiseo dentro de su imagen. */
const BODY_AXIS = 0.5

/** Esquinas recortadas del panel, estilo HUD. */
const CHAMFER = "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)"

function LayerCard({
  layer,
  index,
  active,
  onHover,
}: {
  layer: Layer
  index: number
  active: boolean
  onHover: (index: number | null) => void
}) {
  const level = LEVELS[layer.level]
  const isRight = layer.side === "right"
  return (
    // El envoltorio posiciona (con su translate); GSAP anima solo el interior
    <div
      className={`relative lg:absolute lg:w-[30%] lg:-translate-y-1/2 ${isRight ? "lg:right-0" : "lg:left-0"}`}
      style={{ top: `${layer.y * 100}%` } as CSSProperties}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="anatomy-card" data-index={index}>
      {/* Borde: la capa de color asoma 1px alrededor del panel oscuro */}
      <div
        className="p-px transition-[background-color] duration-300"
        style={{ clipPath: CHAMFER, backgroundColor: `${layer.color}${active ? "aa" : "55"}` }}
      >
        <div className="relative bg-[#070a0b]/95 px-5 py-4" style={{ clipPath: CHAMFER }}>
          {/* Resplandor tenue del color de la capa */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ background: `radial-gradient(circle at ${isRight ? "0%" : "100%"} 50%, ${layer.color}, transparent 70%)` }}
          />
          <div className={`relative flex items-center gap-4 ${isRight ? "" : "flex-row-reverse"}`}>
            {/* Mira del conector, del lado que da a la figura */}
            <span aria-hidden="true" className="relative hidden h-8 w-8 shrink-0 lg:block">
              <span className="absolute inset-0 rounded-full border border-dashed opacity-50" style={{ borderColor: layer.color }} />
              <span
                className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ backgroundColor: layer.color, boxShadow: `0 0 10px ${layer.color}` }}
              />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[17px] font-bold leading-tight" style={{ color: layer.color }}>
                {layer.title}
              </h3>
              <p className="mt-1 text-xs leading-snug" style={{ color: `${layer.color}b3` }}>
                {layer.text}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: layer.color }}>
                  {level.label}
                </span>
                {/* Barra de 3 segmentos; el último puede ir a medias */}
                <span className="flex gap-1" aria-label={`Nivel ${level.fill} de 3`}>
                  {[0, 1, 2].map((segment) => {
                    const fill = Math.max(0, Math.min(1, level.fill - segment))
                    return (
                      <span key={segment} className="relative h-2.5 w-6 overflow-hidden rounded-[2px]" style={{ backgroundColor: `${layer.color}26` }}>
                        <span className="absolute inset-y-0 left-0" style={{ width: `${fill * 100}%`, backgroundColor: layer.color }} />
                      </span>
                    )
                  })}
                </span>
              </div>
              <p className="mt-2 font-mono text-[10px] tracking-wide text-white/40">{layer.tools}</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

/**
 * Anatomía de un proyecto: Odiseo al centro y, sobre su eje, un nodo por
 * capa del software, de la infraestructura a la IA. En escritorio la sección
 * se fija y el scroll enciende las capas de abajo hacia arriba: nodo, línea
 * y panel. En móvil la figura va arriba y los paneles en lista.
 */
export default function ServiciosAnatomia() {
  const root = useRef<HTMLElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".anatomy-stage",
            pin: true,
            scrub: 0.8,
            start: "top top",
            end: "+=140%",
          },
        })
        tl.from(".anatomy-figure", { opacity: 0, y: 40, duration: 1 })
        // La energía sube desde la base: de la última capa a la primera
        for (let i = LAYERS.length - 1; i >= 0; i -= 1) {
          const side = LAYERS[i]!.side
          tl.from(`.anatomy-node[data-index="${i}"]`, { scale: 0, opacity: 0, duration: 0.5 })
            .from(`.anatomy-line[data-index="${i}"]`, { scaleX: 0, duration: 0.6 }, "<0.1")
            .from(
              `.anatomy-card[data-index="${i}"]`,
              { opacity: 0, x: side === "right" ? 40 : -40, duration: 0.6 },
              "<0.3",
            )
        }
      })

      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".anatomy-card").forEach((card) => {
          gsap.from(card, {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 90%" },
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative z-10 border-t border-white/[0.06] bg-[#050708]">
      {/* Encabezado */}
      <div className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 lg:px-10 lg:pt-36">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">
              <span className="text-white/30">03</span>&nbsp;&nbsp;Anatomía
            </p>
            <h2 className="mt-6 text-[11vw] font-bold leading-[0.9] tracking-tight text-white lg:text-[5.5vw]">
              La anatomía
              <br />
              de <span className="font-serif font-normal italic text-[#26FFDF]">tu software.</span>
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-textMuted lg:text-lg">
            Todo proyecto se construye por capas, de la infraestructura a la inteligencia artificial. Estas son las que trabajamos y con qué herramientas.
          </p>
        </div>
      </div>

      {/* Escenario: se fija en escritorio mientras se encienden las capas */}
      <div className="anatomy-stage flex items-center px-4 py-16 sm:px-6 lg:h-screen lg:px-10 lg:py-0 lg:pt-16">
        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-4 lg:block lg:h-[min(84vh,860px)]">
          {/* Figura con los nodos sobre su eje */}
          <div
            className="anatomy-figure relative mx-auto mb-6 aspect-[2/3] h-[55vh] lg:absolute lg:left-1/2 lg:top-0 lg:mb-0 lg:h-full lg:-translate-x-1/2"
          >
            {/* Resplandor del eje, como una columna de energía */}
            <div
              aria-hidden="true"
              className="absolute top-[17%] h-[60%] w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#26FFDF]/50 via-white/25 to-[#08A696]/50 blur-[2px]"
              style={{ left: `${BODY_AXIS * 100}%` }}
            />
            <Image
              src="/imagenes/home/carrusel/desarrollo_web_end_backup.webp"
              alt="Odiseo, la estatua de V1TR0, con las capas del software marcadas sobre su eje"
              fill
              sizes="(min-width: 1024px) 40rem, 70vw"
              className="object-contain opacity-90 [filter:grayscale(0.3)_brightness(0.8)]"
            />
            {LAYERS.map((layer, index) => (
              // Anclaje sin tamaño en el eje; el nodo se centra con márgenes
              // negativos para que GSAP pueda escalarlo sin pisar un translate
              <span
                key={layer.title}
                aria-hidden="true"
                className="absolute z-10 h-0 w-0"
                style={{ left: `${BODY_AXIS * 100}%`, top: `${layer.y * 100}%` }}
              >
                <span data-index={index} className="anatomy-node absolute -left-3.5 -top-3.5 h-7 w-7 lg:-left-[18px] lg:-top-[18px] lg:h-9 lg:w-9">
                  <span
                    className="grid h-full w-full place-items-center rounded-full transition-transform duration-300"
                    style={{
                      backgroundColor: layer.color,
                      boxShadow: `0 0 18px 4px ${layer.color}99, 0 0 0 6px ${layer.color}26`,
                      transform: `scale(${hovered === index ? 1.25 : 1})`,
                    }}
                  >
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </span>
                </span>
              </span>
            ))}
          </div>

          {/* Líneas del nodo al panel (solo escritorio) */}
          {LAYERS.map((layer, index) => (
            <span
              key={layer.title}
              aria-hidden="true"
              // Arranca en el borde del nodo (18px de radio) para no taparle el centro
              className={`absolute hidden h-[2px] -mt-px lg:block ${layer.side === "right" ? "left-[calc(50%+18px)]" : "right-[calc(50%+18px)]"}`}
              style={{ top: `${layer.y * 100}%`, width: "calc(20% - 18px)" }}
            >
            <span
              data-index={index}
              className={`anatomy-line block h-full w-full ${layer.side === "right" ? "origin-left" : "origin-right"}`}
              style={{
                background:
                  layer.side === "right"
                    ? `linear-gradient(to right, ${layer.color}, ${layer.color}66)`
                    : `linear-gradient(to left, ${layer.color}, ${layer.color}66)`,
                boxShadow: hovered === index ? `0 0 12px ${layer.color}` : `0 0 6px ${layer.color}66`,
              }}
            />
            </span>
          ))}

          {/* Paneles de cada capa */}
          {LAYERS.map((layer, index) => (
            <LayerCard key={layer.title} layer={layer} index={index} active={hovered === index} onHover={setHovered} />
          ))}
        </div>
      </div>
    </section>
  )
}
