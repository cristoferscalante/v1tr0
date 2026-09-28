"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUp, Loader2, X } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { siteConfig } from "@/config/site"
import {
  briefListo,
  briefVacio,
  CAMPOS_BRIEF,
  CAMPOS_REQUERIDOS,
  enlaceWhatsApp,
  TIPOS_PROYECTO,
  type Brief,
  type CampoBrief,
} from "@/lib/asistente/brief"
import { CIERRE, PASOS, responderPregunta } from "@/lib/asistente/guion"
import useSnapAnimations from "@/hooks/use-snap-animations"

/**
 * Cierre del home: el asistente de V1TR0.
 *
 * Lo principal es la conversación, que es guionada (ver lib/asistente/guion):
 * sin modelo de lenguaje, sin costo por mensaje y sin respuestas fuera de
 * libreto. Mientras avanza, el brief del proyecto se llena por detrás; solo sale a la vista si la persona quiere revisarlo, y el
 * envío abre WhatsApp con el mensaje ya redactado. Nada se guarda en el
 * servidor, así que no hay datos personales que custodiar.
 *
 * Sin panel de fondo: los modelos y el chat flotan sobre el vacío de la página.
 */

type Mensaje = { rol: "usuario" | "asistente"; texto: string }

/**
 * Los modelos de la marca, reunidos. `alto` es relativo al grupo y `z` decide
 * quién queda delante; el del POS viene cortado a media altura, así que se
 * desvanece por abajo como en el hero de la tienda.
 */
const MODELOS = [
  { src: "/imagenes/home/carrusel/sistemas_de_informacion.webp", aspecto: 2 / 3, centro: "15%", alto: "72%", z: 20, flotar: 0.4 },
  { src: "/imagenes/home/odiseo/odiseo-46.webp", aspecto: 644 / 1320, centro: "38%", alto: "92%", z: 30, flotar: 0 },
  { src: "/imagenes/tienda/pos-turn/pos-40.webp", aspecto: 520 / 713, centro: "60%", alto: "52%", z: 40, flotar: 0.8, cortado: true },
  { src: "/imagenes/home/carrusel/automatizacion_de_tareas.webp", aspecto: 2 / 3, centro: "84%", alto: "68%", z: 20, flotar: 1.2 },
]

const MULTILINEA: CampoBrief[] = ["necesidad", "funcionalidades"]

/** Fondo oscuro de las tarjetas del hero, en versión opaca para leer sobre el vacío. */
const tarjetaOscura = "border border-white/[0.07] bg-[#0b1414]/85 backdrop-blur-sm"

const campoBase = `w-full rounded-xl px-3 py-2 text-sm text-textPrimary placeholder:text-textMuted/60 transition-colors duration-300 focus:outline-none focus:border-[#26FFDF]/40 ${tarjetaOscura}`

const botonPildora =
  "inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-textPrimary transition-colors duration-300 hover:border-[#26FFDF]/50 hover:text-[#26FFDF]"

export default function ContactoAsistenteSection() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([{ rol: "asistente", texto: PASOS[0]!.pregunta("") }])
  const [brief, setBrief] = useState<Brief>(briefVacio)
  const [paso, setPaso] = useState(0)
  const [entrada, setEntrada] = useState("")
  const [cargando, setCargando] = useState(false)
  const [revisando, setRevisando] = useState(false)
  const listaRef = useRef<HTMLDivElement>(null)
  const temporizador = useRef<ReturnType<typeof setTimeout>>(undefined)

  useSnapAnimations({
    sections: [".contacto-asistente-section"],
    duration: 0.8,
    enableCircularNavigation: false,
    singleAnimation: true,
  })

  useEffect(() => {
    const lista = listaRef.current
    if (lista) {
      lista.scrollTo({ top: lista.scrollHeight, behavior: "smooth" })
    }
  }, [mensajes, cargando])

  useEffect(() => () => clearTimeout(temporizador.current), [])

  /** El asistente "escribe" un momento antes de contestar. */
  function contestar(texto: string) {
    setCargando(true)
    temporizador.current = setTimeout(() => {
      setMensajes((actual) => [...actual, { rol: "asistente", texto }])
      setCargando(false)
    }, 450 + Math.min(texto.length * 8, 700))
  }

  function responder(texto: string, esOpcion = false) {
    const limpio = texto.trim().slice(0, 600)
    if (!limpio || cargando) {
      return
    }
    setMensajes((actual) => [...actual, { rol: "usuario", texto: limpio }])
    setEntrada("")

    const actual = PASOS[paso]
    // Guion terminado: solo quedan las dudas y el envío.
    if (!actual) {
      contestar(responderPregunta(limpio) ?? "Tu resumen ya está listo. Cuando quieras, envíalo por WhatsApp.")
      return
    }

    // Una pregunta no avanza el guion: se contesta y se retoma el paso.
    const aclaracion = esOpcion ? null : responderPregunta(limpio)
    if (aclaracion) {
      contestar(`${aclaracion}\n\n${actual.pregunta(brief.nombre)}`)
      return
    }

    const valor = limpio === actual.omitir ? "" : limpio
    const invalido = valor && !esOpcion ? actual.validar?.(valor) : null
    if (invalido) {
      contestar(invalido)
      return
    }

    const siguiente = { ...brief, [actual.campo]: valor }
    setBrief(siguiente)
    setPaso(paso + 1)
    const proximo = PASOS[paso + 1]
    contestar(proximo ? proximo.pregunta(siguiente.nombre) : CIERRE(siguiente.nombre))
  }

  function alEnviar(evento: FormEvent) {
    evento.preventDefault()
    responder(entrada)
  }

  const pasoActual = PASOS[paso]
  const respuestasRapidas = pasoActual && !cargando
    ? [...(pasoActual.opciones ?? []), ...(pasoActual.omitir ? [pasoActual.omitir] : [])]
    : []
  const listo = briefListo(brief)
  const hayDatos = CAMPOS_BRIEF.some((campo) => brief[campo.id].trim())

  return (
    <section className="contacto-asistente-section relative flex min-h-[100dvh] w-full items-center justify-center px-4 pb-10 pt-24">
      <div className="z-10 mx-auto grid w-full max-w-6xl items-center gap-6 lg:h-[min(640px,calc(100dvh-160px))] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10">
        {/* Modelos reunidos */}
        <motion.div
          className="pointer-events-none relative mx-auto h-[260px] w-full max-w-md sm:h-[320px] lg:h-full lg:max-w-none"
          initial={{ opacity: 0, x: -56 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          aria-hidden="true"
        >
          {MODELOS.map((modelo) => (
            <motion.div
              key={modelo.src}
              className="absolute bottom-0"
              style={{
                // El centrado va por motion: una clase translate la pisaría la animación.
                x: "-50%",
                left: modelo.centro,
                height: modelo.alto,
                aspectRatio: modelo.aspecto,
                zIndex: modelo.z,
                ...(modelo.cortado && {
                  maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                }),
              }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: modelo.flotar }}
            >
              <Image
                src={modelo.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 18vw, 30vw"
                className="object-contain object-bottom"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Chat */}
        <motion.div
          className="relative flex h-[520px] min-h-0 min-w-0 flex-col lg:h-full"
          initial={{ opacity: 0, x: 56 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-textPrimary sm:text-3xl">Asistente V1TR0</h2>
          <p className="mt-1.5 text-sm text-textMuted">
            Cuéntanos tu proyecto; al final lo enviamos a nuestro WhatsApp.
          </p>

          <div
            ref={listaRef}
            data-scroll-inside
            className="mt-4 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain py-4 pr-1 [scrollbar-width:none]"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0, black 32px, black calc(100% - 16px), transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0, black 32px, black calc(100% - 16px), transparent 100%)",
            }}
            aria-live="polite"
          >
            <div className="flex-1" />
            {mensajes.map((mensaje, indice) => (
              <motion.div
                key={indice}
                initial={{ opacity: 0, x: mensaje.rol === "usuario" ? 24 : -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`max-w-[85%] whitespace-pre-wrap rounded-3xl px-4 py-2.5 text-sm leading-relaxed text-textPrimary ${
                  mensaje.rol === "usuario"
                    ? "self-end rounded-br-lg border border-[#26FFDF]/15 bg-[#0d3b3b]/85"
                    : `self-start rounded-bl-lg ${tarjetaOscura}`
                }`}
              >
                {mensaje.texto}
              </motion.div>
            ))}

            {respuestasRapidas.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {respuestasRapidas.map((opcion) => (
                  <button
                    key={opcion}
                    type="button"
                    onClick={() => responder(opcion, true)}
                    className={`rounded-full px-3.5 py-1.5 text-xs text-textMuted transition-colors duration-300 hover:border-[#26FFDF]/40 hover:text-[#26FFDF] ${tarjetaOscura}`}
                  >
                    {opcion}
                  </button>
                ))}
              </div>
            )}

            {cargando && (
              <div className={`self-start rounded-3xl rounded-bl-lg px-4 py-2.5 ${tarjetaOscura}`}>
                <Loader2 className="h-4 w-4 animate-spin text-textMuted" aria-label="El asistente está escribiendo" />
              </div>
            )}

          </div>

          <form onSubmit={alEnviar} className="flex items-center gap-2 pt-2">
            <label htmlFor="asistente-entrada" className="sr-only">
              Escribe tu mensaje
            </label>
            <input
              id="asistente-entrada"
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              maxLength={800}
              autoComplete="off"
              placeholder="Escribe tu mensaje…"
              className={`${campoBase} rounded-full px-5 py-3`}
            />
            <button
              type="submit"
              disabled={cargando || !entrada.trim()}
              aria-label="Enviar mensaje"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#26FFDF] transition-colors duration-300 hover:border-[#26FFDF]/50 disabled:opacity-40 ${tarjetaOscura}`}
            >
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          {(listo || hayDatos) && (
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {listo && (
                <a
                  href={enlaceWhatsApp(siteConfig.company.whatsapp, brief)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={botonPildora}
                >
                  <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
                  Enviar por WhatsApp
                </a>
              )}
              <button
                type="button"
                onClick={() => setRevisando(true)}
                className="text-xs text-textMuted underline-offset-4 transition-colors hover:text-[#26FFDF] hover:underline"
              >
                Revisar datos
              </button>
            </div>
          )}

          {/* El brief: se llena por detrás y solo aparece si la persona quiere revisarlo. */}
          <AnimatePresence>
            {revisando && (
              <RevisionBrief
                brief={brief}
                onCambio={(campo, valor) => setBrief((actual) => ({ ...actual, [campo]: valor }))}
                onCerrar={() => setRevisando(false)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

function RevisionBrief({
  brief,
  onCambio,
  onCerrar,
}: {
  brief: Brief
  onCambio: (campo: CampoBrief, valor: string) => void
  onCerrar: () => void
}) {
  const listo = briefListo(brief)

  return (
    <motion.div
      role="dialog"
      aria-label="Datos del proyecto"
      className="absolute inset-0 z-40 flex flex-col rounded-[2rem] border border-white/[0.07] bg-[#0b1414]/95 backdrop-blur-md"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3 }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onCerrar()
        }
      }}
    >
      <div className="flex items-center justify-between px-5 pt-4">
        <p className="text-sm font-semibold text-textPrimary">Datos del proyecto</p>
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Volver al chat"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-textMuted transition-colors hover:border-white/25 hover:text-textPrimary"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div
        data-scroll-inside
        className="grid min-h-0 flex-1 grid-cols-1 content-start gap-x-3 gap-y-2.5 overflow-y-auto overscroll-contain p-5 sm:grid-cols-2"
      >
        {CAMPOS_BRIEF.map((campo) => {
          const id = `brief-${campo.id}`
          const requerido = CAMPOS_REQUERIDOS.includes(campo.id)
          const ancho = MULTILINEA.includes(campo.id) || campo.id === "tipoProyecto" ? "sm:col-span-2" : ""

          return (
            <div key={campo.id} className={ancho}>
              <label htmlFor={id} className="mb-1 block text-xs text-textMuted">
                {campo.etiqueta}
                {requerido && <span className="text-[#26FFDF]"> *</span>}
              </label>
              {campo.id === "tipoProyecto" ? (
                <select
                  id={id}
                  value={brief.tipoProyecto}
                  onChange={(e) => onCambio("tipoProyecto", e.target.value)}
                  className={campoBase}
                >
                  <option value="">Sin definir</option>
                  {/* Si el modelo devuelve algo fuera de la lista, se muestra igual. */}
                  {brief.tipoProyecto && !(TIPOS_PROYECTO as readonly string[]).includes(brief.tipoProyecto) && (
                    <option value={brief.tipoProyecto}>{brief.tipoProyecto}</option>
                  )}
                  {TIPOS_PROYECTO.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              ) : MULTILINEA.includes(campo.id) ? (
                <textarea
                  id={id}
                  rows={2}
                  maxLength={campo.max}
                  value={brief[campo.id]}
                  onChange={(e) => onCambio(campo.id, e.target.value)}
                  className={`${campoBase} resize-none`}
                />
              ) : (
                <input
                  id={id}
                  type={campo.id === "correo" ? "email" : "text"}
                  maxLength={campo.max}
                  value={brief[campo.id]}
                  onChange={(e) => onCambio(campo.id, e.target.value)}
                  className={campoBase}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="flex justify-center px-5 pb-5">
        {listo ? (
          <a
            href={enlaceWhatsApp(siteConfig.company.whatsapp, brief)}
            target="_blank"
            rel="noopener noreferrer"
            className={botonPildora}
          >
            <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
            Enviar por WhatsApp
          </a>
        ) : (
          <p className="text-xs text-textMuted">Falta nombre o qué necesitas resolver.</p>
        )}
      </div>
    </motion.div>
  )
}
