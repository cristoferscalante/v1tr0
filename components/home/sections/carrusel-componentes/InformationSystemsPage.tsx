"use client"

import React, { useRef } from "react"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useRouter } from "next/navigation"

gsap.registerPlugin(ScrollTrigger)
import { BarChartIcon, PieChartIcon, TrendingUpIcon } from "@/lib/icons"


export default function InformationSystemsPage() {
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

  // Animación secuencial de entrada
  useGSAP(() => {
    const tl = gsap.timeline()
    
    // Reset inicial
    gsap.set([titleRef.current, descriptionRef.current, featuresRef.current, imageRef.current], {
      opacity: 0,
      y: 30
    })

    // Secuencia de animaciones - título primero, luego resto con 0.4s delay
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    })
    .to(descriptionRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "+=0.4")
    .to(featuresRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")

    .to(imageRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.4")
  })

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
              <div ref={imageRef} className="flex items-center justify-center mb-8">
                <Image
                  alt={serviceData.imageAlt}
                  width={270}
                  height={270}
                  className="w-full h-auto max-w-sm object-cover transition-all duration-700 ease-in-out"
                  src={serviceData.imageSrc}
                  style={{ color: "transparent" }}
                />
              </div>
              

            </div>
          </div>
        </section>
      </div>
      

    </>
  )
}
