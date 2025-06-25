// Corrigiendo las rutas de importación
import BackgroundAnimation from "@/components/home/BackgroungAnimation"
import HomeBanner from "@/components/home/HomeBanner"
import TechnologiesSection from "@/components/home/GridTechnologies"
import SoftwareDevelopmentBanner from "@/components/home/SoftwareDevelopmentBanner"
import SoftwarePortfolio from "@/components/home/SoftwarePortfolio"
import DataAnalysisPage from "@/components/home/DataAnalysisPage"
import DataAnalysisPortfolio from "@/components/home/DataAnalysisPortfolio"
import ProjectManagementPage from "@/components/home/ProjectManagementPage"

export default function Home() {
  return (
    <>
      <BackgroundAnimation />
      <HomeBanner />
      <TechnologiesSection />
      <SoftwareDevelopmentBanner />
      <SoftwarePortfolio />
      <DataAnalysisPage />
      <DataAnalysisPortfolio />
      <ProjectManagementPage />
    </>
  )
}
