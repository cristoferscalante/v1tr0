"use client"

// Corrigiendo las rutas de importación
import BackgroundAnimation from "@/components/home/animations/BackgroundAnimation"
import HomeHero from "@/components/home/sections/banner/HomeHero"
import HomeBanner from "@/components/home/sections/banner/HomeBanner"
import HomeTaglineSection from "@/components/home/sections/banner/HomeTaglineSection"
import TechnologiesSection from "@/components/home/technologies/TechnologiesSection"
import ProyectosEnProduccion from "@/components/home/sections/ProyectosEnProduccion"
import ContactoAsistenteSection from "@/components/home/sections/contact/ContactoAsistenteSection"
import BlogsInvestigacionSection from "@/components/home/sections/newsletter/BlogsInvestigacionSection"

import HomeScrollSnap from "@/components/home/layout/HomeScrollSnap"
import SmoothScroll from "@/components/home/layout/SmoothScroll"
import { ScrollProvider } from "@/components/home/shared/ScrollContext"
import UnifiedContactModal from "@/components/home/sections/contact/UnifiedContactModal"
import FooterSection from "@/components/global/FooterSection"
import { useEffect, useState } from "react"
import MobileHome from "@/components/home/mobile/MobileHome"

export default function Home() {
  const [isUnifiedModalOpen, setIsUnifiedModalOpen] = useState(false)
  // Móvil y escritorio son dos recorridos distintos: se decide al montar
  // (mismo corte que el resto del sitio, lg = 1024 px) para no montar los dos.
  const [modo, setModo] = useState<"movil" | "escritorio" | null>(null)
  useEffect(() => {
    // Se re-evalúa al cruzar el corte (girar la tablet, redimensionar,
    // abrir/cerrar DevTools): cada ancho ve su versión sin recargar.
    const consulta = window.matchMedia("(max-width: 1023px)")
    const sincronizar = () => setModo(consulta.matches ? "movil" : "escritorio")
    sincronizar()
    consulta.addEventListener("change", sincronizar)
    return () => consulta.removeEventListener("change", sincronizar)
  }, [])

  if (modo === null) {
    return <div className="min-h-[100svh]" />
  }

  if (modo === "movil") {
    return (
      <ScrollProvider>
        {/* Scroll suave (Lenis) sincronizado con GSAP */}
        <SmoothScroll />
        <BackgroundAnimation />
        <MobileHome />
        <TechnologiesSection />
        {/* La casa V1TR0 también en teléfono; el panel del header conserva el chat. */}
        <ContactoAsistenteSection />
        <BlogsInvestigacionSection />
        <FooterSection />
      </ScrollProvider>
    )
  }

  return (
    <ScrollProvider>
      <BackgroundAnimation />

      <HomeScrollSnap>
        {/* Sección 1: Hero de aterrizaje con el h1 */}
        <HomeHero />

        {/* Sección 3: Proyectos de clientes publicados (carrusel curvo) */}
        <ProyectosEnProduccion />

        {/* Sección 4: Tecnologías, justo después del carrusel. HomeScrollSnap la
            reconoce por su tipo, no por su posición. */}
        <TechnologiesSection />

        {/* Tarjetas de navegación, después de Tecnologías */}
        <HomeBanner />

        {/* Sección 5: Texto dinámico */}
        <HomeTaglineSection />

        {/* Sección 6: el asistente. Ocupa el lugar de la vieja bifurcación
            software / hardware; las dos rutas siguen a mano como enlaces. */}
        <ContactoAsistenteSection />

        {/* Sección 7: Newsletter de Blogs & Investigación, justo antes del footer. */}
        <BlogsInvestigacionSection />

        {/* Sección 8: Footer */}
        <FooterSection />
      </HomeScrollSnap>
      
      {/* Modal Unificado */}
      <UnifiedContactModal 
        isOpen={isUnifiedModalOpen} 
        onClose={() => setIsUnifiedModalOpen(false)} 
      />
    </ScrollProvider>
  )
}
