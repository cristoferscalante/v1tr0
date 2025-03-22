import Image from "next/image";

const About = () => {
  return (
    <section className="w-full py-32 bg-background font-alexandria">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Encabezado de sección */}
        <div className="grid gap-10 md:gap-16 lg:grid-cols-2 mb-20">
          <div className="space-y-4">
            <div className="text-highlight text-sm">Sobre Nosotros</div>
            <h2 className="text-4xl font-bold tracking-tighter text-textPrimary sm:text-5xl">
              Innovación y tecnología para la gestión de proyectos
            </h2>
          </div>
          <div className="flex flex-col items-start space-y-4">
            <p className="text-textMuted text-lg md:text-xl">
              En <span className="font-bold text-primary">V1TR0</span>, 
              transformamos la gestión de proyectos con tecnología de vanguardia, 
              inteligencia artificial y visualización en tiempo real. Nuestro equipo 
              multidisciplinario trabaja para crear soluciones ágiles, eficientes y escalables 
              para empresas y profesionales del desarrollo de software.
            </p>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="w-full h-px bg-custom-2 my-10"></div>

        {/* Sección del equipo */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">01</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Nuestro Equipo</h3>

          <div className="grid md:grid-cols-3 gap-16">
            {/* Cristofer */}
            <div className="text-center">
              <Image
                src="/placeholder.svg?height=500&width=400"
                alt="Cristofer Bolaños"
                width={400}
                height={500}
                className="rounded-md mb-6 object-cover mx-auto"
              />
              <h4 className="text-2xl font-bold text-textPrimary">Cristofer Bolaños</h4>
              <p className="text-primary mb-4">Desarrollador de Software & Líder Técnico</p>
              <p className="text-textMuted">
                Especialista en desarrollo de software con tecnologías como Next.js y Python. 
                Enfocado en la creación de soluciones innovadoras con IA y automatización.
              </p>
            </div>

            {/* María Paz */}
            <div className="text-center">
              <Image
                src="/placeholder.svg?height=500&width=400"
                alt="Maria Paz Morales"
                width={400}
                height={500}
                className="rounded-md mb-6 object-cover mx-auto"
              />
              <h4 className="text-2xl font-bold text-textPrimary">María Paz Morales</h4>
              <p className="text-primary mb-4">Gestión de Proyectos</p>
              <p className="text-textMuted">
                Socióloga con experiencia en gestión de proyectos tecnológicos y 
                metodologías ágiles. Su enfoque está en la eficiencia y optimización de procesos.
              </p>
            </div>

            {/* Álvaro Efren */}
            <div className="text-center">
              <Image
                src="/placeholder.svg?height=500&width=400"
                alt="Álvaro Efren Bolaños"
                width={400}
                height={500}
                className="rounded-md mb-6 object-cover mx-auto"
              />
              <h4 className="text-2xl font-bold text-textPrimary">Álvaro Efren Bolaños</h4>
              <p className="text-primary mb-4">Analista de Datos & IA</p>
              <p className="text-textMuted">
                Politólogo y analista de datos, con un enfoque en el uso de inteligencia 
                artificial y big data para la toma de decisiones en proyectos tecnológicos.
              </p>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="w-full h-px bg-custom-2 my-10"></div>

        {/* Sección de Servicios */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">02</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Nuestros Servicios</h3>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Desarrollo de Software */}
            <div>
              <h4 className="text-2xl font-bold text-textPrimary">Desarrollo de Software</h4>
              <p className="text-textMuted">
                Creación de aplicaciones web modernas y escalables con <span className="font-bold">Next.js</span> y <span className="font-bold">Python</span>, 
                optimizando rendimiento y seguridad.
              </p>
            </div>

            {/* Ciencia de Datos */}
            <div>
              <h4 className="text-2xl font-bold text-textPrimary">Ciencia de Datos & IA</h4>
              <p className="text-textMuted">
                Implementamos modelos de <span className="font-bold">machine learning</span> 
                e inteligencia artificial para análisis de datos y toma de decisiones estratégicas.
              </p>
            </div>

            {/* Gestión de Proyectos */}
            <div>
              <h4 className="text-2xl font-bold text-textPrimary">Gestión de Proyectos</h4>
              <p className="text-textMuted">
                Aplicamos metodologías ágiles y herramientas avanzadas para optimizar 
                el desarrollo y ejecución de proyectos tecnológicos.
              </p>
            </div>

            {/* Visualización de Datos */}
            <div>
              <h4 className="text-2xl font-bold text-textPrimary">Visualización de Datos</h4>
              <p className="text-textMuted">
                Desarrollamos dashboards interactivos y herramientas para representar 
                datos en tiempo real, facilitando el análisis y toma de decisiones.
              </p>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="w-full h-px bg-custom-2 my-10"></div>

        {/* Misión y Visión */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">03</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Nuestra Visión</h3>
          <p className="text-textMuted text-lg">
            En <span className="font-bold">V1TR0</span>, creemos en el poder de la tecnología 
            para transformar la manera en que se gestionan los proyectos. Nos enfocamos en 
            brindar soluciones eficientes e inteligentes que potencien la productividad y la 
            toma de decisiones estratégicas. Nuestro compromiso es innovar continuamente, 
            integrando las últimas tendencias en desarrollo de software, ciencia de datos y 
            metodologías ágiles para impulsar el éxito de nuestros clientes.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
