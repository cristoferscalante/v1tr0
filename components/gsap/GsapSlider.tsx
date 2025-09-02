"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { Observer } from "gsap/Observer"
import BackgroundAnimation from "@/components/home/BackgroundAnimation"

gsap.registerPlugin(Observer)

interface SlideExample {
  title: string;
  bgColor?: string;
  url?: string;
  img?: string;
  video?: string;
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
    img: "/images/alcaldia_contractual.png",
    video: "/videos/demo-contractual.mp4"
  },
  {
    title: "Análisis de Datos",
    bgColor: "#06414D",
    url: "/portfolio/ejemplo-2",
    img: "/service/analisis-de-datos.png",
    video: "/videos/demo-analytics.mp4"
  },
  {
    title: "Gestión de Proyectos",
    bgColor: "#025159",
    url: "/portfolio/ejemplo-3",
    img: "/service/gestion-de-proyectos.png"
  },
  {
    title: "Consultoría Estratégica",
    bgColor: "#D9D9D9",
    url: "/portfolio/ejemplo-4",
    img: "/service/consultoria-estrategica.png"
  },
  {
    title: "Inteligencia Artificial",
    bgColor: "#1E1E1E",
    url: "/portfolio/ejemplo-5",
    img: "/service/inteligencia-artificial.png",
    video: "/videos/demo-ai.mp4"
  }
];

export default function GsapSlider({ title = "Portafolio", examples = defaultExamples }: GsapSliderProps) {
  // Referencias para los elementos DOM que GSAP manipulará
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  const outerWrappersRef = useRef<(HTMLElement | null)[]>([])
  const innerWrappersRef = useRef<(HTMLElement | null)[]>([])
  const countRef = useRef<HTMLSpanElement | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

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

  // Función para gestionar la carga optimizada de videos
  const updateVideoLoading = useCallback((activeIndex: number) => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === activeIndex) {
          // Video activo: carga completa y reproduce si es necesario
          video.preload = 'auto'
          video.load() // Fuerza la recarga con la nueva configuración
        } else {
          // Videos inactivos: solo metadata
          video.preload = 'metadata'
          video.pause() // Pausa videos que no están activos
        }
      }
    })
  }, [])

  // Función central que maneja la lógica de la animación de transición entre diapositivas
  const gotoSection = useCallback(
    (index: number, direction: number) => {
      if (animating.current) { return }
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
      if (sections[currentIndex]) {
        gsap.set(sections[currentIndex]!, { zIndex: 1, autoAlpha: 1 }) // Muestra la actual
      }
      if (sections[index]) {
        gsap.set(sections[index]!, { zIndex: 2, autoAlpha: 1 }) // Pone la siguiente en primer plano
      }

      if (count) {
        tl.set(count, { textContent: index + 1 }, 0.32) // Actualiza el contador de diapositivas
      }
      
      if (outerWrappers[index]) {
        tl.fromTo(
            outerWrappers[index]!,
            { xPercent: 100 * direction },
            { xPercent: 0 },
            0,
          ) // Desplaza el contenedor exterior de la siguiente diapositiva
      }
      
      if (innerWrappers[index]) {
        tl.fromTo(
            innerWrappers[index]!,
            { xPercent: -100 * direction },
            { xPercent: 0 },
            0,
          ) // Desplaza el contenedor interior de la siguiente diapositiva
      }
      
      if (heading) {
        tl.to(
            heading,
            { "--width": 800, xPercent: 30 * direction },
            0,
          ) // Anima el título de la diapositiva actual
      }
      
      if (nextHeading) {
        tl.fromTo(
            nextHeading,
            { "--width": 800, xPercent: -30 * direction },
            { "--width": 200, xPercent: 0 },
            0,
          ) // Anima el título de la siguiente diapositiva
      }

      tl.timeScale(0.8) // Ajusta la velocidad de la línea de tiempo

      setCurrentIndex(index)
      // Actualizar la carga de videos después de la transición
      updateVideoLoading(index)
    },
    [currentIndex, updateVideoLoading]
  )

  // Configuración del Observer para la navegación
  useEffect(() => {
    let observer: Observer | null = null

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
      if (observer) { observer.kill() }
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

  // Inicializar la carga optimizada de videos al montar el componente
  useEffect(() => {
    // Pequeño delay para asegurar que los videos estén en el DOM
    const timer = setTimeout(() => {
      updateVideoLoading(currentIndex)
    }, 100)

    return () => clearTimeout(timer)
  }, [currentIndex, updateVideoLoading])

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
                    <>
                      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90"></div>
                      <div className="relative z-20 flex flex-col items-center justify-center h-full px-8 pt-24">
                        {/* Video Container con más espacio y margen superior para evitar navbar */}
                        <div className="w-full max-w-5xl mx-auto mb-12 mt-8">
                          <video 
                            ref={(el) => { videoRefs.current[index] = el }}
                            src={slide.video} 
                            controls 
                            preload={index === currentIndex ? 'auto' : 'metadata'}
                            className="max-w-[80vh] h-auto max-h-[30vh] md:max-h-[35vh] lg:max-h-[45vh] max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] mx-auto rounded-2xl shadow-2xl border-2 border-[#26FFDF]/40 hover:border-[#26FFDF]/60 transition-all duration-300"
                            poster={slide.img}
                            onLoadStart={() => {
                              // Asegurar que solo el video activo se carga completamente
                              if (index !== currentIndex && videoRefs.current[index]) {
                                videoRefs.current[index]!.preload = 'metadata'
                              }
                            }}
                          >
                            Tu navegador no soporta el elemento de video.
                          </video>
                        </div>
                        
                        {/* Título con más espacio */}
                        <div className="text-center mb-16">
                          <h2 
                            className="slide__heading text-5xl md:text-7xl font-bold text-white relative z-10"
                            style={{ '--width': '200px' } as React.CSSProperties}
                          >
                            {slide.title}
                          </h2>
                          <div className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                            <p>Soluciones tecnológicas innovadoras diseñadas</p>
                            <p>para optimizar y transformar tu negocio</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : slide.img && (
                    <>
                      <Image src={slide.img} alt={slide.title} fill className="object-cover opacity-40" />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/40"></div>
                    </>
                  )}
                  {!slide.video && (
                    <h2 
                      className="slide__heading text-6xl md:text-8xl font-bold text-white mb-8 relative z-10"
                      style={{ '--width': '200px' } as React.CSSProperties}
                    >
                      {slide.title}
                    </h2>
                  )}
                  {slide.url && (
                    <div className="fixed bottom-8 right-8 z-50">
                      <a 
                        href={slide.url}
                        className="group relative bg-[#02505931] backdrop-blur-sm rounded-2xl border border-[#26FFDF]/20 transition-all duration-300 hover:border-[#26FFDF] hover:bg-[#02505950] inline-flex items-center px-8 py-4 text-lg font-semibold hover:scale-105 shadow-[0_0_30px_rgba(38,255,223,0.3)] hover:shadow-[0_0_40px_rgba(38,255,223,0.5)]"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#26FFDF]/10 to-[#08A696]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10 text-white">Conócelo más</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 ml-3 text-[#26FFDF] group-hover:translate-x-1 transition-transform duration-300"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                      </a>
                    </div>
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


    </div>
  )
}