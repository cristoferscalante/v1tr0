"use client"

import React, { useRef, useState, useCallback, useEffect, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { useIsMobile } from '@/hooks/use-mobile'

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================

type ViewKey = 'isometric' | 'perspective'

const CAMERA_VIEWS = {
  isometric: {
    name: 'Isométrica',
    position: [-12, 39, -40] as [number, number, number],
    modelPosition: [2.2, 2.2, -0.9] as [number, number, number],
    fov: 4.5,
    modelScale: [2.8, 2.8, 2.8] as [number, number, number]
  },
  perspective: {
    name: 'Perspectiva',
    position: [10, 120, 55] as [number, number, number],
    modelPosition: [-0.1, -0.2, 0.1] as [number, number, number],
    fov: 3,
    modelScale: [4.2, 4.2, 4.2] as [number, number, number]
  }
} as const

// Material configuration for Glass Morphism effect
const GLASS_MATERIAL_CONFIG = {
  color: '#26FFDF',
  metalness: 0.9,
  roughness: 0.1,
  transmission: 0.9,
  thickness: 0.9,
  transparent: true,
  opacity: 0.8,
  clearcoat: 0.0,
  clearcoatRoughness: 0.2,
  ior: 0.5,
  reflectivity: 2.9,
  envMapIntensity: 0.5,
  emissive: '#0b5f53',
  emissiveIntensity: 0.9,
  side: THREE.DoubleSide
} as const

// Lighting configurations
const LIGHTING_CONFIG = {
  perspective: {
    ambient: { intensity: 0.1, color: '#ffffff' },
    directional: [
      { position: [15, 45, 25], intensity: 0.1, color: '#26FFDF', castShadow: true },
      { position: [-12, 35, 20], intensity: 0.1, color: '#08A696' },
      { position: [0, 50, -15], intensity: 0.4, color: '#26FFDF' }
    ],
    point: [
      { position: [20, 25, 10], intensity: 0.5, color: '#122c2a' },
      { position: [-15, 20, 8], intensity: 0.4, color: '#0d1a18' }
    ]
  },
  isometric: {
    ambient: { intensity: 0.4, color: '#19213d' },
    directional: [
      { position: [10, 10, 5], intensity: 0.8, color: '#26FFDF', castShadow: true },
      { position: [-10, 55, 50], intensity: 5.4, color: '#08A696' },
      { position: [0, -9, -50], intensity: 9.3, color: '#26FFDF' }
    ],
    point: [
      { position: [5, 8, 5], intensity: 0.3, color: '#122c2a' },
      { position: [-5, 8, 5], intensity: 0.3, color: '#0d1a18' }
    ]
  }
} as const

// Animation constants
const ANIMATION_CONFIG = {
  sway: {
    x: { amplitude: 0.015, frequency: 0.08 },
    y: { amplitude: 0.012, frequency: 0.25 },
    z: { amplitude: 0.008, frequency: 0.05 }
  },
  rotation: {
    y: { amplitude: 0.025, frequency: 0.06 },
    z: { amplitude: 0.015, frequency: 0.08 },
    x: { amplitude: 0.008, frequency: 0.04 }
  },
  transition: {
    duration: 6.0,
    lerpFactor: 0.5
  }
} as const

const MODEL_CENTER = new THREE.Vector3(0.001, 3.1, 0.2)
const MODEL_PATH = '/imagenes/3d/models/v1tr0_logo_3d.glb'

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

// Hook for model positioning logic
function useModelPosition(currentView: ViewKey, position: 'left' | 'right') {
  const targetPosition = useRef(new THREE.Vector3())
  const currentPosition = useRef(new THREE.Vector3())
  
  const getBaseX = useCallback(() => {
    if (currentView === 'isometric') {
      return position === 'left' ? -3 : 3
    }
    return position === 'left' ? -1 : 1
  }, [currentView, position])
  
  useEffect(() => {
    const baseX = getBaseX()
    targetPosition.current.set(baseX, 2.5, 0.5)
    
    if (currentPosition.current.length() === 0) {
      currentPosition.current.copy(targetPosition.current)
    }
  }, [getBaseX])
  
  return { targetPosition, currentPosition }
}

// Hook for camera transitions
function useCameraTransition(currentView: ViewKey, camera: THREE.Camera, modelCenter: THREE.Vector3) {
  const targetPosition = useRef(new THREE.Vector3())
  const currentPosition = useRef(new THREE.Vector3())
  const targetFov = useRef(12)
  const isTransitioning = useRef(false)
  const transitionStartTime = useRef(0)
  const isInitialized = useRef(false)
  
  // Initialize camera position
  useEffect(() => {
    if (!isInitialized.current) {
      const defaultView = CAMERA_VIEWS.isometric
      camera.position.set(...defaultView.position)
      if ('fov' in camera) {
        const perspCamera = camera as THREE.PerspectiveCamera
        perspCamera.fov = defaultView.fov
        perspCamera.updateProjectionMatrix()
      }
      camera.lookAt(modelCenter)
      currentPosition.current.copy(camera.position)
      isInitialized.current = true
    }
  }, [camera, modelCenter])
  
  // Handle view changes
  useEffect(() => {
    const view = CAMERA_VIEWS[currentView]
    targetPosition.current.set(...view.position)
    targetFov.current = view.fov
    isTransitioning.current = true
    transitionStartTime.current = Date.now()
  }, [currentView])
  
  return {
    targetPosition,
    currentPosition,
    targetFov,
    isTransitioning,
    transitionStartTime
  }
}

// ============================================================================
// COMPONENTS
// ============================================================================

// Lighting component
function SceneLighting({ currentView }: { currentView: ViewKey }) {
  const config = LIGHTING_CONFIG[currentView]
  
  return (
    <>
      <ambientLight intensity={config.ambient.intensity} color={config.ambient.color} />
      {config.directional.map((light, index) => (
        <directionalLight
          key={`directional-${index}`}
          position={light.position as [number, number, number]}
          intensity={light.intensity}
          color={light.color}
          castShadow={'castShadow' in light ? light.castShadow : false}
        />
      ))}
      {config.point.map((light, index) => (
        <pointLight
          key={`point-${index}`}
          position={light.position as [number, number, number]}
          intensity={light.intensity}
          color={light.color}
        />
      ))}
    </>
  )
}

// Optimized 3D Model component
function Logo3DModel({ 
  onTogglePosition, 
  position,
  currentView,
  onModelLoaded
}: { 
  onTogglePosition: () => void
  position: 'left' | 'right'
  currentView: ViewKey
  onModelLoaded?: () => void
}) {
  const meshRef = useRef<THREE.Group>(null)
  const { targetPosition, currentPosition } = useModelPosition(currentView, position)
  
  // Load and configure model
  const { scene } = useGLTF(MODEL_PATH, true)
  
  // Apply material configuration
  const configuredScene = useMemo(() => {
    const clonedScene = scene.clone()
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhysicalMaterial(GLASS_MATERIAL_CONFIG)
      }
    })
    return clonedScene
  }, [scene])

  // Notify when model is loaded and configured
  useEffect(() => {
    if (configuredScene && onModelLoaded) {
      // Small delay to ensure the model is fully rendered
      const timer = setTimeout(() => {
        onModelLoaded()
      }, 100)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [configuredScene, onModelLoaded])
  
  // Animation loop
  useFrame((state, delta) => {
    if (!meshRef.current) {
      return
    }
    
    // Smooth position interpolation with easing
    const baseLerpFactor = Math.min(1, delta * ANIMATION_CONFIG.transition.lerpFactor)
    // Apply easeOutCubic for more natural movement
    const easedLerpFactor = 1 - Math.pow(1 - baseLerpFactor, 3)
    currentPosition.current.lerp(targetPosition.current, easedLerpFactor)
    
    // Apply organic sway animation with multiple harmonics
    const time = state.clock.elapsedTime
    const swayX = (Math.sin(time * ANIMATION_CONFIG.sway.x.frequency) + 
                   Math.sin(time * ANIMATION_CONFIG.sway.x.frequency * 1.3) * 0.3) * ANIMATION_CONFIG.sway.x.amplitude
    const swayY = (Math.sin(time * ANIMATION_CONFIG.sway.y.frequency) + 
                   Math.cos(time * ANIMATION_CONFIG.sway.y.frequency * 0.7) * 0.4) * ANIMATION_CONFIG.sway.y.amplitude
    const swayZ = (Math.cos(time * ANIMATION_CONFIG.sway.z.frequency) + 
                   Math.sin(time * ANIMATION_CONFIG.sway.z.frequency * 1.1) * 0.2) * ANIMATION_CONFIG.sway.z.amplitude
    
    meshRef.current.position.set(
      currentPosition.current.x + swayX,
      currentPosition.current.y + swayY,
      currentPosition.current.z + swayZ
    )
    
    // Apply smooth rotation animation with organic feel
    meshRef.current.rotation.y = (Math.sin(time * ANIMATION_CONFIG.rotation.y.frequency) + 
                                   Math.sin(time * ANIMATION_CONFIG.rotation.y.frequency * 1.2) * 0.3) * ANIMATION_CONFIG.rotation.y.amplitude
    meshRef.current.rotation.z = (Math.sin(time * ANIMATION_CONFIG.rotation.z.frequency) + 
                                   Math.cos(time * ANIMATION_CONFIG.rotation.z.frequency * 0.8) * 0.2) * ANIMATION_CONFIG.rotation.z.amplitude
    meshRef.current.rotation.x = (Math.cos(time * ANIMATION_CONFIG.rotation.x.frequency) + 
                                   Math.sin(time * ANIMATION_CONFIG.rotation.x.frequency * 1.4) * 0.15) * ANIMATION_CONFIG.rotation.x.amplitude
  })
  
  const viewConfig = CAMERA_VIEWS[currentView]
  
  return (
    <group 
      ref={meshRef}
      onClick={onTogglePosition}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'default'
      }}
    >
      <primitive 
        object={configuredScene} 
        scale={viewConfig.modelScale}
        position={viewConfig.modelPosition}
      />
    </group>
  )
}

// Optimized Camera Controller
function CameraController({ 
  currentView, 
  modelCenter, 
  onPositionComplete 
}: { 
  currentView: ViewKey
  modelCenter: THREE.Vector3
  onPositionComplete: () => void
}) {
  const { camera } = useThree()
  const {
    targetPosition,
    currentPosition,
    targetFov,
    isTransitioning,
    transitionStartTime
  } = useCameraTransition(currentView, camera, modelCenter)
  
  useFrame((_, delta) => {
    if (isTransitioning.current) {
      const elapsed = (Date.now() - transitionStartTime.current) / 1000
      const progress = Math.min(elapsed / ANIMATION_CONFIG.transition.duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const lerpFactor = easeProgress * 0.1 * (60 * delta)
      
      currentPosition.current.lerpVectors(
        camera.position,
        targetPosition.current,
        lerpFactor
      )
      
      if ('fov' in camera) {
        const perspCamera = camera as THREE.PerspectiveCamera
        const currentFov = perspCamera.fov
        const newFov = currentFov + (targetFov.current - currentFov) * lerpFactor
        perspCamera.fov = newFov
        perspCamera.updateProjectionMatrix()
      }
      
      camera.position.copy(currentPosition.current)
      camera.lookAt(modelCenter)
      
      if (progress >= 1) {
        isTransitioning.current = false
        setTimeout(() => onPositionComplete(), 300)
      }
    } else {
      camera.lookAt(modelCenter)
    }
  })
  
  return null
}

// Loading component
function Loader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  )
}

// Mobile placeholder component
function MobilePlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1 }}
      className="w-full h-auto flex items-center justify-center"
      style={{ height: 'auto', padding: '40px 0' }}
    >
      <div className="text-center space-y-4">
        <div className="w-32 h-32 mx-auto bg-white/90 dark:bg-[#02505931] backdrop-blur-sm border border-[#08A696]/60 dark:border-[#08A696]/30 rounded-full flex items-center justify-center shadow-lg">
          <svg 
            className="w-16 h-16 text-[#08A696] dark:text-[#26FFDF]" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[#08A696] dark:text-[#26FFDF] bg-white/90 dark:bg-[#02505931] backdrop-blur-sm border border-[#08A696]/60 dark:border-[#08A696]/30 rounded-2xl px-4 py-2 inline-block shadow-lg">Modelo 3D V1TR0</h3>
        <p className="text-sm text-gray-400 max-w-xs mx-auto">
          El modelo 3D interactivo está disponible en dispositivos de escritorio para una mejor experiencia.
        </p>
      </div>
    </motion.div>
  )
}

// Text content components
function ViewTextOverlay({ currentView, showViewText }: { currentView: ViewKey, showViewText: boolean }) {
  return (
    <AnimatePresence>
      {showViewText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-4 left-4 z-10 pointer-events-none"
        >
          <div className="bg-white/90 dark:bg-[#02505931] backdrop-blur-sm border border-[#08A696]/60 dark:border-[#08A696]/30 rounded-2xl px-4 py-2 shadow-lg">
            <p className="text-sm font-medium text-[#08A696] dark:text-[#26FFDF]">
              Vista: {CAMERA_VIEWS[currentView].name}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function FloatingTextContent({ currentView }: { currentView: ViewKey }) {
  return (
    <AnimatePresence mode="wait">
      {currentView === 'isometric' && (
        <motion.div
          key="isometric-text"
          initial={{ 
            opacity: 0, 
            x: 80,
            y: 40,
            scale: 0.7,
            rotateY: 15
          }}
          animate={{ 
            opacity: 1, 
            x: 0,
            y: 0,
            scale: 1,
            rotateY: 0
          }}
          exit={{ 
            opacity: 0, 
            x: 60,
            y: -20,
            scale: 0.8,
            rotateY: -10
          }}
          transition={{ 
            duration: 1.5, 
            ease: [0.16, 1, 0.3, 1],
            delay: 0.5
          }}
          className="absolute top-[23%] right-4 lg:right-8 xl:right-12 2xl:right-16 transform -translate-y-1/2 z-20 pointer-events-none max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl"
        >
          <div className="bg-white/90 dark:bg-[#02505931] backdrop-blur-sm border border-[#08A696]/60 dark:border-[#08A696]/30 rounded-2xl p-6 lg:p-8 xl:p-10 shadow-lg hover:shadow-xl transition-all duration-300 mr-2 lg:mr-4 xl:mr-6">
            <p className="text-[#08A696] dark:text-[#26FFDF] font-semibold text-xs lg:text-sm xl:text-base leading-relaxed text-left">
              V1TR0 nace en 2025 con la misión de potenciar el rendimiento y la eficiencia de todo tipo de organizaciones —desde emprendedores y empresas en crecimiento, hasta agencias de cooperación internacional e instituciones consolidadas— mediante soluciones de software hechas a medida.
              <br /><br />
              Nuestra visión es integrar y optimizar las herramientas de gestión y operación diaria, unificando procesos y recursos para maximizar su impacto.
            </p>
          </div>
        </motion.div>
      )}
      
      {currentView === 'perspective' && (
        <motion.div
          key="perspective-text"
          initial={{ 
            opacity: 0, 
            x: -80,
            y: 50,
            scale: 0.7,
            rotateY: -15
          }}
          animate={{ 
            opacity: 1, 
            x: 0,
            y: 0,
            scale: 1,
            rotateY: 0
          }}
          exit={{ 
            opacity: 0, 
            x: -60,
            y: 30,
            scale: 0.8,
            rotateY: 10
          }}
          transition={{ 
            duration: 1.5, 
            ease: [0.16, 1, 0.3, 1],
            delay: 0.5
          }}
          className="absolute top-1/3 left-24 lg:left-28 xl:left-32 2xl:left-36 transform -translate-y-1/2 z-20 pointer-events-none max-w-md"
        >
          <div className="bg-white/90 dark:bg-[#02505931] backdrop-blur-sm border border-[#08A696]/60 dark:border-[#08A696]/30 rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <p className="text-[#08A696] dark:text-[#26FFDF] font-semibold text-sm leading-relaxed">
              Analizamos a fondo cada necesidad y, a partir de ello, diseñamos soluciones modulares, adaptadas y escalables, capaces de crecer al ritmo de cada proyecto.
              <br /><br />
              Así garantizamos que nuestros clientes, sin importar su tamaño o sector, cuenten siempre con tecnología que impulse su evolución.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function V1tr0Logo3D() {
  const [currentView, setCurrentView] = useState<ViewKey>('isometric')
  const [showViewText, setShowViewText] = useState(false)
  const [showModel, setShowModel] = useState(false)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const isMobile = useIsMobile()
  
  const handleToggleView = useCallback(() => {
    setShowViewText(false)
    setCurrentView(prev => prev === 'isometric' ? 'perspective' : 'isometric')
  }, [])
  
  const handlePositionComplete = useCallback(() => {
    // Position complete callback - can be extended if needed
  }, [])

  const handleModelLoaded = useCallback(() => {
    setIsModelLoaded(true)
  }, [])
  
  // Simplified loading sequence
  useEffect(() => {
    setShowViewText(true)
    
    const modelTimer = setTimeout(() => {
      setShowModel(true)
      setTimeout(() => setShowViewText(false), 1000)
    }, 1000)
    
    return () => clearTimeout(modelTimer)
  }, [])
  
  if (isMobile) {
    return <MobilePlaceholder />
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1 }}
      className="w-full h-full relative"
    >
      <ViewTextOverlay currentView={currentView} showViewText={showViewText} />
      {isModelLoaded && <FloatingTextContent key={currentView} currentView={currentView} />}
      
      {showModel && (
        <Suspense fallback={<Loader />}>
          <Canvas
            camera={{ 
              position: [20, 20, 20],
              fov: 1,
              up: [0, 1, 0]
            }}
            style={{ 
              background: 'transparent',
              width: '100%',
              height: '100%'
            }}
            className="w-full h-full"
            gl={{ 
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              outputColorSpace: THREE.SRGBColorSpace
            }}
          >
            <SceneLighting currentView={currentView} />
            <Environment preset="city" resolution={256} />
            <CameraController 
              currentView={currentView} 
              modelCenter={MODEL_CENTER} 
              onPositionComplete={handlePositionComplete}
            />
            <Logo3DModel 
              onTogglePosition={handleToggleView} 
              position={currentView === 'isometric' ? 'left' : 'right'}
              currentView={currentView}
              onModelLoaded={handleModelLoaded}
            />
          </Canvas>
        </Suspense>
      )}
    </motion.div>
  )
}

// Preload the model for better performance
useGLTF.preload(MODEL_PATH, true)