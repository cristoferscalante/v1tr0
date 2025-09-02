"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { useTheme } from "@/components/theme-provider"

interface CharacterBackgroundProps {
  style?: React.CSSProperties
}

const CharacterBackground = ({ style = undefined }: CharacterBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) { return }

    const ctx = canvas.getContext("2d")
    if (!ctx) { return }

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Character configurations
    const characters: Array<{
      x: number
      y: number
      size: number
      vx: number
      vy: number
      rotation: number
      rotationSpeed: number
      opacity: number
      variant: "filled" | "outline"
      image: HTMLImageElement
    }> = []

    const numCharacters = 8

    // Create SVG character designs
    const createCharacterSVG = (variant: "filled" | "outline") => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
      svg.setAttribute("viewBox", "0 0 400 800")
      svg.setAttribute("width", "400")
      svg.setAttribute("height", "800")

      if (variant === "filled") {
        // Filled character with gradients and glow
        svg.innerHTML = `
          <defs>
            <radialGradient id="headGradient" cx="50%" cy="30%" r="70%">
              <stop offset="0%" style="stop-color:${isDark ? "#26ffdf" : "#08a696"};stop-opacity:0.9" />
              <stop offset="100%" style="stop-color:${isDark ? "#1a8a7a" : "#065a52"};stop-opacity:0.7" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/> 
              </feMerge>
            </filter>
          </defs>
          
          <!-- Head -->
          <circle cx="200" cy="150" r="120" fill="url(#headGradient)" filter="url(#glow)" />
          
          <!-- Eyes -->
          <rect x="120" y="120" width="50" height="30" rx="5" fill="${isDark ? "#000" : "#fff"}" />
          <rect x="230" y="120" width="50" height="30" rx="5" fill="${isDark ? "#000" : "#fff"}" />
          
          <!-- Body -->
          <rect x="150" y="270" width="100" height="180" rx="20" fill="url(#headGradient)" filter="url(#glow)" />
          
          <!-- Tentacles -->
          <ellipse cx="120" cy="500" rx="15" ry="120" fill="url(#headGradient)" filter="url(#glow)" />
          <ellipse cx="160" cy="520" rx="12" ry="140" fill="url(#headGradient)" filter="url(#glow)" />
          <ellipse cx="200" cy="530" rx="15" ry="150" fill="url(#headGradient)" filter="url(#glow)" />
          <ellipse cx="240" cy="520" rx="12" ry="140" fill="url(#headGradient)" filter="url(#glow)" />
          <ellipse cx="280" cy="500" rx="15" ry="120" fill="url(#headGradient)" filter="url(#glow)" />
          
          <!-- Tentacle ends -->
          <circle cx="120" cy="620" r="12" fill="url(#headGradient)" filter="url(#glow)" />
          <circle cx="160" cy="660" r="10" fill="url(#headGradient)" filter="url(#glow)" />
          <circle cx="200" cy="680" r="12" fill="url(#headGradient)" filter="url(#glow)" />
          <circle cx="240" cy="660" r="10" fill="url(#headGradient)" filter="url(#glow)" />
          <circle cx="280" cy="620" r="12" fill="url(#headGradient)" filter="url(#glow)" />
        `
      } else {
        // Outline character with glowing contours
        svg.innerHTML = `
          <defs>
            <filter id="outlineGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/> 
              </feMerge>
            </filter>
          </defs>
          
          <!-- Head outline -->
          <circle cx="200" cy="150" r="120" fill="none" stroke="${isDark ? "#26ffdf" : "#08a696"}" stroke-width="3" filter="url(#outlineGlow)" />
          
          <!-- Eyes outline -->
          <rect x="120" y="120" width="50" height="30" rx="5" fill="none" stroke="${isDark ? "#26ffdf" : "#08a696"}" stroke-width="2" filter="url(#outlineGlow)" />
          <rect x="230" y="120" width="50" height="30" rx="5" fill="none" stroke="${isDark ? "#26ffdf" : "#08a696"}" stroke-width="2" filter="url(#outlineGlow)" />
          
          <!-- Body outline -->
          <rect x="150" y="270" width="100" height="180" rx="20" fill="none" stroke="${isDark ? "#26ffdf" : "#08a696"}" stroke-width="3" filter="url(#outlineGlow)" />
          
          <!-- Tentacles outline -->
          <ellipse cx="120" cy="500" rx="15" ry="120" fill="none" stroke="${isDark ? "#26ffdf" : "#08a696"}" stroke-width="2" filter="url(#outlineGlow)" />
          <ellipse cx="160" cy="520" rx="12" ry="140" fill="none" stroke="${isDark ? "#26ffdf" : "#08a696"}" stroke-width="2" filter="url(#outlineGlow)" />
          <ellipse cx="200" cy="530" rx="15" ry="150" fill="none" stroke="${isDark ? "#26ffdf" : "#08a696"}" stroke-width="2" filter="url(#outlineGlow)" />
          <ellipse cx="240" cy="520" rx="12" ry="140" fill="none" stroke="${isDark ? "#26ffdf" : "#08a696"}" stroke-width="2" filter="url(#outlineGlow)" />
          <ellipse cx="280" cy="500" rx="15" ry="120" fill="none" stroke="${isDark ? "#26ffdf" : "#08a696"}" stroke-width="2" filter="url(#outlineGlow)" />
          
          <!-- Tentacle ends outline -->
          <circle cx="120" cy="620" r="12" fill="none" stroke="${isDark ? "#26ffdf" : "#08a696"}" stroke-width="2" filter="url(#outlineGlow)" />
          <circle cx="160" cy="660" r="10" fill="none" stroke="${isDark ? "#26ffdf" : "#08a696"}" stroke-width="2" filter="url(#outlineGlow)" />
          <circle cx="200" cy="680" r="12" fill="none" stroke="${isDark ? "#26ffdf" : "#08a696"}" stroke-width="2" filter="url(#outlineGlow)" />
          <circle cx="240" cy="660" r="10" fill="none" stroke="${isDark ? "#26ffdf" : "#08a696"}" stroke-width="2" filter="url(#outlineGlow)" />
          <circle cx="280" cy="620" r="12" fill="none" stroke="${isDark ? "#26ffdf" : "#08a696"}" stroke-width="2" filter="url(#outlineGlow)" />
        `
      }

      return svg
    }

    // Convert SVG to image
    const svgToImage = (svg: SVGElement): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const svgData = new XMLSerializer().serializeToString(svg)
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
        const url = URL.createObjectURL(svgBlob)
        
        const img = new Image()
        img.onload = () => {
          URL.revokeObjectURL(url)
          resolve(img)
        }
        img.src = url
      })
    }

    // Initialize characters
    const initCharacters = async () => {
      const filledSvg = createCharacterSVG("filled")
      const outlineSvg = createCharacterSVG("outline")
      
      const filledImage = await svgToImage(filledSvg)
      const outlineImage = await svgToImage(outlineSvg)

      for (let i = 0; i < numCharacters; i++) {
        const size = Math.random() * 60 + 40 // Size between 40-100
        const variant = Math.random() > 0.5 ? "filled" : "outline"
        
        characters.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          vx: (Math.random() - 0.5) * 0.5, // Slower movement
          vy: (Math.random() - 0.5) * 0.5,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
          opacity: Math.random() * 0.3 + 0.1, // Very subtle opacity
          variant,
          image: variant === "filled" ? filledImage : outlineImage
        })
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      characters.forEach((char) => {
        // Update position
        char.x += char.vx
        char.y += char.vy
        char.rotation += char.rotationSpeed

        // Bounce off edges
        if (char.x < -char.size || char.x > canvas.width + char.size) {
          char.vx *= -1
        }
        if (char.y < -char.size || char.y > canvas.height + char.size) {
          char.vy *= -1
        }

        // Keep within bounds
        char.x = Math.max(-char.size, Math.min(canvas.width + char.size, char.x))
        char.y = Math.max(-char.size, Math.min(canvas.height + char.size, char.y))

        // Draw character
        ctx.save()
        ctx.globalAlpha = char.opacity
        ctx.translate(char.x, char.y)
        ctx.rotate(char.rotation)
        
        // Draw with correct proportions (size * 2 for height)
        const drawWidth = char.size
        const drawHeight = char.size * 2
        
        ctx.drawImage(
          char.image,
          -drawWidth / 2,
          -drawHeight / 2,
          drawWidth,
          drawHeight
        )
        
        ctx.restore()
      })

      requestAnimationFrame(animate)
    }

    // Start animation
    initCharacters().then(() => {
      animate()
    })

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [isDark])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: -1,
        ...style,
      }}
    />
  )
}

export default CharacterBackground