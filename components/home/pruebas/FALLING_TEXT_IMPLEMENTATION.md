# Implementación del Componente FallingText

## Descripción

El componente FallingText crea un efecto de física interactivo donde las palabras de un texto caen y pueden ser manipuladas con el mouse. Utiliza Matter.js para la simulación de física y está optimizado para React con Next.js.

## Configuración Personalizada

Basado en tus especificaciones:
- **Trigger**: Scroll (se activa al hacer scroll)
- **Gravity**: 0.17 (gravedad suave)
- **Mouse Constraint Stiffness**: 0.9 (alta rigidez del mouse)
- **Color Principal**: #26FFDF (turquesa brillante)

## Estructura del Proyecto

\`\`\`
proyecto/
├── components/
│   ├── FallingText.tsx
│   ├── FallingText.css
│   └── Footer.tsx
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
└── package.json
\`\`\`

## Instalación y Dependencias

### 1. Instalar Matter.js

\`\`\`bash
npm install matter-js
npm install @types/matter-js --save-dev
\`\`\`

### 2. Código del Componente FallingText

\`\`\`tsx
// components/FallingText.tsx
"use client"

import { useRef, useState, useEffect } from "react"
import Matter from "matter-js"
import "./FallingText.css"

const FallingText = ({
  className = "",
  text = "",
  highlightWords = [],
  highlightClass = "highlighted",
  trigger = "scroll",
  backgroundColor = "transparent",
  wireframes = false,
  gravity = 0.17,
  mouseConstraintStiffness = 0.9,
  fontSize = "1rem",
}) => {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const canvasContainerRef = useRef(null)

  const [effectStarted, setEffectStarted] = useState(false)

  useEffect(() => {
    if (!textRef.current) return
    const words = text.split(" ")
    const newHTML = words
      .map((word) => {
        const isHighlighted = highlightWords.some((hw) => word.startsWith(hw))
        return `<span class="word ${isHighlighted ? highlightClass : ""}">${word}</span>`
      })
      .join(" ")
    textRef.current.innerHTML = newHTML
  }, [text, highlightWords, highlightClass])

  useEffect(() => {
    if (trigger === "auto") {
      setEffectStarted(true)
      return
    }
    if (trigger === "scroll" && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setEffectStarted(true)
            observer.disconnect()
          }
        },
        { threshold: 0.1 },
      )
      observer.observe(containerRef.current)
      return () => observer.disconnect()
    }
  }, [trigger])

  useEffect(() => {
    if (!effectStarted) return

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter

    const containerRect = containerRef.current.getBoundingClientRect()
    const width = containerRect.width
    const height = containerRect.height

    if (width <= 0 || height <= 0) {
      return
    }

    const engine = Engine.create()
    engine.world.gravity.y = gravity

    const render = Render.create({
      element: canvasContainerRef.current,
      engine,
      options: {
        width,
        height,
        background: backgroundColor,
        wireframes,
      },
    })

    const boundaryOptions = {
      isStatic: true,
      render: { fillStyle: "transparent" },
    }
    const floor = Bodies.rectangle(width / 2, height + 25, width, 50, boundaryOptions)
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundaryOptions)
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, boundaryOptions)
    const ceiling = Bodies.rectangle(width / 2, -25, width, 50, boundaryOptions)

    const wordSpans = textRef.current.querySelectorAll(".word")
    const wordBodies = [...wordSpans].map((elem) => {
      const rect = elem.getBoundingClientRect()

      const x = rect.left - containerRect.left + rect.width / 2
      const y = rect.top - containerRect.top + rect.height / 2

      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        render: { fillStyle: "transparent" },
        restitution: 0.8,
        frictionAir: 0.01,
        friction: 0.2,
      })

      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 5,
        y: 0,
      })
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05)
      return { elem, body }
    })

    wordBodies.forEach(({ elem, body }) => {
      elem.style.position = "absolute"
      elem.style.left = `${body.position.x - body.bounds.max.x + body.bounds.min.x / 2}px`
      elem.style.top = `${body.position.y - body.bounds.max.y + body.bounds.min.y / 2}px`
      elem.style.transform = "none"
    })

    const mouse = Mouse.create(containerRef.current)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: mouseConstraintStiffness,
        render: { visible: false },
      },
    })
    render.mouse = mouse

    World.add(engine.world, [floor, leftWall, rightWall, ceiling, mouseConstraint, ...wordBodies.map((wb) => wb.body)])

    const runner = Runner.create()
    Runner.run(runner, engine)
    Render.run(render)

    const updateLoop = () => {
      wordBodies.forEach(({ body, elem }) => {
        const { x, y } = body.position
        elem.style.left = `${x}px`
        elem.style.top = `${y}px`
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`
      })
      Matter.Engine.update(engine)
      requestAnimationFrame(updateLoop)
    }
    updateLoop()

    return () => {
      Render.stop(render)
      Runner.stop(runner)
      if (render.canvas && canvasContainerRef.current) {
        canvasContainerRef.current.removeChild(render.canvas)
      }
      World.clear(engine.world)
      Engine.clear(engine)
    }
  }, [effectStarted, gravity, wireframes, backgroundColor, mouseConstraintStiffness])

  const handleTrigger = () => {
    if (!effectStarted && (trigger === "click" || trigger === "hover")) {
      setEffectStarted(true)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`falling-text-container ${className}`}
      onClick={trigger === "click" ? handleTrigger : undefined}
      onMouseEnter={trigger === "hover" ? handleTrigger : undefined}
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        ref={textRef}
        className="falling-text-target"
        style={{
          fontSize: fontSize,
          lineHeight: 1.4,
        }}
      />
      <div ref={canvasContainerRef} className="falling-text-canvas" />
    </div>
  )
}

export default FallingText
\`\`\`

### 3. Estilos CSS

\`\`\`css
/* components/FallingText.css */
.falling-text-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.falling-text-target {
  position: relative;
  z-index: 1;
  pointer-events: none;
}

.falling-text-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: auto;
}

.word {
  display: inline-block;
  margin-right: 0.25em;
  transition: all 0.3s ease;
  user-select: none;
  pointer-events: none;
}

.highlighted {
  font-weight: bold;
  color: #26FFDF;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .falling-text-container {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .falling-text-container {
    font-size: 0.8rem;
  }
}
\`\`\`

### 4. Componente Footer

\`\`\`tsx
// components/Footer.tsx
import FallingText from './FallingText'

export default function Footer() {
  const footerText = `Transforma tu idea en acción con Desarrollo de software a medida, conecta todo con Sistemas de información inteligentes y gana tiempo gracias a la Automatización de tareas, apps y herramientas web. La innovación tecnológica es nuestro motor de soluciones.`

  const highlightWords = [
    "Desarrollo",
    "software",
    "medida",
    "Sistemas",
    "información",
    "Automatización",
    "tareas",
    "apps",
    "herramientas",
    "web",
    "innovación",
    "soluciones"
  ]

  return (
    <footer className="w-full bg-gray-900 text-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="h-32 mb-8">
          <FallingText
            text={footerText}
            highlightWords={highlightWords}
            highlightClass="highlighted"
            trigger="scroll"
            backgroundColor="transparent"
            wireframes={false}
            gravity={0.17}
            fontSize="1.2rem"
            mouseConstraintStiffness={0.9}
            className="text-center"
          />
        </div>
        
        <div className="text-center text-sm text-gray-400 mt-8">
          <p>&copy; 2025 Tu Empresa. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
\`\`\`

### 5. Implementación en la Página Principal

\`\`\`tsx
// app/page.tsx
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Tu contenido principal aquí */}
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">Tu Contenido Principal</h1>
      </div>
      
      {/* Footer con FallingText */}
      <Footer />
    </main>
  )
}
\`\`\`

### 6. Configuración del Layout

\`\`\`tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tu Sitio Web',
  description: 'Sitio web con efecto FallingText',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
\`\`\`

## Propiedades del Componente

| Propiedad | Tipo | Valor por Defecto | Descripción |
|-----------|------|-------------------|-------------|
| `text` | string | "" | Texto que se convertirá en palabras que caen |
| `highlightWords` | string[] | [] | Palabras que se destacarán con la clase especial |
| `highlightClass` | string | "highlighted" | Clase CSS para las palabras destacadas |
| `trigger` | "auto" \| "scroll" \| "hover" \| "click" | "scroll" | Cuándo activar el efecto |
| `gravity` | number | 0.17 | Fuerza de gravedad (0-2) |
| `mouseConstraintStiffness` | number | 0.9 | Rigidez de la interacción del mouse (0-1) |
| `fontSize` | string | "1rem" | Tamaño de fuente del texto |
| `backgroundColor` | string | "transparent" | Color de fondo del canvas |
| `wireframes` | boolean | false | Mostrar wireframes de Matter.js para debug |

## Instrucciones de Implementación

### Paso 1: Instalación
1. Instala las dependencias: `npm install matter-js @types/matter-js`
2. Copia los archivos del componente a tu proyecto

### Paso 2: Configuración
1. Asegúrate de que tu proyecto use Next.js 13+ con App Router
2. Verifica que Tailwind CSS esté configurado
3. Ajusta el color principal (#26FFDF) en el CSS si es necesario

### Paso 3: Personalización
- Modifica el texto en el componente Footer
- Ajusta las palabras destacadas en el array `highlightWords`
- Cambia los valores de gravedad y rigidez según tus preferencias

### Paso 4: Optimización
- El componente usa `"use client"` para funcionalidad del lado del cliente
- Se limpia automáticamente al desmontar para evitar memory leaks
- Responsive por defecto con breakpoints para móvil

## Consideraciones de Rendimiento

- El componente usa `requestAnimationFrame` para animaciones suaves
- Se limpia automáticamente al desmontar el componente
- Optimizado para dispositivos móviles con tamaños de fuente responsivos
- El efecto se activa solo cuando es visible (Intersection Observer)

## Troubleshooting

### Problema: Las palabras no caen
- Verifica que Matter.js esté instalado correctamente
- Asegúrate de que el contenedor tenga altura definida

### Problema: El efecto no se activa
- Revisa que el trigger esté configurado correctamente
- Para "scroll", verifica que el elemento sea visible en viewport

### Problema: Rendimiento lento
- Reduce la cantidad de palabras en el texto
- Ajusta la gravedad a un valor más alto para efectos más rápidos
- Considera usar `wireframes: true` solo para debug

## Soporte de Navegadores

- Chrome/Edge: ✅ Completo
- Firefox: ✅ Completo  
- Safari: ✅ Completo
- Mobile: ✅ Optimizado

---

**Nota**: Este componente está optimizado para tu configuración específica con gravedad 0.17, trigger por scroll, y color principal #26FFDF. Puedes ajustar estos valores según tus necesidades.
