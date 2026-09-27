"use client"

// Corrigiendo las rutas de importación
import BackgroundAnimation from "@/components/home/animations/BackgroundAnimation"
import HomeBanner from "@/components/home/sections/banner/HomeBanner"
import HomeTaglineSection from "@/components/home/sections/banner/HomeTaglineSection"
import TechnologiesSection from "@/components/home/technologies/TechnologiesSection"
import ServicesTabSection from "@/components/home/sections/ServicesTabSection"
import PathChoiceSection from "@/components/home/sections/PathChoiceSection"

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
        {/* Sección 1: Hero */}
        <HomeBanner />

        {/* Sección 2: Texto dinámico */}
        <HomeTaglineSection />

        {/* Sección 3: Servicios con Tabs */}
        <ServicesTabSection />
        
        {/* Sección 4: Bifurcación software / hardware */}
        <PathChoiceSection />
        
        {/* Sección 5: Tecnologías */}
        <TechnologiesSection />
        
        {/* Sección 6: Footer */}
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
