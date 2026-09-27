"use client"
import TextType from "@/components/home/hero/TextType"

/**
 * Segunda sección del home: el texto dinámico, en su propio snap.
 * Arranca a escribir cuando entra en pantalla, no al cargar la página.
 */
export default function HomeTaglineSection() {
  return (
    <section className="relative min-h-[100svh] md:min-h-[100dvh] w-full grid place-items-center px-4 sm:px-6">
      <TextType
        text={[
          "Transformamos tu potencial\nen innovación y resultados",
          "Las estructuras basadas en codigo\nno paran de crecer",
          "Tu futuro te lo dicen tus datos\nSe soberano de tu información",
          "Libera tu tiempo\nAutomatiza tus procesos, y tareas",
          "Inaugura tu tienda virtual\nvende tus productos a todos",
          "Tus clientes necesitan visitarte\n¡Vive digital!",
          "Sistemas de información\nGestiona y centraliza tus datos",
          "Portafolios interactivos\n¡Posiciona tu talento!",
          "Infraestructura web\nUnifica procesos, sistemas, y tareas",
          "Integra Inteligencia Artificial\ny potencia tus herramientas",
        ]}
        typingSpeed={60}
        pauseDuration={1500}
        deletingSpeed={10}
        startOnVisible
        className="w-full max-w-5xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-snug md:leading-tight text-center text-white min-h-[4em] sm:min-h-[3em] md:min-h-[2.5em]"
      />
    </section>
  )
}
