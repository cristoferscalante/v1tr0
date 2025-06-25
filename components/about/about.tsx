import CardViewerPremium from "./card-viewer-premium"
import Image from "next/image"
import BokehBackground from "./BokehBackground"

const About = () => {
  return (
    <section className="w-full font-sans py-20 relative">
      {/* Use the new BokehBackground component instead of the abstract shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <BokehBackground />
      </div>

      {/* Content container with higher z-index */}
      <div className="container px-4 md:px-6 mx-auto max-w-6xl relative z-10">
        {/* Encabezado de sección */}
        <div className="grid gap-10 md:gap-16 lg:grid-cols-2 mb-24">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-custom-1 text-highlight text-sm font-medium">
              Sobre Nosotros
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-textPrimary leading-tight">
              Innovación y tecnología para la gestión de proyectos
            </h2>
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <p className="text-textMuted text-lg md:text-xl leading-relaxed">
              En <span className="font-bold text-primary">V1TR0</span>, transformamos la gestión de proyectos con
              tecnología de vanguardia, inteligencia artificial y visualización en tiempo real. Nuestro equipo
              multidisciplinario trabaja para crear soluciones ágiles, eficientes y escalables para empresas y
              profesionales del desarrollo de software.
            </p>
          </div>
        </div>

        {/* Línea divisoria con gradiente */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-custom-2 to-transparent my-16"></div>

        {/* Sección del equipo */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-10">
            <div className="text-2xl text-primary font-bold">01</div>
            <div className="h-px flex-grow bg-custom-2/30"></div>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-textPrimary mb-16 text-center">Nuestro Equipo</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
            {/* Miembro 1 */}
            <div className="flex flex-col items-center">
              <div className="w-full h-[500px] md:h-[500px] lg:h-[500px] mb-8">
                <CardViewerPremium frontImage="/about/card-efren.jpg" backImage="/about/card-back.jpg" />
              </div>
              <div className="text-center max-w-sm mx-auto">
                <h4 className="text-2xl font-bold text-textPrimary mb-2">Álvaro Efren Bolaños</h4>
                <p className="text-primary font-medium mb-4">Analista de Datos & IA</p>
                <p className="text-textMuted">
                  Politólogo y analista de datos, con un enfoque en el uso de inteligencia artificial y big data para la
                  toma de decisiones en proyectos tecnológicos.
                </p>
              </div>
            </div>

            {/* Miembro 2 */}
            <div className="flex flex-col items-center">
              <div className="w-full h-[500px] md:h-[500px] lg:h-[500px] mb-8">
                <CardViewerPremium frontImage="/about/card-cristofer.jpg" backImage="/about/card-back.jpg" />
              </div>
              <div className="text-center max-w-sm mx-auto">
                <h4 className="text-2xl font-bold text-textPrimary mb-2">Cristofer Bolaños</h4>
                <p className="text-primary font-medium mb-4">Desarrollador de Software & Líder Técnico</p>
                <p className="text-textMuted">
                  Especialista en desarrollo de software con tecnologías como Next.js y Python. Enfocado en la creación
                  de soluciones innovadoras con IA y automatización.
                </p>
              </div>
            </div>

            {/* Miembro 3 */}
            <div className="flex flex-col items-center">
              <div className="w-full h-[500px] md:h-[500px] lg:h-[500px] mb-8">
                <CardViewerPremium frontImage="/about/card-maria.jpg" backImage="/about/card-back.jpg" />
              </div>
              <div className="text-center max-w-sm mx-auto">
                <h4 className="text-2xl font-bold text-textPrimary mb-2">María Paz Morales</h4>
                <p className="text-primary font-medium mb-4">Gestión de Proyectos</p>
                <p className="text-textMuted">
                  Socióloga con experiencia en gestión de proyectos tecnológicos y metodologías ágiles. Su enfoque está
                  en la eficiencia y optimización de procesos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria con gradiente */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-custom-2 to-transparent my-16"></div>

        {/* Sección de Servicios */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-10">
            <div className="text-2xl text-primary font-bold">02</div>
            <div className="h-px flex-grow bg-custom-2/30"></div>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-textPrimary mb-16 text-center">Nuestros Servicios</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* Desarrollo de Software */}
            <div className="bg-custom-1/30 backdrop-blur-sm rounded-2xl p-8 border border-custom-2/20 hover:border-custom-2/50 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 rounded-full bg-custom-2/30 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-highlight"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-textPrimary mb-4">Desarrollo de Software</h4>
              <p className="text-textMuted leading-relaxed">
                Creación de aplicaciones web modernas y escalables con{" "}
                <span className="font-bold text-highlight">Next.js</span> y{" "}
                <span className="font-bold text-highlight">Python</span>, optimizando rendimiento y seguridad. Nuestras
                soluciones se adaptan a las necesidades específicas de cada cliente.
              </p>
            </div>

            {/* Ciencia de Datos */}
            <div className="bg-custom-1/30 backdrop-blur-sm rounded-2xl p-8 border border-custom-2/20 hover:border-custom-2/50 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 rounded-full bg-custom-2/30 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-highlight"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-textPrimary mb-4">
                Automatización de Datos e Inteligencia Artificial
              </h4>
              <p className="text-textMuted leading-relaxed">
                Implementamos modelos de <span className="font-bold text-highlight">machine learning</span> e
                inteligencia artificial para análisis de datos y toma de decisiones estratégicas. Transformamos datos en
                insights accionables.
              </p>
            </div>

            {/* Gestión de Proyectos */}
            <div className="bg-custom-1/30 backdrop-blur-sm rounded-2xl p-8 border border-custom-2/20 hover:border-custom-2/50 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 rounded-full bg-custom-2/30 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-highlight"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-textPrimary mb-4">Gestión de Proyectos</h4>
              <p className="text-textMuted leading-relaxed">
                Aplicamos metodologías ágiles y herramientas avanzadas para optimizar el desarrollo y ejecución de
                proyectos tecnológicos. Garantizamos entregas a tiempo y dentro del presupuesto.
              </p>
            </div>

            {/* Visualización de Datos */}
            <div className="bg-custom-1/30 backdrop-blur-sm rounded-2xl p-8 border border-custom-2/20 hover:border-custom-2/50 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 rounded-full bg-custom-2/30 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-highlight"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-textPrimary mb-4">Visualización de Datos</h4>
              <p className="text-textMuted leading-relaxed">
                Desarrollamos dashboards interactivos y herramientas para representar datos en tiempo real, facilitando
                el análisis y toma de decisiones. Convertimos datos complejos en visualizaciones claras e intuitivas.
              </p>
            </div>
          </div>
        </div>

        {/* Línea divisoria con gradiente */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-custom-2 to-transparent my-16"></div>

        {/* Misión y Visión */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <div className="text-2xl text-primary font-bold">03</div>
            <div className="h-px flex-grow bg-custom-2/30"></div>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-textPrimary mb-16 text-center">Nuestra Visión</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/15-SzfeYK3mFDL4IOh7XyaucnbCXX7OPV.png"
                alt="Equipo V1TR0 observando una red neuronal digital"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-custom-1/80 to-transparent"></div>
            </div>

            <div className="bg-custom-1/30 backdrop-blur-sm rounded-2xl p-8 border border-custom-2/20">
              <p className="text-textMuted text-lg leading-relaxed">
                En <span className="font-bold text-highlight">V1TR0</span>, creemos en el poder de la tecnología para
                transformar la manera en que se gestionan los proyectos. Nos enfocamos en brindar soluciones eficientes
                e inteligentes que potencien la productividad y la toma de decisiones estratégicas.
              </p>
              <p className="text-textMuted text-lg leading-relaxed mt-6">
                Nuestro compromiso es innovar continuamente, integrando las últimas tendencias en desarrollo de
                software, ciencia de datos y metodologías ágiles para impulsar el éxito de nuestros clientes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
