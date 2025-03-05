import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Calendar,
  CheckSquare,
  ClipboardList,
  GitBranch,
  Kanban,
  Lightbulb,
  Settings,
  Target,
  Users,
} from "lucide-react"

const ProjectManagement = () => {
  return (
    <section className="w-full py-24 bg-background font-alexandria">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Encabezado de sección */}
        <div className="grid gap-10 md:gap-16 lg:grid-cols-2 mb-20">
          <div className="space-y-4">
            <div className="text-highlight text-sm">Gestión de Proyectos</div>
            <h2 className="text-4xl font-bold tracking-tighter text-textPrimary sm:text-5xl">
              Impulsando la excelencia en la ejecución de proyectos tecnológicos
            </h2>
          </div>
          <div className="flex flex-col items-start space-y-4">
            <p className="text-textMuted text-lg md:text-xl">
              En V1TR0 ofrecemos servicios integrales de gestión de proyectos tecnológicos que garantizan la entrega
              exitosa de soluciones innovadoras. Combinamos metodologías probadas, herramientas avanzadas y experiencia
              especializada para maximizar el valor de tus iniciativas tecnológicas.
            </p>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="w-full h-px bg-custom-2 my-10"></div>

        {/* Sección 01 - Gestión y Administración */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">01</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Gestión y Administración</h3>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-textMuted text-lg mb-8">
                Implementamos procesos estructurados para planificar, ejecutar y controlar proyectos tecnológicos
                complejos. Nuestro enfoque garantiza la alineación con los objetivos estratégicos, la optimización de
                recursos y la entrega de resultados medibles.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Oficina de Gestión de Proyectos (PMO)</h4>
                    <p className="text-textMuted">
                      Establecemos estructuras de gobierno que estandarizan procesos y mejoran la eficiencia en la
                      gestión de múltiples proyectos.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <Kanban className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Metodologías Ágiles</h4>
                    <p className="text-textMuted">
                      Aplicamos Scrum, Kanban y enfoques híbridos adaptados a las necesidades específicas de cada
                      proyecto y organización.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Planificación y Seguimiento</h4>
                    <p className="text-textMuted">
                      Desarrollamos planes detallados y realizamos un seguimiento continuo para garantizar el
                      cumplimiento de plazos y objetivos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Gestión de proyectos"
                width={500}
                height={600}
                className="rounded-md object-cover"
              />
            </div>
          </div>
        </div>

        {/* Sección 02 - Implementación y Construcción */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">02</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Implementación y Construcción</h3>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Implementación de proyectos"
                width={500}
                height={600}
                className="rounded-md object-cover"
              />
            </div>

            <div>
              <p className="text-textMuted text-lg mb-8">
                Ejecutamos la construcción e implementación de soluciones tecnológicas con equipos multidisciplinarios
                altamente cualificados. Nuestro enfoque de entrega continua garantiza resultados incrementales y
                adaptabilidad a los cambios del entorno.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <GitBranch className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">DevOps y CI/CD</h4>
                    <p className="text-textMuted">
                      Implementamos prácticas de integración y entrega continua para acelerar el tiempo de salida al
                      mercado.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <CheckSquare className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Aseguramiento de Calidad</h4>
                    <p className="text-textMuted">
                      Aplicamos procesos rigurosos de testing y validación para garantizar productos libres de defectos.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <Settings className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Automatización de Procesos</h4>
                    <p className="text-textMuted">
                      Optimizamos flujos de trabajo mediante la automatización de tareas repetitivas y procesos
                      complejos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección 03 - Investigación e Innovación */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">03</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Investigación e Innovación</h3>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-textMuted text-lg mb-8">
                Impulsamos la innovación mediante procesos estructurados de investigación y experimentación. Nuestro
                enfoque combina análisis de tendencias tecnológicas, design thinking y prototipado rápido para
                desarrollar soluciones disruptivas que generan ventajas competitivas.
              </p>

              <div className="space-y-6">
                <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg">
                  <h4 className="text-xl font-bold text-textPrimary mb-2">Design Thinking</h4>
                  <p className="text-textMuted">
                    Aplicamos metodologías centradas en el usuario para identificar necesidades no satisfechas y
                    desarrollar soluciones innovadoras que generan valor real.
                  </p>
                </div>

                <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg">
                  <h4 className="text-xl font-bold text-textPrimary mb-2">Proof of Concept (PoC)</h4>
                  <p className="text-textMuted">
                    Desarrollamos prototipos funcionales para validar conceptos, reducir riesgos y demostrar la
                    viabilidad de nuevas ideas antes de la implementación completa.
                  </p>
                </div>

                <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg">
                  <h4 className="text-xl font-bold text-textPrimary mb-2">Vigilancia Tecnológica</h4>
                  <p className="text-textMuted">
                    Monitorizamos continuamente las tendencias emergentes para identificar oportunidades de innovación y
                    mantener la competitividad en un entorno cambiante.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Investigación e innovación"
                width={500}
                height={600}
                className="rounded-md object-cover"
              />
            </div>
          </div>
        </div>

        {/* Sección 04 - Consultoría Estratégica */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">04</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Consultoría Estratégica</h3>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Consultoría estratégica"
                width={500}
                height={600}
                className="rounded-md object-cover"
              />
            </div>

            <div>
              <p className="text-textMuted text-lg mb-8">
                Proporcionamos asesoramiento experto para alinear la tecnología con los objetivos de negocio. Nuestros
                consultores ayudan a definir hojas de ruta tecnológicas, optimizar procesos y desarrollar capacidades
                organizativas que impulsan la transformación digital.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Transformación Digital</h4>
                    <p className="text-textMuted">
                      Diseñamos e implementamos estrategias para la adopción efectiva de tecnologías digitales en toda
                      la organización.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <ClipboardList className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Optimización de Procesos</h4>
                    <p className="text-textMuted">
                      Analizamos y rediseñamos procesos de negocio para mejorar la eficiencia y adaptabilidad
                      organizacional.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Gestión del Cambio</h4>
                    <p className="text-textMuted">
                      Facilitamos la adopción de nuevas tecnologías y procesos mediante estrategias efectivas de gestión
                      del cambio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección 05 - Tendencias del Mercado */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">05</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Tendencias Actuales en Gestión de Proyectos</h3>

          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="w-16 h-16 rounded-full bg-custom-2 flex items-center justify-center mb-6">
                <span className="text-highlight text-2xl font-bold">1</span>
              </div>
              <h4 className="text-xl font-bold text-textPrimary mb-4">Gestión Híbrida</h4>
              <p className="text-textMuted">
                Combinamos metodologías ágiles y tradicionales para crear enfoques personalizados que se adaptan a las
                necesidades específicas de cada proyecto y organización, maximizando la eficiencia y flexibilidad.
              </p>
            </div>

            <div>
              <div className="w-16 h-16 rounded-full bg-custom-2 flex items-center justify-center mb-6">
                <span className="text-highlight text-2xl font-bold">2</span>
              </div>
              <h4 className="text-xl font-bold text-textPrimary mb-4">Inteligencia Artificial en PM</h4>
              <p className="text-textMuted">
                Implementamos soluciones basadas en IA para automatizar tareas rutinarias, predecir riesgos, optimizar
                la asignación de recursos y proporcionar insights accionables para la toma de decisiones.
              </p>
            </div>

            <div>
              <div className="w-16 h-16 rounded-full bg-custom-2 flex items-center justify-center mb-6">
                <span className="text-highlight text-2xl font-bold">3</span>
              </div>
              <h4 className="text-xl font-bold text-textPrimary mb-4">Equipos Distribuidos</h4>
              <p className="text-textMuted">
                Aplicamos metodologías y herramientas especializadas para gestionar eficazmente equipos remotos y
                distribuidos globalmente, manteniendo la productividad, colaboración y cohesión del equipo.
              </p>
            </div>
          </div>
        </div>

        {/* Sección 06 - Herramientas y Tecnologías */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">06</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Herramientas y Tecnologías</h3>

          <p className="text-textMuted text-lg mb-10 max-w-3xl">
            Utilizamos un ecosistema integrado de herramientas avanzadas para optimizar cada aspecto de la gestión de
            proyectos, desde la planificación hasta la entrega y análisis.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg text-center">
              <h4 className="text-lg font-bold text-textPrimary mb-2">Jira</h4>
              <p className="text-textMuted">Gestión ágil de proyectos</p>
            </div>

            <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg text-center">
              <h4 className="text-lg font-bold text-textPrimary mb-2">Confluence</h4>
              <p className="text-textMuted">Documentación colaborativa</p>
            </div>

            <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg text-center">
              <h4 className="text-lg font-bold text-textPrimary mb-2">Microsoft Project</h4>
              <p className="text-textMuted">Planificación avanzada</p>
            </div>

            <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg text-center">
              <h4 className="text-lg font-bold text-textPrimary mb-2">Slack</h4>
              <p className="text-textMuted">Comunicación en tiempo real</p>
            </div>

            <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg text-center">
              <h4 className="text-lg font-bold text-textPrimary mb-2">Trello</h4>
              <p className="text-textMuted">Gestión visual de tareas</p>
            </div>

            <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg text-center">
              <h4 className="text-lg font-bold text-textPrimary mb-2">GitHub</h4>
              <p className="text-textMuted">Control de versiones</p>
            </div>

            <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg text-center">
              <h4 className="text-lg font-bold text-textPrimary mb-2">Power BI</h4>
              <p className="text-textMuted">Análisis y reporting</p>
            </div>

            <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg text-center">
              <h4 className="text-lg font-bold text-textPrimary mb-2">Monday.com</h4>
              <p className="text-textMuted">Gestión integral de proyectos</p>
            </div>
          </div>
        </div>

        {/* Sección de contacto */}
        <div className="w-full py-12 border-t border-custom-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-2xl font-bold text-textPrimary">
                ¿Necesitas optimizar la gestión de tus proyectos tecnológicos?
              </h3>
              <p className="text-textMuted mt-2">
                Hablemos sobre cómo podemos ayudarte a alcanzar tus objetivos con mayor eficiencia.
              </p>
            </div>
            <Link
              href="/contact"
              className="flex items-center gap-2 bg-primary hover:bg-opacity-90 transition-all px-6 py-3 rounded-md text-textPrimary"
            >
              <span>Solicitar asesoramiento</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectManagement

