"use client"
import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  LayoutGroup,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion"
import Image from "next/image"
import { SOUND_CONTROL_ATTR, useSound } from "@/components/global/sound/SoundProvider"
import { setIntroActive } from "@/lib/intro-store"

/**
 * La intro corre en cada carga completa del home (entrar o recargar). Si ya
 * corrió en este documento y se vuelve al home navegando dentro del sitio,
 * el hero aparece armado. Vive en el módulo: una recarga lo reinicia.
 */
let introPlayed = false
/** Pausa con la bienvenida ya escrita antes de pasar al escudo. */
const WELCOME_HOLD_MS = 300
const FILL_SECONDS = 3.2
/** Pausa con el escudo lleno antes de ofrecer la entrada. */
const HOLD_MS = 500
const EASE_OUT = [0.16, 1, 0.3, 1] as const
/**
 * Si nadie pulsa "Entrar" en este tiempo, la puerta entra sola. Sin gesto el
 * navegador no deja sonar: la música (encendida por defecto) arranca con el
 * primer clic o toque del usuario.
 */
const GATE_AUTO_ENTER_MS = 3000

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      // Arranca cuando el escudo ya va de camino a la derecha
      delayChildren: 0.35
    }
  }
}

/**
 * Cada elemento entra desde el borde más cercano a su sitio final: en
 * escritorio el texto vive a la izquierda y llega desde ahí; en móvil va
 * centrado bajo el escudo y sube desde abajo. `custom` = ¿escritorio?
 */
const itemVariants = {
  hidden: (desktop: boolean) => ({
    opacity: 0,
    x: desktop ? -140 : 0,
    y: desktop ? 0 : 56,
    filter: "blur(6px)",
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: EASE_OUT }
  }
}

/** Copia del escudo sin el fondo punteado del PNG original, que a este tamaño se ve como un recuadro. */
const SHIELD = { src: "/imagenes/logos/escudo-logo-hero.png", width: 551, height: 634 }

const WELCOME_WORD = "V1TR0"

/** Rizo en espiral: medias vueltas de radio decreciente, dos vueltas completas. */
const CURL_UP = "a14 14 0 0 0 0-28a10 10 0 0 0 0 20a7 7 0 0 0 0-14a4.5 4.5 0 0 0 0 9a2.5 2.5 0 0 0 0-5"
const CURL_DOWN = "a14 14 0 0 1 0 28a10 10 0 0 1 0-20a7 7 0 0 1 0 14a4.5 4.5 0 0 1 0-9a2.5 2.5 0 0 1 0 5"

/**
 * Corchete de la intro (lado izquierdo; el derecho es su espejo). El centro
 * es recto; nace ahí y se abre hacia arriba y hacia abajo, dobla en esquinas
 * amplias y cada punta remata en un rizo que se enrolla hacia afuera, en teal.
 */
function WelcomeBracket({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`welcome-frame pointer-events-none absolute top-0 h-full aspect-[120/320] overflow-visible ${
        mirrored ? "right-0 -scale-x-100" : "left-0"
      }`}
      viewBox="0 0 120 320"
      fill="none"
    >
      <path pathLength={1} className="welcome-frame-line" d="M14 160V108C14 54 38 24 90 24" />
      <path pathLength={1} className="welcome-frame-line" d="M14 160V212C14 266 38 296 90 296" />
      <path pathLength={1} className="welcome-frame-curl" d={`M90 24${CURL_UP}`} />
      <path pathLength={1} className="welcome-frame-curl" d={`M90 296${CURL_DOWN}`} />
    </svg>
  )
}

/**
 * welcome: "Bienvenido a V1TR0" · loading: el escudo se llena ·
 * gate: espera la entrada · ready: hero armado
 */
type Phase = "welcome" | "loading" | "gate" | "ready"

/**
 * Primera sección del home: el hero de aterrizaje, con el único <h1> de la
 * página. Entra en cuatro tiempos: una bienvenida, el escudo que se llena
 * en el centro mientras corre el arranque, la oferta de entrar con o sin
 * sonido (el clic es el gesto que el navegador exige para reproducir audio)
 * y, al entrar, el escudo que se desplaza a la derecha mientras aparece el texto.
 */
export default function HomeHero() {
  // En una carga completa arranca siempre en la bienvenida (así coincide con el
  // HTML del servidor); solo al volver navegando, montado en el cliente, nace armado
  const [phase, setPhase] = useState<Phase>(() => (introPlayed ? "ready" : "welcome"))
  const welcomeRef = useRef<HTMLDivElement>(null)
  // Sin intro el escudo no viaja: aparece en su sitio
  const [instant] = useState(() => introPlayed)
  const reduceMotion = useReducedMotion()
  const sound = useSound()
  // Mismo corte que el grid (lg): decide desde qué borde entra cada elemento
  const [desktop, setDesktop] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)")
    const sync = () => setDesktop(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  // El header y los botones flotantes esperan fuera de pantalla hasta que la intro termina
  useEffect(() => {
    setIntroActive(phase !== "ready")
  }, [phase])
  useEffect(() => () => setIntroActive(false), [])

  // Avance del relleno del escudo (0–100)
  const progress = useMotionValue(0)
  const clipPath = useTransform(progress, (v) => `inset(${100 - v}% 0 0 0)`)

  useEffect(() => {
    if (introPlayed) {
      return
    }

    let cancelled = false
    let hold: ReturnType<typeof setTimeout> | undefined
    let controls: ReturnType<typeof animate> | undefined

    // La bienvenida es CSS y pudo avanzar o terminar antes de hidratar: se
    // espera a que sus animaciones acaben, no un tiempo fijo desde el montaje.
    // Los rizos giran en loop (iteraciones infinitas): esos nunca terminan y no se esperan.
    const animations = (welcomeRef.current?.getAnimations({ subtree: true }) ?? []).filter(
      (animation) => animation.effect?.getTiming().iterations !== Infinity,
    )
    void Promise.all(animations.map((animation) => animation.finished)).then(() => {
      if (cancelled) {
        return
      }
      hold = setTimeout(() => {
        setPhase("loading")
        controls = animate(progress, 100, {
          duration: FILL_SECONDS,
          // Deja que la salida de la bienvenida y la entrada del escudo se crucen
          delay: 0.5,
          ease: [0.65, 0, 0.35, 1],
          onComplete: () => {
            hold = setTimeout(() => setPhase("gate"), HOLD_MS)
          },
        })
      }, WELCOME_HOLD_MS)
    })

    return () => {
      cancelled = true
      controls?.stop()
      if (hold) {
        clearTimeout(hold)
      }
    }
  }, [progress])

  /**
   * sound: enciende la música · silent: la apaga y lo recuerda ·
   * skip: entra sin tocar la preferencia (la música, encendida por defecto,
   * arranca con el primer clic).
   */
  const enter = (mode: "sound" | "silent" | "skip") => {
    if (mode === "sound") {
      sound.enable()
    } else if (mode === "silent") {
      sound.disable()
    }
    // Se marca al entrar y no al montar: StrictMode monta el efecto dos veces
    // y, marcada de entrada, la segunda pasada se saltaría la intro.
    introPlayed = true
    setPhase("ready")
  }

  // En la puerta, quien scrollea o usa el teclado entra directo; y si nadie
  // hace nada, entra sola a los pocos segundos
  useEffect(() => {
    if (phase !== "gate") {
      return
    }
    sound.preload()
    const skip = () => enter("skip")
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "Escape"].includes(e.key)) {
        skip()
      }
    }
    window.addEventListener("wheel", skip, { once: true, passive: true })
    window.addEventListener("touchmove", skip, { once: true, passive: true })
    window.addEventListener("keydown", onKey)
    const autoEnter = setTimeout(skip, GATE_AUTO_ENTER_MS)
    return () => {
      clearTimeout(autoEnter)
      window.removeEventListener("wheel", skip)
      window.removeEventListener("touchmove", skip)
      window.removeEventListener("keydown", onKey)
    }
    // `enter` y `sound` cambian de identidad en cada render; solo importa la fase
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const shieldTransition = instant ? { duration: 0 } : { duration: 1.3, ease: EASE_OUT }
  const ready = phase === "ready"

  return (
    <section
      aria-labelledby="home-hero-title"
      aria-busy={phase === "loading"}
      className="relative min-h-[100svh] md:min-h-[100dvh] w-full overflow-hidden grid grid-rows-[var(--header-safe)_1fr_auto] px-4 sm:px-6 lg:px-10 pb-8"
    >
      {/* Fila 1 del grid: espacio reservado para el header flotante. */}
      <div aria-hidden="true" className="row-start-1" />

      <LayoutGroup>
        {/* Momento 1 y 2: arranque y puerta de entrada */}
        <AnimatePresence>
          {!ready && (
            <motion.div
              key="loader"
              className="absolute inset-0 z-20 flex items-center justify-center"
              exit={{ opacity: 1 }}
            >
              {/* El marco se queda de la bienvenida a la puerta: lo que cambia es
                  lo de adentro. Al entrar se desvanece y el escudo sale de él. */}
              <div
                ref={welcomeRef}
                className="relative flex h-[24rem] w-[min(88vw,38rem)] sm:h-[28rem] items-center justify-center"
              >
                {/* pointer-events-none: el marco va posicionado encima del contenido y,
                    sin esto, se tragaba los clics de "Entrar" */}
                <motion.div className="pointer-events-none absolute inset-0" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
                  <WelcomeBracket />
                  <WelcomeBracket mirrored />
                </motion.div>
                <AnimatePresence mode="wait">
                  {phase === "welcome" ? (
                    <motion.div
                      key="welcome"
                      aria-hidden="true"
                      className="flex flex-col items-center text-center"
                      initial={false}
                      exit={{ opacity: 0, y: -12, filter: "blur(6px)", transition: { duration: 0.45, ease: EASE_OUT } }}
                    >
                      <span className="welcome-label font-mono text-[10px] sm:text-xs uppercase tracking-[0.42em] text-white/50">
                        Bienvenido a
                      </span>
                      <span className="mt-5 flex overflow-hidden text-7xl sm:text-8xl lg:text-9xl font-semibold leading-[1.05] tracking-[-0.04em] text-white">
                        {WELCOME_WORD.split("").map((letter, i) => (
                          <span key={i} className="welcome-letter inline-block" style={{ ["--i" as string]: i }}>
                            {letter}
                          </span>
                        ))}
                      </span>
                      <span className="welcome-rule mt-7 block h-px w-28 origin-center bg-[#26FFDF]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="boot"
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: EASE_OUT }}
                    >
                      <motion.div layoutId="hero-shield" transition={shieldTransition} className="relative h-48 sm:h-56 aspect-[551/634]">
                        {/* Silueta apagada */}
                        <Image {...SHIELD} alt="" priority className="absolute inset-0 h-full w-full opacity-[0.1] grayscale" />
                        {/* Relleno a color que sube */}
                        <motion.div className="absolute inset-0" style={{ clipPath }}>
                          <Image {...SHIELD} alt="" priority className="h-full w-full" />
                        </motion.div>
                      </motion.div>

                      <motion.div
                        // Reserva el alto de la puerta: así el escudo no salta cuando aparece
                        className="mt-10 flex h-24 w-56 flex-col items-center font-mono text-[10px] uppercase tracking-[0.28em] text-white/45"
                        exit={{ opacity: 0, transition: { duration: 0.25 } }}
                      >
                        <AnimatePresence initial={false}>
                          {phase === "gate" && (
                            <motion.div
                              key="gate"
                              className="flex flex-col items-center gap-5"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, ease: EASE_OUT }}
                            >
                              <button
                                type="button"
                                autoFocus
                                onClick={() => enter("sound")}
                                className="rounded-full border border-white/15 bg-white/[0.03] px-9 py-3.5 text-[11px] tracking-[0.32em] text-white transition-colors duration-300 hover:border-[#26FFDF]/50 hover:bg-[#26FFDF]/[0.06] focus:outline-none focus-visible:border-[#26FFDF]"
                              >
                                Entrar
                              </button>
                              <button
                                type="button"
                                {...{ [SOUND_CONTROL_ATTR]: "" }}
                                onClick={() => enter("silent")}
                                className="text-[9px] tracking-[0.28em] text-white/35 transition-colors hover:text-white/70 focus:outline-none focus-visible:text-white"
                              >
                                Entrar sin sonido
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Momento 3: el hero armado, con el escudo ya a la derecha */}
        <div className="row-start-2 relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-20">
          <motion.div
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate={ready ? "visible" : "hidden"}
          >
            <motion.h1
              id="home-hero-title"
              custom={desktop}
              variants={itemVariants}
              className="text-[2.6rem] sm:text-6xl xl:text-7xl font-semibold leading-[1.02] tracking-[-0.035em] text-white"
            >
              Desarrollo de software <span className="text-[#26FFDF]">a medida</span> para tu negocio
            </motion.h1>

            <motion.p
              custom={desktop}
              variants={itemVariants}
              className="mt-7 max-w-xl text-base sm:text-lg leading-relaxed text-white/55"
            >
              Diseñamos y programamos aplicaciones web, tiendas en línea, sistemas de
              información y automatizaciones, y los dejamos funcionando en producción.
            </motion.p>


          </motion.div>

          {/* Sitio final del escudo, dentro de un marco redondeado. En móvil no cabe
              junto al texto: se queda arriba, pequeño, como sello. */}
          <div className="order-first flex justify-center lg:order-none">
            <div className="relative flex items-center justify-center lg:aspect-square lg:w-full lg:max-w-[32rem]">
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 hidden rounded-[2.5rem] border border-white/[0.07] bg-white/[0.015] lg:block"
                // El marco vive a la derecha: entra desde ese borde
                initial={{ opacity: 0, x: 140 }}
                animate={ready ? { opacity: 1, x: 0 } : { opacity: 0, x: 140 }}
                transition={{ duration: instant ? 0 : 1, delay: instant ? 0 : 0.9, ease: EASE_OUT }}
              />

              {ready && (
                <motion.div
                  layoutId="hero-shield"
                  transition={shieldTransition}
                  className="relative h-32 sm:h-40 lg:h-[82%] aspect-[551/634]"
                >
                  {/* Flotación lenta una vez asentado */}
                  <motion.div
                    className="relative h-full w-full"
                    animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: instant ? 0 : 1.3 }}
                  >
                    <Image {...SHIELD} alt="Escudo de V1TR0" priority className="h-full w-full" />
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </LayoutGroup>

      {/* Indicador de que hay más contenido debajo */}
      <motion.div
        aria-hidden="true"
        className="row-start-3 relative z-10 flex justify-center pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: instant ? 0 : 1.6, duration: 0.8 }}
      >
        <span className="relative block h-10 w-px overflow-hidden rounded-full bg-white/10">
          <span className="absolute inset-x-0 top-0 h-3 rounded-full bg-[#26FFDF] motion-safe:animate-[scroll-cue_2.2s_ease-in-out_infinite]" />
        </span>
      </motion.div>
    </section>
  )
}
