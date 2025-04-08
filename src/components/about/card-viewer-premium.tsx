"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"

interface CardViewerPremiumProps {
  frontImage: string
  backImage: string
}

export default function CardViewerPremium({ frontImage, backImage }: CardViewerPremiumProps) {
  const [rotation, setRotation] = useState({ x: 5, y: 0, z: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const [autoRotate, setAutoRotate] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const rotationRef = useRef(rotation)
  const cardRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Grosor de la tarjeta en píxeles
  const cardThickness = 4

  // Actualizar la referencia cuando cambia el estado
  useEffect(() => {
    rotationRef.current = rotation
  }, [rotation])

  // Manejar el inicio del arrastre (mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (autoRotate) return
    setIsDragging(true)
    setStartPosition({ x: e.clientX, y: e.clientY })
  }

  // Manejar el inicio del arrastre (touch)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (autoRotate) return
    setIsDragging(true)
    setStartPosition({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    })
  }

  // Manejar el movimiento del mouse durante el arrastre
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || autoRotate) return

    // Calcular la diferencia de posición
    const deltaX = e.clientX - startPosition.x
    const deltaY = e.clientY - startPosition.y

    // Actualizar la rotación
    setRotation((prev) => ({
      y: prev.y + deltaX * 0.5,
      x: prev.x - deltaY * 0.5,
      z: prev.z,
    }))

    // Actualizar la posición inicial para el próximo movimiento
    setStartPosition({ x: e.clientX, y: e.clientY })
  }

  // Manejar el movimiento táctil durante el arrastre
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || autoRotate) return
    e.preventDefault() // Prevenir scroll

    // Calcular la diferencia de posición
    const deltaX = e.touches[0].clientX - startPosition.x
    const deltaY = e.touches[0].clientY - startPosition.y

    // Actualizar la rotación
    setRotation((prev) => ({
      y: prev.y + deltaX * 0.5,
      x: prev.x - deltaY * 0.5,
      z: prev.z,
    }))

    // Actualizar la posición inicial para el próximo movimiento
    setStartPosition({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    })
  }

  // Manejar el fin del arrastre
  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Manejar el hover
  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  // Añadir listeners globales para capturar el mouse/touch fuera del componente
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleDragEnd()
      }
    }

    const handleGlobalTouchEnd = () => {
      if (isDragging) {
        handleDragEnd()
      }
    }

    window.addEventListener("mouseup", handleGlobalMouseUp)
    window.addEventListener("touchend", handleGlobalTouchEnd)

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp)
      window.removeEventListener("touchend", handleGlobalTouchEnd)
    }
  }, [isDragging])

  // Efecto de iluminación dinámica basado en la posición del mouse
  useEffect(() => {
    if (!containerRef.current || autoRotate) return

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging || !isHovering) return

      const rect = containerRef.current!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Normalizar coordenadas (0-1)
      const normalizedX = x / rect.width
      const normalizedY = y / rect.height

      // Convertir a ángulos (-15 a 15 grados)
      const rotX = 15 - normalizedY * 30
      const rotY = -15 + normalizedX * 30

      setRotation((prev) => ({
        x: rotX,
        y: rotY,
        z: prev.z,
      }))
    }

    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isHovering, isDragging, autoRotate])

  // Animación de rotación automática
  useEffect(() => {
    if (!cardRef.current) return

    let animationId: number
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const floatY = Math.sin(elapsed / 1000) * 5 // Movimiento suave arriba y abajo

      if (cardRef.current) {
        let currentRotation = { ...rotationRef.current }

        // Si está en modo de rotación automática, incrementar la rotación Y suavemente
        if (autoRotate) {
          currentRotation = {
            ...currentRotation,
            y: currentRotation.y + 0.2, // Rotación más suave
            x: 5 + Math.sin(elapsed / 3000) * 3, // Leve inclinación
          }

          // Actualizar la referencia sin causar re-renderizados
          rotationRef.current = currentRotation
        }

        // Aplicar transformaciones directamente al DOM
        cardRef.current.style.transform = `
          rotateX(${currentRotation.x % 360}deg)
          rotateY(${currentRotation.y % 360}deg)
          rotateZ(${currentRotation.z % 360}deg)
          translateY(${floatY}px)
        `
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      // Sincronizar el estado con la referencia al desmontar
      if (autoRotate) {
        setRotation(rotationRef.current)
      }
    }
  }, [autoRotate])

  // Función para ver el reverso
  const showBack = () => {
    setRotation((prev) => ({
      ...prev,
      y: prev.y + 180,
    }))
  }

  // Color base para los bordes
  const edgeColor = "#002233"  
  const highlightColor = "rgba(0, 255, 204, 0.3)"

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div
        ref={containerRef}
        className="relative w-full h-full max-w-[300px] max-h-[480px] mx-auto cursor-grab active:cursor-grabbing touch-manipulation"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: "1500px",
        }}
      >
        {/* Efecto de luz ambiental */}
        <div
          className="absolute inset-0 bg-gradient-radial from-[#00ffcc10] to-transparent opacity-0 transition-opacity duration-1000"
          style={{ opacity: isHovering ? 0.5 : 0 }}
        />

        <div
          ref={cardRef}
          className="w-full h-full transition-all duration-700 ease-out relative"
          style={{
            transformStyle: "preserve-3d",
            borderRadius: "16px",
            boxShadow: isHovering
              ? "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 255, 204, 0.2)"
              : "0 10px 30px rgba(0, 0, 0, 0.5)",
            transition: "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease-out",
          }}
        >
          {/* Capa base para toda la tarjeta */}
          <div
            className="absolute inset-0"
            style={{
              background: edgeColor,
              borderRadius: "16px",
              transform: "translateZ(0)",
            }}
          />

          {/* Front */}
          <div
            className="absolute w-full h-full overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: `translateZ(${cardThickness / 2}px)`,
              borderRadius: "16px",
              transition: "all 0.5s ease-out",
            }}
          >
            {/* Gradiente de fondo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#001219] to-[#005f73] opacity-20" />

            {/* Imagen principal */}
            <Image
              src={frontImage || "/placeholder.svg"}
              alt="Card front"
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              priority
              style={{
                objectFit: "cover",
                borderRadius: "16px",
                filter: "contrast(1.05) saturate(1.1)",
              }}
            />

            {/* Overlay de brillo holográfico */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#00ffcc15] to-transparent opacity-0 transition-opacity duration-500"
              style={{
                opacity: isHovering ? 0.7 : 0,
                backgroundSize: "200% 200%",
                animation: "moveGradient 3s ease infinite alternate",
              }}
            />

            {/* Borde interno */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: "16px",
                border: `1px solid ${highlightColor}`,
                boxShadow: "inset 0 0 10px rgba(0, 255, 204, 0.1)",
              }}
            />
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: `rotateY(180deg) translateZ(${cardThickness / 2}px)`,
              borderRadius: "16px",
              transition: "all 0.5s ease-out",
            }}
          >
            {/* Gradiente de fondo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#001219] to-[#005f73] opacity-20" />

            {/* Imagen principal */}
            <Image
              src={backImage || "/placeholder.svg"}
              alt="Card back"
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              priority
              style={{
                objectFit: "cover",
                borderRadius: "16px",
                filter: "contrast(1.05) saturate(1.1)",
              }}
            />

            {/* Overlay de brillo holográfico */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#00ffcc15] to-transparent opacity-0 transition-opacity duration-500"
              style={{
                opacity: isHovering ? 0.7 : 0,
                backgroundSize: "200% 200%",
                animation: "moveGradient 3s ease infinite alternate",
              }}
            />

            {/* Borde interno */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: "16px",
                border: `1px solid ${highlightColor}`,
                boxShadow: "inset 0 0 10px rgba(0, 255, 204, 0.1)",
              }}
            />
          </div>

          {/* Efecto de brillo en los bordes - Frente */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(0, 255, 204, 0.3) 0%, transparent 50%, rgba(0, 255, 204, 0.3) 100%)",
              transform: `translateZ(${cardThickness / 2 + 0.1}px)`,
              borderRadius: "16px",
              opacity: isHovering ? 0.8 : 0.3,
              transition: "opacity 0.5s ease-out",
            }}
          />

          {/* Efecto de brillo en los bordes - Reverso */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(0, 255, 204, 0.3) 0%, transparent 50%, rgba(0, 255, 204, 0.3) 100%)",
              transform: `rotateY(180deg) translateZ(${cardThickness / 2 + 0.1}px)`,
              borderRadius: "16px",
              opacity: isHovering ? 0.8 : 0.3,
              transition: "opacity 0.5s ease-out",
            }}
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="px-4 py-2 bg-[#005f73] hover:bg-[#0a9396] rounded-md text-white text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(0,255,204,0.3)]"
        >
          {autoRotate ? "Detener rotación" : "Rotación automática"}
        </button>

        <button
          onClick={showBack}
          className="px-4 py-2 bg-[#003d4d] hover:bg-[#005f73] rounded-md text-white text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(0,255,204,0.3)]"
        >
          Ver Reverso
        </button>
      </div>

      <style jsx global>{`
        @keyframes moveGradient {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
      `}</style>
    </div>
  )
}

