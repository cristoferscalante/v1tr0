"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { useTheme } from "@/components/theme-provider"

interface BokehBackgroundProps {
  style?: React.CSSProperties
}

interface Particle {
  x: number
  y: number
  radius: number
  color: string
  vx: number
  vy: number
  opacity: number
}

const BokehBackground = ({ style = undefined }: BokehBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) { return }
    const ctx = canvas.getContext("2d")
    if (!ctx) { return }

    const resizeCanvas = () => {
      if (!ctx) { return }
      canvas.width = innerWidth
      canvas.height = innerHeight
    }

    // Configurar el tamaño inicial y agregar listener para redimensionar
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Configuración de partículas
    const particles: Particle[] = []
    const particleCount = 70 // Aumentar la cantidad de partículas

    // Colores según el tema
    const particleColors = isDark
      ? ["rgba(38, 255, 223, 0.6)", "rgba(8, 166, 150, 0.6)", "rgba(2, 81, 89, 0.6)"]
      : ["rgba(200, 240, 235, 0.25)", "rgba(180, 230, 225, 0.22)", "rgba(160, 220, 215, 0.2)"] // Colores extremadamente claros para modo claro

    // Crear partículas iniciales
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 2 + Math.random() * 3, // Aumentar el tamaño para mayor visibilidad
        color: particleColors[Math.floor(Math.random() * particleColors.length)] || "rgba(38, 255, 223, 0.6)",
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: 0.3 + Math.random() * 0.5, // Aumentar la opacidad base
      })
    }

    // Función de animación
    let animationFrameId: number
    const animate = () => {
      // Limpiar el canvas con un fondo semi-transparente para crear efecto de desvanecimiento
      ctx.clearRect(0, 0, canvas.width, canvas.height) // Limpiar completamente el canvas

      // Dibujar y actualizar partículas
      particles.forEach((particle) => {
        // Actualizar posición
        particle.x += particle.vx
        particle.y += particle.vy

        // Manejar rebote en los bordes
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx = -particle.vx
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy = -particle.vy
        }

        // Dibujar partícula
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // Dibujar brillo suave (opcional)
        const glow = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius * 3)
        glow.addColorStop(0, particle.color)
        glow.addColorStop(1, "transparent")

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    // Iniciar animación
    animate()

    // Limpiar al desmontar
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isDark])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.7, // Aumentar la opacidad para mayor visibilidad
        ...style,
      }}
      aria-hidden="true"
    />
  )
}

export default BokehBackground
