"use client"

// Corrigiendo las rutas de importación
import BackgroundAnimation from "@/components/home/animations/BackgroundAnimation"
import HomeHero from "@/components/home/sections/banner/HomeHero"
import HomeBanner from "@/components/home/sections/banner/HomeBanner"
import HomeTaglineSection from "@/components/home/sections/banner/HomeTaglineSection"
import TechnologiesSection from "@/components/home/technologies/TechnologiesSection"
import ProyectosEnProduccion from "@/components/home/sections/ProyectosEnProduccion"
import PathChoiceSection from "@/components/home/sections/PathChoiceSection"
import ContactoAsistenteSection from "@/components/home/sections/contact/ContactoAsistenteSection"

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

        {/* Sección 3: Texto dinámico */}
        <HomeTaglineSection />

        {/* Sección 4: Proyectos de clientes publicados */}
        <ProyectosEnProduccion />
        
        {/* Sección 5: Bifurcación software / hardware */}
        <PathChoiceSection />

        {/* Sección 6: Contacto con asistente que llena el brief */}
        <ContactoAsistenteSection />
        
        {/* Sección 7: Tecnologías. HomeScrollSnap la reconoce por ser la penúltima. */}
        <TechnologiesSection />
        
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
