"use client"
import { useCallback, useEffect, useRef, useState } from "react"
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
import { Contrast } from "lucide-react"
import dynamic from "next/dynamic"
import { useSound } from "@/components/global/sound/SoundProvider"
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
/** Pausa con el escudo lleno antes de entrar solo al hero. */
const HOLD_MS = 1000
const EASE_OUT = [0.16, 1, 0.3, 1] as const

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

/** Escudo 3D que sigue al cursor. Sin SSR: WebGL solo existe en el navegador. */
const HeroShield3D = dynamic(() => import("@/components/3d/HeroShield3D"), { ssr: false })

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

/** welcome: "Bienvenido a V1TR0" · loading: el escudo se llena · ready: hero armado */
type Phase = "welcome" | "loading" | "ready"

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
  // El escudo 3D solo tiene sentido con un cursor que seguir: escritorio con
  // puntero fino y sin reduced-motion. En el resto se queda el PNG.
  const [pointerFine, setPointerFine] = useState(false)
  // El PNG hace el vuelo de la intro; el 3D lo reemplaza cuando ya aterrizó y
  // pintó su primer fotograma
  const [landed, setLanded] = useState(() => introPlayed)
  const [modelReady, setModelReady] = useState(false)
  const handleModelReady = useCallback(() => setModelReady(true), [])
  // Lente ASCII del escudo invertida: todo en caracteres y el cursor descubre el modelo
  const [asciiInverted, setAsciiInverted] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)")
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)")
    const sync = () => {
      setDesktop(query.matches)
      setPointerFine(fine.matches)
    }
    sync()
    query.addEventListener("change", sync)
    fine.addEventListener("change", sync)
    return () => {
      query.removeEventListener("change", sync)
      fine.removeEventListener("change", sync)
    }
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
            // Sin gesto el navegador no deja sonar: la música (encendida por
            // defecto) arranca con el primer clic o toque; se deja precargada
            sound.preload()
            hold = setTimeout(() => {
              // Se marca al entrar y no al montar: StrictMode monta el efecto dos
              // veces y, marcada de entrada, la segunda pasada se saltaría la intro.
              introPlayed = true
              setPhase("ready")
            }, HOLD_MS)
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
    // `sound` cambia de identidad en cada render; la intro corre una sola vez
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress])

  const shieldTransition = instant ? { duration: 0 } : { duration: 1.3, ease: EASE_OUT }
  const ready = phase === "ready"
  const use3D = desktop && pointerFine && !reduceMotion
  const show3D = use3D && landed && modelReady

  return (
    <section
      aria-labelledby="home-hero-title"
      aria-busy={phase === "loading"}
      className="relative min-h-[100svh] md:min-h-[100dvh] w-full overflow-hidden grid grid-rows-[var(--header-safe)_1fr_auto] px-4 sm:px-6 lg:px-10 pb-8"
    >
      {/* Fila 1 del grid: espacio reservado para el header flotante. */}
      <div aria-hidden="true" className="row-start-1" />

      <LayoutGroup>
        {/* Momento 1 y 2: bienvenida y arranque; al llenarse el escudo entra solo */}
        <AnimatePresence>
          {!ready && (
            <motion.div
              key="loader"
              className="absolute inset-0 z-20 flex items-center justify-center"
              exit={{ opacity: 1 }}
            >
              {/* El marco se queda de la bienvenida al arranque: lo que cambia es
                  lo de adentro. Al entrar se desvanece y el escudo sale de él. */}
              <div
                ref={welcomeRef}
                // En escritorio crece con el escudo, que ya carga a su tamaño final
                className="relative flex h-[24rem] w-[min(88vw,38rem)] sm:h-[28rem] lg:h-[min(80vh,46rem)] lg:w-[min(88vw,42rem)] items-center justify-center"
              >
                {/* pointer-events-none: el marco va posicionado encima del contenido */}
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
                      {/* Mismo tamaño que en su sitio final del hero: al entrar solo se
                          desliza, sin crecer ni achicarse */}
                      <motion.div layoutId="hero-shield" transition={shieldTransition} className="relative h-32 sm:h-40 lg:h-[min(62vh,36rem)] aspect-[551/634]">
                        {/* Silueta apagada */}
                        <Image {...SHIELD} alt="" priority className="absolute inset-0 h-full w-full opacity-[0.1] grayscale" />
                        {/* Relleno a color que sube */}
                        <motion.div className="absolute inset-0" style={{ clipPath }}>
                          <Image {...SHIELD} alt="" priority className="h-full w-full" />
                        </motion.div>
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
          {/* Capa entre el escudo (z-0) y el texto (z-10): una retícula fina que
              pasa por encima del modelo y se desvanece hacia los bordes, y una
              sombra suave desde la izquierda que asienta el texto. Solo en
              escritorio, donde el escudo queda detrás del texto. */}
          <motion.div
            aria-hidden="true"
            className="hero-veil pointer-events-none absolute -inset-x-[12vw] -inset-y-[18vh] z-[5] hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: instant ? 0 : 1.2, delay: instant ? 0 : 1 }}
          />
          <motion.div
            className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left"
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

          {/* Sitio final del escudo, sin marco: en escritorio es grande y desborda
              su columna por debajo del texto, como parte del fondo. En móvil no
              cabe junto al texto: se queda arriba, pequeño, como sello. */}
          {/* Sin z-index propio: así el escudo queda bajo la capa (z-5) y el
              control, dentro de esta misma columna, puede quedar encima (z-10) */}
          <div className="relative order-first flex justify-center lg:order-none">
            {/* group: el control de la lente aparece con el cursor sobre el escudo */}
            <div className="group relative flex items-center justify-center lg:h-[min(62vh,36rem)] lg:w-full">
              {ready && (
                <motion.div
                  layoutId="hero-shield"
                  transition={shieldTransition}
                  onLayoutAnimationComplete={() => setLanded(true)}
                  // Alto igual al del escudo de la intro (lg: el de esta caja)
                  className="relative h-32 sm:h-40 lg:h-full aspect-[551/634]"
                >
                  {/* Flotación lenta una vez asentado */}
                  <motion.div
                    className="relative h-full w-full"
                    animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: instant ? 0 : 1.3 }}
                  >
                    <Image
                      {...SHIELD}
                      alt="Escudo de V1TR0"
                      priority
                      className={`h-full w-full transition-opacity duration-300 ${show3D ? "opacity-0" : "opacity-100"}`}
                    />
                    {/* Se monta al entrar para que cargue durante el vuelo. El lienzo
                        desborda la caja del PNG: al inclinarse el escudo no se recorta.
                        No recibe eventos: pasa por encima del texto y no debe taparlo. */}
                    {use3D && (
                      <div
                        aria-hidden="true"
                        className={`pointer-events-none absolute -inset-[18%] transition-opacity duration-300 ${show3D ? "opacity-100" : "opacity-0"}`}
                      >
                        {/* Cruce corto: lo que integra el cambio es la distorsión con la
                            que el escudo se asienta al quedar a la vista */}
                        <HeroShield3D onReady={handleModelReady} inverted={asciiInverted} revealed={show3D} />
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}

              {/* Control de la lente: invierte el efecto (todo ASCII, el cursor
                  descubre el modelo) y lo revierte. Solo con el escudo 3D a la
                  vista; entra desde abajo, el borde más cercano. Oculto hasta
                  que el cursor pasa por el escudo (o llega con el teclado). */}
              <AnimatePresence>
                {show3D && (
                  <motion.div
                    className="absolute inset-x-0 -bottom-6 z-10 flex justify-center"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 24 }}
                    transition={{ duration: 0.8, ease: EASE_OUT }}
                  >
                    <button
                      type="button"
                      aria-pressed={asciiInverted}
                      aria-label={asciiInverted ? "Revertir el efecto ASCII" : "Invertir el efecto ASCII"}
                      title={asciiInverted ? "Revertir efecto" : "Invertir efecto"}
                      onClick={() => setAsciiInverted((value) => !value)}
                      className={`flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border bg-white/[0.03] opacity-0 transition-[opacity,transform,color,border-color] duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:border-[#26FFDF]/50 hover:text-white focus:outline-none focus-visible:translate-y-0 focus-visible:border-[#26FFDF] focus-visible:opacity-100 ${
                        asciiInverted ? "border-[#26FFDF]/40 text-[#26FFDF]" : "border-white/15 text-white/70"
                      }`}
                    >
                      {/* Medio lleno: al invertir se da vuelta */}
                      <Contrast
                        aria-hidden="true"
                        className={`h-[18px] w-[18px] transition-transform duration-500 ${asciiInverted ? "rotate-180" : ""}`}
                        strokeWidth={1.5}
                      />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
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
