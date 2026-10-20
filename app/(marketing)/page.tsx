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
import { ScrollProvider } from "@/components/home/shared/ScrollContext"
import UnifiedContactModal from "@/components/home/sections/contact/UnifiedContactModal"
import FooterSection from "@/components/global/FooterSection"
import { useState } from "react"

export default function Home() {
  const [isUnifiedModalOpen, setIsUnifiedModalOpen] = useState(false)

  return (
    <ScrollProvider>
      <BackgroundAnimation />
      
      <HomeScrollSnap>
        {/* Sección 1: Hero de aterrizaje con el h1 */}
        <HomeHero />

        {/* Sección 2: Tarjetas de navegación */}
        <HomeBanner />

        {/* Sección 3: Proyectos de clientes publicados (carrusel curvo) */}
        <ProyectosEnProduccion />

        {/* Sección 4: Tecnologías, justo después del carrusel. HomeScrollSnap la
            reconoce por su tipo, no por su posición. */}
        <TechnologiesSection />

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
