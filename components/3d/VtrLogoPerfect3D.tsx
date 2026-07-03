"use client"

import React, { useRef, Suspense, useMemo, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Center } from '@react-three/drei'
import * as THREE from 'three'
import { useIsMobile } from '@/hooks/use-mobile'

// ============================================================================
// CONSTANTS
// ============================================================================

const MODEL_PATH = '/imagenes/3d/models/vtr-logo-perfect.glb'

// Ángulo máximo de oscilación pasiva (±30°)
const PASSIVE_SWING_RAD = Math.PI / 6

// Iluminación cinematográfica
const CINEMATIC_LIGHTING = {
  ambient: { intensity: 0.05, color: '#0a1a1a' },
  directional: [
    { position: [6, 12, 8]   as [number, number, number], intensity: 3.5, color: '#fff8f0', castShadow: true  },
    { position: [-8, 6, -10] as [number, number, number], intensity: 4.2, color: '#26FFDF', castShadow: false },
    { position: [-6, 2, 6]   as [number, number, number], intensity: 0.6, color: '#b0e8ff', castShadow: false },
    { position: [0, -8, 4]   as [number, number, number], intensity: 0.4, color: '#ffeecc', castShadow: false },
  ],
  point: [
    { position: [0, 10, 0]   as [number, number, number], intensity: 2.5, color: '#08A696', distance: 20, decay: 2 },
    { position: [-5, 3, -3]  as [number, number, number], intensity: 1.8, color: '#26FFDF', distance: 15, decay: 2 },
    { position: [0, -4, 2]   as [number, number, number], intensity: 0.8, color: '#08A696', distance: 10, decay: 2 },
  ],
} as const

const FLOAT = {
  y:   { amp: 0.08, freq: 0.35 },
  x:   { amp: 0.010, freq: 0.22 },
} as const

// ============================================================================
// LIGHTING
// ============================================================================

function CinematicLighting() {
  return (
    <>
      <ambientLight intensity={CINEMATIC_LIGHTING.ambient.intensity} color={CINEMATIC_LIGHTING.ambient.color} />
      {CINEMATIC_LIGHTING.directional.map((l, i) => (
        <directionalLight
          key={`dir-${i}`}
          position={l.position}
          intensity={l.intensity}
          color={l.color}
          castShadow={l.castShadow}
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />
      ))}
      {CINEMATIC_LIGHTING.point.map((l, i) => (
        <pointLight
          key={`pt-${i}`}
          position={l.position}
          intensity={l.intensity}
          color={l.color}
          distance={l.distance}
          decay={l.decay}
        />
      ))}
    </>
  )
}

// ============================================================================
// 3D MODEL
// Recibe refs de interacción para combinar oscilación pasiva + drag del usuario
// ============================================================================

interface ModelProps {
  isDragging: React.MutableRefObject<boolean>
  dragRotY: React.MutableRefObject<number>
}

function PerfectLogoModel({ isDragging, dragRotY }: ModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(MODEL_PATH, true)

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) { return }
      child.castShadow    = true
      child.receiveShadow = true
      const mat = child.material as THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial
      if (!mat) { return }
      if (mat.map)         { mat.map.colorSpace         = THREE.SRGBColorSpace }
      if (mat.emissiveMap) { mat.emissiveMap.colorSpace  = THREE.SRGBColorSpace }
      if (mat.normalMap)   { mat.normalMap.colorSpace    = THREE.LinearSRGBColorSpace }
      if ('envMapIntensity' in mat) {
        (mat as THREE.MeshStandardMaterial).envMapIntensity = 1.8
      }
      mat.needsUpdate = true
    })
    return clone
  }, [scene])

  useFrame((state) => {
    if (!groupRef.current) { return }
    const t = state.clock.elapsedTime

    // ── Float vertical (siempre activo) ──
    groupRef.current.position.y =
      Math.sin(t * FLOAT.y.freq) * FLOAT.y.amp +
      Math.sin(t * FLOAT.y.freq * 1.73) * FLOAT.y.amp * 0.28

    // ── Rotación X suave (inclinación, siempre) ──
    groupRef.current.rotation.x =
      Math.cos(t * FLOAT.x.freq * 0.7) * FLOAT.x.amp

    // ── Rotación Y ──
    if (isDragging.current) {
      // El usuario arrastra: aplicamos su rotación directamente
      groupRef.current.rotation.y = dragRotY.current
      // Sincronizamos para que al soltar no haya salto
    } else {
      // Oscilación pasiva: péndulo suave ±30°
      const passiveTarget = Math.sin(t * 0.28) * PASSIVE_SWING_RAD
      // Lerp muy suave desde la posición actual (incluye post-drag) hacia el péndulo
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        passiveTarget,
        0.018
      )
      // Mantenemos dragRotY sincronizado para que al iniciar drag no haya salto
      dragRotY.current = groupRef.current.rotation.y
    }
  })

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={clonedScene} />
      </Center>
    </group>
  )
}

// ============================================================================
// LOADER / PLACEHOLDERS
// ============================================================================

function Loader() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-[#08A696]/20 border-t-[#26FFDF] animate-spin" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#26FFDF]/50 font-mono">
          cargando
        </span>
      </div>
    </div>
  )
}

function MobilePlaceholder() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl blur-xl bg-[#08A696]/20 scale-110" />
        <div className="relative w-28 h-28 rounded-2xl border border-[#08A696]/40 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <svg className="w-14 h-14 text-[#26FFDF]" fill="none" viewBox="0 0 100 100">
            <polygon points="50,8 92,29 92,71 50,92 8,71 8,29" fill="none" stroke="currentColor" strokeWidth="3" />
            <text x="50" y="62" textAnchor="middle" fill="currentColor" fontSize="22" fontWeight="700" fontFamily="monospace">V1</text>
          </svg>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CANVAS SCENE — recibe refs de interacción desde el wrapper
// ============================================================================

function Scene3D({ isDragging, dragRotY }: ModelProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 1.6], fov: 60, near: 0.1, far: 100 }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.35,
        outputColorSpace: THREE.SRGBColorSpace,
        alpha: true,
      }}
      shadows="soft"
    >
      <CinematicLighting />
      <Environment preset="night" resolution={512} />
      <PerfectLogoModel isDragging={isDragging} dragRotY={dragRotY} />
    </Canvas>
  )
}

// ============================================================================
// EXPORT — maneja eventos de pointer en el wrapper div
// ============================================================================

export default function VtrLogoPerfect3D({ className = '' }: { className?: string }) {
  const isMobile = useIsMobile()

  // Refs de interacción — compartidos entre DOM y Canvas
  const isDragging  = useRef(false)
  const dragRotY    = useRef(0)
  const lastPointerX = useRef(0)

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current   = true
    lastPointerX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.style.cursor = 'grabbing'
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) { return }
    const delta = e.clientX - lastPointerX.current
    dragRotY.current    += delta * 0.009   // sensibilidad del drag
    lastPointerX.current = e.clientX
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current          = false
    e.currentTarget.style.cursor = 'grab'
  }, [])

  const onPointerLeave = useCallback(() => {
    isDragging.current = false
  }, [])

  if (isMobile) {
    return (
      <div className={`w-full h-full ${className}`}>
        <MobilePlaceholder />
      </div>
    )
  }

  return (
    <div
      className={`w-full h-full ${className}`}
      style={{ cursor: 'grab' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
    >
      <Suspense fallback={<Loader />}>
        <Scene3D isDragging={isDragging} dragRotY={dragRotY} />
      </Suspense>
    </div>
  )
}

useGLTF.preload(MODEL_PATH, true)
