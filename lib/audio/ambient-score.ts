/**
 * Banda sonora generativa del sitio: una pieza chill de timbres de 8 bits
 * que nunca suena igual. Tone.js se importa bajo demanda, al pedir sonido,
 * para no cargarlo en la visita de quien no lo activa.
 *
 * Forma: ciclos de 8 compases (una vuelta a la progresión) que recorren
 * secciones. Todos los instrumentos tocan siempre; cada sección decide qué
 * capas se oyen y las ganancias se funden en varios segundos, así el
 * arreglo respira en vez de cambiar de golpe.
 */

type ToneLib = typeof import("tone")

export interface AmbientScore {
  play: () => void
  pause: () => void
  dispose: () => void
}

interface Chord {
  pad: string[]
  bass: [string, string]
  arp: string[]
}

// Re dórico: i – VI – III – iv, dos compases por acorde
const MAIN: Chord[] = [
  { pad: ["F3", "A3", "C4", "E4"], bass: ["D2", "A2"], arp: ["D4", "F4", "A4", "C5", "E5"] },
  { pad: ["D3", "F3", "A3", "C4"], bass: ["Bb1", "F2"], arp: ["Bb3", "D4", "F4", "A4", "C5"] },
  { pad: ["E3", "G3", "A3", "C4"], bass: ["F2", "C3"], arp: ["F4", "A4", "C5", "E5", "G5"] },
  { pad: ["F3", "Bb3", "D4", "A4"], bass: ["G1", "D2"], arp: ["G4", "Bb4", "D5", "F5", "A5"] },
]

// Progresión alterna para el puente: i – v – VI – VII
const BRIDGE: Chord[] = [
  { pad: ["F3", "A3", "C4", "E4"], bass: ["D2", "A2"], arp: ["D4", "F4", "A4", "E5", "F5"] },
  { pad: ["E3", "G3", "C4", "D4"], bass: ["A1", "E2"], arp: ["A3", "C4", "E4", "G4", "C5"] },
  { pad: ["D3", "F3", "A3", "C4"], bass: ["Bb1", "F2"], arp: ["Bb3", "D4", "F4", "A4", "D5"] },
  { pad: ["E3", "G3", "C4", "D4"], bass: ["C2", "G2"], arp: ["C4", "E4", "G4", "D5", "E5"] },
]

const BELL_SCALE = ["D5", "F5", "G5", "A5", "C6", "D6"]

type Layer = "pad" | "bass" | "arp" | "drums" | "hats" | "bells" | "lead" | "texture"

interface Section {
  name: string
  progression: Chord[]
  layers: Partial<Record<Layer, number>>
  /** Frecuencia de corte del filtro del pad: más cerrada = más íntimo. */
  padCutoff: number
}

const SECTIONS: Section[] = [
  { name: "amanecer", progression: MAIN, padCutoff: 900, layers: { pad: 0.8, texture: 0.6, bells: 0.4 } },
  { name: "pulso", progression: MAIN, padCutoff: 1400, layers: { pad: 0.7, bass: 0.8, texture: 0.4, bells: 0.5 } },
  { name: "circuito", progression: MAIN, padCutoff: 1800, layers: { pad: 0.6, bass: 0.8, arp: 0.7, hats: 0.6, texture: 0.3 } },
  { name: "ciudad", progression: MAIN, padCutoff: 2200, layers: { pad: 0.55, bass: 0.9, arp: 0.6, drums: 0.8, hats: 0.7, lead: 0.6 } },
  { name: "puente", progression: BRIDGE, padCutoff: 1100, layers: { pad: 0.8, bass: 0.5, bells: 0.7, texture: 0.6 } },
  { name: "ciudad", progression: MAIN, padCutoff: 2400, layers: { pad: 0.5, bass: 0.9, arp: 0.7, drums: 0.85, hats: 0.8, lead: 0.5, bells: 0.3 } },
  { name: "circuito", progression: BRIDGE, padCutoff: 1600, layers: { pad: 0.6, bass: 0.7, arp: 0.8, hats: 0.5 } },
  { name: "descanso", progression: MAIN, padCutoff: 800, layers: { pad: 0.8, texture: 0.7, bells: 0.5 } },
]

const STEPS_PER_BAR = 16
const BARS_PER_SECTION = 8
const LAYER_FADE_SECONDS = 5
/** Ganancia final; el limitador contiene los picos cuando todas las capas suman. */
const MASTER_LEVEL = 1.6

const chance = (p: number) => Math.random() < p
const pick = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)]!
/** Velocidad con variación humana alrededor de `base`. */
const human = (base: number, spread = 0.12) => Math.min(1, Math.max(0.05, base + (Math.random() - 0.5) * spread * 2))

export async function createAmbientScore(): Promise<AmbientScore> {
  const Tone: ToneLib = await import("tone")
  const transport = Tone.getTransport()
  transport.bpm.value = 82
  transport.swing = 0.12
  transport.swingSubdivision = "16n"

  // ---------------------------------------------------------------- master
  const master = new Tone.Gain(0)
  const limiter = new Tone.Limiter(-1.5)
  const warmth = new Tone.Filter({ type: "lowpass", frequency: 9000, rolloff: -12 })
  master.chain(warmth, limiter, Tone.getDestination())

  const reverb = new Tone.Reverb({ decay: 7, preDelay: 0.03, wet: 1 })
  const reverbReturn = new Tone.Gain(0.32).connect(master)
  reverb.connect(reverbReturn)
  await reverb.ready

  const layerGain = {} as Record<Layer, InstanceType<ToneLib["Gain"]>>
  const makeLayer = (layer: Layer, send: number) => {
    const gain = new Tone.Gain(0).connect(master)
    if (send > 0) {
      gain.connect(new Tone.Gain(send).connect(reverb))
    }
    layerGain[layer] = gain
    return gain
  }

  // ------------------------------------------------------------ instrumentos
  // Pad: FM suave con ataque lento, coro y un filtro que se abre por sección
  const padFilter = new Tone.Filter({ type: "lowpass", frequency: 900, Q: 0.4 })
  const padChorus = new Tone.Chorus({ frequency: 0.3, delayTime: 4, depth: 0.6, wet: 0.5 }).start()
  const pad = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 1.5,
    modulationIndex: 2,
    oscillator: { type: "sine" },
    modulation: { type: "triangle" },
    envelope: { attack: 2.2, decay: 1, sustain: 0.8, release: 4 },
    modulationEnvelope: { attack: 3, decay: 1, sustain: 0.6, release: 4 },
    volume: -20,
  })
  pad.chain(padFilter, padChorus, makeLayer("pad", 0.7))

  // Bajo: triángulo redondo, sin agudos
  const bass = new Tone.MonoSynth({
    oscillator: { type: "triangle" },
    filter: { type: "lowpass", Q: 1 },
    envelope: { attack: 0.02, decay: 0.3, sustain: 0.5, release: 0.8 },
    filterEnvelope: { attack: 0.01, decay: 0.25, sustain: 0.3, release: 0.6, baseFrequency: 120, octaves: 2.2 },
    volume: -12,
  })
  bass.connect(makeLayer("bass", 0.08))

  // Arpegio de bits: pulso estrecho, reducido a 6 bits y filtrado que respira
  const arpCrush = new Tone.BitCrusher(6)
  arpCrush.wet.value = 0.35
  const arpFilter = new Tone.Filter({ type: "lowpass", frequency: 1600, Q: 2 })
  const arpLfo = new Tone.LFO({ frequency: "16m", min: 700, max: 3200 }).start()
  arpLfo.connect(arpFilter.frequency)
  const arpDelay = new Tone.FeedbackDelay({ delayTime: "8n.", feedback: 0.32, wet: 0.3 })
  const arp = new Tone.Synth({
    oscillator: { type: "pulse", width: 0.25 },
    envelope: { attack: 0.005, decay: 0.14, sustain: 0.1, release: 0.25 },
    volume: -24,
  })
  arp.chain(arpCrush, arpFilter, arpDelay, makeLayer("arp", 0.35))

  // Campanas: FM metálico escaso, con eco largo
  const bellDelay = new Tone.PingPongDelay({ delayTime: "4n.", feedback: 0.4, wet: 0.45 })
  const bells = new Tone.FMSynth({
    harmonicity: 3.01,
    modulationIndex: 12,
    envelope: { attack: 0.002, decay: 1.4, sustain: 0, release: 1.6 },
    modulationEnvelope: { attack: 0.002, decay: 0.4, sustain: 0, release: 0.4 },
    volume: -26,
  })
  bells.chain(bellDelay, makeLayer("bells", 0.8))

  // Melodía chip: cuadrada muy baja, solo en las secciones más llenas
  const leadFilter = new Tone.Filter({ type: "lowpass", frequency: 2400 })
  const lead = new Tone.Synth({
    oscillator: { type: "square" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.35, release: 0.4 },
    portamento: 0.03,
    volume: -30,
  })
  lead.chain(leadFilter, new Tone.FeedbackDelay({ delayTime: "8n", feedback: 0.25, wet: 0.25 }), makeLayer("lead", 0.5))

  // Batería lo-fi: bombo suave, aro con ruido en banda y hats filtrados
  const drumBus = new Tone.Filter({ type: "lowpass", frequency: 7000 })
  drumBus.connect(makeLayer("drums", 0.12))
  const kick = new Tone.MembraneSynth({
    pitchDecay: 0.04,
    octaves: 5,
    envelope: { attack: 0.001, decay: 0.35, sustain: 0, release: 0.2 },
    volume: -10,
  }).connect(drumBus)
  const snare = new Tone.NoiseSynth({
    noise: { type: "pink" },
    envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.05 },
    volume: -22,
  })
  snare.chain(new Tone.Filter({ type: "bandpass", frequency: 1900, Q: 0.9 }), drumBus)

  const hatGain = makeLayer("hats", 0.1)
  const hats = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.035, sustain: 0, release: 0.02 },
    volume: -30,
  })
  hats.chain(new Tone.Filter({ type: "highpass", frequency: 7500 }), hatGain)

  // Textura: ruido rosa que sube y baja como viento sobre cables
  const texture = new Tone.Noise("pink").start()
  const textureFilter = new Tone.AutoFilter({ frequency: "8m", baseFrequency: 300, octaves: 3, depth: 0.9 }).start()
  texture.volume.value = -38
  texture.chain(textureFilter, makeLayer("texture", 0.6))

  // -------------------------------------------------------------- partitura
  let step = 0
  let leadPhrase: (string | null)[] = []

  const composeLeadPhrase = (chords: Chord[]) => {
    // Motivo de 16 corcheas sobre las notas del arpegio: repetible y cantable
    const phrase: (string | null)[] = []
    for (let i = 0; i < 16; i++) {
      const chord = chords[Math.floor(i / 4) % chords.length]!
      phrase.push(i % 4 === 3 || chance(0.25) ? null : pick(chord.arp.slice(1, 4)))
    }
    return phrase
  }

  const enterSection = (section: Section, time: number) => {
    const layers = Object.keys(layerGain) as Layer[]
    for (const layer of layers) {
      layerGain[layer].gain.cancelScheduledValues(time)
      layerGain[layer].gain.linearRampToValueAtTime(section.layers[layer] ?? 0, time + LAYER_FADE_SECONDS)
    }
    padFilter.frequency.linearRampToValueAtTime(section.padCutoff, time + LAYER_FADE_SECONDS * 1.5)
    leadPhrase = composeLeadPhrase(section.progression)
  }

  let arpIndex = 0
  let arpDirection = 1

  transport.scheduleRepeat((time) => {
    const stepInBar = step % STEPS_PER_BAR
    const bar = Math.floor(step / STEPS_PER_BAR)
    const barInSection = bar % BARS_PER_SECTION
    const section = SECTIONS[Math.floor(bar / BARS_PER_SECTION) % SECTIONS.length]!
    const chord = section.progression[Math.floor(barInSection / 2)]!
    const barSeconds = Tone.Time("1m").toSeconds()

    if (stepInBar === 0 && barInSection === 0) {
      enterSection(section, time)
    }

    // Pad: un acorde cada dos compases, ligado
    if (stepInBar === 0 && barInSection % 2 === 0) {
      pad.triggerAttackRelease(chord.pad, barSeconds * 1.9, time, human(0.55, 0.08))
    }

    // Bajo: tónica en 1, anticipación en el "y" del 2, quinta en el 3 y medio
    if (stepInBar === 0) {
      bass.triggerAttackRelease(chord.bass[0], "4n.", time, human(0.8))
    } else if (stepInBar === 6 && chance(0.7)) {
      bass.triggerAttackRelease(chord.bass[0], "8n", time, human(0.55))
    } else if (stepInBar === 10) {
      bass.triggerAttackRelease(chance(0.6) ? chord.bass[1] : chord.bass[0], "8n", time, human(0.6))
    } else if (stepInBar === 14 && chance(0.3)) {
      bass.triggerAttackRelease(chord.bass[1], "16n", time, human(0.45))
    }

    // Arpegio: semicorcheas que suben y bajan, con huecos para respirar
    if (!(stepInBar % 4 === 3 && chance(0.5))) {
      const notes = chord.arp
      arpIndex += arpDirection
      if (arpIndex >= notes.length - 1 || arpIndex <= 0) {
        arpDirection *= -1
        arpIndex = Math.max(0, Math.min(notes.length - 1, arpIndex))
      }
      const accent = stepInBar % 4 === 0 ? 0.75 : 0.45
      arp.triggerAttackRelease(notes[arpIndex]!, "32n", time, human(accent))
    }

    // Batería
    if (stepInBar === 0 || (stepInBar === 10 && chance(0.8)) || (stepInBar === 7 && chance(0.15))) {
      kick.triggerAttackRelease("C1", "8n", time, human(stepInBar === 0 ? 0.9 : 0.65))
    }
    if (stepInBar === 4 || stepInBar === 12) {
      snare.triggerAttackRelease("16n", time, human(0.6))
    }
    if (stepInBar % 2 === 0) {
      hats.triggerAttackRelease("32n", time, human(stepInBar % 4 === 2 ? 0.6 : 0.35))
    } else if (chance(0.18)) {
      hats.triggerAttackRelease("32n", time, human(0.2))
    }

    // Campanas: escasas, siempre en corchea
    if (stepInBar % 2 === 0 && chance(0.11)) {
      bells.triggerAttackRelease(pick(BELL_SCALE), "8n", time, human(0.5, 0.2))
    }

    // Melodía: el motivo de la sección, en corcheas
    if (stepInBar % 2 === 0) {
      const note = leadPhrase[(barInSection % 2) * 8 + stepInBar / 2]
      if (note) {
        lead.triggerAttackRelease(note, "8n", time, human(0.5))
      }
    }

    step++
  }, "16n")

  const nodes = [
    master, limiter, warmth, reverb, reverbReturn, padFilter, padChorus, pad, bass, arpCrush, arpFilter, arpLfo,
    arpDelay, arp, bellDelay, bells, leadFilter, lead, drumBus, kick, snare, hats, texture, textureFilter,
    ...Object.values(layerGain),
  ]

  return {
    play() {
      const now = Tone.now()
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.linearRampToValueAtTime(MASTER_LEVEL, now + 3)
      if (transport.state !== "started") {
        transport.start("+0.05")
      }
    },
    pause() {
      const now = Tone.now()
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.linearRampToValueAtTime(0, now + 1.2)
      transport.pause(now + 1.3)
    },
    dispose() {
      transport.stop()
      transport.cancel()
      nodes.forEach((node) => node.dispose())
    },
  }
}
