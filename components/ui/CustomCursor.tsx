"use client"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "@/components/theme-provider"

export default function CustomCursor() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const cursorRef = useRef<HTMLDivElement>(null)
  const centerDotRef = useRef<HTMLDivElement>(null)
  const clickTextRef = useRef<HTMLDivElement>(null)
  const [, setIsClicked] = useState(false)
  const [, setIsHovering] = useState(false)
  const [showClickText, setShowClickText] = useState(false)
  
  // Color principal según el tema
  const cursorColor = isDark ? "#26FFDF" : "#08A696"

  useEffect(() => {
    const cursor = cursorRef.current
    
    if (!cursor) { return; }
    
    // Función para actualizar la posición del cursor
    const updateCursorPosition = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
      
      // Actualizar también el punto central
      if (centerDotRef.current) {
        centerDotRef.current.style.left = `${e.clientX}px`
        centerDotRef.current.style.top = `${e.clientY}px`
      }
    }
    
    // Función para manejar el clic
    const handleClick = (e: MouseEvent) => {
      setIsClicked(true)
      
      // Mostrar el texto de clic
      if (clickTextRef.current) {
        clickTextRef.current.style.left = `${e.clientX}px`
        clickTextRef.current.style.top = `${e.clientY - 20}px`
        setShowClickText(true)
        
        // Ocultar el texto después de la animación
        setTimeout(() => setShowClickText(false), 1000)
      }
      
      // Restablecer el estado después de la animación
      setTimeout(() => setIsClicked(false), 1000)
    }
    
    // Detectar cuando el cursor está sobre elementos interactivos
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = [
        'A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'
      ].includes(target.tagName) || 
      target.hasAttribute('role') || 
      target.classList.contains('cursor-pointer')
      
      setIsHovering(isInteractive)
    }
    
    // Agregar event listeners
    document.addEventListener('mousemove', updateCursorPosition)
    document.addEventListener('click', handleClick)
    document.addEventListener('mouseover', handleMouseOver)
    
    // Limpiar event listeners
    return () => {
      document.removeEventListener('mousemove', updateCursorPosition)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [isDark])
  
  return (
    <>
      {/* Estilos para las animaciones */}
      <style jsx global>{`
        body {
          cursor: auto;
        }
        
        a, button, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"]) {
          cursor: pointer;
        }
        
        @keyframes pulseEffect {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.9;
          }
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
        }
        
        @keyframes floatUp {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-30px);
            opacity: 0;
          }
        }
      `}</style>
      
      {/* Cursor nativo del sistema - sin elementos personalizados */}
      
      {/* Texto de clic */}
      <div
        ref={clickTextRef}
        className="fixed pointer-events-none z-[9999] transform -translate-x-1/2 font-bold text-xs"
        style={{
          color: cursorColor,
          textShadow: `0 0 5px ${cursorColor}`,
          opacity: showClickText ? 1 : 0,
          animation: showClickText ? 'floatUp 1s ease-out forwards' : 'none',
        }}
      >
        ¡Click!
      </div>
    </>
  )
}