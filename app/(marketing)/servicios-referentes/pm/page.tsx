import ProjectManagement from "@/components/service/project-management-new"
import GsapSlider from "@/components/gsap/GsapSlider"

const taskAutomationExamples = [
  {
    title: "Automatización",
    bgColor: "#1E1E1E",
    url: "https://v1tr0.com",
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/21.mp4"
  }
];

export default function ProjectManagementPage() {
  return (
    <>
      <ProjectManagement />
      <GsapSlider title="Automatización de tareas" examples={taskAutomationExamples} />
    </>
  )
}
