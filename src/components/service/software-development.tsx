import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Code, Database, Layers, Rocket, Server, Zap } from "lucide-react"

const SoftwareDevelopment = () => {
  return (
    <section className="w-full py-24 bg-background font-alexandria">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Encabezado de sección */}
        <div className="grid gap-10 md:gap-16 lg:grid-cols-2 mb-20">
          <div className="space-y-4">
            <div className="text-highlight text-sm">Desarrollo de Software</div>
            <h2 className="text-4xl font-bold tracking-tighter text-textPrimary sm:text-5xl">
              Soluciones digitales a la medida de tus necesidades
            </h2>
          </div>
          <div className="flex flex-col items-start space-y-4">
            <p className="text-textMuted text-lg md:text-xl">
              En V1TR0 transformamos ideas en soluciones tecnológicas innovadoras. Nuestro enfoque combina las últimas
              tecnologías con metodologías ágiles para crear software que impulsa el crecimiento de tu negocio.
            </p>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="w-full h-px bg-custom-2 my-10"></div>

        {/* Sección 01 - Ciclo de vida del software */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">01</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Ciclo de vida del software</h3>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-textMuted text-lg mb-8">
                Gestionamos cada fase del desarrollo con precisión y transparencia, desde la concepción inicial hasta el
                mantenimiento continuo, asegurando que tu software evolucione con tu negocio.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <span className="text-highlight font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Análisis y Planificación</h4>
                    <p className="text-textMuted">
                      Definimos objetivos, alcance y requisitos técnicos para crear una hoja de ruta clara.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <span className="text-highlight font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Diseño y Arquitectura</h4>
                    <p className="text-textMuted">Creamos la estructura técnica y visual que soportará tu solución.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <span className="text-highlight font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Desarrollo e Implementación</h4>
                    <p className="text-textMuted">
                      Construimos tu solución con código limpio y prácticas de desarrollo modernas.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <span className="text-highlight font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Pruebas y Calidad</h4>
                    <p className="text-textMuted">
                      Verificamos exhaustivamente cada aspecto para garantizar un producto sin fallos.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <span className="text-highlight font-bold">5</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Despliegue y Mantenimiento</h4>
                    <p className="text-textMuted">
                      Lanzamos tu solución y proporcionamos soporte continuo para su evolución.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Ciclo de vida del software"
                width={500}
                height={600}
                className="rounded-md object-cover"
              />
            </div>
          </div>
        </div>

        {/* Sección 02 - Tecnologías */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">02</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Tecnologías de vanguardia</h3>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Tecnologías modernas"
                width={500}
                height={600}
                className="rounded-md object-cover"
              />
            </div>

            <div>
              <p className="text-textMuted text-lg mb-8">
                Nos mantenemos a la vanguardia de la innovación tecnológica, implementando las herramientas y frameworks
                más avanzados para crear soluciones robustas, escalables y preparadas para el futuro.
              </p>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Code size={20} />
                    <h4 className="font-bold">Frontend</h4>
                  </div>
                  <p className="text-textMuted">React, Vue, Angular, Next.js</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Server size={20} />
                    <h4 className="font-bold">Backend</h4>
                  </div>
                  <p className="text-textMuted">Node.js, Python, Java, .NET</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Database size={20} />
                    <h4 className="font-bold">Bases de datos</h4>
                  </div>
                  <p className="text-textMuted">MongoDB, PostgreSQL, MySQL, Firebase</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Layers size={20} />
                    <h4 className="font-bold">DevOps</h4>
                  </div>
                  <p className="text-textMuted">Docker, Kubernetes, CI/CD, AWS</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Zap size={20} />
                    <h4 className="font-bold">IA & ML</h4>
                  </div>
                  <p className="text-textMuted">TensorFlow, PyTorch, NLP, Computer Vision</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Rocket size={20} />
                    <h4 className="font-bold">Móvil</h4>
                  </div>
                  <p className="text-textMuted">React Native, Flutter, Swift, Kotlin</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección 03 - Desarrollo a medida */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">03</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Desarrollo a medida</h3>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-textMuted text-lg mb-8">
                Creamos soluciones personalizadas que se adaptan perfectamente a tus necesidades específicas, procesos
                de negocio y objetivos estratégicos, evitando las limitaciones de los productos genéricos o
                preconfigurados.
              </p>

              <div className="space-y-6">
                <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg">
                  <h4 className="text-xl font-bold text-textPrimary mb-2">Aplicaciones Empresariales</h4>
                  <p className="text-textMuted">
                    Sistemas ERP, CRM y de gestión interna adaptados a tus procesos específicos para maximizar la
                    eficiencia operativa.
                  </p>
                </div>

                <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg">
                  <h4 className="text-xl font-bold text-textPrimary mb-2">Plataformas Web</h4>
                  <p className="text-textMuted">
                    Portales, e-commerce y aplicaciones web progresivas con experiencias de usuario excepcionales y alto
                    rendimiento.
                  </p>
                </div>

                <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg">
                  <h4 className="text-xl font-bold text-textPrimary mb-2">Aplicaciones Móviles</h4>
                  <p className="text-textMuted">
                    Apps nativas y multiplataforma que conectan con tus usuarios en cualquier dispositivo con interfaces
                    intuitivas.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Desarrollo a medida"
                width={500}
                height={600}
                className="rounded-md object-cover"
              />
            </div>
          </div>
        </div>

        {/* Sección 04 - Metodología */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">04</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Nuestra metodología</h3>

          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="w-16 h-16 rounded-full bg-custom-2 flex items-center justify-center mb-6">
                <span className="text-highlight text-2xl font-bold">1</span>
              </div>
              <h4 className="text-xl font-bold text-textPrimary mb-4">Enfoque Ágil</h4>
              <p className="text-textMuted">
                Trabajamos con metodologías Scrum y Kanban para entregar valor de forma incremental, adaptándonos
                rápidamente a los cambios y manteniendo la transparencia.
              </p>
            </div>

            <div>
              <div className="w-16 h-16 rounded-full bg-custom-2 flex items-center justify-center mb-6">
                <span className="text-highlight text-2xl font-bold">2</span>
              </div>
              <h4 className="text-xl font-bold text-textPrimary mb-4">Colaboración Continua</h4>
              <p className="text-textMuted">
                Mantenemos una comunicación constante y transparente, involucrándote en cada etapa para asegurar que el
                resultado final cumpla tus expectativas.
              </p>
            </div>

            <div>
              <div className="w-16 h-16 rounded-full bg-custom-2 flex items-center justify-center mb-6">
                <span className="text-highlight text-2xl font-bold">3</span>
              </div>
              <h4 className="text-xl font-bold text-textPrimary mb-4">Mejora Continua</h4>
              <p className="text-textMuted">
                Implementamos ciclos de retroalimentación y mejora constante, optimizando procesos y resultados en cada
                iteración del proyecto.
              </p>
            </div>
          </div>
        </div>

        {/* Sección de contacto */}
        <div className="w-full py-12 border-t border-custom-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-2xl font-bold text-textPrimary">¿Listo para transformar tu idea en realidad?</h3>
              <p className="text-textMuted mt-2">Hablemos sobre tu próximo proyecto de software.</p>
            </div>
            <Link
              href="/contact"
              className="flex items-center gap-2 bg-primary hover:bg-opacity-90 transition-all px-6 py-3 rounded-md text-textPrimary"
            >
              <span>Contactar ahora</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SoftwareDevelopment

