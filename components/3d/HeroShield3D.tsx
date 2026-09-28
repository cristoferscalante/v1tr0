"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Center, Environment, useGLTF, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { CinematicLighting, MODEL_PATH } from "@/components/3d/VtrLogoPerfect3D"

/**
 * Qué se pinta en la escena. "png": la ilustración del escudo sobre un plano
 * (la misma imagen de la intro, 147 KB). "glb": el modelo 3D de /about (1,9 MB
 * más el mapa de entorno), con volumen e iluminación reales.
 */
const SHIELD_SOURCE: "png" | "glb" = "png"
const SHIELD_IMAGE = { src: "/imagenes/logos/escudo-logo-hero.png", aspect: 551 / 634 }

/** Cámara; el fov está calibrado para que el escudo mida lo mismo que el PNG
 *  de la intro, al que reemplaza con un fundido. */
const CAMERA = { z: 1.6, fov: 47 }
/** Cuánto desborda el lienzo la caja del PNG por lado: debe coincidir con la
 *  clase `-inset-[18%]` de su contenedor en HomeHero. */
const CANVAS_BLEED = 0.18

/** Inclinación máxima hacia el cursor: leve, solo para que "mire". */
const MAX_TILT = { x: 0.22, y: 0.4 }
/** Qué tan rápido alcanza la pose objetivo (por segundo). */
const FOLLOW_SPEED = 3.2

/** Rampa de densidad del ASCII, de vacío a lleno. El punto medio (·) va
 *  centrado en la celda y lee mejor que el punto de línea base. El tramo
 *  denso usa glyphs de altura x (x, o, •) en vez de #&@: más livianos. */
const ASCII_RAMP = " ·:-=+*xo•"
/** Lado de cada celda de carácter y radio de la lente, en px CSS. */
const ASCII_CELL = 10
const ASCII_RADIUS = 120
/** Tamaño del carácter respecto de su celda. */
const ASCII_GLYPH_SCALE = 0.74
/** Índice mínimo dentro de una celda cubierta: ":" (el "·" solo, en bloque,
 *  se lee como trama de puntos y no como caracteres). */
const ASCII_MIN_INDEX = 2
/** Cuántas veces por segundo se barajan los caracteres. */
const ASCII_SCRAMBLE_FPS = 12

/** Familia de la mono del sitio (JetBrains Mono, vía la variable de next/font). */
function asciiFontFamily() {
  return getComputedStyle(document.body).getPropertyValue("--font-jetbrains-mono").trim() || "ui-monospace, monospace"
}

type Pointer = { x: number; y: number; clientX: number; clientY: number; inside: boolean }

/**
 * Posición del cursor normalizada a [-1, 1] sobre toda la ventana, no solo
 * sobre el canvas: el escudo sigue al puntero esté donde esté en la página.
 */
function usePointer() {
  const pointer = useRef<Pointer>({ x: 0, y: 0, clientX: 0, clientY: 0, inside: false })
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
      pointer.current.clientX = e.clientX
      pointer.current.clientY = e.clientY
      pointer.current.inside = true
    }
    // Al salir de la ventana vuelve de frente y se apaga la lente
    const onLeave = () => {
      pointer.current.x = 0
      pointer.current.y = 0
      pointer.current.inside = false
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    document.documentElement.addEventListener("pointerleave", onLeave)
    return () => {
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
    }
  }, [])
  return pointer
}

/** Inclina el grupo hacia el cursor, amortiguado e independiente de los fps. */
function useTilt(pointer: React.MutableRefObject<Pointer>) {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) {
      return
    }
    const t = 1 - Math.exp(-FOLLOW_SPEED * delta)
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointer.current.x * MAX_TILT.y, t)
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, pointer.current.y * MAX_TILT.x, t)
  })
  return groupRef
}

/** Avisa tras el primer fotograma pintado: recién ahí se puede cruzar con el PNG. */
function useReady(onReady: () => void) {
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(onReady))
    return () => cancelAnimationFrame(raf)
  }, [onReady])
}

type ShieldProps = { pointer: React.MutableRefObject<Pointer>; onReady: () => void }

/** Grosor del canto de la ilustración y cuántas láminas lo forman. */
const EDGE_DEPTH = 0.045
const EDGE_SLICES = 14

const LAYER_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/**
 * uEdge = 0: la ilustración tal cual (la cara). uEdge = 1: solo su silueta,
 * en un teal oscuro que se apaga hacia atrás (uShade), para armar el canto.
 */
const LAYER_FRAGMENT = /* glsl */ `
  uniform sampler2D map;
  uniform float uEdge;
  uniform float uShade;
  varying vec2 vUv;
  void main() {
    vec4 color = texture2D(map, vUv);
    if (uEdge > 0.5) {
      // Corte nítido: las láminas apiladas con borde suave se ven borrosas
      if (color.a < 0.5) discard;
      gl_FragColor = vec4(vec3(0.004, 0.06, 0.055) * uShade, 1.0);
    } else {
      gl_FragColor = color;
    }
  }
`

/**
 * La ilustración del escudo como una medalla con grosor: la cara es el PNG y
 * detrás se apilan láminas con su silueta que forman el canto. De frente el
 * canto queda oculto (cada lámina se agranda lo que la perspectiva le quita),
 * así calza exacto con el PNG de la intro y el fundido no se nota; al
 * inclinarse asoma por el lado contrario. Sin luces: colores tal cual.
 */
function ShieldImage({ pointer, onReady }: ShieldProps) {
  const groupRef = useTilt(pointer)
  const texture = useTexture(SHIELD_IMAGE.src)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  useReady(onReady)

  // Alto visible a la distancia del plano, menos el desborde del lienzo
  const height = (2 * CAMERA.z * Math.tan(THREE.MathUtils.degToRad(CAMERA.fov / 2))) / (1 + 2 * CANVAS_BLEED)

  const { geometry, face, slices } = useMemo(() => {
    const make = (edge: number, shade: number) =>
      new THREE.ShaderMaterial({
        vertexShader: LAYER_VERTEX,
        fragmentShader: LAYER_FRAGMENT,
        uniforms: { map: { value: texture }, uEdge: { value: edge }, uShade: { value: shade } },
        transparent: true,
        depthWrite: false,
      })
    return {
      geometry: new THREE.PlaneGeometry(height * SHIELD_IMAGE.aspect, height),
      face: make(0, 1),
      // De atrás hacia adelante; la más cercana a la cara es la más clara
      slices: Array.from({ length: EDGE_SLICES }, (_, i) => {
        const depth = EDGE_DEPTH * (1 - i / EDGE_SLICES)
        return { depth, material: make(1, 0.55 + 0.45 * (i / EDGE_SLICES)) }
      }),
    }
  }, [texture, height])

  useEffect(
    () => () => {
      geometry.dispose()
      face.dispose()
      slices.forEach(({ material }) => material.dispose())
    },
    [geometry, face, slices],
  )

  return (
    <group ref={groupRef}>
      {slices.map(({ depth, material }, i) => (
        <mesh
          key={i}
          geometry={geometry}
          material={material}
          position-z={-depth}
          scale={(CAMERA.z + depth) / CAMERA.z}
          renderOrder={i}
        />
      ))}
      <mesh geometry={geometry} material={face} renderOrder={EDGE_SLICES} />
    </group>
  )
}

function ShieldModel({ pointer, onReady }: ShieldProps) {
  const groupRef = useTilt(pointer)
  const { scene } = useGLTF(MODEL_PATH, true)

  // Mismo tratamiento de materiales que en /about
  const model = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) {
        return
      }
      const mat = child.material as THREE.MeshStandardMaterial
      if (!mat) {
        return
      }
      if (mat.map) {
        mat.map.colorSpace = THREE.SRGBColorSpace
      }
      if (mat.emissiveMap) {
        mat.emissiveMap.colorSpace = THREE.SRGBColorSpace
      }
      if (mat.normalMap) {
        mat.normalMap.colorSpace = THREE.LinearSRGBColorSpace
      }
      mat.envMapIntensity = 1.8
      mat.needsUpdate = true
    })
    return clone
  }, [scene])

  useReady(onReady)

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={model} />
      </Center>
    </group>
  )
}

/**
 * Atlas con los caracteres de la rampa en fila, blanco sobre negro, en la
 * mono del sitio (JetBrains Mono, vía la variable de next/font). Cada glyph
 * deja margen en su celda para que los mipmaps no mezclen vecinos.
 */
function createGlyphAtlas() {
  const size = 64
  const canvas = document.createElement("canvas")
  canvas.width = size * ASCII_RAMP.length
  canvas.height = size
  const texture = new THREE.CanvasTexture(canvas)
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 4

  const font = `400 ${Math.round(size * ASCII_GLYPH_SCALE)}px ${asciiFontFamily()}`

  const draw = () => {
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#fff"
    ctx.font = font
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ASCII_RAMP.split("").forEach((char, i) => ctx.fillText(char, i * size + size / 2, size / 2 + 1))
    texture.needsUpdate = true
  }
  draw()
  // Si la fuente aún no cargó, se redibuja cuando esté
  void document.fonts.load(font).then(draw).catch(() => {})
  return texture
}

const ASCII_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

/**
 * Mezcla la escena con su versión en caracteres dentro de un círculo
 * alrededor del cursor. Cada celda toma el color y el brillo del modelo en
 * ese punto y elige el carácter por densidad.
 */
const ASCII_FRAGMENT = /* glsl */ `
  uniform sampler2D tScene;
  uniform sampler2D tGlyphs;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uCell;
  uniform float uRadius;
  uniform float uStrength;
  uniform float uInvert;
  uniform float uDistort;
  uniform float uGlyphCount;
  uniform float uMinIndex;
  uniform float uTime;
  uniform float uScrambleFps;

  // Pseudoaleatorio estable en [0, 1) para una celda y un tic
  float hash(float x, float y, float z) {
    return fract(sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453);
  }
  varying vec2 vUv;

  void main() {
    vec2 px = vUv * uResolution;

    // Distorsión de llegada (uDistort 1 → 0): bandas horizontales que se
    // corren a saltos, una onda leve y los canales RGB separados. Se apaga
    // sola y deja la imagen limpia.
    float d = uDistort;
    vec2 uv = vUv;
    if (d > 0.001) {
      float band = floor(vUv.y * 36.0);
      float jump = hash(band, floor(uTime * 18.0), 5.0) - 0.5;
      uv.x += jump * 0.14 * d * d;
      uv.x += sin(vUv.y * 28.0 + uTime * 10.0) * 0.018 * d;
    }
    vec2 split = vec2(0.02 * d, 0.0);
    vec4 center = texture2D(tScene, uv);
    vec4 red = texture2D(tScene, uv + split);
    vec4 blue = texture2D(tScene, uv - split);
    vec4 original = vec4(red.r, center.g, blue.b, max(center.a, max(red.a, blue.a)));

    vec2 cellCenter = (floor(px / uCell) + 0.5) * uCell;
    vec4 cellColor = texture2D(tScene, cellCenter / uResolution);
    // Brillo con la curva del tone mapping aplicada a ojo: la escena está en lineal
    vec3 mapped = cellColor.rgb / (cellColor.rgb + 0.6);
    float luma = dot(mapped, vec3(0.299, 0.587, 0.114));
    // Curva que abre las sombras: el cuerpo del escudo es teal oscuro y, sin
    // esto, casi todas sus celdas caían en el espacio en blanco
    float density = pow(clamp(luma * 3.2, 0.0, 1.0), 0.42);
    // Toda celda que cubre el modelo lleva al menos el índice mínimo
    float covered = step(0.5, cellColor.a);
    float index = max(floor(density * 0.999 * uGlyphCount), uMinIndex);

    // Borde vivo: el radio ondula con el ángulo y el tiempo, así la lente no
    // es un círculo fijo
    vec2 toCell = cellCenter - uMouse;
    float angle = atan(toCell.y, toCell.x);
    float radius = uRadius * (1.0 + 0.08 * sin(angle * 5.0 + uTime * 2.2) + 0.05 * sin(angle * 3.0 - uTime * 1.7));
    float lensAtCell = 1.0 - smoothstep(radius * 0.65, radius, length(toCell));
    // Cuánto ASCII lleva la celda: en modo normal, la lente; invertido
    // (uInvert = 1), todo menos la lente
    float lens = lensAtCell * uStrength;
    float amount = lens + (1.0 - 2.0 * lens) * uInvert;

    // Barajado: los caracteres saltan a un vecino de la rampa a saltos
    vec2 cellId = floor(px / uCell);
    float tick = floor(uTime * uScrambleFps);
    // Inquietud máxima en el borde de la lente, calma donde el ASCII es pleno
    float edge = 1.0 - abs(2.0 * amount - 1.0);
    if (hash(cellId.x, cellId.y, tick) < 0.12 + 0.7 * edge) {
      float offset = floor(hash(cellId.y, cellId.x, tick + 17.0) * 5.0) - 2.0;
      index = clamp(index + offset, uMinIndex, uGlyphCount - 1.0);
    }
    index *= covered;
    vec2 inCell = fract(px / uCell);
    float glyph = texture2D(tGlyphs, vec2((index + inCell.x) / uGlyphCount, inCell.y)).r;
    // Teal de marca en las sombras, blanco en las luces (en lineal: la salida
    // pasa por el tone mapping y la conversión a sRGB)
    vec3 tint = mix(vec3(0.02, 1.0, 0.74), vec3(1.0), smoothstep(0.45, 0.95, density));
    // Piso de brillo alto: sobre el teal oscuro los caracteres tenues se
    // perdían y el borde de la lente parecía más chico que en el texto
    float glow = 0.9 + density * 0.8;
    vec4 ascii = vec4(tint * glow * glyph, glyph * covered);

    // La lente se decide por celda: el borde ondulado queda en escalones de
    // carácter, como el resto del ASCII
    gl_FragColor = mix(original, ascii, amount);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

/**
 * Toma el render de la escena: la pinta en una textura y la pasa por el
 * shader ASCII antes de llevarla a pantalla.
 */
/** Duración de la distorsión con la que el escudo se asienta al aparecer. */
const ARRIVAL_SECONDS = 1.8

function AsciiLens({
  pointer,
  inverted,
  revealed,
}: {
  pointer: React.MutableRefObject<Pointer>
  inverted: boolean
  revealed: boolean
}) {
  // Instante (reloj de la escena) en que el escudo quedó a la vista
  const revealedAt = useRef<number | null>(null)
  const { gl, scene, camera, size, viewport } = useThree()

  const target = useMemo(
    () =>
      new THREE.WebGLRenderTarget(1, 1, {
        type: THREE.HalfFloatType,
        samples: 4,
      }),
    [],
  )

  const glyphs = useMemo(() => createGlyphAtlas(), [])

  const { quadScene, quadCamera, material } = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      vertexShader: ASCII_VERTEX,
      fragmentShader: ASCII_FRAGMENT,
      uniforms: {
        tScene: { value: target.texture },
        tGlyphs: { value: glyphs },
        uResolution: { value: new THREE.Vector2() },
        uMouse: { value: new THREE.Vector2(-9999, -9999) },
        uCell: { value: ASCII_CELL },
        uRadius: { value: ASCII_RADIUS },
        uStrength: { value: 0 },
        uInvert: { value: 0 },
        uDistort: { value: 1 },
        uGlyphCount: { value: ASCII_RAMP.length },
        uMinIndex: { value: ASCII_MIN_INDEX },
        uTime: { value: 0 },
        uScrambleFps: { value: ASCII_SCRAMBLE_FPS },
      },
      transparent: true,
      blending: THREE.NoBlending,
      depthTest: false,
      depthWrite: false,
      toneMapped: true,
    })
    const quadScene = new THREE.Scene()
    quadScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))
    return { quadScene, quadCamera: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), material }
  }, [target, glyphs])

  useEffect(() => {
    const dpr = viewport.dpr
    target.setSize(Math.round(size.width * dpr), Math.round(size.height * dpr))
    material.uniforms.uResolution!.value.set(size.width * dpr, size.height * dpr)
    material.uniforms.uCell!.value = ASCII_CELL * dpr
    material.uniforms.uRadius!.value = ASCII_RADIUS * dpr
  }, [size, viewport.dpr, target, material])

  useEffect(
    () => () => {
      target.dispose()
      glyphs.dispose()
      material.dispose()
    },
    [target, glyphs, material],
  )

  // Prioridad 1: R3F deja de renderizar solo y el pase queda a cargo de esto
  useFrame((state, delta) => {
    material.uniforms.uTime!.value = state.clock.elapsedTime
    const rect = gl.domElement.getBoundingClientRect()
    const { clientX, clientY, inside } = pointer.current
    const dpr = viewport.dpr
    const uniforms = material.uniforms
    uniforms.uMouse!.value.set((clientX - rect.left) * dpr, (rect.bottom - clientY) * dpr)

    // La lente se enciende con el cursor sobre el lienzo y se apaga con un fundido
    const over =
      inside && clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom
    const t = 1 - Math.exp(-8 * delta)
    uniforms.uStrength!.value = THREE.MathUtils.lerp(uniforms.uStrength!.value, over ? 1 : 0, t)
    // El cambio de modo se cruza en ~0.6 s
    uniforms.uInvert!.value = THREE.MathUtils.lerp(uniforms.uInvert!.value, inverted ? 1 : 0, 1 - Math.exp(-5 * delta))

    // Llegada: distorsión plena mientras está oculto; al revelarse se apaga
    // con salida suave
    if (!revealed) {
      revealedAt.current = null
      uniforms.uDistort!.value = 1
    } else {
      revealedAt.current ??= state.clock.elapsedTime
      const progress = Math.min((state.clock.elapsedTime - revealedAt.current) / ARRIVAL_SECONDS, 1)
      uniforms.uDistort!.value = Math.pow(1 - progress, 3)
    }

    gl.setRenderTarget(target)
    gl.clear()
    gl.render(scene, camera)
    gl.setRenderTarget(null)
    gl.render(quadScene, quadCamera)
  }, 1)

  return null
}

/**
 * Escudo del hero en WebGL: de frente, se inclina levemente hacia donde está
 * el cursor y lleva la lente ASCII. La flotación la pone el contenedor del
 * hero, no el modelo. Qué escudo se pinta lo decide SHIELD_SOURCE.
 */
export default function HeroShield3D({
  onReady,
  inverted = false,
  revealed = true,
}: {
  onReady: () => void
  inverted?: boolean
  /** Si ya está a la vista: dispara la distorsión con la que se asienta. */
  revealed?: boolean
}) {
  const pointer = usePointer()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  // Fuera de pantalla no se renderiza ningún fotograma
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) {
      return
    }
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={wrapperRef} className="h-full w-full">
      <Canvas
        frameloop={inView ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, CAMERA.z], fov: CAMERA.fov, near: 0.1, far: 100 }}
        style={{ background: "transparent" }}
        gl={{
          antialias: true,
          alpha: true,
          // La ilustración no pasa por tone mapping: conserva sus colores
          toneMapping: SHIELD_SOURCE === "png" ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.35,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        {SHIELD_SOURCE === "png" ? (
          <Suspense fallback={null}>
            <ShieldImage pointer={pointer} onReady={onReady} />
          </Suspense>
        ) : (
          <>
            <CinematicLighting />
            <Suspense fallback={null}>
              <Environment preset="night" resolution={256} />
              <ShieldModel pointer={pointer} onReady={onReady} />
            </Suspense>
          </>
        )}
        <AsciiLens pointer={pointer} inverted={inverted} revealed={revealed} />
      </Canvas>
    </div>
  )
}
