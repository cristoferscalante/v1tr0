"use client"

// Corrigiendo las rutas de importación
import BackgroundAnimation from "../../components/home/BackgroundAnimation"
import HomeBanner from "@/components/home/HomeBanner"
import TechnologiesSection from "@/components/home/GridTechnologies"
import SoftwareDevelopmentBanner from "@/components/home/SoftwareDevelopmentBanner"
import DataAnalysisPage from "@/components/home/DataAnalysisPage"
import TaskAutomationPage from "@/components/home/TaskAutomationPage"
import ConsultationAndDemosSection from "@/components/home/ConsultationAndDemosSection"
import FooterSection from "@/components/global/FooterSection"

import PinnedScrollSection from "@/components/home/PinnedScrollSection"
import HomeScrollSnap from "@/components/home/HomeScrollSnap"
import { ScrollProvider } from "@/components/home/shared/ScrollContext"
import UnifiedContactModal from "@/components/home/UnifiedContactModal"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { motion } from "framer-motion"

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
          <DataAnalysisPage />
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
