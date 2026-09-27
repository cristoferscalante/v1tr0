"use client"

import { useEffect, useState, type MouseEvent, type ReactNode } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion"

type Example = { title: string; image: string; href?: string }

interface SubcategoryGalleryTileProps {
  name: string
  examples: Example[]
  active: boolean
  onSelect: () => void
}

/** Cuánto tiempo se queda cada proyecto al frente mientras el cursor está encima. */
const CYCLE_MS = 1400

/**
 * Posición de las ventanas del mazo: [frente, izquierda, derecha].
 * En reposo asoman apenas por detrás; con hover se abren en abanico.
 */
const REST = [
  { x: 0, y: 0, rotate: 0, scale: 1 },
  { x: -12, y: 4, rotate: -6, scale: 0.9 },
  { x: 12, y: 4, rotate: 6, scale: 0.9 },
]
const FANNED = [
  { x: 0, y: -6, rotate: 0, scale: 1.06 },
  { x: -22, y: 4, rotate: -12, scale: 0.88 },
  { x: 22, y: 4, rotate: 12, scale: 0.88 },
]

function hostOf(href?: string) {
  if (!href) return null
  try {
    return new URL(href).hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}

/** Esqueleto de página: lo que se ve cuando la subcategoría aún no tiene proyectos. */
function Wireframe({ shimmer }: { shimmer: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col gap-[5%] p-[7%]">
      <div className="h-[34%] rounded-[3px] bg-[#26FFDF]/[0.07] border border-[#26FFDF]/10" />
      <div className="h-[6%] w-3/4 rounded-full bg-white/[0.07]" />
      <div className="h-[6%] w-1/2 rounded-full bg-white/[0.05]" />
      <div className="mt-auto grid grid-cols-3 gap-[6%] h-[22%]">
        <div className="rounded-[3px] bg-white/[0.05]" />
        <div className="rounded-[3px] bg-white/[0.05]" />
        <div className="rounded-[3px] bg-white/[0.05]" />
      </div>
      {shimmer && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-[#26FFDF]/15 to-transparent"
          initial={{ x: "-120%" }}
          animate={{ x: "260%" }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  )
}

/** Ventana de navegador en miniatura: barra con tres puntos y el contenido debajo. */
export function MiniWindow({ children, ghost = false, highlighted = false }: { children?: ReactNode; ghost?: boolean; highlighted?: boolean }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col overflow-hidden rounded-lg border transition-colors duration-300 ${
        ghost
          ? "border-dashed border-[#26FFDF]/15 bg-[#031414]/70"
          : highlighted
          ? "border-[#26FFDF]/55 bg-[#031414] shadow-[0_10px_28px_-12px_rgba(38,255,223,0.45)]"
          : "border-[#26FFDF]/20 bg-[#031414] shadow-[0_10px_24px_-14px_rgba(0,0,0,0.9)]"
      }`}
    >
      <div className="flex h-3 shrink-0 items-center gap-[3px] border-b border-[#26FFDF]/10 bg-black/40 px-1.5">
        <span className="h-[4px] w-[4px] rounded-full bg-[#ff5f57]/70" />
        <span className="h-[4px] w-[4px] rounded-full bg-[#febc2e]/70" />
        <span className="h-[4px] w-[4px] rounded-full bg-[#28c840]/70" />
        <span className="ml-1 h-[5px] flex-1 rounded-full bg-white/[0.07]" />
      </div>
      <div className="relative flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

/**
 * Ficha de subcategoría como galería: un mazo de mini-ventanas con los
 * proyectos reales. Con el cursor encima el mazo se abre en abanico, se inclina
 * siguiendo el puntero y rota los proyectos al frente. Sin proyectos, muestra
 * una ventana vacía con el esqueleto de una página.
 */
export function SubcategoryGalleryTile({ name, examples, active, onSelect }: SubcategoryGalleryTileProps) {
  const reduceMotion = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const [front, setFront] = useState(0)
  const count = examples.length
  const open = hovered || active

  // Rota el proyecto al frente mientras hay hover y más de uno que mostrar.
  useEffect(() => {
    if (!hovered || count < 2 || reduceMotion) return undefined
    const id = window.setInterval(() => setFront((i) => (i + 1) % count), CYCLE_MS)
    return () => window.clearInterval(id)
  }, [hovered, count, reduceMotion])

  // Inclinación 3D que sigue al puntero.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), { stiffness: 220, damping: 18 })
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), { stiffness: 220, damping: 18 })

  const handleMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (reduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width - 0.5)
    py.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const handleLeave = () => {
    setHovered(false)
    px.set(0)
    py.set(0)
  }

  // Las dos ventanas de atrás muestran los proyectos siguientes; si no hay, quedan como ventanas fantasma.
  const layers = [0, 1, 2].map((offset) => (count > offset ? examples[(front + offset) % count] : undefined))
  const current = layers[0]
  const pose = open && !reduceMotion ? FANNED : REST
  const caption = current ? hostOf(current.href) ?? current.title : null

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      onFocus={() => setHovered(true)}
      onBlur={handleLeave}
      aria-pressed={active}
      aria-label={`${name}: ${count > 0 ? `${count} ${count === 1 ? "proyecto" : "proyectos"}` : "próximamente"}`}
      className={`group/sub relative flex min-h-[8.5rem] flex-col overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60 ${
        active
          ? "bg-[#0d5d5d]/60 border-[#26FFDF]/40 text-[#26FFDF]"
          : "bg-black/20 border-[#0d3d3d]/60 text-textMuted hover:text-textPrimary hover:border-[#08A696]/40 hover:bg-[#02505950]"
      }`}
    >
      {/* Rejilla tenue de fondo: da sensación de mesa de trabajo */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-40"}`}
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 45%, rgba(38,255,223,0.14), transparent 65%), radial-gradient(rgba(38,255,223,0.12) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 10px 10px",
        }}
      />

      {/* Escenario del mazo */}
      <div className="relative flex flex-1 items-center justify-center px-3 pt-4 pb-1 [perspective:600px]">
        <motion.div
          className="relative aspect-[16/10] w-[70%]"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          {[2, 1, 0].map((slot) => {
            const example = layers[slot]
            return (
              <motion.div
                key={slot}
                className="absolute inset-0"
                style={{ zIndex: 3 - slot }}
                animate={pose[slot]}
                transition={{ type: "spring", stiffness: 260, damping: 22, delay: slot === 0 ? 0 : 0.03 * slot }}
              >
                <MiniWindow ghost={!example && slot > 0} highlighted={slot === 0 && open}>
                  {slot === 0 && !example && <Wireframe shimmer={hovered && !reduceMotion} />}
                  {example && (
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={example.image}
                        className="absolute inset-0"
                        initial={{ opacity: 0, scale: 1.08 }}
                        animate={{ opacity: slot === 0 ? 1 : 0.55, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                      >
                        <Image src={example.image} alt="" fill sizes="160px" className="object-cover object-top" />
                      </motion.div>
                    </AnimatePresence>
                  )}
                  {/* Leyenda del proyecto al frente, solo con hover */}
                  {slot === 0 && caption && (
                    <span
                      className={`absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/85 to-transparent px-1.5 pt-3 pb-1 text-left text-[8px] font-medium tracking-wide text-[#26FFDF] transition-opacity duration-300 ${
                        hovered ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {caption}
                    </span>
                  )}
                </MiniWindow>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Nombre + estado */}
      <div className="relative flex flex-col items-center gap-1 px-1.5 pb-2.5">
        <span className="text-[11px] font-medium leading-tight text-center break-words line-clamp-2">{name}</span>
        {count > 1 ? (
          <span className="flex items-center gap-[3px]" aria-hidden="true">
            {examples.map((example, index) => (
              <span
                key={example.title}
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  index === front ? "w-3 bg-[#26FFDF]" : "w-[3px] bg-[#26FFDF]/30"
                }`}
              />
            ))}
          </span>
        ) : (
          <span className="text-[9px] uppercase tracking-[0.18em] text-[#26FFDF]/45" aria-hidden="true">
            {count === 1 ? "1 proyecto" : "Próximamente"}
          </span>
        )}
      </div>
    </button>
  )
}
