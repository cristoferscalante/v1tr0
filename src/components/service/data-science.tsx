import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
} from "lucide-react"

const DataScience = () => {
  return (
    <section className="w-full py-24 bg-background font-alexandria">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Encabezado de sección */}
        <div className="grid gap-10 md:gap-16 lg:grid-cols-2 mb-20">
          <div className="space-y-4">
            <div className="text-highlight text-sm">
              Ciencia de Datos y Análisis Avanzado
            </div>
            <h2 className="text-4xl font-bold tracking-tighter text-textPrimary sm:text-5xl">
              Ciencia de Datos y Análisis Avanzado
            </h2>
            <div className="font-semibold text-xl text-textPrimary">
              Convertimos datos en sistemas inteligentes
            </div>
          </div>
          <div className="flex flex-col items-start space-y-4">
            <p className="text-textMuted text-lg md:text-xl">
              Bienvenido a la dependencia de Ciencia de Datos y Análisis Avanzado de V1TR0. Te encuentras en el epicentro donde los datos cobran vida y se transforman en conocimiento estratégico. Todo lo que nos rodea—las dinámicas sociales, las organizaciones y el mundo en general—funciona a través de datos, modelos algorítmicos e inteligencia artificial. No es solo información, es la clave para comprender patrones, anticipar comportamientos y tomar decisiones fundamentadas.
            </p>
            <p className="text-textMuted text-lg md:text-xl">
              Lo que descubrirás a continuación es la base sobre la cual se construyen estrategias efectivas y soluciones innovadoras. Adéntrate en este universo donde los datos nos enseñan el funcionamiento de la totalidad.
            </p>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="w-full h-px bg-custom-2 my-10"></div>

        {/* Sección 01 - Análisis de Datos */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">01</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">
            Análisis de Datos
          </h3>
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-textMuted text-lg mb-8">
                La información fluye incesante, vastos océanos de datos que contienen la esencia misma de nuestras interacciones, decisiones y estructuras se definen sin ordenarse. Con V1TR0 navegamos a través de este océano, aplicando técnicas avanzadas de análisis que nos permiten extraer insights accionables. Así nuestro enfoque fusiona la rigurosidad de la estadística con el análisis estratégico, trazando un puente entre el conocimiento crudo y la toma de decisiones informada. Cada cifra, cada anomalía, cada correlación es un indicio de una estructura más grande, un modelo subyacente que moldea su funcionamiento. Así, avanzamos en la exploración de este universo de datos, desentrañando su lógica interna para convertirlo en ventaja competitiva y solución innovadora.
              </p>
              <p className="text-textMuted text-lg mb-8">
                <strong>El proceso de análisis de datos sigue diversas etapas esenciales:</strong>
              </p>
              <ul className="list-disc list-inside text-textMuted text-lg space-y-2">
                <li>
                  <strong>Recopilación y Preparación de Datos:</strong> Recolectamos datos de múltiples fuentes, los limpiamos y los estructuramos para garantizar su calidad y utilidad.
                </li>
                <li>
                  <strong>Análisis Exploratorio:</strong> Descubrimos patrones, tendencias y anomalías en los datos para generar hipótesis valiosas que guíen la toma de decisiones.
                </li>
                <li>
                  <strong>Modelado y Análisis Predictivo:</strong> Utilizamos modelos estadísticos y machine learning para prever comportamientos futuros y anticipar posibles escenarios.
                </li>
                <li>
                  <strong>Minería de Datos:</strong> Extraemos conocimiento valioso de grandes conjuntos de datos estructurados y no estructurados mediante técnicas avanzadas de exploración.
                </li>
                <li>
                  <strong>Interpretación y Comunicación:</strong> Traducimos los hallazgos en recomendaciones accionables y visualizaciones que facilitan su comprensión y aplicación estratégica.
                </li>
              </ul>
            </div>
            <div>
              <Image
                src="/service/analisis-de-datos.png"
                alt="Análisis de datos"
                width={800}
                height={900}
                className="rounded-md object-cover"
              />
            </div>
          </div>
        </div>

        {/* Sección 02 - Visualización de Datos */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">02</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">
            Visualización de Datos
          </h3>
          <div className="grid md:grid-cols-2 gap-16 ">
            <div>
              <Image
                src="/service/visualizacion-de-datos.png"
                alt="Visualización de datos"
                width={400}
                height={500}
                className="rounded-md object-cover"
              />
            </div>
            <div>
              <p className="text-textMuted text-lg mb-8">
                Los datos, por sí solos, son una maraña de cifras y variables sin rostro. Pero cuando se les otorga forma, cuando se traducen en imágenes, gráficos y narrativas visuales, adquieren un nuevo significado. La visualización de datos es el puente entre la complejidad y la comprensión, la clave que transforma la información en conocimiento accesible.
              </p>
              <p className="text-textMuted text-lg mb-8">
                Aquí, cada punto de datos es una pieza dentro de un lienzo dinámico que revela patrones, tendencias y relaciones invisibles a simple vista. Convertimos datos complejos en visualizaciones interactivas que iluminan decisiones estratégicas.
              </p>
              <ul className="list-disc list-inside text-textMuted text-lg space-y-2">
                <li>
                  <strong>Dashboards Interactivos:</strong> Paneles de control dinámicos que permiten explorar los datos desde múltiples perspectivas, ofreciendo una visión en tiempo real de la realidad operativa.
                </li>
                <li>
                  <strong>Informes Automatizados:</strong> Sistemas inteligentes que generan reportes de manera continua, asegurando que la información crítica esté siempre disponible sin esfuerzo manual.
                </li>
                <li>
                  <strong>Storytelling con Datos:</strong> Construcción de narrativas visuales impactantes que comunican eficazmente los insights más relevantes, permitiendo que los datos hablen con claridad y precisión.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sección 03 - Auditorías de Datos */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">03</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">
            Auditorías de Datos
          </h3>
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-textMuted text-lg mb-8">
                En la inmensidad de los sistemas de información, cada dato es un engranaje que mantiene en marcha la maquinaria de una organización. Pero, ¿qué sucede cuando estos engranajes están corroídos por la inconsistencia, la duplicidad o la imprecisión? La integridad de los datos es la piedra angular de cualquier estrategia basada en información. Nuestras auditorías no solo examinan la calidad de los datos, sino que también iluminan su fiabilidad, revelando riesgos ocultos y oportunidades de mejora que de otro modo permanecerían velados.
              </p>
              <ul className="list-disc list-inside text-textMuted text-lg space-y-2">
                <li>
                  <strong>Calidad de Datos:</strong> Diseccionamos la precisión, completitud y consistencia de los datos, garantizando que sean confiables y útiles para la toma de decisiones estratégicas.
                </li>
                <li>
                  <strong>Cumplimiento Normativo:</strong> Aseguramos que la gestión de datos cumpla con las regulaciones vigentes (GDPR, LOPD, etc.), evitando riesgos legales y operacionales.
                </li>
                <li>
                  <strong>Seguridad de Datos:</strong> Examinamos vulnerabilidades y aplicamos estrategias para blindar los activos de información contra accesos no autorizados y brechas de seguridad.
                </li>
              </ul>
            </div>
            <div>
              <Image
                src="/service/auditorias-de-datos.png"
                alt="Auditorías de datos"
                width={400}
                height={500}
                className="rounded-md object-cover"
              />
            </div>
          </div>
        </div>

        {/* Sección 04 - Inteligencia Artificial y Machine Learning */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">04</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">
            Inteligencia Artificial y Machine Learning
          </h3>
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <Image
                src="/service/inteligencia-artificial.png"
                alt="Inteligencia Artificial"
                width={600}
                height={700}
                className="rounded-md object-cover"
              />
            </div>
            <div>
              <p className="text-textMuted text-lg mb-8">
                La inteligencia artificial no es solo una herramienta; es una nueva forma de percibir el software. Cada modelo que construimos es un sistema que aprende, se adapta y evoluciona con el entorno, descubriendo patrones donde el ojo humano solo vería cajas negras. En esta frontera del conocimiento, la IA y el Machine Learning se erigen como arquitectos del futuro, automatizando procesos, revelando estructuras invisibles y generando predicciones con una precisión sin precedentes.
              </p>
              <ul className="list-disc list-inside text-textMuted text-lg space-y-2">
                <li>
                  <strong>Modelos Predictivos:</strong> Diseñamos algoritmos capaces de anticipar comportamientos, tendencias y resultados futuros, transformando la incertidumbre en conocimiento estratégico.
                </li>
                <li>
                  <strong>Sistemas de Recomendación:</strong> Desarrollamos motores de inteligencia capaces de sugerir productos, contenidos o acciones personalizadas, potenciando la interacción con los usuarios.
                </li>
                <li>
                  <strong>Procesamiento de Lenguaje Natural:</strong> Desciframos el significado oculto en textos, extrayendo sentimientos, temas y entidades clave para comprender mejor las dinámicas del lenguaje y su impacto en el negocio.
                </li>
                <li>
                  <strong>Automatización de Tareas:</strong> Implementamos soluciones en Python e IA que agilizan procesos repetitivos, optimizando tiempos y reduciendo errores humanos en operaciones críticas.
                </li>
              </ul>
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
