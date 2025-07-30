"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight, BarChart, PieChart, TrendingUp, X, Send } from "lucide-react"

// Add the import for BokehBackground at the top of the file, after the other imports
import BokehBackground from "@/components/about/BokehBackground"

export default function DataScience() {
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    serviceArea: "datos", // Preseleccionamos datos
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Añadir estos estados para controlar los efectos de las imágenes
  const [isConsultoriaGlowing, setIsConsultoriaGlowing] = useState(false)
  const [isConsultoriaShaking, setIsConsultoriaShaking] = useState(false)
  const [isAutomatizacionGlowing, setIsAutomatizacionGlowing] = useState(false)
  const [isAutomatizacionShaking, setIsAutomatizacionShaking] = useState(false)
  const [isIAGlowing, setIsIAGlowing] = useState(false)
  const [isIAShaking, setIsIAShaking] = useState(false)

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío de datos
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mostrar mensaje de éxito
    setSubmitSuccess(true)
    setIsSubmitting(false)

    // Cerrar el popup después de 3 segundos
    setTimeout(() => {
      setIsContactPopupOpen(false)
      setSubmitSuccess(false)
      setFormData({ name: "", email: "", message: "", serviceArea: "datos" })
    }, 3000)
  }

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Añadir estas funciones para manejar los clics en las imágenes
  const handleConsultoriaImageClick = () => {
    setIsConsultoriaGlowing(true)
    setIsConsultoriaShaking(true)
    setTimeout(() => setIsConsultoriaShaking(false), 500)
    setTimeout(() => setIsConsultoriaGlowing(false), 800)
  }

  const handleAutomatizacionImageClick = () => {
    setIsAutomatizacionGlowing(true)
    setIsAutomatizacionShaking(true)
    setTimeout(() => setIsAutomatizacionShaking(false), 500)
    setTimeout(() => setIsAutomatizacionGlowing(false), 800)
  }

  const handleIAImageClick = () => {
    setIsIAGlowing(true)
    setIsIAShaking(true)
    setTimeout(() => setIsIAShaking(false), 500)
    setTimeout(() => setIsIAGlowing(false), 800)
  }

  return (
    <section className="w-full py-24 font-sans relative">
      <BokehBackground style={{ zIndex: -1 }} />
      <div className="container px-4 md:px-6 mx-auto">
        {/* Encabezado de sección */}
        <div className="grid gap-10 md:gap-16 lg:grid-cols-2 mb-20">
          <div className="space-y-4">
            <div className="text-highlight text-sm">Ciencia de datos & Análisis avanzado</div>
            <h2 className="text-4xl font-bold tracking-tighter text-textPrimary sm:text-5xl">
              Sistemas de Información
            </h2>
          </div>
          <div className="flex flex-col items-start space-y-4">
            <p className="text-textMuted text-lg md:text-xl">
              Los datos son un activo estratégico. Comprenderlos, gestionarlos y convertirlos en decisiones inteligentes
              es lo que marca la diferencia. ¿Cómo se logra esto? Construyendo una infraestructura de datos robusta:
              desde fomentar una cultura de datos, a la identificación de insights o patrones. Ello permite llegar a
              automatizar el proceso con reportes que revelen lo que está ocurriendo mes a mes en tu entorno
              organizativo o sistema de trabajo.
            </p>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="w-full h-px bg-custom-2 my-10"></div>

        {/* Sección 01 - Consultoría en Cultura de Datos */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">01</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">
            Consultoría en Cultura de Datos & Análisis Avanzado
          </h3>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-textMuted text-lg mb-8">
                Ayudamos a las organizaciones y los proyectos a adoptar una cultura basada en los datos como eje de
                decisión. Dado que una organización o proyecto que no mide, no aprende. Y sin aprendizaje, no hay
                mejora. Identificando la etapa en que te encuentras, trabajamos junto a ti para entender tu nivel actual
                de madurez analítica, con ello podremos alinear la visión de tu objetivos con una estrategia de datos
                clara.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <BarChart className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Análisis Exploratorio</h4>
                    <p className="text-textMuted">
                      Examinamos tus datos para descubrir insights ocultos y oportunidades de mejora en tus procesos y
                      estrategias.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                    <PieChart className="w-6 h-6 text-highlight" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-textPrimary mb-2">Visualización de Datos</h4>
                    <p className="text-textMuted">
                      Creamos dashboards interactivos y visualizaciones claras que comunican eficazmente la historia
                      detrás de tus datos.
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
                      Utilizamos modelos estadísticos y machine learning para predecir tendencias futuras y anticipar
                      cambios en tu mercado.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Consultor%C3%ADa%20en%20Cultura%20de%20Datos%20%26%20An%C3%A1lisis%20Avanzado-szmhM8tetW7ej9FpI2Y0iKv3hyH9vb.png"
                alt="Consultoría en Cultura de Datos & Análisis Avanzado - Ecosistemas de datos"
                width={500}
                height={600}
                onClick={handleConsultoriaImageClick}
                className={`rounded-md object-contain transition-all duration-700 ease-in-out hover:scale-105 animate-gentle-balance ${
                  isConsultoriaGlowing ? "animate-glow-pulse" : ""
                } ${isConsultoriaShaking ? "animate-shake" : ""}`}
                style={{
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        </div>

        {/* Sección 02 - Automatización de Reportes */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">02</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">
            Automatización de tareas y reportes de Análisis y Visualización de datos
          </h3>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Automatizaci%C3%B3n%20de%20tareas%20y%20reportes%20de%20An%C3%A1lisis%20y%20Visualizaci%C3%B3n%20de%20datos-viab5oAiUjBu7Jqw8XW9WrWKWlDUyy.png"
                alt="Automatización de tareas y reportes de Análisis y Visualización de datos"
                width={500}
                height={600}
                onClick={handleAutomatizacionImageClick}
                className={`rounded-md object-cover transition-all duration-700 ease-in-out hover:scale-105 animate-gentle-balance ${
                  isAutomatizacionGlowing ? "animate-glow-pulse" : ""
                } ${isAutomatizacionShaking ? "animate-shake" : ""}`}
                style={{
                  cursor: "pointer",
                }}
              />
            </div>

            <div>
              <p className="text-textMuted text-lg mb-8">
                Transformamos procesos manuales en flujos de trabajo automatizados que generan reportes precisos y
                actualizados. Esto libera tiempo valioso de tu equipo y garantiza la consistencia de la información.
              </p>

              <div className="space-y-6">
                <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg">
                  <h4 className="text-xl font-bold text-textPrimary mb-2">Reportes Periódicos</h4>
                  <p className="text-textMuted">
                    Configuramos sistemas que generan automáticamente informes diarios, semanales o mensuales con los
                    KPIs más relevantes para tu negocio.
                  </p>
                </div>

                <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg">
                  <h4 className="text-xl font-bold text-textPrimary mb-2">Alertas Inteligentes</h4>
                  <p className="text-textMuted">
                    Implementamos sistemas de alertas que te notifican cuando tus métricas clave superan umbrales
                    predefinidos.
                  </p>
                </div>

                <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg">
                  <h4 className="text-xl font-bold text-textPrimary mb-2">Distribución Automatizada</h4>
                  <p className="text-textMuted">
                    Creamos flujos de trabajo que distribuyen automáticamente los reportes a los stakeholders adecuados
                    en el formato que prefieran.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección 03 - Inteligencia Artificial */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">03</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Implementación de Chat Bots & agentes IA</h3>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="text-textMuted text-lg mb-8">
                Nuestros agentes de IA pueden procesar, analizar y actuar sobre grandes volúmenes de datos,
                permitiéndote enfocarte en lo que realmente importa: la estrategia y la innovación.
              </p>

              <div className="space-y-6">
                <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg">
                  <h4 className="text-xl font-bold text-textPrimary mb-2">Modelos Predictivos</h4>
                  <p className="text-textMuted">
                    Desarrollamos modelos que predicen comportamientos futuros, como la rotación de clientes, demanda de
                    productos o tendencias de mercado.
                  </p>
                </div>

                <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg">
                  <h4 className="text-xl font-bold text-textPrimary mb-2">Procesamiento de Lenguaje Natural</h4>
                  <p className="text-textMuted">
                    Analizamos texto no estructurado para extraer insights de comentarios de clientes, redes sociales y
                    otras fuentes textuales.
                  </p>
                </div>

                <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg">
                  <h4 className="text-xl font-bold text-textPrimary mb-2">Sistemas de Recomendación</h4>
                  <p className="text-textMuted">
                    Creamos algoritmos que personalizan recomendaciones para tus clientes, aumentando la relevancia y
                    las conversiones.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Implementaci%C3%B3n%20de%20Chat%20Bots%20%26%20agentes%20IA-w8hmJxWIDazbkNNQQUH4k5yFr6Lmzd.png"
                alt="Implementación de Chat Bots & agentes IA"
                width={500}
                height={600}
                onClick={handleIAImageClick}
                className={`rounded-md object-cover transition-all duration-700 ease-in-out hover:scale-105 animate-gentle-balance ${
                  isIAGlowing ? "animate-glow-pulse" : ""
                } ${isIAShaking ? "animate-shake" : ""}`}
                style={{
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        </div>

        {/* Sección 04 - Herramientas y Tecnologías */}
        <div className="mb-20">
          <div className="text-2xl text-primary mb-10">04</div>
          <h3 className="text-3xl font-bold text-textPrimary mb-10">Herramientas y Tecnologías</h3>

          <p className="text-textMuted text-lg mb-10 max-w-3xl">
            Utilizamos un ecosistema de herramientas avanzadas para el análisis, visualización y procesamiento de datos,
            adaptándonos a las necesidades específicas de cada proyecto.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg text-center">
              <h4 className="text-lg font-bold text-textPrimary mb-2">Python</h4>
              <p className="text-textMuted">Análisis y modelado</p>
            </div>

            <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg text-center">
              <h4 className="text-lg font-bold text-textPrimary mb-2">R</h4>
              <p className="text-textMuted">Estadística avanzada</p>
            </div>

            <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg text-center">
              <h4 className="text-lg font-bold text-textPrimary mb-2">Tableau</h4>
              <p className="text-textMuted">Visualización de datos</p>
            </div>

            <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg text-center">
              <h4 className="text-lg font-bold text-textPrimary mb-2">Power BI</h4>
              <p className="text-textMuted">Dashboards interactivos</p>
            </div>

            <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg text-center">
              <h4 className="text-lg font-bold text-textPrimary mb-2">TensorFlow</h4>
              <p className="text-textMuted">Machine learning</p>
            </div>

            <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg text-center">
              <h4 className="text-lg font-bold text-textPrimary mb-2">SQL</h4>
              <p className="text-textMuted">Bases de datos</p>
            </div>

            <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg text-center">
              <h4 className="text-lg font-bold text-textPrimary mb-2">Spark</h4>
              <p className="text-textMuted">Big data</p>
            </div>

            <div className="p-6 bg-custom-1 border border-custom-2 rounded-lg text-center">
              <h4 className="text-lg font-bold text-textPrimary mb-2">AWS/Azure</h4>
              <p className="text-textMuted">Cloud computing</p>
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
                Hablemos sobre cómo podemos ayudarte a transformar tus datos en decisiones estratégicas.
              </p>
            </div>
            <button
              onClick={() => setIsContactPopupOpen(true)}
              className="flex items-center gap-2 bg-primary hover:bg-opacity-90 transition-all px-6 py-3 rounded-md text-textPrimary"
            >
              <span>Contactar ahora</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Popup de contacto */}
      {isContactPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-backgroundSecondary rounded-xl p-6 w-full max-w-md shadow-2xl border border-custom-2/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-textPrimary">Contactar ahora</h3>
              <button
                onClick={() => setIsContactPopupOpen(false)}
                className="p-1 rounded-full hover:bg-custom-1/50 transition-colors"
              >
                <X className="w-5 h-5 text-textMuted" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="text-lg font-semibold text-textPrimary mb-2">¡Mensaje enviado!</h4>
                <p className="text-textMuted">Nos pondremos en contacto contigo lo antes posible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-textMuted mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-custom-1/30 border border-custom-2/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight text-gray-500"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-textMuted mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-custom-1/30 border border-custom-2/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight text-gray-500"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="serviceArea" className="block text-sm font-medium text-textMuted mb-1">
                    Área de Servicio
                  </label>
                  <select
                    id="serviceArea"
                    name="serviceArea"
                    value={formData.serviceArea}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-custom-1/30 border border-custom-2/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight text-gray-500 [&>option]:text-gray-500 dark:[&>option]:text-gray-400"
                  >
                    <option value="desarrollo">Desarrollo de Software</option>
                    <option value="gestion">Gestión de Proyectos</option>
                    <option value="datos">Ciencia de Datos y Análisis Avanzado</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-textMuted mb-1">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 bg-custom-1/30 border border-custom-2/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight resize-none text-gray-500"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-custom-3 to-custom-4 text-white rounded-lg font-medium hover:from-highlight hover:to-custom-3 transition-all duration-300 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    "Enviar mensaje"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
