import InformationSystems from "@/components/service/information-systems"
import GsapSlider from "@/components/gsap/GsapSlider"

const informationSystemsExamples = [
  {
    title: "Sistema de Control Contractual",
    bgColor: "#1E1E1E",
    url: "/portfolio/sistema-contractual",
    img: "/images/alcaldia_contractual.png"
  },
  {
    title: "Dashboard de Análisis de Datos",
    bgColor: "#06414D",
    url: "/portfolio/dashboard-analytics",
    img: "/service/analisis-de-datos.png"
  },
  {
    title: "Sistema de Gestión Hospitalaria",
    bgColor: "#025159",
    url: "/portfolio/sistema-hospitalario",
    img: "/service/clinica.png"
  },
  {
    title: "Plataforma de Inventarios",
    bgColor: "#2D3748",
    url: "/portfolio/sistema-inventarios",
    img: "/service/inventarios.png"
  },
  {
    title: "Sistema de Recursos Humanos",
    bgColor: "#4A5568",
    url: "/portfolio/sistema-rrhh",
    img: "/service/recursos-humanos.png"
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