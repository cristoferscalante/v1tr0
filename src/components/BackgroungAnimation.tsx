'use client'

import React, { useEffect, useRef } from 'react'

const BackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    const fontSize = 50
    const columns = Math.floor(canvas.width / fontSize)
    const rows = Math.floor(canvas.height / fontSize)
    const background: string[][] = []

    // Create static background of numbers
    for (let x = 0; x < columns; x++) {
      background[x] = []
      for (let y = 0; y < rows; y++) {
        background[x][y] = Math.random() > 0.5 ? '1' : '0'
      }
    }

    // Variables for the "lighting" effect
    let lightX = 0
    let lightY = 0
    let lightSpeedX = 2
    let lightSpeedY = 1.5

    const draw = () => {
      // Semi-transparent gradient background
      ctx.fillStyle = '#0f0f10' 
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add subtle tones in the corners
      const gradientTopLeft = ctx.createRadialGradient(0, 0, 50, 0, 0, 300)
      gradientTopLeft.addColorStop(0, 'rgba(2, 81, 89, 0.1)') // Using Color 2
      gradientTopLeft.addColorStop(1, 'rgba(2, 81, 89, 0)')
      ctx.fillStyle = gradientTopLeft
      ctx.fillRect(0, 0, 300, 300)

      const gradientTopRight = ctx.createRadialGradient(canvas.width, 0, 50, canvas.width, 0, 300)
      gradientTopRight.addColorStop(0, 'rgba(8, 166, 150, 0.1)') // Using Color 3
      gradientTopRight.addColorStop(1, 'rgba(8, 166, 150, 0)')
      ctx.fillStyle = gradientTopRight
      ctx.fillRect(canvas.width - 300, 0, 300, 300)

      ctx.font = `${fontSize}px monospace`

      // Draw the static background with a more subtle vertical gradient
      for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
          const distanceToLight = Math.hypot(lightX - x * fontSize, lightY - (y + 1) * fontSize)
          
          let brightness = Math.max(1 - (distanceToLight / 350), 0)
          brightness = Math.min(brightness * 0.07, 0.1)

          const backgroundOpacity = 1 - (y / rows)
          const finalOpacity = backgroundOpacity * 0.02 + brightness

          ctx.fillStyle = `rgba(38, 255, 223, ${finalOpacity})` // Using Color 4 (Oficial)
          ctx.fillText(background[x][y], x * fontSize, (y + 1) * fontSize)
        }
      }

      // Update the "flashlight" position
      lightX += lightSpeedX
      lightY += lightSpeedY

      // If the flashlight reaches the edge, change direction
      if (lightX > canvas.width || lightX < 0) lightSpeedX *= -1
      if (lightY > canvas.height || lightY < 0) lightSpeedY *= -1
    }

    const animate = () => {
      draw()
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#0f0f10', 
        zIndex: -1,
      }}
    />
  )
}

export default BackgroundAnimation

