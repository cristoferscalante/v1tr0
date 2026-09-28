/**
 * Bleeps de 8 bits para el asistente del home.
 *
 * Aparte de la banda sonora (lib/audio/ambient-score, que carga Tone.js), esto
 * es WebAudio pelado: ondas cuadradas con una envolvente corta. Pesa nada, no
 * trae ningún archivo y suena a chip, que es justo lo que pide el robot.
 *
 * El navegador no deja sonar sin un gesto previo, así que el contexto se crea
 * en el primer bleep —que siempre nace de un clic o un Enter— y si aún está
 * suspendido se reanuda. Si el visitante apagó el sonido del sitio, callan.
 */

import { SOUND_STORAGE_KEY } from "@/components/global/sound/SoundProvider"

/** Respeta el interruptor de sonido del sitio, el mismo que la banda sonora. */
function sonidoApagado() {
  try {
    return localStorage.getItem(SOUND_STORAGE_KEY) === "off"
  } catch {
    return false
  }
}

type ContextoWebAudio = AudioContext & { webkitAudioContext?: never }

let contexto: ContextoWebAudio | null = null

function obtenerContexto(): ContextoWebAudio | null {
  if (typeof window === "undefined") {
    return null
  }
  if (!contexto) {
    const Constructor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Constructor) {
      return null
    }
    contexto = new Constructor() as ContextoWebAudio
  }
  if (contexto.state === "suspended") {
    void contexto.resume()
  }
  return contexto
}

/** Una nota: frecuencia en Hz, cuándo entra y cuánto dura, en segundos. */
interface Nota {
  hz: number
  desde: number
  dura: number
  /** Onda del chip. `square` es el timbre base; `triangle` suaviza. */
  onda?: OscillatorType
  ganancia?: number
}

const FRASES: Record<string, Nota[]> = {
  /** Elegir una respuesta rápida: dos pasos hacia arriba. */
  clic: [
    { hz: 660, desde: 0, dura: 0.05 },
    { hz: 880, desde: 0.05, dura: 0.07 },
  ],
  /** Enviar texto propio: un golpe seco. */
  enviar: [{ hz: 520, desde: 0, dura: 0.07 }],
  /** El robot habla: tres bits cortos, como una impresora de chip. */
  hablar: [
    { hz: 740, desde: 0, dura: 0.04, ganancia: 0.6 },
    { hz: 990, desde: 0.07, dura: 0.04, ganancia: 0.5 },
    { hz: 830, desde: 0.14, dura: 0.05, ganancia: 0.45 },
  ],
  /** Algo no cuadra: dos notas hacia abajo. */
  error: [
    { hz: 400, desde: 0, dura: 0.08 },
    { hz: 260, desde: 0.09, dura: 0.14 },
  ],
  /** Brief completo: arpegio de victoria. */
  listo: [
    { hz: 660, desde: 0, dura: 0.07 },
    { hz: 880, desde: 0.08, dura: 0.07 },
    { hz: 1100, desde: 0.16, dura: 0.07 },
    { hz: 1320, desde: 0.24, dura: 0.18, onda: "triangle" },
  ],
  /** El robot cambia de sitio: un barrido corto. */
  volar: [
    { hz: 300, desde: 0, dura: 0.05, onda: "triangle", ganancia: 0.5 },
    { hz: 450, desde: 0.05, dura: 0.05, onda: "triangle", ganancia: 0.4 },
    { hz: 620, desde: 0.1, dura: 0.08, onda: "triangle", ganancia: 0.3 },
  ],
}

export type Bleep = keyof typeof FRASES

/** Volumen general: los bleeps acompañan, no tapan la banda sonora. */
const VOLUMEN = 0.06

/**
 * Suena una frase. Si el navegador no tiene WebAudio, o el usuario nunca ha
 * interactuado, no pasa nada: es decoración, nunca debe romper la página.
 */
export function bleep(tipo: Bleep) {
  if (sonidoApagado()) {
    return
  }
  const ctx = obtenerContexto()
  if (!ctx) {
    return
  }
  const ahora = ctx.currentTime
  for (const nota of FRASES[tipo] ?? []) {
    const oscilador = ctx.createOscillator()
    const ganancia = ctx.createGain()
    oscilador.type = nota.onda ?? "square"
    oscilador.frequency.setValueAtTime(nota.hz, ahora + nota.desde)

    // Envolvente corta y sin cola: el "clic" del chip está en el ataque.
    const pico = VOLUMEN * (nota.ganancia ?? 1)
    ganancia.gain.setValueAtTime(0, ahora + nota.desde)
    ganancia.gain.linearRampToValueAtTime(pico, ahora + nota.desde + 0.005)
    ganancia.gain.exponentialRampToValueAtTime(0.0001, ahora + nota.desde + nota.dura)

    oscilador.connect(ganancia).connect(ctx.destination)
    oscilador.start(ahora + nota.desde)
    oscilador.stop(ahora + nota.desde + nota.dura + 0.02)
  }
}
