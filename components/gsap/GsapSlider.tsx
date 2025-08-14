"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { gsap } from "gsap"
import { Observer } from "gsap/Observer"
import BackgroundAnimation from "@/components/home/BackgroungAnimation"

gsap.registerPlugin(Observer)

interface SlideExample {
  title: string;
  bgColor?: string;
  url?: string;
  img?: string;
}

interface GsapSliderProps {
  title?: string;
  examples?: SlideExample[];
}

const defaultExamples: SlideExample[] = [
  {
    title: "Sistema de control contractual",
    bgColor: "#1E1E1E",
    url: "/portfolio/ejemplo-1",
    img: "/images/alcaldia_contractual.png"
  },
  {
    title: "Ejemplo 2",
    bgColor: "#06414D",
    url: "/portfolio/ejemplo-2",
    img: "/service/analisis-de-datos.png"
  },
  {
    title: "Ejemplo 3",
    bgColor: "#025159",
    url: "/portfolio/ejemplo-3",
    img: "/service/gestion-de-proyectos.png"
  },
  {
    title: "Ejemplo 4",
    bgColor: "#D9D9D9",
    url: "/portfolio/ejemplo-4",
    img: "/service/consultoria-estrategica.png"
  },
  {
    title: "Ejemplo 5",
    bgColor: "#1E1E1E",
    url: "/portfolio/ejemplo-5",
    img: "/service/inteligencia-artificial.png"
  }
];

export default function GsapSlider({ title = "Portafolio", examples = defaultExamples }: GsapSliderProps) {
  // Referencias para los elementos DOM que GSAP manipulará
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  const outerWrappersRef = useRef<(HTMLElement | null)[]>([])
  const innerWrappersRef = useRef<(HTMLElement | null)[]>([])
  const countRef = useRef<HTMLSpanElement | null>(null)

  // Estado para el índice de la sección actual
  const [currentIndex, setCurrentIndex] = useState(0)
  // Referencia mutable para el estado de la animación (evita re-renders innecesarios)
  const animating = useRef(false)

  // Datos de las diapositivas
  const slides = [
    {
      title: title,
    },
    ...examples
  ]

  // Función central que maneja la lógica de la animación de transición entre diapositivas
  const gotoSection = useCallback(
    (index: number, direction: number) => {
      if (animating.current) return
      animating.current = true

      const sections = sectionsRef.current
      const outerWrappers = outerWrappersRef.current
      const innerWrappers = innerWrappersRef.current
      const count = countRef.current

      const wrap = gsap.utils.wrap(0, sections.length) // Permite el bucle infinito
      index = wrap(index) // Ajusta el índice para que siempre esté dentro del rango

      const tl = gsap.timeline({
        defaults: { duration: 1, ease: "expo.inOut" },
        onComplete: () => {
          animating.current = false // Restablece la bandera al completar la animación
        },
      })

      const currentSection = sections[currentIndex]
      const heading = currentSection?.querySelector(".slide__heading")
      const nextSection = sections[index]
      const nextHeading = nextSection?.querySelector(".slide__heading")

      // Configuración inicial de visibilidad y z-index para la transición
      gsap.set(sections, { zIndex: 0, autoAlpha: 0 }) // Oculta todo
      gsap.set(sections[currentIndex], { zIndex: 1, autoAlpha: 1 }) // Muestra la actual
      gsap.set(sections[index], { zIndex: 2, autoAlpha: 1 }) // Pone la siguiente en primer plano

      tl.set(count, { text: index + 1 }, 0.32) // Actualiza el contador de diapositivas
        .fromTo(
          outerWrappers[index],
          { xPercent: 100 * direction },
          { xPercent: 0 },
          0,
        ) // Desplaza el contenedor exterior de la siguiente diapositiva
        .fromTo(
          innerWrappers[index],
          { xPercent: -100 * direction },
          { xPercent: 0 },
          0,
        ) // Desplaza el contenedor interior de la siguiente diapositiva
        .to(
          heading,
          { "--width": 800, xPercent: 30 * direction },
          0,
        ) // Anima el título de la diapositiva actual
        .fromTo(
          nextHeading,
          { "--width": 800, xPercent: -30 * direction },
          { "--width": 200, xPercent: 0 },
          0,
        ) // Anima el título de la siguiente diapositiva

        .timeScale(0.8) // Ajusta la velocidad de la línea de tiempo

      setCurrentIndex(index)
    },
    [currentIndex]
  )

  // Configuración del Observer para la navegación
  useEffect(() => {
    let observer: any

    const initObserver = () => {
      observer = Observer.create({
        type: "wheel,touch,pointer",
        wheelSpeed: -1,
        onDown: () => gotoSection(currentIndex - 1, -1),
        onUp: () => gotoSection(currentIndex + 1, 1),
        tolerance: 10,
        preventDefault: true
      })
    }

    // Inicializar después de un pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(initObserver, 100)

    return () => {
      clearTimeout(timer)
      if (observer) observer.kill()
    }
  }, [currentIndex, gotoSection])

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " " || e.key === "Enter") {
        e.preventDefault()
        gotoSection(currentIndex + 1, 1)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        gotoSection(currentIndex - 1, -1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, gotoSection])

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <section
          key={index}
          ref={(el) => { sectionsRef.current[index] = el }}
          className={`slide fixed top-0 left-0 w-full h-full ${index === 0 ? 'visible' : 'invisible'}`}
          style={{ zIndex: index === 0 ? 1 : 0 }}
        >
          <div 
            ref={(el) => { outerWrappersRef.current[index] = el }}
            className="slide__outer w-full h-full"
          >
            <div 
              ref={(el) => { innerWrappersRef.current[index] = el }}
              className="slide__inner w-full h-full"
            >
              <div 
                className="slide__content w-full h-full flex items-center justify-center relative"
                style={{ backgroundColor: slide.bgColor }}
              >
                {index === 0 && <BackgroundAnimation />}
                <div className="slide__container max-w-4xl mx-auto px-8 text-center">
                  {slide.video ? (
                    <video src={slide.video} autoPlay muted loop className="absolute inset-0 w-full h-full object-cover opacity-20" />
                  ) : slide.img && (
                    <img src={slide.img} alt={slide.title} className="absolute inset-0 w-full h-full object-cover opacity-20" />
                  )}
                  <h2 
                    className="slide__heading text-6xl md:text-8xl font-bold text-white mb-8"
                    style={{ '--width': '200px' } as any}
                  >
                    {slide.title}
                  </h2>
                  {slide.url && (
                    <a 
                      href={slide.url}
                      className="absolute bottom-8 right-8 bg-white/30 backdrop-blur-sm border border-white/40 text-white px-6 py-3 rounded-full font-bold transition-all duration-300 hover:bg-white/50 hover:scale-105 flex items-center space-x-2"
                    >
                      <span>Conócelo</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                    </a>
                  )}
 
                  </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Overlay con contador e imágenes de fondo */}
      <div className="overlay fixed top-0 left-0 w-full h-full pointer-events-none z-10">



      </div>

      {/* Instrucciones de navegación */}
      <div className="absolute bottom-8 left-8 text-white/70 text-sm pointer-events-none z-20">
        <p>Usa la rueda del ratón, teclas de flecha o gestos táctiles para navegar</p>
      </div>
    </div>
  )
}