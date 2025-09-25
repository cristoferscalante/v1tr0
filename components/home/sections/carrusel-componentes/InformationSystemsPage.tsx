"use client"

import React, { useRef } from "react"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRouter } from "next/navigation"

gsap.registerPlugin(ScrollTrigger)
import { BarChartIcon, PieChartIcon, TrendingUpIcon } from "@/lib/icons"

interface InformationSystemsPageProps {
  isActive?: boolean
}

export default function InformationSystemsPage({ isActive = false }: InformationSystemsPageProps) {
  const router = useRouter()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

   const serviceData = {
    title: "Sistemas de Información & Análisis de Datos",
    description: "Los datos son un activo estratégico. Comprenderlos, gestionarlos y convertirlos en decisiones estratégicas es lo que marca la diferencia.",
    features: [
      {
        icon: <BarChartIcon className="w-6 h-6" />,
        text: "Sistemas de gestión de datos institucionales, agenciales & comerciales.",
      },
      {
        icon: <PieChartIcon className="w-6 h-6" />,
        text: "Análisis avanzado & Visualización de estructuras de datos jerárquicas, relacionales, espaciales y temporales.",
      },
      {
        icon: <TrendingUpIcon className="w-6 h-6" />,
        text: "Diseño de dashboards e informes interactivos para la toma de decisiones.",
      },
    ],
    imageSrc: "/imagenes/home/carrusel/sistemas_de_informacion.png",
    imageAlt: "Analista de datos entusiasta con visualizaciones, gráficos y elementos de IA en estilo digital neón",

  }

  // Animación secuencial de entrada más marcada y dramática
  useGSAP(() => {
    // Solo ejecutar animaciones cuando la sección esté activa
    if (!isActive) {
      return
    }

    const tl = gsap.timeline()
    
    // Reset inicial más dramático
    gsap.set([titleRef.current, descriptionRef.current, featuresRef.current, imageRef.current], {
      opacity: 0,
      y: 80,
      scale: 0.8,
      rotationX: 15
    })

    // Secuencia de animaciones más rápidas y marcadas
    tl.to([titleRef.current, imageRef.current], {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 0.6,
      ease: "back.out(2.0)"
    })
    .to(descriptionRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 0.5,
      ease: "back.out(1.7)"
    }, "+=0.1")
    .to(featuresRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 0.5,
      ease: "back.out(1.7)"
    }, "-=0.3")
  }, [isActive])

  // Animaciones sutiles continuas para la imagen (separadas)
  useGSAP(() => {
    if (!isActive) {
      return
    }

    const imageElement = imageRef.current?.querySelector('img')
    if (imageElement) {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      
      if (!prefersReducedMotion) {
        // Floating animation - más amplitud y velocidad
        gsap.to(imageElement, {
          y: -25,
          duration: 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        })
        
        // Breathing/scale animation - más rápido
        gsap.to(imageElement, {
          scale: 1.08,
          duration: 2.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        })
        
        // Subtle rotation - más rápido
        gsap.to(imageElement, {
          rotation: 3,
          duration: 4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        })
      }
    }
  }, [isActive])

  return (
    <>
      <div className="w-full h-full max-w-7xl mx-auto px-4 lg:px-6 xl:px-8 flex items-center justify-center">
        <section className="min-h-screen lg:min-h-screen w-full px-4 py-8 lg:py-16 flex items-center bg-transparent">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12">
              <h1 
                ref={titleRef}
                onClick={() => router.push('/servicios-referentes/new')}
                className="text-3xl md:text-5xl font-bold text-textPrimary mb-6 transition-all duration-300 hover:text-highlight hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(38,255,223,0.5)] transform-gpu cursor-pointer"
              >
                {serviceData.title}
              </h1>
              
              <p 
                ref={descriptionRef}
                className="text-textMuted text-lg mb-8"
              >
                {serviceData.description}
              </p>
              
              <div ref={featuresRef} className="space-y-4">
                {serviceData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-custom-2 text-highlight">
                      {feature.icon}
                    </div>
                    <p className="text-textPrimary">{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 mt-12 lg:mt-0 flex flex-col items-center">
              <div ref={imageRef} className="flex items-center justify-center mb-8" style={{ willChange: 'transform' }}>
                <Image
                  alt={serviceData.imageAlt}
                  width={270}
                  height={270}
                  className="w-full h-auto max-w-sm object-cover transition-all duration-700 ease-in-out"
                  src={serviceData.imageSrc}
                  style={{ color: "transparent", willChange: 'transform' }}
                />
              </div>
              

            </div>
          </div>
        </section>
      </div>
      

    </>
  )
}
