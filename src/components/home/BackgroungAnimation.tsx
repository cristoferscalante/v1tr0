"use client"

import type React from "react"
import { useEffect, useRef } from "react"

const BackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let lastTime = 0
    const fps = 30
    const interval = 1000 / fps

    const fontSize = 30
    let columns: number, rows: number
    let background: string[][] = []

    let lightX = window.innerWidth / 2
    let lightY = window.innerHeight / 2
    let targetX = lightX
    let targetY = lightY
    let lastMouseMoveTime = 0

    const easeAmount = 0.1
    const targetFillRatio = 0.5 // Objetivo de 70% de celdas llenas

    function createBackground() {
      columns = Math.floor(window.innerWidth / fontSize)
      rows = Math.floor(window.innerHeight / fontSize)
      background = Array.from({ length: columns }, () =>
        Array.from({ length: rows }, () => (Math.random() < targetFillRatio ? (Math.random() > 0.5 ? "1" : "0") : " ")),
      )
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      createBackground()
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    const draw = (currentTime: number) => {
      if (currentTime - lastTime < interval) {
        animationFrameId = requestAnimationFrame(draw)
        return
      }

      ctx.fillStyle = "rgba(15, 15, 16, 0.9)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px 'Alexandria', monospace`
      ctx.textAlign = "center"

      lightX += (targetX - lightX) * easeAmount
      lightY += (targetY - lightY) * easeAmount

      if (currentTime - lastMouseMoveTime > 200) {
        targetX += (Math.random() - 0.4) * 30
        targetY += (Math.random() - 0.4) * 30
        targetX = Math.max(0, Math.min(canvas.width, targetX))
        targetY = Math.max(0, Math.min(canvas.height, targetY))
      }

      let filledCells = 0
      const totalCells = columns * rows

      for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
          const distanceToLight = Math.hypot(lightX - x * fontSize, lightY - y * fontSize)
          const brightness = Math.max(1 - distanceToLight / 300, 0) * 0.1 // Aumentado el brillo base

          if (Math.random() < 0.01) {
            if (background[x][y] !== " ") {
              background[x][y] = " "
            } else {
              background[x][y] = Math.random() > 0.5 ? "1" : "0"
            }
          }

          if (background[x][y] !== " ") {
            filledCells++
          }

          ctx.fillStyle = `rgba(38, 255, 223, ${brightness})`
          ctx.fillText(background[x][y], x * fontSize + fontSize / 2, (y + 1) * fontSize)
        }
      }

      // Ajustar el equilibrio si es necesario
      const currentFillRatio = filledCells / totalCells
      if (Math.abs(currentFillRatio - targetFillRatio) > 0.05) {
        for (let x = 0; x < columns; x++) {
          for (let y = 0; y < rows; y++) {
            if (Math.random() < 0.1) {
              if (currentFillRatio < targetFillRatio && background[x][y] === " ") {
                background[x][y] = Math.random() > 0.5 ? "1" : "0"
              } else if (currentFillRatio > targetFillRatio && background[x][y] !== " ") {
                background[x][y] = " "
              }
            }
          }
        }
      }

      lastTime = currentTime
      animationFrameId = requestAnimationFrame(draw)
    }

    const handleMouseMove = (event: MouseEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      lastMouseMoveTime = performance.now()
    }

    window.addEventListener("mousemove", handleMouseMove)
    animationFrameId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#0b0b0c",
        zIndex: -1,
        fontFamily: "Alexandria, monospace",
      }}
    />
  )
}

export default BackgroundAnimation

