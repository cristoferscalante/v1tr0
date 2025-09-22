"use client"

// Corrigiendo las rutas de importación
import BackgroundAnimation from "@/components/home/animations/BackgroundAnimation"
import HomeBanner from "@/components/home/sections/banner/HomeBanner"
import TechnologiesSection from "@/components/home/technologies/TechnologiesSection"
import SoftwareDevelopmentBanner from "@/components/home/sections/carrusel-componentes/SoftwareDevelopmentBanner"
import InformationSystemsPage from "@/components/home/sections/carrusel-componentes/InformationSystemsPage"
import TaskAutomationPage from "@/components/home/sections/carrusel-componentes/TaskAutomationPage"
import ConsultationAndDemosSection from "@/components/home/sections/contact/ConsultationAndDemosSection"


import PinnedScrollSection from "@/components/home/layout/PinnedScrollSection"
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
        
        {/* Sección 2: Servicios (Scroll Horizontal) */}
        <PinnedScrollSection>
          <SoftwareDevelopmentBanner />
          <InformationSystemsPage />
          <TaskAutomationPage />
        </PinnedScrollSection>
        
        {/* Sección de Consulta y Demos */}
        <ConsultationAndDemosSection setIsUnifiedModalOpen={setIsUnifiedModalOpen} />
        
        {/* Sección 3: Tecnologías */}
        <TechnologiesSection />
        
        {/* Sección 4: Footer */}
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
