// Corrigiendo las rutas de importación
import BackgroundAnimation from "@/components/home/BackgroungAnimation"
import HomeBanner from "@/components/home/HomeBanner"
import TechnologiesSection from "@/components/home/GridTechnologies"
import SoftwareDevelopmentBanner from "@/components/home/SoftwareDevelopmentBanner"
import DataAnalysisPage from "@/components/home/DataAnalysisPage"
import TaskAutomationPage from "@/components/home/TaskAutomationPage"

import PinnedScrollSection from "@/components/home/PinnedScrollSection"
import HomeScrollSnap from "@/components/home/HomeScrollSnap"
import ImageSection from "@/components/home/ImageSection"

export default function Home() {
  return (
    <>
      <BackgroundAnimation />
      
      {/* Sección 1: Hero */}
      <HomeBanner />
      
      {/* Sección 2: Scroll Horizontal */}
      <PinnedScrollSection>
        <SoftwareDevelopmentBanner />
        <DataAnalysisPage />
        <TaskAutomationPage />
      </PinnedScrollSection>
      
      {/* Sección 3: Nueva Imagen */}
      <ImageSection />
      
      {/* Sección 4: Tecnologías */}
      <TechnologiesSection />
    </>
  )
}
