// Corrigiendo las rutas de importación
import BackgroundAnimation from "@/components/home/BackgroungAnimation"
import HomeBanner from "@/components/home/HomeBanner"
import TechnologiesSection from "@/components/home/GridTechnologies"
import SoftwareDevelopmentBanner from "@/components/home/SoftwareDevelopmentBanner"
import DataAnalysisPage from "@/components/home/DataAnalysisPage"
import TaskAutomationPage from "@/components/home/TaskAutomationPage"
import FooterSection from "@/components/global/FooterSection"

import PinnedScrollSection from "@/components/home/PinnedScrollSection"
import HomeScrollSnap from "@/components/home/HomeScrollSnap"
import { ScrollProvider } from "@/components/home/shared/ScrollContext"

export default function Home() {
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
        
        {/* Sección 3: Tecnologías */}
        <TechnologiesSection />
        
        {/* Sección 4: Footer */}
        <FooterSection />
      </HomeScrollSnap>
    </ScrollProvider>
  )
}
