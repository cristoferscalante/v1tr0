import InformationSystems from "@/components/service/information-systems"
import GsapSlider from "@/components/gsap/GsapSlider"

const informationSystemsExamples = [
  {
    title: "Sistema de Control Contractual",
    bgColor: "#1E1E1E",
    url: "https://sgc.edux.com.co/",
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/sistema-educacion.mp4"
  },
  {
    title: "Dashboard de Análisis de Datos",
    bgColor: "#06414D",
    url: "https://dashboard-five-green.vercel.app/",
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/dash-demo-vitro.mp4"
  },  
  {
    title: "Extructura Temporal: Linea de Tiempo ",
    bgColor: "#2D3748",
    url: "https://presidents-timeline.vercel.app/",
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/presidents.mp4"
  },
  {
    title: "Sistema de Recursos Humanos",
    bgColor: "#4A5568",
    url: "https://sgth.com.co/",
    video: "https://pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev/sgth.mp4"
  }
];

export default function NewPage() {
  return (
    <main>
      <InformationSystems />
      <GsapSlider title="Sistemas de Información" examples={informationSystemsExamples} />
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2024 V1TR0. Todos los derechos reservados.</p>
      </footer>
    </main>
  )
}