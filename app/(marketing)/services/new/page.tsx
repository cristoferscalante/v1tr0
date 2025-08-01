import InformationSystems from "@/components/service/information-systems"
import GsapSlider from "@/components/gsap/GsapSlider"

export default function NewPage() {
  return (
    <main>
      <InformationSystems />
      <GsapSlider />
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2024 V1TR0. Todos los derechos reservados.</p>
      </footer>
    </main>
  )
}