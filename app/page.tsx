// Import the home page content from marketing
import BackgroundAnimation from "@/components/home/BackgroungAnimation"
import HomeBanner from "@/components/home/HomeBanner"
import TechnologiesSection from "@/components/home/GridTechnologies"
import SoftwareDevelopmentBanner from "@/components/home/SoftwareDevelopmentBanner"
import DataAnalysisPage from "@/components/home/DataAnalysisPage"
import ProjectManagementPage from "@/components/home/ProjectManagementPage"
import PinnedScrollSection from "@/components/home/PinnedScrollSection"
import SmoothTransitionWrapper from "@/components/home/SmoothTransitionWrapper"

export default function Home() {
  return (
    <>
      <BackgroundAnimation />
      <HomeBanner />      
      <PinnedScrollSection>
        <SoftwareDevelopmentBanner />
        <DataAnalysisPage />
        <ProjectManagementPage />
      </PinnedScrollSection>
      <SmoothTransitionWrapper>
        <TechnologiesSection />
      </SmoothTransitionWrapper>
    </>
  )
}
