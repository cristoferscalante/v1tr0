import BackgroundAnimation from "@/src/components/home/BackgroungAnimation";
import HomeBanner from "@/src/components/home/HomeBanner";
import TechnologiesSection from "@/src/components/home/GridTechnologies";
import SoftwareDevelopmentBanner from "@/src/components/home/SoftwareDevelopmentBanner";
import SoftwarePortfolio from "@/src/components/home/SoftwarePortfolio";
import DataAnalysisPage from "@/src/components/home/DataAnalysisPage";
import DataAnalysisPortfolio from "@/src/components/home/DataAnalysisPortfolio";
import ProjectManagementPage from "@/src/components/home/ProjectManagementPage";




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
  );
}