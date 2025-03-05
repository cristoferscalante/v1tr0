import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BarChart2,
  Brain,
  PieChartIcon as ChartPieIcon,
  ClipboardCheck,
  Database,
  LineChart,
  Search,
  TrendingUp,
} from "lucide-react"

const DataScience = () => {
  return (
    <section className="w-full py-24 bg-background font-alexandria">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Encabezado de sección */}
        <div className="grid gap-10 md:gap-16 lg:grid-cols-2 mb-20">
          <div className="space-y-4">
            <div className="text-highlight text-sm">Ciencia de Datos</div>
            <h2 className="text-4xl font-bold tracking-tighter text-textPrimary sm:text-5xl">
              Transformando datos en decisiones estratégicas
            </h2>
          </div>
          <div className="flex flex-col items-start space-y-4">
            <p className="text-textMuted text-lg md:text-xl">
              En V1TR0 convertimos el potencial oculto de tus datos en ventajas competitivas. Nuestras soluciones de
              ciencia de datos te permiten descubrir patrones, predecir tendencias y optimizar procesos para impulsar el
              crecimiento de tu negocio.
            </p>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="w-full h-px bg-custom-2 my-10"></div>

        {/* Sección 01 - Análisis de Datos */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">01</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Análisis de Datos</h3>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-textMuted text-lg mb-8">
                Transformamos grandes volúmenes de datos en insights accionables mediante técnicas avanzadas de
                análisis. Nuestro enfoque combina experiencia estadística con conocimiento de negocio para identificar
                oportunidades de mejora y optimización.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <Search className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Análisis Exploratorio</h4>
                    <p className="text-textMuted">
                      Descubrimos patrones, tendencias y anomalías en tus datos para generar hipótesis valiosas.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Análisis Predictivo</h4>
                    <p className="text-textMuted">
                      Utilizamos modelos estadísticos y machine learning para prever comportamientos futuros.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <Database className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Minería de Datos</h4>
                    <p className="text-textMuted">
                      Extraemos conocimiento valioso de grandes conjuntos de datos estructurados y no estructurados.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Análisis de datos"
                width={500}
                height={600}
                className="rounded-md object-cover"
              />
            </div>
          </div>
        </div>

        {/* Sección 02 - Visualización de Datos */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">02</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Visualización de Datos</h3>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Visualización de datos"
                width={500}
                height={600}
                className="rounded-md object-cover"
              />
            </div>

            <div>
              <p className="text-textMuted text-lg mb-8">
                Convertimos datos complejos en visualizaciones interactivas y comprensibles que facilitan la toma de
                decisiones. Nuestros dashboards personalizados presentan la información clave de forma clara y accesible
                para todos los niveles de tu organización.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <BarChart2 className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Dashboards Interactivos</h4>
                    <p className="text-textMuted">
                      Creamos paneles de control dinámicos que permiten explorar los datos desde múltiples perspectivas.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <LineChart className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Informes Automatizados</h4>
                    <p className="text-textMuted">
                      Implementamos sistemas de generación automática de informes para monitoreo continuo.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <ChartPieIcon className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Storytelling con Datos</h4>
                    <p className="text-textMuted">
                      Construimos narrativas visuales que comunican eficazmente los insights más relevantes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección 03 - Auditorías de Datos */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">03</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Auditorías de Datos</h3>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-textMuted text-lg mb-8">
                Evaluamos la calidad, integridad y seguridad de tus datos para identificar riesgos y oportunidades de
                mejora. Nuestras auditorías proporcionan una visión clara del estado actual de tus activos de datos y
                recomendaciones concretas para optimizar su gestión.
              </p>

              <div className="space-y-6">
                <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg">
                  <h4 className="text-xl font-bold text-textPrimary mb-2">Calidad de Datos</h4>
                  <p className="text-textMuted">
                    Evaluamos la precisión, completitud, consistencia y fiabilidad de tus datos para garantizar que las
                    decisiones se basen en información confiable.
                  </p>
                </div>

                <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg">
                  <h4 className="text-xl font-bold text-textPrimary mb-2">Cumplimiento Normativo</h4>
                  <p className="text-textMuted">
                    Verificamos que tus procesos de gestión de datos cumplan con las regulaciones aplicables (GDPR,
                    LOPD, etc.) y estándares de la industria.
                  </p>
                </div>

                <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg">
                  <h4 className="text-xl font-bold text-textPrimary mb-2">Seguridad de Datos</h4>
                  <p className="text-textMuted">
                    Identificamos vulnerabilidades y recomendamos medidas para proteger tus activos de datos contra
                    accesos no autorizados y brechas de seguridad.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Auditorías de datos"
                width={500}
                height={600}
                className="rounded-md object-cover"
              />
            </div>
          </div>
        </div>

        {/* Sección 04 - Inteligencia Artificial y Machine Learning */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">04</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Inteligencia Artificial y Machine Learning</h3>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Inteligencia Artificial"
                width={500}
                height={600}
                className="rounded-md object-cover"
              />
            </div>

            <div>
              <p className="text-textMuted text-lg mb-8">
                Implementamos soluciones avanzadas de IA y Machine Learning para automatizar procesos, detectar patrones
                complejos y generar predicciones precisas. Nuestros modelos se adaptan a las necesidades específicas de
                tu negocio, proporcionando resultados tangibles y medibles.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Modelos Predictivos</h4>
                    <p className="text-textMuted">
                      Desarrollamos algoritmos que anticipan comportamientos, tendencias y resultados futuros.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <ClipboardCheck className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Sistemas de Recomendación</h4>
                    <p className="text-textMuted">
                      Creamos sistemas inteligentes que sugieren productos, contenidos o acciones personalizadas.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <Search className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Procesamiento de Lenguaje Natural</h4>
                    <p className="text-textMuted">
                      Analizamos textos para extraer sentimientos, temas y entidades relevantes para tu negocio.
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
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Tendencias del Mercado en Ciencia de Datos</h3>

          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="w-16 h-16 rounded-full bg-custom-2 flex items-center justify-center mb-6">
                <span className="text-highlight text-2xl font-bold">1</span>
              </div>
              <h4 className="text-xl font-bold text-textPrimary mb-4">DataOps y MLOps</h4>
              <p className="text-textMuted">
                Implementamos prácticas de DataOps y MLOps para automatizar y optimizar el ciclo de vida de los
                proyectos de datos, reduciendo el tiempo de implementación y mejorando la calidad de los resultados.
              </p>
            </div>

            <div>
              <div className="w-16 h-16 rounded-full bg-custom-2 flex items-center justify-center mb-6">
                <span className="text-highlight text-2xl font-bold">2</span>
              </div>
              <h4 className="text-xl font-bold text-textPrimary mb-4">IA Explicable (XAI)</h4>
              <p className="text-textMuted">
                Desarrollamos modelos de IA transparentes y comprensibles, permitiendo entender el razonamiento detrás
                de cada predicción o recomendación, fundamental para sectores regulados y decisiones críticas.
              </p>
            </div>

            <div>
              <div className="w-16 h-16 rounded-full bg-custom-2 flex items-center justify-center mb-6">
                <span className="text-highlight text-2xl font-bold">3</span>
              </div>
              <h4 className="text-xl font-bold text-textPrimary mb-4">Análisis en Tiempo Real</h4>
              <p className="text-textMuted">
                Implementamos soluciones de procesamiento de datos en tiempo real que permiten responder inmediatamente
                a cambios en el comportamiento de usuarios, mercados o sistemas operativos.
              </p>
            </div>
          </div>
        </div>

        {/* Sección de contacto */}
        <div className="w-full py-12 border-t border-custom-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-2xl font-bold text-textPrimary">
                ¿Listo para desbloquear el potencial de tus datos?
              </h3>
              <p className="text-textMuted mt-2">
                Hablemos sobre cómo la ciencia de datos puede transformar tu negocio.
              </p>
            </div>
            <Link
              href="/contact"
              className="flex items-center gap-2 bg-primary hover:bg-opacity-90 transition-all px-6 py-3 rounded-md text-textPrimary"
            >
              <span>Solicitar consulta</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DataScience

