"use client"

import { Suspense, useRef, useState, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { useIsMobile } from '@/hooks/use-mobile'

// Camera view configurations
type ViewKey = 'isometric' | 'perspective'

const CAMERA_VIEWS = {
  isometric: {
    name: 'Isométrica',
    position: [-25, 22, -6] as [number, number, number],
    fov: 8
  },
  perspective: {
    name: 'Perspectiva',
    position: [2, 80, 30] as [number, number, number],
    fov: 5
  }
} as const

// Component to load the 3D model with click interaction and position control
function Logo3DModel({ 
  onTogglePosition, 
  position,
  currentView
}: { 
  onTogglePosition: () => void
  position: 'left' | 'right'
  currentView: ViewKey
}) {
  const { scene } = useGLTF('/3d/v1tr0_logo_3d.glb')
  const meshRef = useRef<THREE.Group>()
  const targetPosition = useRef(new THREE.Vector3())
  const currentPosition = useRef(new THREE.Vector3())
  
  // Apply Glass Morphism effect to the model
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshPhysicalMaterial({
        color: '#26FFDF', // V1TR0 primary turquoise color
        metalness: 1.1, // Low metalness for glass effect
        roughness: 0.01, // Very smooth surface
        transmission: 0.9, // High transmission for glass transparency
        thickness: 1.5, // Glass thickness
        transparent: true,
        opacity: 0.8, // Lower opacity for glass effect
        clearcoat: 1.0, // Clear coat for glossy finish
        clearcoatRoughness: 0.3, // Smooth clear coat
        ior: 1.5, // Index of refraction for glass
        reflectivity: 0.9, // High reflectivity
        envMapIntensity: 1.5, // Enhanced environment reflections
        emissive: '#06414D', // Subtle glow
        emissiveIntensity: 0.1, // Low intensity glow
        side: THREE.DoubleSide // Render both sides for better glass effect
      })
    }
  })
  
  // Initialize positions
  useEffect(() => {
    if (meshRef.current) {
      let baseX
      if (currentView === 'isometric') {
        baseX = position === 'left' ? -3 : 3
      } else {
        baseX = position === 'left' ? -5 : 4
      }
      targetPosition.current.set(baseX, 1.5, 0.1)
      if (currentPosition.current.length() === 0) {
        currentPosition.current.copy(targetPosition.current)
        meshRef.current.position.copy(currentPosition.current)
      }
    }
  }, [position, currentView])
  
  // Animation and position interpolation
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Update target position based on current position state
      let baseX
      if (currentView === 'isometric') {
        baseX = position === 'left' ? -3 : 3
      } else {
        baseX = position === 'left' ? -5 : 1
      }
      targetPosition.current.set(baseX, 2.5, 0.5)
      
      // Smooth interpolation to target position
      currentPosition.current.lerp(targetPosition.current, delta * 3)
      
      // Apply position with gentle swaying animation
      const swayX = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
      const swayY = Math.sin(state.clock.elapsedTime * 1.01) * 0.1
      const swayZ = Math.cos(state.clock.elapsedTime * 0.011) * 0.02
      
      meshRef.current.position.set(
        currentPosition.current.x + swayX,
        currentPosition.current.y + swayY,
        currentPosition.current.z + swayZ
      )
      
      // Gentle rotation animation
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.01) * 0.05
    }
  })
  
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
        object={scene} 
        scale={currentView === 'isometric' ? [5, 5, 5] : [7, 7, 7]}
        position={currentView === 'isometric' ? [0.5, 0.7, 0.5] : [-2.5, -3.0, 0.5]}
      />
    </group>
  )
}

// Loading fallback component
function Loader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  )
}

// Camera controller that follows the model
function CameraController({ currentView, modelCenter, onPositionComplete }: { 
  currentView: ViewKey; 
  modelCenter: THREE.Vector3;
  onPositionComplete: () => void;
}) {
  const { camera } = useThree()
  const targetPosition = useRef(new THREE.Vector3())
  const currentPosition = useRef(new THREE.Vector3())
  const targetFov = useRef(12)
  const isTransitioning = useRef(false)
  const transitionStartTime = useRef(0)
  const hasCompletedTransition = useRef(false)
  
  useEffect(() => {
    const view = CAMERA_VIEWS[currentView]
    targetPosition.current.set(...view.position)
    targetFov.current = view.fov
    isTransitioning.current = true
    transitionStartTime.current = Date.now()
    hasCompletedTransition.current = false
  }, [currentView])
  
  useFrame(() => {
    if (isTransitioning.current) {
      const elapsed = (Date.now() - transitionStartTime.current) / 1000
      const duration = 1.0
      const progress = Math.min(elapsed / duration, 1)
      
      // Smooth easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      
      currentPosition.current.lerpVectors(
        camera.position,
        targetPosition.current,
        easeProgress * 0.1
      )
      
      // Animate FOV transition
      const currentFov = camera.fov
      const newFov = currentFov + (targetFov.current - currentFov) * easeProgress * 0.1
      camera.fov = newFov
      camera.updateProjectionMatrix()
      
      camera.position.copy(currentPosition.current)
      camera.lookAt(modelCenter)
      
      // Check if transition is complete
      if (progress >= 1 && !hasCompletedTransition.current) {
        isTransitioning.current = false
        hasCompletedTransition.current = true
        // Delay text appearance slightly after camera stops
        setTimeout(() => {
          onPositionComplete()
        }, 300)
      }
    } else {
      camera.lookAt(modelCenter)
    }
  })
  
  return null
}

export default function V1tr0Logo3D() {
  const [currentView, setCurrentView] = useState<ViewKey>('isometric')
  const [showViewText, setShowViewText] = useState(false)
  const modelCenter = new THREE.Vector3(0.001, 3.1, 0.2)
  const isMobile = useIsMobile()
  
  const handleToggleView = useCallback(() => {
    setShowViewText(false) // Hide text during transition
    setCurrentView(prev => prev === 'isometric' ? 'perspective' : 'isometric')
  }, [])
  
  const handlePositionComplete = useCallback(() => {
    setShowViewText(true)
    // Hide text after 1 second
    setTimeout(() => {
      setShowViewText(false)
    }, 1000)
  }, [])
  
  // Initialize text visibility after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowViewText(true)
      // Hide text after 1 second
      setTimeout(() => {
        setShowViewText(false)
      }, 1000)
    }, 1500) // Show text after initial load
    
    return () => clearTimeout(timer)
  }, [])
  
  // Render mobile placeholder instead of 3D model
  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 }}
        className="w-full h-auto flex items-center justify-center"
        style={{ height: '700px' }}
      >
        <div className="text-center space-y-4">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#26FFDF]/20 to-[#06414D]/20 rounded-full flex items-center justify-center border border-[#26FFDF]/30">
            <svg 
              className="w-16 h-16 text-[#26FFDF]" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#26FFDF]">Modelo 3D V1TR0</h3>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">
            El modelo 3D interactivo está disponible en dispositivos de escritorio para una mejor experiencia.
          </p>
        </div>
      </motion.div>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1 }}
      className="w-full h-full relative"
    >
      {/* View Text Overlay */}
      <AnimatePresence>
        {showViewText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-4 left-4 z-10 pointer-events-none"
          >
            <div className="bg-black/20 backdrop-blur-sm border border-[#26FFDF]/30 rounded-lg px-4 py-2">
              <p className="text-highlight font-medium text-sm">
                Vista: {CAMERA_VIEWS[currentView].name}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Text Content - Isometric View */}
      <AnimatePresence>
        {currentView === 'isometric' && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="absolute top-1/4 right-8 lg:right-12 xl:right-16 2xl:right-20 transform -translate-y-1/2 z-20 pointer-events-none max-w-sm lg:max-w-md xl:max-w-lg"
          >
            <div className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 rounded-2xl p-6 lg:p-8 xl:p-10 shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 transition-all duration-300 hover:border-[#08A696] mr-4 lg:mr-6 xl:mr-8">
              <p className="text-highlight text-sm lg:text-base xl:text-lg leading-relaxed text-left">
                V1TR0 nace en 2025 con la misión de potenciar el rendimiento y la eficiencia de todo tipo de organizaciones —desde emprendedores y empresas en crecimiento, hasta agencias de cooperación internacional e instituciones consolidadas— mediante soluciones de software hechas a medida.
                <br /><br />
                Nuestra visión es integrar y optimizar las herramientas de gestión y operación diaria, unificando procesos y recursos para maximizar su impacto.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Text Content - Perspective View */}
      <AnimatePresence>
        {currentView === 'perspective' && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="absolute top-1/3 left-20 transform -translate-y-1/2 z-20 pointer-events-none max-w-md"
          >
            <div className="bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20 rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl hover:shadow-[#08A696]/10 transition-all duration-300 hover:border-[#08A696]">
              <p className="text-highlight text-sm leading-relaxed">
                Analizamos a fondo cada necesidad y, a partir de ello, diseñamos soluciones modulares, adaptadas y escalables, capaces de crecer al ritmo de cada proyecto.
                <br /><br />
                Así garantizamos que nuestros clientes, sin importar su tamaño o sector, cuenten siempre con tecnología que impulse su evolución.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ 
            position: [10, 10, 10],
            fov: 12,
            up: [0, 1, 0]
          }}
          style={{ 
            background: 'transparent',
            width: '100%',
            height: '100%'
          }}
          className="w-full h-full"
        >
          {/* Enhanced lighting for Glass Morphism effect */}
          <ambientLight intensity={0.4} color="#ffffff" />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={0.8} 
            color="#26FFDF"
            castShadow
          />
          <directionalLight 
            position={[-10, 5, 5]} 
            intensity={0.4} 
            color="#08A696"
          />
          <directionalLight 
            position={[0, -5, -10]} 
            intensity={0.3} 
            color="#26FFDF"
          />
          <pointLight position={[5, 8, 5]} intensity={0.3} color="#08A696" />
          <pointLight position={[-5, 8, 5]} intensity={0.3} color="#26FFDF" />
          <Environment preset="studio" />
          <CameraController 
            currentView={currentView} 
            modelCenter={modelCenter} 
            onPositionComplete={handlePositionComplete}
          />
          
          {/* 3D Model with click interaction */}
          <Logo3DModel 
            onTogglePosition={handleToggleView} 
            position={currentView === 'isometric' ? 'left' : 'right'}
            currentView={currentView}
          />
        </Canvas>
      </Suspense>
    </motion.div>
  )
}

// Preload the model for better performance
useGLTF.preload('/3d/v1tr0_logo_3d.glb')