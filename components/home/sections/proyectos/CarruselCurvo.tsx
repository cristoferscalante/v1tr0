"use client"

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber"
import * as THREE from "three"

/**
 * Carrusel curvo de proyectos, a la manera de jesperlandberg.com: las tarjetas
 * viven sobre un cilindro que rodea la cámara (los bordes laterales se acercan
 * al espectador), flotan sobre un piso de retícula en perspectiva y se
 * arrastran en un bucle infinito con inercia. Mientras más rápido se arrastra,
 * más se curvan.
 *
 * El título y la flecha van pintados dentro de la textura de cada tarjeta para
 * que se curven con ella, igual que en la referencia.
 */

export interface ProyectoCarrusel {
  title: string
  image: string
  href: string
}

export interface CarruselCurvoHandle {
  mover: (pasos: number) => void
}

/** Proporción de la tarjeta (ancho / alto), la de las capturas. */
const ASPECTO = 16 / 10
/** Separación entre tarjetas, en fracción del ancho de tarjeta. */
const HUECO = 0.045
/** Radio del cilindro, en anchos de vista: menor = más curvo. */
const RADIO = 1.35
/** Curvatura extra por velocidad de arrastre. */
const CURVA_VELOCIDAD = 0.035
/** Qué tan rápido la posición alcanza al objetivo (inercia). */
const SUAVIZADO = 5.5
/** Mínimo de tarjetas en el bucle para que nunca se vea el salto. */
const MINIMO_BUCLE = 8
const CAMARA = { z: 3.2, fov: 38 }
/** Lente del cursor: radio (en alturas de tarjeta), abombado y aumento. */
const LENTE = { radio: 0.36, abombado: 0.3, hundido: 0.09, aumento: 0.38 }
/** Duración de la entrada a un proyecto: centrar, aplanar y llenar la pantalla. */
const DURACION_ENTRADA = 1.1
/** Antes de entrar: salto de la tarjeta y ola que sale del punto del clic. */
const OLA = { duracion: 0.55, salto: 0.07, amplitud: 0.06, velocidad: 3.2, frecuencia: 9 }

/**
 * Medidas en unidades de mundo (plano z = 0) para un lienzo de `anchoPx` ×
 * `altoPx`. La usan la escena y los controles, así un arrastre o un paso de
 * flecha mueve exactamente una tarjeta.
 */
function medidas(anchoPx: number, altoPx: number) {
  const altoVista = 2 * CAMARA.z * Math.tan(THREE.MathUtils.degToRad(CAMARA.fov / 2))
  const anchoVista = altoVista * (anchoPx / Math.max(altoPx, 1))
  const ancho = Math.min(anchoVista / (anchoPx < 768 ? 1.15 : 2.15), altoVista * 0.62 * ASPECTO)
  return {
    anchoVista,
    ancho,
    alto: ancho / ASPECTO,
    paso: ancho * (1 + HUECO),
    mundoPorPx: altoVista / Math.max(altoPx, 1),
  }
}

const vertex = /* glsl */ `
  uniform float uRadio;
  uniform float uCurva;
  uniform float uPlano;
  uniform vec2 uCursor;
  uniform float uFuerza;
  uniform float uRadioLente;
  uniform float uAbombado;
  uniform float uHundido;
  uniform vec2 uOlaOrigen;
  uniform float uOlaT;
  uniform float uOlaAmp;
  varying vec2 vUv;
  varying vec2 vDelta;
  varying float vAnillo;

  void main() {
    vUv = uv;
    vec4 mundo = modelMatrix * vec4(position, 1.0);

    // Lente del cursor, medida sobre la tarjeta desenrollada: un domo que se
    // acerca a la cámara rodeado de un anillo hundido.
    vDelta = mundo.xy - uCursor;
    float d = length(vDelta) / uRadioLente;
    float domo = exp(-d * d * 1.6);
    float anillo = exp(-pow((d - 1.15) * 3.2, 2.0));
    vAnillo = anillo * uFuerza;
    mundo.z += (domo * uAbombado - anillo * uHundido) * uFuerza;

    // Ola del clic: un frente circular que se expande desde el punto tocado y
    // se apaga con la distancia y el tiempo.
    if (uOlaAmp > 0.0) {
      float dOla = length(mundo.xy - uOlaOrigen);
      float frente = dOla - uOlaT * ${OLA.velocidad.toFixed(2)};
      float envolvente = exp(-frente * frente * 6.0) * exp(-dOla * 0.6);
      mundo.z += sin(frente * ${OLA.frecuencia.toFixed(1)}) * envolvente * uOlaAmp;
    }

    // Se enrolla el plano sobre un cilindro centrado en la cámara: la x del
    // mundo pasa a ser longitud de arco y los extremos se acercan.
    float radio = uRadio / (1.0 + uCurva);
    float angulo = mundo.x / radio;
    // Al entrar a un proyecto el cilindro se desenrolla (uPlano -> 1).
    mundo.x = mix(sin(angulo) * radio, mundo.x, uPlano);
    mundo.z += (1.0 - cos(angulo)) * radio * (1.0 - uPlano);
    gl_Position = projectionMatrix * viewMatrix * mundo;
  }
`

const fragment = /* glsl */ `
  uniform sampler2D uTextura;
  uniform float uAspecto;
  uniform float uRadioEsquina;
  uniform float uHover;
  uniform float uFoco;
  uniform float uSalida;
  uniform vec2 uTam;
  uniform float uFuerza;
  uniform float uRadioLente;
  uniform float uAumento;
  varying vec2 vUv;
  varying vec2 vDelta;
  varying float vAnillo;

  float cajaRedondeada(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspecto, 1.0);
    float d = cajaRedondeada(p, vec2(uAspecto, 1.0) * 0.5, uRadioEsquina);
    float alfa = 1.0 - smoothstep(-0.002, 0.002, d);
    if (alfa <= 0.0) discard;

    // Aumento: bajo el cursor la imagen se dilata desde su centro.
    float dl = length(vDelta) / uRadioLente;
    float lupa = exp(-dl * dl * 1.4) * uFuerza * uAumento;
    vec2 uvLente = clamp(vUv - (vDelta / uTam) * lupa, 0.0, 1.0);
    vec3 color = texture2D(uTextura, uvLente).rgb;
    // El anillo hundido queda en sombra: es lo que hace legible el relieve.
    color *= 1.0 - vAnillo * 0.5;
    // Profundidad: la tarjeta en foco va plena; las demás se apagan y se
    // vuelven translúcidas.
    color *= mix(0.6, 1.0, uFoco) * (0.94 + 0.06 * uHover);
    gl_FragColor = vec4(color, alfa * mix(0.32, 1.0, uFoco) * uSalida);
    #include <colorspace_fragment>
  }
`

const vertexPiso = /* glsl */ `
  uniform vec2 uCursorPiso;
  uniform float uFuerza;
  varying vec3 vMundo;
  void main() {
    vec4 mundo = modelMatrix * vec4(position, 1.0);
    // El piso se ondula bajo el cursor, con la misma lógica de domo y anillo.
    float d = length(mundo.xz - uCursorPiso) / 1.4;
    mundo.y += (exp(-d * d * 1.6) * 0.22 - exp(-pow((d - 1.1) * 3.0, 2.0)) * 0.06) * uFuerza;
    vMundo = mundo.xyz;
    gl_Position = projectionMatrix * viewMatrix * mundo;
  }
`

const fragmentPiso = /* glsl */ `
  uniform float uDesplazamiento;
  uniform float uCelda;
  uniform vec3 uColor;
  uniform float uAlfa;
  varying vec3 vMundo;

  float linea(float coord) {
    float f = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    return 1.0 - min(f, 1.0);
  }

  void main() {
    vec2 c = vec2(vMundo.x + uDesplazamiento, vMundo.z) / uCelda;
    float l = max(linea(c.x), linea(c.y));
    // Tenue; se desvanece hacia el horizonte y los lados, pero llega hasta el
    // borde inferior del lienzo.
    float lejos = smoothstep(-14.0, -1.0, vMundo.z);
    float lados = 1.0 - smoothstep(4.0, 9.0, abs(vMundo.x));
    gl_FragColor = vec4(uColor, l * 0.08 * lejos * lados * uAlfa);
  }
`

/** Pinta imagen + degradado + título + flecha en un lienzo, como en la referencia. */
async function texturaDeTarjeta(proyecto: ProyectoCarrusel): Promise<THREE.CanvasTexture> {
  const ancho = 1280
  const alto = Math.round(ancho / ASPECTO)
  const lienzo = document.createElement("canvas")
  lienzo.width = ancho
  lienzo.height = alto
  const ctx = lienzo.getContext("2d")!

  ctx.fillStyle = "#0b1414"
  ctx.fillRect(0, 0, ancho, alto)

  const imagen = new Image()
  imagen.src = proyecto.image
  await imagen.decode().catch(() => undefined)
  if (imagen.naturalWidth) {
    // object-fit: cover anclado arriba: las capturas importan por su cabecera.
    const escala = Math.max(ancho / imagen.naturalWidth, alto / imagen.naturalHeight)
    const w = imagen.naturalWidth * escala
    const h = imagen.naturalHeight * escala
    ctx.drawImage(imagen, (ancho - w) / 2, 0, w, h)
  }

  const degradado = ctx.createLinearGradient(0, alto * 0.45, 0, alto)
  degradado.addColorStop(0, "rgba(0,0,0,0)")
  degradado.addColorStop(1, "rgba(0,0,0,0.72)")
  ctx.fillStyle = degradado
  ctx.fillRect(0, 0, ancho, alto)

  await document.fonts?.ready
  const familia = getComputedStyle(document.body).fontFamily || "sans-serif"
  const margen = 56
  ctx.fillStyle = "#ffffff"
  ctx.font = `600 58px ${familia}`
  ctx.textBaseline = "alphabetic"
  ctx.fillText(proyecto.title, margen, alto - margen)

  const radio = 34
  const cx = ancho - margen - radio
  const cy = alto - margen - 18
  ctx.fillStyle = "#050909"
  ctx.beginPath()
  ctx.arc(cx, cy, radio, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = "#ffffff"
  ctx.lineWidth = 4
  ctx.lineCap = "round"
  ctx.lineJoin = "round"
  ctx.beginPath()
  ctx.moveTo(cx - 11, cy)
  ctx.lineTo(cx + 11, cy)
  ctx.moveTo(cx + 2, cy - 9)
  ctx.lineTo(cx + 11, cy)
  ctx.lineTo(cx + 2, cy + 9)
  ctx.stroke()

  const textura = new THREE.CanvasTexture(lienzo)
  textura.colorSpace = THREE.SRGBColorSpace
  textura.anisotropy = 8
  return textura
}

type Estado = {
  objetivo: number
  actual: number
  velocidad: number
  /** Proyecto al que se está entrando; mientras exista, el carrusel no se mueve. */
  entrada: { indice: number; inicio: number; href: string; navegado: boolean } | null
  /** Si el cursor está sobre el carrusel (activa la lente). */
  puntero: boolean
}

const suavizar = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function Escena({
  proyectos,
  estado,
  onIngreso,
}: {
  proyectos: ProyectoCarrusel[]
  estado: React.MutableRefObject<Estado>
  onIngreso?: (ingresando: boolean) => void
}) {
  const { size, camera, clock, pointer } = useThree()
  const cursor = useRef({ previo: new THREE.Vector2(), impulso: 0 })
  const [texturas, setTexturas] = useState<THREE.CanvasTexture[]>([])
  const grupo = useRef<THREE.Group>(null)
  const hover = useRef<number | null>(null)

  useEffect(() => {
    let vivo = true
    Promise.all(proyectos.map(texturaDeTarjeta)).then((lista) => {
      if (vivo) {
        setTexturas(lista)
      } else {
        lista.forEach((t) => t.dispose())
      }
    })
    return () => {
      vivo = false
    }
  }, [proyectos])

  useEffect(() => () => texturas.forEach((t) => t.dispose()), [texturas])

  const { anchoVista, ancho: anchoTarjeta, alto: altoTarjeta, paso } = medidas(size.width, size.height)

  // Se repite la lista hasta tener tarjetas de sobra para el bucle.
  const copias = Math.max(1, Math.ceil(MINIMO_BUCLE / proyectos.length))
  const tarjetas = useMemo(
    () => Array.from({ length: proyectos.length * copias }, (_, i) => i % proyectos.length),
    [proyectos.length, copias],
  )
  const largo = tarjetas.length * paso

  const uniformesCompartidos = useMemo(
    () => ({
      uRadio: { value: 1 },
      uCurva: { value: 0 },
      uPlano: { value: 0 },
      uOlaOrigen: { value: new THREE.Vector2(0, 0) },
      uOlaT: { value: 0 },
      uOlaAmp: { value: 0 },
      uCursor: { value: new THREE.Vector2(0, 0) },
      uFuerza: { value: 0 },
      uRadioLente: { value: 1 },
      uAbombado: { value: 0 },
      uHundido: { value: 0 },
      uAumento: { value: LENTE.aumento },
    }),
    [],
  )
  const materiales = useMemo(
    () =>
      tarjetas.map(
        () =>
          new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            transparent: true,
            uniforms: {
              ...uniformesCompartidos,
              uTextura: { value: null },
              uAspecto: { value: ASPECTO },
              uRadioEsquina: { value: 0.045 },
              uHover: { value: 0 },
              uFoco: { value: 1 },
              uSalida: { value: 1 },
              uTam: { value: new THREE.Vector2(1, 1) },
            },
          }),
      ),
    [tarjetas, uniformesCompartidos],
  )
  useEffect(() => () => materiales.forEach((m) => m.dispose()), [materiales])

  const materialPiso = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertexPiso,
        fragmentShader: fragmentPiso,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uDesplazamiento: { value: 0 },
          uCelda: { value: 0.6 },
          uColor: { value: new THREE.Color("#26FFDF") },
          uAlfa: { value: 1 },
          uCursorPiso: { value: new THREE.Vector2(0, 99) },
          uFuerza: uniformesCompartidos.uFuerza,
        },
      }),
    [uniformesCompartidos],
  )
  useEffect(() => () => materialPiso.dispose(), [materialPiso])

  // Al volver con "atrás" el navegador puede restaurar la página tal cual
  // quedó (bfcache), con la cámara metida en la tarjeta: se restablece.
  useEffect(() => {
    const alMostrar = (evento: PageTransitionEvent) => {
      if (evento.persisted && estado.current.entrada) {
        estado.current.entrada = null
        onIngreso?.(false)
      }
    }
    window.addEventListener("pageshow", alMostrar)
    return () => window.removeEventListener("pageshow", alMostrar)
  }, [estado, onIngreso])

  useEffect(() => {
    materiales.forEach((material, i) => {
      material.uniforms.uTextura!.value = texturas[tarjetas[i]!] ?? null
    })
  }, [materiales, texturas, tarjetas])

  useFrame((_, delta) => {
    const e = estado.current
    const dt = Math.min(delta, 1 / 30)
    const antes = e.actual
    // Al entrar, el centrado es más rápido para que la tarjeta llegue al
    // medio antes de llenar la pantalla.
    const rapidez = e.entrada ? SUAVIZADO * 2.2 : SUAVIZADO
    e.actual += (e.objetivo - e.actual) * (1 - Math.exp(-rapidez * dt))
    e.velocidad = (e.actual - antes) / Math.max(dt, 1e-4)

    uniformesCompartidos.uRadio.value = anchoVista * RADIO
    const curva = Math.min(Math.abs(e.velocidad) * CURVA_VELOCIDAD, 0.6)
    uniformesCompartidos.uCurva.value += (curva - uniformesCompartidos.uCurva.value) * 0.12
    materialPiso.uniforms.uDesplazamiento!.value = -e.actual

    // Entrada: la cámara avanza hasta que la tarjeta, ya plana, cubre el lienzo.
    // Primero la ola y el salto; después, la entrada.
    const transcurrido = e.entrada ? clock.elapsedTime - e.entrada.inicio : 0
    const pOla = e.entrada ? Math.min(transcurrido / OLA.duracion, 1) : 1
    uniformesCompartidos.uOlaT.value = transcurrido
    uniformesCompartidos.uOlaAmp.value = e.entrada ? altoTarjeta * OLA.amplitud * (1 - pOla) : 0
    const salto = e.entrada ? Math.sin(Math.PI * pOla) * altoTarjeta * OLA.salto : 0
    const progreso = e.entrada
      ? THREE.MathUtils.clamp((transcurrido - OLA.duracion * 0.7) / DURACION_ENTRADA, 0, 1)
      : 0
    const k = suavizar(progreso)
    const tanMedio = Math.tan(THREE.MathUtils.degToRad(CAMARA.fov / 2))
    const aspecto = size.width / Math.max(size.height, 1)
    const zLleno = (Math.min(altoTarjeta, anchoTarjeta / aspecto) / (2 * tanMedio)) * 0.96
    camera.position.z = THREE.MathUtils.lerp(CAMARA.z, zLleno, k)
    uniformesCompartidos.uPlano.value = Math.min(1, k * 1.6)
    materialPiso.uniforms.uAlfa!.value = 1 - k

    // Cursor: se intersecta el rayo con el cilindro de las tarjetas y el
    // punto se expresa como longitud de arco, igual que en el vertex shader.
    const radio = uniformesCompartidos.uRadio.value / (1 + uniformesCompartidos.uCurva.value)
    const rayo = new THREE.Vector3(pointer.x, pointer.y, 0.5).unproject(camera).sub(camera.position).normalize()
    const cz = camera.position.z
    const a = rayo.x * rayo.x + rayo.z * rayo.z
    const b = 2 * rayo.z * (cz - radio)
    const c = (cz - radio) * (cz - radio) - radio * radio
    const t = (-b + Math.sqrt(Math.max(b * b - 4 * a * c, 0))) / (2 * a)
    const px = rayo.x * t
    const pz = cz + rayo.z * t
    const py = camera.position.y + rayo.y * t
    const arco = Math.atan2(px, radio - pz) * radio
    const lente = uniformesCompartidos.uCursor.value
    lente.x += (arco - lente.x) * 0.25
    lente.y += (py - lente.y) * 0.25

    // Más fuerza mientras el cursor se mueve; en reposo queda un domo leve.
    const mov = cursor.current.previo.distanceTo(pointer) / Math.max(dt, 1e-4)
    cursor.current.previo.copy(pointer)
    cursor.current.impulso += (Math.min(mov * 0.35, 1) - cursor.current.impulso) * 0.08
    const metaFuerza = e.puntero && !e.entrada ? 0.55 + 0.45 * cursor.current.impulso : 0
    const fuerza = uniformesCompartidos.uFuerza
    fuerza.value += (metaFuerza - fuerza.value) * 0.1
    uniformesCompartidos.uRadioLente.value = altoTarjeta * LENTE.radio
    uniformesCompartidos.uAbombado.value = altoTarjeta * LENTE.abombado
    uniformesCompartidos.uHundido.value = altoTarjeta * LENTE.hundido
    materialPiso.uniforms.uCursorPiso!.value.set(lente.x, -0.4)
    if (e.entrada && progreso >= 1 && !e.entrada.navegado) {
      e.entrada.navegado = true
      window.location.assign(e.entrada.href)
    }

    const hijos = grupo.current?.children ?? []
    hijos.forEach((malla, i) => {
      // Posición en el bucle, centrada en 0.
      let x = (((i * paso + e.actual) % largo) + largo) % largo
      if (x > largo / 2) {
        x -= largo
      }
      const material = materiales[i]!
      malla.position.x = x
      malla.position.y = e.entrada?.indice === i ? salto : 0
      // 1 en el centro, 0 a partir de una tarjeta de distancia.
      material.uniforms.uFoco!.value = 1 - THREE.MathUtils.smoothstep(Math.abs(x), 0, paso * 0.85)
      const elegida = e.entrada?.indice === i
      material.uniforms.uSalida!.value = e.entrada && !elegida ? 1 - k : 1
      material.uniforms.uRadioEsquina!.value = 0.045 * (elegida ? 1 - k : 1)
      material.uniforms.uTam!.value.set(anchoTarjeta, altoTarjeta)
      // La elegida se dibuja encima de todo mientras crece.
      malla.renderOrder = elegida ? 10 : 0
      const meta = hover.current === i ? 1 : 0
      material.uniforms.uHover!.value += (meta - material.uniforms.uHover!.value) * 0.15
    })
  })

  const abrir = (evento: ThreeEvent<MouseEvent>, indice: number) => {
    // Un arrastre no es un clic.
    if (evento.delta > 6) {
      return
    }
    const proyecto = proyectos[tarjetas[indice]!]
    if (!proyecto || estado.current.entrada) {
      return
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.location.assign(proyecto.href)
      return
    }
    // Se centra la tarjeta tocada (su x actual pasa a 0) y empieza la entrada.
    const malla = grupo.current?.children[indice]
    estado.current.objetivo = estado.current.actual - (malla?.position.x ?? 0)
    estado.current.entrada = { indice, inicio: clock.elapsedTime, href: proyecto.href, navegado: false }
    // La ola nace donde se tocó; como la tarjeta se va a centrar, el origen
    // se corre con ella.
    uniformesCompartidos.uOlaOrigen.value.set(evento.point.x - (malla?.position.x ?? 0), evento.point.y)
    document.body.style.cursor = ""
    onIngreso?.(true)
  }

  return (
    <>
      <group ref={grupo}>
        {tarjetas.map((_, i) => (
          <mesh
            key={i}
            material={materiales[i]}
            onClick={(e) => abrir(e, i)}
            onPointerOver={() => {
              hover.current = i
              document.body.style.cursor = "pointer"
            }}
            onPointerOut={() => {
              hover.current = null
              document.body.style.cursor = ""
            }}
          >
            <planeGeometry args={[anchoTarjeta, altoTarjeta, 64, 40]} />
          </mesh>
        ))}
      </group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -altoTarjeta * 0.62, -6]} material={materialPiso}>
        <planeGeometry args={[40, 24, 160, 96]} />
      </mesh>
    </>
  )
}

const CarruselCurvo = forwardRef<
  CarruselCurvoHandle,
  { proyectos: ProyectoCarrusel[]; className?: string; onIngreso?: (ingresando: boolean) => void }
>(
  function CarruselCurvo({ proyectos, className = "", onIngreso }, ref) {
    const estado = useRef<Estado>({ objetivo: 0, actual: 0, velocidad: 0, entrada: null, puntero: false })
    const contenedor = useRef<HTMLDivElement>(null)
    const arrastre = useRef<{ x: number; objetivo: number } | null>(null)
    const pasoPx = useRef(1)

    const medir = () => {
      const caja = contenedor.current?.getBoundingClientRect()
      return medidas(caja?.width ?? 1, caja?.height ?? 1)
    }

    useImperativeHandle(ref, () => ({
      mover: (pasos: number) => {
        if (estado.current.entrada) {
          return
        }
        const { paso } = medir()
        estado.current.objetivo = Math.round(estado.current.objetivo / paso) * paso + pasos * paso
      },
    }))

    useEffect(() => {
      const el = contenedor.current
      if (!el) {
        return
      }
      // Rueda horizontal (trackpad o shift+rueda) mueve el carrusel. La
      // vertical se deja pasar al scroll-snap del home.
      const alRodar = (e: WheelEvent) => {
        const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0
        if (!dx || estado.current.entrada) {
          return
        }
        e.preventDefault()
        e.stopPropagation()
        estado.current.objetivo -= dx * medir().mundoPorPx * 1.2
      }
      el.addEventListener("wheel", alRodar, { passive: false })
      return () => el.removeEventListener("wheel", alRodar)
    }, [])

    return (
      <div
        ref={contenedor}
        className={`relative cursor-grab touch-pan-y select-none active:cursor-grabbing ${className}`}
        onPointerDown={(e) => {
          if (estado.current.entrada) {
            return
          }
          arrastre.current = { x: e.clientX, objetivo: estado.current.objetivo }
          pasoPx.current = medir().mundoPorPx
        }}
        onPointerMove={(e) => {
          // La lente es cosa del mouse; en táctil no hay cursor que seguir.
          estado.current.puntero = e.pointerType === "mouse"
          if (!arrastre.current) {
            return
          }
          const dx = e.clientX - arrastre.current.x
          estado.current.objetivo = arrastre.current.objetivo + dx * pasoPx.current * 1.4
        }}
        onPointerUp={() => {
          if (!arrastre.current) {
            return
          }
          // Al soltar, se asienta en la tarjeta más cercana.
          const { paso } = medir()
          estado.current.objetivo = Math.round(estado.current.objetivo / paso) * paso
          arrastre.current = null
        }}
        onPointerCancel={() => {
          arrastre.current = null
        }}
        onPointerLeave={() => {
          arrastre.current = null
          estado.current.puntero = false
        }}
      >
        <Canvas
          camera={{ position: [0, 0, CAMARA.z], fov: CAMARA.fov }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Escena proyectos={proyectos} estado={estado} onIngreso={onIngreso} />
        </Canvas>
      </div>
    )
  },
)

export default CarruselCurvo
