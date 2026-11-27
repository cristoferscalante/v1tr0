"use client"

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { FaTelegramPlane } from "react-icons/fa"
import { siteConfig } from "@/config/site"
import {
  briefListo,
  briefVacio,
  CAMPOS_BRIEF,
  copiarMensaje,
  mensajeContacto,
  TIPOS_PROYECTO,
  type Brief,
  type CampoBrief,
} from "@/lib/asistente/brief"
import { PASOS } from "@/lib/asistente/guion"
import useSnapAnimations from "@/hooks/use-snap-animations"
import { bleep } from "@/lib/audio/bleeps"
import RobotAsistente, { type Animo } from "./RobotAsistente"

/**
 * Cierre del home en escritorio: el brief como un plano isométrico del
 * estudio. Cada sala es una parte del mensaje (qué construir, la idea, plazo,
 * presupuesto, quién eres) y la última es el envío del mensaje por Telegram.
 *
 * Se juega moviendo al robot de sala en sala. Algunas respuestas se eligen
 * tocando objetos del plano —las cajas del taller, los pilares del plazo, las
 * pilas de monedas de la bóveda—; las de texto se escriben en la ficha de la
 * sala. Las preguntas salen del mismo guion que el chat del header
 * (lib/asistente/guion), así que ambos dicen lo mismo.
 */

type IdSala = "proyecto" | "idea" | "plazo" | "presupuesto" | "contacto" | "envio"

/** Etapas del mensaje; la primera se responde eligiendo habitación en el plano. */
const SALAS: Array<{ id: IdSala; titulo: string; campos: CampoBrief[] }> = [
  { id: "proyecto", titulo: "Qué construir", campos: ["tipoProyecto"] },
  { id: "idea", titulo: "La idea", campos: ["necesidad", "funcionalidades"] },
  { id: "plazo", titulo: "Plazo", campos: ["plazo"] },
  { id: "presupuesto", titulo: "Presupuesto", campos: ["presupuesto"] },
  { id: "contacto", titulo: "Quién eres", campos: ["nombre", "empresa", "ciudad", "correo"] },
  { id: "envio", titulo: "Enviar", campos: [] },
]

/* ------------------------------ Geometría ------------------------------ */

const S = 40
const K = S * 0.866
const H = S * 0.5
const VB = { x: -420, y: -170, w: 960, h: 690 }

function iso(x: number, y: number, z = 0): [number, number] {
  return [(x - y) * K, (x + y) * H - z * S]
}
const pts = (...p: Array<[number, number, number?]>) => p.map(([x, y, z]) => iso(x, y, z).join(",")).join(" ")


const TONO = {
  apagado: { arriba: "#24322f", izq: "#172321", der: "#111b1a" },
  muro: { arriba: "#2b3a38", izq: "#1a2725", der: "#131e1d" },
  encendido: { arriba: "#2a8f84", izq: "#1c6159", der: "#154943" },
  tenue: { arriba: "#1f4a45", izq: "#163834", der: "#112c29" },
  hoja: { arriba: "#2a5a44", izq: "#1c3f30", der: "#153226" },
  tronco: { arriba: "#4a3b2d", izq: "#3a2e23", der: "#2c231b" },
  agua: { arriba: "#1d6a80", izq: "#16505f", der: "#113e4a" },
}
type Tono = keyof typeof TONO

/** Una caja isométrica: tapa y las dos caras que dan al espectador. */
function Caja({
  x,
  y,
  w,
  d,
  h,
  z = 0,
  tono = "apagado",
}: {
  x: number
  y: number
  w: number
  d: number
  h: number
  z?: number
  tono?: Tono
}) {
  const t = TONO[tono]
  const z1 = z + h
  return (
    <g style={{ transition: "fill 400ms" }}>
      <polygon points={pts([x, y + d, z], [x + w, y + d, z], [x + w, y + d, z1], [x, y + d, z1])} fill={t.izq} />
      <polygon points={pts([x + w, y, z], [x + w, y + d, z], [x + w, y + d, z1], [x + w, y, z1])} fill={t.der} />
      <polygon
        points={pts([x, y, z1], [x + w, y, z1], [x + w, y + d, z1], [x, y + d, z1])}
        fill={t.arriba}
        stroke="#000"
        strokeOpacity={0.25}
        strokeWidth={0.6}
      />
    </g>
  )
}

/* ----------------------------- Componente ------------------------------ */

const pregunta = (campo: CampoBrief, nombre: string) => PASOS.find((p) => p.campo === campo)!.pregunta(nombre)
const paso = (campo: CampoBrief) => PASOS.find((p) => p.campo === campo)!
const etiqueta = (campo: CampoBrief) => CAMPOS_BRIEF.find((c) => c.id === campo)!.etiqueta

const tarjeta = "border border-white/[0.07] bg-[#0b1414]/85 backdrop-blur-sm"
const campoBase = `w-full rounded-xl px-3 py-2 text-sm text-textPrimary placeholder:text-textMuted/60 transition-colors duration-300 focus:outline-none focus:border-[#26FFDF]/40 ${tarjeta}`
const botonPildora =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-textPrimary transition-colors duration-300 hover:border-[#26FFDF]/50 hover:text-[#26FFDF] disabled:opacity-40"

export default function PlanoAsistente() {
  const [brief, setBrief] = useState<Brief>(briefVacio)
  const [sala, setSala] = useState<IdSala>("proyecto")
  const [hechas, setHechas] = useState<Set<IdSala>>(new Set())
  const [animo, setAnimo] = useState<Animo>("neutral")
  const [hablando, setHablando] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)
  /** Zona de la casa bajo el cursor: se marca sin elegirla. */
  const [sobre, setSobre] = useState<string | null>(null)
  const salaRef = useRef<IdSala>("proyecto")
  const relojes = useRef<Array<ReturnType<typeof setTimeout>>>([])

  useSnapAnimations({
    sections: [".contacto-asistente-section"],
    duration: 0.8,
    enableCircularNavigation: false,
    singleAnimation: true,
  })

  useEffect(() => () => relojes.current.forEach(clearTimeout), [])
  const luego = (ms: number, fn: () => void) => relojes.current.push(setTimeout(fn, ms))

  const listo = briefListo(brief)
  const salaActual = SALAS.find((s) => s.id === sala)!
  const indiceSala = SALAS.indexOf(salaActual)

  function irA(id: IdSala) {
    if (id === salaRef.current) {return}
    salaRef.current = id
    setSala(id)
    setAviso(null)
    setAnimo("pensando")
    bleep("volar")
    luego(800, () => {
      setAnimo("neutral")
      setHablando(true)
      bleep("hablar")
    })
    luego(1900, () => setHablando(false))
  }

  function cambiar(campo: CampoBrief, valor: string) {
    setBrief((actual) => ({ ...actual, [campo]: valor }))
  }

  /** Cierra la sala y manda al robot a la siguiente sin resolver. */
  function completar(id: IdSala, siguienteBrief: Brief = brief) {
    if (id === "idea" && !siguienteBrief.necesidad.trim()) {
      return fallar("Cuéntanos al menos qué necesitas resolver.")
    }
    if (id === "contacto") {
      if (!siguienteBrief.nombre.trim()) {return fallar("Nos falta tu nombre.")}
      const error = siguienteBrief.correo.trim() ? paso("correo").validar?.(siguienteBrief.correo.trim()) : null
      if (error) {return fallar(error)}
    }
    const nuevas = new Set(hechas).add(id)
    setHechas(nuevas)
    setAviso(null)
    const todo = briefListo(siguienteBrief)
    setAnimo(todo ? "celebrando" : "contento")
    bleep(todo && nuevas.size >= 5 ? "listo" : "clic")
    const proxima = SALAS.find((s) => s.id !== "envio" && !nuevas.has(s.id))
    luego(700, () => irA(proxima?.id ?? "envio"))
  }

  function fallar(texto: string) {
    setAviso(texto)
    setAnimo("confundido")
    bleep("error")
  }

  /** Elegir habitación en el plano responde la primera etapa. */
  function elegirTipo(tipo: string) {
    const siguiente = { ...brief, tipoProyecto: tipo }
    setBrief(siguiente)
    bleep("volar")
    completar("proyecto", siguiente)
  }

  // El robot vive en el piso elegido (o en el que está bajo el cursor).
  const enfocada = Boolean(brief.tipoProyecto) && sala !== "proyecto"
  const tipoSobre = ZONAS.find((z) => z.id === sobre)?.tipo ?? null
  const robot = posicionRobot(brief.tipoProyecto, enfocada ? brief.tipoProyecto : (tipoSobre ?? (brief.tipoProyecto || null)), enfocada)

  return (
    <section className="contacto-asistente-section relative flex min-h-[100dvh] w-full items-center justify-center px-4 pb-10 pt-24">
      <h2 className="sr-only">Asistente V1TR0: arma tu mensaje</h2>

      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 lg:flex-row lg:items-center">
        {/* Plano */}
        <motion.div
          className="relative w-full lg:flex-1"
          style={{ aspectRatio: `${VB.w} / ${VB.h}`, maxWidth: `calc((100dvh - 130px) * ${VB.w / VB.h})` }}
          initial={{ opacity: 0, x: -48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <Plano
            tipo={brief.tipoProyecto}
            brief={brief}
            enfocada={enfocada}
            sobre={sobre}
            onSobre={setSobre}
            onTipo={elegirTipo}
          />

          <motion.div
            className="pointer-events-none absolute w-[11%]"
            initial={false}
            animate={{ left: robot.left, top: robot.top }}
            style={{ x: "-50%", y: "-50%" }}
            transition={{ type: "spring", stiffness: 60, damping: 14, mass: 1 }}
            aria-hidden="true"
          >
            <motion.div
              animate={{ y: [0, -8, 0, 5, 0], rotate: [0, 2, 0, -2, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <RobotAsistente animo={animo} hablando={hablando} className="w-full" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Ficha de la sala */}
        <motion.div
          className={`w-full max-w-md shrink-0 rounded-3xl p-6 lg:w-[380px] ${tarjeta}`}
          initial={{ opacity: 0, x: 48 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <nav className="mb-5 flex gap-1.5" aria-label="Salas">
            {SALAS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => irA(s.id)}
                aria-label={s.titulo}
                aria-current={s.id === sala ? "step" : undefined}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  s.id === sala ? "bg-[#26FFDF]" : hechas.has(s.id) ? "bg-[#26FFDF]/40" : "bg-white/10 hover:bg-white/20"
                }`}
              />
            ))}
          </nav>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={sala}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                {/* Volver a la etapa anterior; desde la primera no hay a dónde. */}
                {indiceSala > 0 && (
                  <button
                    type="button"
                    onClick={() => irA(SALAS[indiceSala - 1]!.id)}
                    aria-label={`Volver a ${SALAS[indiceSala - 1]!.titulo}`}
                    className="-ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors duration-300 hover:border-[#26FFDF]/50 hover:text-[#26FFDF]"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#26FFDF]">{salaActual.titulo}</p>
              </div>

              {sala === "envio" ? (
                <Envio brief={brief} listo={listo} onIr={irA} />
              ) : (
                <>
                  {sala === "proyecto" && <p className="text-xs text-textMuted">Toca un cuarto de la casa o elige aquí.</p>}
                  {salaActual.campos.map((campo) => (
                    <Campo key={campo} campo={campo} brief={brief} onCambio={cambiar} onElegirTipo={elegirTipo} />
                  ))}
                  {aviso && <p className="text-xs text-[#ff8a8a]">{aviso}</p>}
                  <button type="button" onClick={() => completar(sala)} className={botonPildora}>
                    Listo
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------- Ficha --------------------------------- */

function Campo({
  campo,
  brief,
  onCambio,
  onElegirTipo,
}: {
  campo: CampoBrief
  brief: Brief
  onCambio: (campo: CampoBrief, valor: string) => void
  /** Elegir tipo aquí equivale a tocar su habitación en el plano. */
  onElegirTipo?: (tipo: string) => void
}) {
  const p = paso(campo)
  const max = CAMPOS_BRIEF.find((c) => c.id === campo)!.max
  const id = `plano-${campo}`
  const valor = brief[campo]
  const fichas = [...(p.opciones ?? [])]
  const largo = campo === "necesidad" || campo === "funcionalidades"

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm leading-relaxed text-textPrimary">
        {campo === "nombre" || campo === "empresa" || campo === "ciudad" || campo === "correo"
          ? etiqueta(campo)
          : pregunta(campo, brief.nombre)}
      </label>
      {campo === "tipoProyecto" && (
        <div className="grid grid-cols-2 gap-2">
          {fichas.map((opcion) => (
            <button
              key={opcion}
              type="button"
              onClick={() => onElegirTipo?.(opcion)}
              aria-pressed={valor === opcion}
              className={`flex flex-col items-center justify-start gap-2 rounded-2xl border px-3 pb-3 pt-3.5 text-center text-xs leading-tight transition-colors duration-300 ${
                valor === opcion
                  ? "border-[#26FFDF]/50 bg-[#0d3b3b]/85 text-[#26FFDF]"
                  : "border-white/[0.07] bg-[#0b1414]/85 text-textMuted hover:border-[#26FFDF]/40 hover:text-[#26FFDF]"
              }`}
            >
              <IlustracionTipo tipo={opcion} />
              {opcion}
            </button>
          ))}
        </div>
      )}
      {fichas.length > 0 && campo !== "tipoProyecto" && (
        <div className="flex flex-wrap gap-1.5">
          {fichas.map((opcion) => (
            <button
              key={opcion}
              type="button"
              onClick={() => {
                onCambio(campo, opcion)
                bleep("clic")
              }}
              className={`rounded-full border px-3 py-1 text-xs transition-colors duration-300 ${
                valor === opcion
                  ? "border-[#26FFDF]/50 bg-[#0d3b3b]/85 text-[#26FFDF]"
                  : "border-white/[0.07] bg-[#0b1414]/85 text-textMuted hover:border-[#26FFDF]/40 hover:text-[#26FFDF]"
              }`}
            >
              {opcion}
            </button>
          ))}
        </div>
      )}
      {fichas.length === 0 &&
        (largo ? (
          <textarea
            id={id}
            rows={3}
            maxLength={max}
            value={valor}
            onChange={(e) => onCambio(campo, e.target.value)}
            placeholder={p.omitir}
            className={`${campoBase} resize-none`}
          />
        ) : (
          <input
            id={id}
            type={campo === "correo" ? "email" : "text"}
            maxLength={max}
            value={valor}
            onChange={(e) => onCambio(campo, e.target.value)}
            placeholder={p.omitir ? `Opcional · ${p.omitir.toLowerCase()}` : undefined}
            className={campoBase}
          />
        ))}
    </div>
  )
}

/**
 * Ilustraciones de línea de cada tipo de proyecto: las mismas ideas que los
 * muebles de su habitación (estante, pantalla, monitor y servidor, teléfono,
 * barras, brazo robótico, gateway con señal, caja sin abrir).
 */
const ILUSTRACIONES: Record<string, ReactNode> = {
  "Sala de conferencias": (
    <>
      <rect x="3" y="3" width="18" height="10" rx="1.5" />
      <path d="M12 13v3M8 21l4-5 4 5" />
    </>
  ),
  Baño: (
    <>
      <path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z" />
      <path d="M6 12V5a2 2 0 0 1 3.5-1.3M7 19l-1 2M17 19l1 2" />
    </>
  ),
  Jardín: (
    <>
      <path d="M12 21v-6" />
      <path d="M12 15c-4 0-6-2.5-6-5.5S8.5 3 12 3s6 3.5 6 6.5S16 15 12 15z" />
      <path d="M8 21h8" />
    </>
  ),
  "Tienda en línea": (
    <>
      <path d="M3 5h3l2.5 11h11L22 8H7.5" />
      <circle cx="10" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M11 11h7" />
    </>
  ),
  "Landing page o sitio web": (
    <>
      <rect x="2.5" y="4" width="19" height="15" rx="2.5" />
      <path d="M2.5 8h19" />
      <circle cx="5" cy="6" r="0.5" />
      <path d="M6 12h7M6 15h4" />
      <rect x="15" y="11" width="3.5" height="5" rx="1" />
    </>
  ),
  "Aplicación web o sistema interno": (
    <>
      <rect x="2" y="4" width="13" height="10" rx="2" />
      <path d="M6 18h5M8.5 14v4" />
      <rect x="17" y="3" width="5" height="17" rx="1.5" />
      <path d="M18.5 7h2M18.5 10h2M18.5 13h2" />
    </>
  ),
  "App móvil": (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="3" />
      <path d="M10.5 5h3" />
      <rect x="9" y="8" width="2.5" height="2.5" rx="0.6" />
      <rect x="12.5" y="8" width="2.5" height="2.5" rx="0.6" />
      <rect x="9" y="12" width="2.5" height="2.5" rx="0.6" />
      <circle cx="12" cy="18.5" r="0.8" />
    </>
  ),
  "Datos y dashboards": (
    <>
      <path d="M3 21h18" />
      <rect x="4.5" y="13" width="3" height="8" rx="1" />
      <rect x="10.5" y="8" width="3" height="13" rx="1" />
      <rect x="16.5" y="11" width="3" height="10" rx="1" />
      <path d="M5 9l5-4 4 3 5-4" />
    </>
  ),
  "Automatización o bots": (
    <>
      <path d="M3 21h18" />
      <path d="M6 21v-4h4v4" />
      <path d="M8 17V10l7-4 3 3" />
      <circle cx="8" cy="10" r="1.3" />
      <circle cx="15" cy="6" r="1.3" />
      <path d="M18 9v3M16.5 13.5l1.5-1.5 1.5 1.5" />
    </>
  ),
  "Hardware IoT (LoRa)": (
    <>
      <path d="M12 12v9M9 21h6" />
      <circle cx="12" cy="10.5" r="1.5" />
      <path d="M8.5 7a5 5 0 0 1 7 0M6 4.5a8.5 8.5 0 0 1 12 0" />
      <rect x="2.5" y="15" width="3.5" height="3.5" rx="1" />
      <rect x="18" y="15" width="3.5" height="3.5" rx="1" />
    </>
  ),
  Otro: (
    <>
      <path d="M3.5 8l8.5-4.5L20.5 8v9L12 21.5 3.5 17z" />
      <path d="M3.5 8L12 12.5 20.5 8M12 12.5v9" />
      <path d="M7.75 5.75l8.5 4.5" />
    </>
  ),
}

function IlustracionTipo({ tipo }: { tipo: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-11 w-11 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ILUSTRACIONES[tipo] ?? ILUSTRACIONES.Otro}
    </svg>
  )
}

function Envio({ brief, listo, onIr }: { brief: Brief; listo: boolean; onIr: (id: IdSala) => void }) {
  if (!listo) {
    const falta: Array<[string, IdSala]> = []
    if (!brief.necesidad.trim()) {falta.push(["Qué necesitas resolver", "idea"])}
    if (!brief.nombre.trim()) {falta.push(["Tu nombre", "contacto"])}
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-textPrimary">La antena se enciende cuando tengamos:</p>
        {falta.map(([texto, id]) => (
          <button key={id} type="button" onClick={() => onIr(id)} className={botonPildora}>
            {texto}
          </button>
        ))}
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-4">
      <pre
        data-scroll-inside
        className="max-h-56 overflow-y-auto whitespace-pre-wrap rounded-2xl border border-white/[0.07] bg-black/30 p-4 font-sans text-xs leading-relaxed text-textMuted [scrollbar-width:none]"
      >
        {mensajeContacto(brief)}
      </pre>
      {/* El resumen va escrito en el chat (t.me/<usuario>?text=); también se copia por si la app no lo precarga. */}
      <a
        href={`${siteConfig.company.telegram}?text=${encodeURIComponent(mensajeContacto(brief))}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          void copiarMensaje(brief)
          bleep("listo")
        }}
        className={botonPildora}
      >
        <FaTelegramPlane className="h-4 w-4" aria-hidden="true" />
        Enviar por Telegram
      </a>
      <a
        href={`mailto:${siteConfig.company.email}?subject=${encodeURIComponent("Proyecto: " + (brief.necesidad || "quiero más información").slice(0, 80))}&body=${encodeURIComponent(mensajeContacto(brief))}`}
        className="text-center text-xs text-textMuted underline-offset-4 transition-colors hover:text-[#26FFDF] hover:underline"
      >
        O envíalo por correo
      </a>
    </div>
  )
}

/**
 * Ilustración de cada nota. Plazo y presupuesto cambian con la respuesta: las
 * agujas del reloj avanzan según el plazo y las pilas de monedas crecen con
 * el presupuesto.
 */
function IlustracionNota({ clave, brief }: { clave: string; brief: Brief }) {
  const relleno = { fill: "#26FFDF", fillOpacity: 0.12 }
  let dibujo: ReactNode
  switch (clave) {
    case "tipo":
      dibujo = ILUSTRACIONES[brief.tipoProyecto] ?? ILUSTRACIONES.Otro
      break
    case "necesidad":
      // Bombillo: la idea que se quiere resolver.
      dibujo = (
        <>
          <path d="M8.5 15.5a6 6 0 1 1 7 0c-.8.6-1.2 1.4-1.2 2.3v.7H9.7v-.7c0-.9-.4-1.7-1.2-2.3z" {...relleno} />
          <path d="M9.8 21h4.4" />
          <path d="M12 14.5v-3.5M10.3 12.3 12 11l1.7 1.3" />
          <path d="M12 1.5v1.2M3.5 9.5h1.2M19.3 9.5h1.2M5.6 3.6l.9.9M18.4 3.6l-.9.9" />
        </>
      )
      break
    case "funciones":
      // Lista de verificación con piezas marcadas.
      dibujo = (
        <>
          <rect x="4" y="2.5" width="16" height="19" rx="2.5" {...relleno} />
          <path d="M9 2.5h6v2.2H9z" />
          <path d="M7.5 9.5l1.3 1.3 2.2-2.4M7.5 14.5l1.3 1.3 2.2-2.4" />
          <path d="M13 9.6h4M13 14.6h4M8 19h9" />
        </>
      )
      break
    case "plazo": {
      // Reloj: la aguja larga recorre más esfera cuanto más lejos el plazo.
      const opciones = paso("plazo").opciones ?? []
      const i = Math.max(0, opciones.indexOf(brief.plazo))
      const angulo = ((i + 1) / (opciones.length + 1)) * 2 * Math.PI
      const hx = 12 + 6 * Math.sin(angulo)
      const hy = 13 - 6 * Math.cos(angulo)
      dibujo = (
        <>
          <circle cx="12" cy="13" r="8.5" {...relleno} />
          <path d={`M12 13 A 7 7 0 ${angulo > Math.PI ? 1 : 0} 1 ${12 + 7 * Math.sin(angulo)} ${13 - 7 * Math.cos(angulo)}`} strokeOpacity={0.45} />
          <path d={`M12 13L${hx.toFixed(2)} ${hy.toFixed(2)}`} />
          <path d="M12 13v-3.5" />
          <path d="M9.5 2.5h5M12 2.5v2" />
          <circle cx="12" cy="13" r="0.9" fill="currentColor" />
        </>
      )
      break
    }
    case "presupuesto": {
      // Pilas de monedas: una pila más por cada tramo de presupuesto.
      const opciones = paso("presupuesto").opciones ?? []
      const pilas = Math.max(1, opciones.indexOf(brief.presupuesto) + 1)
      dibujo = (
        <>
          {Array.from({ length: 4 }, (_, p) => {
            const alto = p < pilas ? 2 + p : 0
            const x = 3 + p * 4.8
            return (
              <g key={p} strokeOpacity={p < pilas ? 1 : 0.25}>
                {Array.from({ length: Math.max(1, alto) }, (_, m) => (
                  <ellipse key={m} cx={x + 2} cy={20 - m * 2.6} rx="2.2" ry="1" {...(p < pilas ? relleno : {})} />
                ))}
              </g>
            )
          })}
          <path d="M2 22h20" />
        </>
      )
      break
    }
    default:
      // Credencial de contacto.
      dibujo = (
        <>
          <rect x="2.5" y="5" width="19" height="14" rx="2.5" {...relleno} />
          <circle cx="8.5" cy="11" r="2.2" />
          <path d="M5 16.5c.6-1.8 2-2.7 3.5-2.7s2.9.9 3.5 2.7" />
          <path d="M14.5 10h4.5M14.5 13h3.5M14.5 16h2.5" />
          <path d="M10 5V3.5h4V5" />
        </>
      )
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 h-8 w-8 shrink-0 text-[#26FFDF]"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dibujo}
    </svg>
  )
}

/* -------------------------------- Casa --------------------------------- */

type B = [number, number, number, number, number, number?, Tono?]
type Tipo = (typeof TIPOS_PROYECTO)[number]

/** Marca de las piezas de acento: se encienden cuando su cuarto está marcado. */
const a = "acento" as unknown as Tono

/** Árbol: tronco y dos capas de copa. */
const arbol = (x: number, y: number, alto = 1): B[] => [
  [x, y, 0.22, 0.22, 0.45 * alto, 0, "tronco"],
  [x - 0.39, y - 0.39, 1.0, 1.0, 0.6 * alto, 0.45 * alto, "hoja"],
  [x - 0.2, y - 0.2, 0.62, 0.62, 0.45 * alto, 1.05 * alto, "hoja"],
]

interface Zona {
  id: string
  titulo: string
  /** Si la zona responde "qué construir", el tipo; los añadidos no lo tienen. */
  tipo?: Tipo
  x: number
  y: number
  w: number
  d: number
  clase: "cuarto" | "pasillo" | "exterior"
  piso?: string
  muebles: B[]
}

/** Baranda del balcón: postes y pasamanos (se dibuja al final, va delante). */
const baranda = (x0: number, y0: number, w: number, d: number): B[] => [
  [x0, y0, 0.07, d, 0.06, 0.55, "muro"],
  ...Array.from({ length: Math.round(w) + 1 }, (_, i): B => [x0 + Math.min(i, w - 0.08), y0 + d - 0.08, 0.08, 0.08, 0.55, 0, "muro"]),
  [x0 + w - 0.07, y0, 0.07, d, 0.06, 0.55, "muro"],
  [x0, y0 + d - 0.08, w, 0.08, 0.06, 0.55, "muro"],
]

/**
 * La casa V1TR0 en dos plantas. Abajo, a pie de calle: tienda, sitio web,
 * sala de conferencias, bodega, baño y taller de automatización, con el
 * jardín y el letrero al frente. Arriba: sistemas, app móvil y datos, y el
 * balcón con el gateway LoRa. Cada tipo de proyecto tiene su cuarto; el baño,
 * las conferencias y el jardín son añadidos de la casa.
 */
const ZONAS: Zona[] = [
  {
    id: "pasillo",
    titulo: "Pasillo",
    x: 0, y: 3.5, w: 14, d: 1,
    clase: "pasillo",
    piso: "#121d1c",
    muebles: [
      [13.4, 0.25, 0.45, 0.45, 0.35],
      [13.45, 0.3, 0.35, 0.35, 0.35, 0.35, "hoja"],
    ],
  },
  {
    id: "pasillo2",
    titulo: "Pasillo",
    x: 7, y: 4.5, w: 1, d: 5.5,
    clase: "pasillo",
    piso: "#121d1c",
    muebles: [],
  },
    {
    id: "tienda",
    titulo: "Tienda en línea",
    tipo: "Tienda en línea",
    x: 0, y: 0.5, w: 4, d: 3,
    clase: "cuarto",
    muebles: [
      [0.3, 0.2, 3.2, 0.45, 1.0],
      ...[0.45, 1.25, 2.05, 2.85].map((x, i): B => [x, 0.27, 0.45, 0.3, 0.2 + (i % 2) * 0.1, 1.0, a]),
      [0.5, 1.4, 1.3, 0.65, 0.5],
      [0.65, 1.5, 0.35, 0.35, 0.25, 0.5, a],
      [1.25, 1.5, 0.35, 0.35, 0.32, 0.5, a],
      [2.4, 1.3, 1.2, 0.6, 0.55],
      [2.8, 1.4, 0.4, 0.35, 0.22, 0.55, a],
      [2.6, 2.4, 0.55, 0.38, 0.35, 0, a],
    ],
  },
  {
    id: "landing",
    titulo: "Landing page o sitio web",
    tipo: "Landing page o sitio web",
    x: 4, y: 0, w: 3, d: 3.5,
    clase: "cuarto",
    muebles: [
      [0.3, 0.12, 2.4, 0.1, 1.1, 0.05],
      [0.4, 0.22, 2.2, 0.01, 0.85, 0.15, a],
      [0.5, 0.9, 2.0, 0.8, 0.15],
      [1.35, 1.15, 0.3, 0.3, 0.6, 0.15, a],
      ...[0.5, 1.25, 2.0].map((x): B => [x, 2.3, 0.45, 0.4, 0.3]),
    ],
  },
  {
    id: "conferencias",
    titulo: "Sala de conferencias",
    x: 11, y: 0.5, w: 3, d: 3,
    clase: "cuarto",
    muebles: [
      [0.5, 0.12, 2.0, 0.1, 0.9, 0.1],
      [0.6, 0.22, 1.8, 0.01, 0.7, 0.2, "tenue"],
      ...[0.9, 1.6, 2.3].map((y): B => [0.35, y, 0.35, 0.35, 0.3]),
      [0.9, 0.8, 1.2, 2.0, 0.4],
      ...[0.9, 1.6, 2.3].map((y): B => [2.25, y, 0.35, 0.35, 0.3]),
    ],
  },
  {
    id: "bodega",
    titulo: "Otro",
    tipo: "Otro",
    x: 0, y: 4.5, w: 3, d: 2.5,
    clase: "cuarto",
    piso: "#111816",
    muebles: [
      [0.2, 0.25, 0.5, 2.0, 1.0],
      [0.28, 0.4, 0.36, 0.5, 0.3, 1.0, a],
      [0.28, 1.2, 0.36, 0.5, 0.22, 1.0, a],
      [1.0, 0.5, 0.9, 0.9, 0.7],
      [1.1, 0.6, 0.7, 0.7, 0.5, 0.7, a],
      [1.8, 1.3, 0.9, 0.9, 0.8, 0, a],
    ],
  },
  {
    id: "bano",
    titulo: "Baño",
    x: 8, y: 4.5, w: 2, d: 3,
    clase: "cuarto",
    piso: "#17201f",
    muebles: [
      [0.2, 0.3, 1.6, 0.8, 0.5],
      [0.3, 0.4, 1.4, 0.6, 0.01, 0.45, "agua"],
      [1.2, 1.6, 0.6, 0.45, 0.75],
      [1.3, 1.65, 0.4, 0.3, 0.02, 0.75, "agua"],
      [0.3, 2.0, 0.45, 0.2, 0.35, 0.4],
      [0.3, 2.2, 0.45, 0.6, 0.4],
    ],
  },
  {
    id: "automatizacion",
    titulo: "Automatización o bots",
    tipo: "Automatización o bots",
    x: 8, y: 7.5, w: 3.5, d: 3,
    clase: "cuarto",
    muebles: [
      ...[0.6, 2.2].flatMap((x): B[] => [
        [x, 0.25, 0.6, 0.6, 0.3],
        [x + 0.2, 0.45, 0.2, 0.2, 0.75, 0.3, a],
      ]),
      [0.3, 1.3, 3.0, 0.5, 0.35],
      ...[0.4, 1.1, 1.8, 2.6].map((x): B => [x, 1.37, 0.36, 0.36, 0.3, 0.35, a]),
      ...[0.6, 2.2].map((x): B => [x + 0.2, 0.45, 0.2, 0.95, 0.14, 1.05, a]),
      [0.3, 2.2, 0.9, 0.6, 0.5],
      [2.4, 2.2, 0.9, 0.5, 0.7],
      [2.5, 2.2, 0.7, 0.01, 0.4, 0.2, a],
    ],
  },
  {
    id: "patio",
    titulo: "Patio",
    x: 3.5, y: 7, w: 3.5, d: 2.5,
    clase: "exterior",
    muebles: [
      [0.4, 0.35, 1.3, 0.4, 0.3],
      [0.5, 1.3, 0.8, 0.8, 0.3],
      [0.6, 1.4, 0.6, 0.6, 0.01, 0.3, "agua"],
      ...arbol(2.3, 0.9),
      [2.2, 1.9, 1.1, 0.4, 0.3],
    ],
  },
  {
    id: "jardin",
    titulo: "Jardín",
    x: 0, y: 7, w: 3.5, d: 2.5,
    clase: "exterior",
    muebles: [
      ...arbol(0.6, 0.5),
      [0.3, 1.2, 2.0, 0.25, 0.25],
      [0.4, 1.15, 1.8, 0.16, 0.85, 0.25, "muro"],
      ...arbol(2.5, 2.0, 0.8),
    ],
  },
  {
    id: "sistema",
    titulo: "Aplicación web o sistema interno",
    tipo: "Aplicación web o sistema interno",
    x: 7, y: 0, w: 4, d: 3.5,
    clase: "cuarto",
    muebles: [
      [3.0, 0.2, 0.45, 0.55, 1.1],
      [3.05, 0.75, 0.35, 0.01, 0.9, 0.1, a],
      [3.5, 0.2, 0.45, 0.55, 1.1],
      [3.55, 0.75, 0.35, 0.01, 0.9, 0.1, a],
      ...[
        [0.3, 0.9],
        [1.6, 0.9],
        [0.3, 2.0],
        [1.6, 2.0],
      ].flatMap(([x, y]): B[] => [
        [x!, y!, 1.1, 0.55, 0.4],
        [x! + 0.18, y! + 0.05, 0.75, 0.06, 0.4, 0.4, a],
      ]),
      [3.1, 2.1, 0.6, 0.6, 0.3],
    ],
  },
  {
    id: "movil",
    titulo: "App móvil",
    tipo: "App móvil",
    x: 3, y: 4.5, w: 4, d: 2.5,
    clase: "cuarto",
    muebles: [
      [1.0, 0.3, 1.0, 0.16, 1.5],
      [1.07, 0.46, 0.86, 0.01, 1.3, 0.12, a],
      [0.3, 1.3, 2.0, 0.7, 0.4],
      ...[0.45, 1.1, 1.75].map((x): B => [x, 1.45, 0.3, 0.45, 0.04, 0.4, a]),
      [2.6, 1.7, 0.6, 0.55, 0.3],
    ],
  },
  {
    id: "datos",
    titulo: "Datos y dashboards",
    tipo: "Datos y dashboards",
    x: 10, y: 4.5, w: 4, d: 3,
    clase: "cuarto",
    muebles: [
      ...[0.5, 0.85, 0.65, 1.0].map((h, i): B => [0.3 + i * 0.62, 0.5, 0.42, 0.42, h, 0, a]),
      [0.4, 2.0, 0.4, 0.4, 0.4, 0, a],
      [0.9, 2.0, 0.4, 0.4, 0.6, 0, a],
      [1.9, 2.0, 1.8, 0.6, 0.4],
      [2.05, 2.05, 0.7, 0.06, 0.4, 0.4, a],
      [2.9, 2.05, 0.7, 0.06, 0.4, 0.4, a],
    ],
  },
  {
    id: "iot",
    titulo: "Hardware IoT (LoRa)",
    tipo: "Hardware IoT (LoRa)",
    x: 11.5, y: 7.5, w: 4, d: 2,
    clase: "exterior",
    piso: "#131c1b",
    muebles: [
      [0.5, 0.4, 0.12, 0.12, 0.45],
      [0.4, 0.3, 0.32, 0.32, 0.2, 0.45, a],
      [1.5, 0.5, 0.8, 0.8, 0.25],
      [1.8, 0.8, 0.2, 0.2, 2.0, 0.25, a],
      [2.8, 0.5, 0.1, 0.1, 0.4],
      [3.6, 0.5, 0.1, 0.1, 0.4],
      [2.7, 0.4, 1.0, 0.8, 0.08, 0.4, a],
      [0.9, 1.1, 0.5, 0.5, 0.35],
      [0.95, 1.15, 0.4, 0.4, 0.3, 0.35, "hoja"],
      ...baranda(0, 0, 4, 2),
    ],
  },
]

/** ¿Hay otro cuarto pegado detrás (vecino) o delante (frente) en ese eje? */
const CUARTOS = ZONAS.filter((z) => z.clase !== "exterior")
const solapa = (a0: number, a1: number, b0: number, b1: number) => Math.min(a1, b1) - Math.max(a0, b0) > 0.4
function vecino(z: Zona, eje: "x" | "y") {
  return CUARTOS.some((c) =>
    eje === "x"
      ? c !== z && Math.abs(c.x + c.w - z.x) < 0.01 && solapa(c.y, c.y + c.d, z.y, z.y + z.d)
      : c !== z && Math.abs(c.y + c.d - z.y) < 0.01 && solapa(c.x, c.x + c.w, z.x, z.x + z.w),
  )
}
function frente(z: Zona, eje: "x" | "y") {
  return CUARTOS.find((c) =>
    eje === "x"
      ? c !== z && Math.abs(z.x + z.w - c.x) < 0.01 && solapa(c.y, c.y + c.d, z.y, z.y + z.d)
      : c !== z && Math.abs(z.y + z.d - c.y) < 0.01 && solapa(c.x, c.x + c.w, z.x, z.x + z.w),
  )
}

const zonaDe = (tipo: string | null) => ZONAS.find((z) => z.tipo === tipo)

/** Zoom sobre un cuarto: lo centra y lo escala para dejar sitio a las notas. */
const CENTRO = { x: VB.x + VB.w / 2, y: VB.y + VB.h / 2 }
const zoomDe = (z: Zona) => Math.min(2.2, (VB.w - 2 * NOTA_ANCHO - 80) / ((z.w + z.d) * K))
function enfoque(z: Zona) {
  const k = zoomDe(z)
  const [rx, ry] = iso(z.x + z.w / 2, z.y + z.d / 2, 0.5)
  return { tx: CENTRO.x - k * rx, ty: CENTRO.y - k * ry, k }
}
/** Punto del cuarto ampliado; las anclas de las notas vienen en 0–3 y se escalan al cuarto. */
function proyectar(z: Zona, lx: number, ly: number, alto: number): [number, number] {
  const { tx, ty, k } = enfoque(z)
  const [px, py] = iso(z.x + (lx * z.w) / 3, z.y + (ly * z.d) / 3, alto)
  return [tx + k * px, ty + k * py]
}
const aPorcentaje = ([px, py]: [number, number]) => ({
  left: `${((px - VB.x) / VB.w) * 100}%`,
  top: `${((py - VB.y) / VB.h) * 100}%`,
})

/** Dónde flota el robot: en el cuarto elegido o marcado; si no, en el pasillo. */
function posicionRobot(tipo: string, abiertoTipo: string | null, enfocada: boolean) {
  const elegido = zonaDe(tipo)
  if (enfocada && elegido) {return aPorcentaje(proyectar(elegido, 1.5, 1.5, 1.1))}
  const z = zonaDe(abiertoTipo) ?? elegido
  if (!z) {return aPorcentaje(iso(5, 3.5, 1.6))}
  return aPorcentaje(iso(z.x + z.w / 2, z.y + z.d / 2, 1.0))
}

/**
 * Notas del mensaje alrededor del cuarto elegido: cada una se ancla a un punto
 * del cuarto con su línea guía y aparece en cuanto la persona escribe o elige
 * ese dato. Izquierda: el proyecto; derecha: condiciones y contacto.
 */
const NOTAS: Array<{ clave: string; titulo: string; lado: "izq" | "der"; fila: number; ancla: [number, number, number]; valor: (b: Brief) => string }> = [
  { clave: "tipo", titulo: "Proyecto", lado: "izq", fila: 0, ancla: [0.5, 0.3, 1.0], valor: (b) => b.tipoProyecto },
  { clave: "necesidad", titulo: "Qué resuelve", lado: "izq", fila: 1, ancla: [0.3, 1.5, 0.5], valor: (b) => b.necesidad },
  { clave: "funciones", titulo: "Funciones clave", lado: "izq", fila: 2, ancla: [1.0, 2.8, 0.3], valor: (b) => b.funcionalidades },
  { clave: "plazo", titulo: "Plazo", lado: "der", fila: 0, ancla: [2.6, 0.4, 1.0], valor: (b) => b.plazo },
  { clave: "presupuesto", titulo: "Presupuesto", lado: "der", fila: 1, ancla: [2.8, 1.6, 0.5], valor: (b) => b.presupuesto },
  {
    clave: "contacto",
    titulo: "Contacto",
    lado: "der",
    fila: 2,
    ancla: [2.2, 2.8, 0.3],
    valor: (b) => [b.nombre, b.empresa, b.ciudad, b.correo].map((v) => v.trim()).filter(Boolean).join(" · "),
  },
]
const NOTA_ANCHO = 200
const NOTA_FILAS = [CENTRO.y - 230, CENTRO.y, CENTRO.y + 230]

/** Matriz que pega un dibujo plano sobre una cara que mira al frente-izquierda (plano y fijo). */
const caraFrente = (x: number, y: number, z: number, escala: number) => {
  const [ox, oy] = iso(x, y, z)
  return `matrix(${K * escala} ${H * escala} 0 ${S * escala} ${ox} ${oy})`
}

/** Muro con hueco de puerta en el medio. */
function muroConPuerta(eje: "x" | "y", fijo: number, desde: number, largo: number, alto: number, base: number, clave: string) {
  const hueco = Math.min(1, largo * 0.35)
  const tramo = (largo - hueco) / 2
  return [desde, desde + tramo + hueco].map((inicio, i) =>
    eje === "x" ? (
      <Caja key={`${clave}${i}`} x={fijo - 0.06} y={inicio} w={0.12} d={tramo} h={alto} z={base} tono="muro" />
    ) : (
      <Caja key={`${clave}${i}`} x={inicio} y={fijo - 0.06} w={tramo} d={0.12} h={alto} z={base} tono="muro" />
    ),
  )
}

function Plano({
  tipo,
  brief,
  enfocada,
  sobre,
  onSobre,
  onTipo,
}: {
  tipo: string
  brief: Brief
  /** Con el cuarto elegido y ya en las preguntas: solo queda él. */
  enfocada: boolean
  sobre: string | null
  onSobre: (id: string | null) => void
  onTipo: (tipo: string) => void
}) {
  const elegido = zonaDe(tipo)
  const zoom = enfocada && elegido ? enfoque(elegido) : { tx: 0, ty: 0, k: 1 }
  /** `sobre` guarda el id de la zona bajo el cursor (también los añadidos). */
  const marcada = (z: Zona) => (z.tipo !== undefined && z.tipo === tipo) || (!enfocada && z.id === sobre)
  const oculta = (z: Zona) => enfocada && z !== elegido
  const resaltar = (z: Zona) => ({
    onMouseEnter: () => onSobre(z.id),
    onMouseLeave: () => onSobre(null),
  })
  const desvanecer = (visible: boolean) => ({
    opacity: visible ? 1 : 0,
    transition: "opacity 500ms ease",
    pointerEvents: visible ? undefined : ("none" as const),
  })
  const MURO_ALTO = 1.2
  const TABIQUE = 0.55

  return (
    <>
      <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} className="absolute inset-0 h-full w-full select-none" role="group" aria-label="Casa V1TR0: elige un cuarto según lo que quieres construir">
        <g
          style={{
            transform: `translate(${zoom.tx}px, ${zoom.ty}px) scale(${zoom.k})`,
            transformOrigin: "0 0",
            transformBox: "view-box",
            transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {(() => {
            const zonas = ZONAS
            const altura = 0
            return (
              <g>

                {/* Pisos: los cuartos de un tipo se eligen; los añadidos solo se señalan. */}
                {zonas.map((z) => {
                  const activa = marcada(z)
                  const elegible = Boolean(z.tipo)
                  const base = z.piso ?? (z.clase === "exterior" ? "#0f1d16" : "#0d1716")
                  const elegir = () => z.tipo && onTipo(z.tipo)
                  return (
                    <g
                      key={z.id}
                      style={desvanecer(!oculta(z))}
                      className={elegible ? "cursor-pointer outline-none" : undefined}
                      {...resaltar(z)}
                      {...(elegible
                        ? {
                            role: "button",
                            tabIndex: 0,
                            "aria-label": z.titulo,
                            "aria-pressed": z.tipo === tipo,
                            onClick: elegir,
                            onFocus: () => onSobre(z.id),
                            onBlur: () => onSobre(null),
                            onKeyDown: (e: KeyboardEvent) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault()
                                elegir()
                              }
                            },
                          }
                        : {})}
                    >
                      <polygon
                        points={pts([z.x, z.y, altura], [z.x + z.w, z.y, altura], [z.x + z.w, z.y + z.d, altura], [z.x, z.y + z.d, altura])}
                        fill={activa && elegible ? "#123a36" : base}
                        stroke={activa ? "#26FFDF" : "#ffffff"}
                        strokeOpacity={activa ? 0.7 : 0.05}
                        style={{ transition: "fill 300ms, stroke-opacity 300ms" }}
                      />
                      {z.clase !== "exterior" &&
                        Array.from({ length: Math.ceil(z.w) - 1 }, (_, n) => n + 1).map((n) => (
                          <polyline
                            key={`gx${n}`}
                            points={pts([z.x + n, z.y, altura], [z.x + n, z.y + z.d, altura])}
                            stroke="#fff"
                            strokeOpacity={0.03}
                            pointerEvents="none"
                          />
                        ))}
                    </g>
                  )
                })}

                {/* Muros y muebles, fila por fila de atrás hacia adelante. */}
                <g pointerEvents="none">
                  {[...zonas]
                    .sort((p, q) => p.x + p.w / 2 + p.y + p.d / 2 - (q.x + q.w / 2 + q.y + q.d / 2))
                    .map((z) => {
                      const activa = marcada(z)
                      return (
                        <g key={z.id} style={desvanecer(!oculta(z))}>
                          {z.clase === "cuarto" && (
                            <g style={desvanecer(!enfocada)}>
                              {vecino(z, "x") ? (
                                muroConPuerta("x", z.x, z.y, z.d, TABIQUE, altura, `${z.id}x`)
                              ) : (
                                <Caja x={z.x - 0.12} y={z.y} w={0.12} d={z.d} h={MURO_ALTO} z={altura} tono="muro" />
                              )}
                              {vecino(z, "y") ? (
                                muroConPuerta("y", z.y, z.x, z.w, TABIQUE, altura, `${z.id}y`)
                              ) : (
                                <Caja x={z.x - 0.12} y={z.y - 0.12} w={z.w + 0.12} d={0.12} h={MURO_ALTO} z={altura} tono="muro" />
                              )}
                            </g>
                          )}
                          {/* Aislado, el cuarto gana muros propios: fondo alto, frente bajo. */}
                          {z === elegido && (
                            <g style={desvanecer(enfocada)}>
                              <Caja x={z.x - 0.12} y={z.y - 0.12} w={0.12} d={z.d + 0.12} h={1.0} z={altura} tono="muro" />
                              <Caja x={z.x} y={z.y - 0.12} w={z.w} d={0.12} h={1.0} z={altura} tono="muro" />
                            </g>
                          )}
                          {z.muebles.map(([x, y, w, d, alto, zl = 0, t], i) => (
                            <Caja
                              key={i}
                              x={z.x + x}
                              y={z.y + y}
                              w={w}
                              d={d}
                              h={alto}
                              z={altura + zl}
                              tono={t === a ? (activa ? "encendido" : "tenue") : (t ?? "apagado")}
                            />
                          ))}
                          {/* Letrero de la entrada con el logo y el nombre. */}
                          {z.id === "jardin" && (
                            <g>
                              <image
                                href="/imagenes/logos/v1tr0-logo.svg"
                                width={1400}
                                height={1200}
                                transform={caraFrente(z.x + 0.5, z.y + 1.311, 1.03, 0.66 / 1200)}
                              />
                              <text transform={caraFrente(z.x + 1.32, z.y + 1.311, 0.52, 1 / 40)} fontSize={20} fontWeight={700} letterSpacing={2} fill="#26FFDF">
                                V1TR0
                              </text>
                            </g>
                          )}
                          {/* Fachada baja hacia afuera, donde no sigue otro cuarto. */}
                          {z.clase === "cuarto" && (
                            <g style={desvanecer(!enfocada)}>
                              {(() => {
                                const f = frente(z, "y")
                                if (!f) {
                                  return <Caja x={z.x} y={z.y + z.d} w={z.w} d={0.12} h={0.25} tono="muro" />
                                }
                                // El pasillo no levanta muros: la puerta la pone el cuarto.
                                return f.clase === "pasillo" ? muroConPuerta("y", z.y + z.d, z.x, z.w, TABIQUE, 0, `${z.id}fy`) : null
                              })()}
                              {(() => {
                                const f = frente(z, "x")
                                if (!f) {
                                  return <Caja x={z.x + z.w} y={z.y} w={0.12} d={z.d + 0.12} h={0.25} tono="muro" />
                                }
                                return f.clase === "pasillo" ? muroConPuerta("x", z.x + z.w, z.y, z.d, TABIQUE, 0, `${z.id}fx`) : null
                              })()}
                            </g>
                          )}
                          {z === elegido && (
                            <g style={desvanecer(enfocada)}>
                              <Caja x={z.x} y={z.y + z.d} w={z.w} d={0.12} h={0.2} z={altura} tono="muro" />
                              <Caja x={z.x + z.w} y={z.y} w={0.12} d={z.d + 0.12} h={0.2} z={altura} tono="muro" />
                            </g>
                          )}
                        </g>
                      )
                    })}
                </g>
              </g>
            )
          })()}

          {/* Señal del gateway cuando el terraza de antenas está marcado. */}
          {(() => {
            const iot = ZONAS.find((z) => z.id === "iot")!
            if (!marcada(iot)) {
              return null
            }
            const [gx, gy] = iso(iot.x + 1.9, iot.y + 0.9, 2.3)
            return (
              <g pointerEvents="none">
                {[0, 1, 2].map((i) => (
                  <motion.ellipse
                    key={i}
                    cx={gx}
                    cy={gy}
                    fill="none"
                    stroke="#26FFDF"
                    strokeWidth={1.2}
                    initial={{ rx: 5, ry: 2.5, opacity: 0.7 }}
                    animate={{ rx: 46, ry: 23, opacity: 0 }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
                  />
                ))}
              </g>
            )
          })()}
        </g>

        {/* Rótulo de la zona: sale con el cursor (o fijo en el cuarto elegido). */}
        {ZONAS.filter((z) => z.clase !== "pasillo").map((z) => {
          const visible = !enfocada && (sobre ? sobre === z.id : z.tipo !== undefined && z.tipo === tipo)
          const [cx, cy] = iso(z.x + z.w / 2, z.y + z.d / 2, 0)
          const ly = cy - 110
          const ancho = Math.max(z.titulo.length * 6.6 + 30, 100)
          const color = z.tipo ? "#26FFDF" : "#9fb3b0"
          const icono = z.tipo ? ILUSTRACIONES[z.tipo] : (ILUSTRACIONES[z.titulo] ?? ILUSTRACIONES.Jardín)
          return (
            <g
              key={`r-${z.id}`}
              className={z.tipo ? "cursor-pointer" : undefined}
              style={{ ...desvanecer(visible), transition: "opacity 300ms ease" }}
              {...resaltar(z)}
              onClick={() => z.tipo && onTipo(z.tipo)}
              aria-hidden="true"
            >
              <line x1={cx} y1={cy} x2={cx} y2={ly + 26} stroke={color} strokeOpacity={0.5} pointerEvents="none" />
              <circle cx={cx} cy={cy} r={2.5} fill={color} pointerEvents="none" />
              <rect x={cx - ancho / 2} y={ly - 26} width={ancho} height={52} rx={18} fill="#0b1414" stroke={color} strokeOpacity={0.4} />
              {icono && (
                <g
                  transform={`translate(${cx - 11} ${ly - 23}) scale(0.92)`}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {icono}
                </g>
              )}
              <text x={cx} y={ly + 18} textAnchor="middle" fill={color} fontSize={11.5} fontWeight={500}>
                {z.titulo}
              </text>
            </g>
          )
        })}

        {/* Líneas guía de las notas. */}
        {enfocada &&
          elegido &&
          NOTAS.map((n) => {
            if (!n.valor(brief).trim()) {return null}
            const [ax, ay] = proyectar(elegido, ...n.ancla)
            const bx = n.lado === "izq" ? VB.x + 10 + NOTA_ANCHO : VB.x + VB.w - 10 - NOTA_ANCHO
            const by = NOTA_FILAS[n.fila]!
            return (
              <motion.g key={`l-${n.clave}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.5 }} pointerEvents="none">
                <polyline points={`${ax},${ay} ${ax},${by} ${bx},${by}`} fill="none" stroke="#26FFDF" strokeOpacity={0.5} strokeWidth={1} />
                <circle cx={ax} cy={ay} r={3} fill="#26FFDF" />
              </motion.g>
            )
          })}
      </svg>

      {/* Notas: el texto que la persona va escribiendo y eligiendo. */}
      <AnimatePresence>
        {enfocada &&
          NOTAS.map((n) => {
            const valor = n.valor(brief).trim()
            if (!valor) {return null}
            const bx = n.lado === "izq" ? VB.x + 10 : VB.x + VB.w - 10 - NOTA_ANCHO
            return (
              <motion.div
                key={n.clave}
                className={`pointer-events-none absolute -translate-y-1/2 rounded-2xl px-3 py-2 ${tarjeta}`}
                style={{
                  left: `${((bx - VB.x) / VB.w) * 100}%`,
                  top: `${((NOTA_FILAS[n.fila]! - VB.y) / VB.h) * 100}%`,
                  width: `${(NOTA_ANCHO / VB.w) * 100}%`,
                }}
                initial={{ opacity: 0, x: n.lado === "izq" ? -24 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-start gap-2.5">
                  <IlustracionNota clave={n.clave} brief={brief} />
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#26FFDF]">{n.titulo}</p>
                    <p className="mt-0.5 line-clamp-4 break-words text-xs leading-snug text-textPrimary">{valor}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
      </AnimatePresence>
    </>
  )
}
