"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { BarChartIcon, PieChartIcon, TrendingUpIcon } from "@/lib/icons"
import ContactModal from "@/components/home/shared/ContactModal"

export default function DataAnalysisPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const serviceData = {
    title: "Sistemas de Información",
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
    imageSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.%20%C2%A1Potencia%20tu%20estrategia%2C%20automatiza%20tu%20informaci%C3%B3n%21-9D5wtuARJ7clWe9uK7UWmXN6Sd1HLj.png",
    imageAlt: "Analista de datos entusiasta con visualizaciones, gráficos y elementos de IA en estilo digital neón",
    ctaText: "Solicita una consulta",
  }

  // Animación secuencial de entrada
  useEffect(() => {
    const tl = gsap.timeline()
    
    // Reset inicial
    gsap.set([titleRef.current, descriptionRef.current, featuresRef.current, ctaRef.current, imageRef.current], {
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
    .to(ctaRef.current, {
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
  }, [])

  return (
    <>
      <div className="w-full h-full max-w-7xl mx-auto px-4 lg:px-6 xl:px-8 flex items-center justify-center">
        <section className="min-h-screen lg:min-h-screen w-full px-4 py-8 lg:py-16 flex items-center bg-transparent">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12">
              <h1 
                ref={titleRef}
                className="text-4xl md:text-6xl font-bold text-textPrimary mb-6"
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
                <img
                  alt={serviceData.imageAlt}
                  loading="lazy"
                  width="300"
                  height="300"
                  decoding="async"
                  className="w-full h-auto max-w-sm object-cover transition-all duration-700 ease-in-out hover:scale-105"
                  src={serviceData.imageSrc}
                  style={{ color: "transparent", cursor: "pointer" }}
                />
              </div>
              
              <div ref={ctaRef}>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#02505931] backdrop-blur-sm rounded-2xl border border-[#08A696]/20 transition-all duration-300 hover:border-[#08A696] hover:bg-[#02505950] inline-flex items-center px-8 py-4 text-lg font-semibold"
                >
                  <span className="text-[#26FFDF] transition-colors duration-300">
                    {serviceData.ctaText}
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="ml-3 w-5 h-5 transition-transform duration-300 hover:translate-x-1 text-[#26FFDF]"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
