import ProjectManagement from "@/components/service/project-management-new"
import GsapSlider from "@/components/gsap/GsapSlider"

const taskAutomationExamples = [
  {
    title: "Automatización de Email Marketing",
    bgColor: "#1E1E1E",
    url: "/portfolio/email-automation",
    img: "/service/email-automation.png"
  },
  {
    title: "Bot de Atención al Cliente",
    bgColor: "#06414D",
    url: "/portfolio/chatbot-customer",
    img: "/service/chatbot.png"
  },
  {
    title: "Automatización de Reportes",
    bgColor: "#025159",
    url: "/portfolio/report-automation",
    img: "/service/reportes-automaticos.png"
  },
  {
    title: "Integración de APIs",
    bgColor: "#2D3748",
    url: "/portfolio/api-integration",
    img: "/service/api-integration.png"
  },
  {
    title: "Automatización de Procesos de Negocio",
    bgColor: "#4A5568",
    url: "/portfolio/business-process",
    img: "/service/business-automation.png"
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
