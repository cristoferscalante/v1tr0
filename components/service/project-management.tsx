"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"
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
  X,
  Send,
} from "lucide-react"

// Add the import for BokehBackground at the top of the file, after the other imports
import BokehBackground from "@/components/about/BokehBackground"

export default function ProjectManagement() {
  // States for image effects
  const [isGestionGlowing, setIsGestionGlowing] = useState(false)
  const [isGestionShaking, setIsGestionShaking] = useState(false)
  const [isImplementacionGlowing, setIsImplementacionGlowing] = useState(false)
  const [isImplementacionShaking, setIsImplementacionShaking] = useState(false)
  const [isInvestigacionGlowing, setIsInvestigacionGlowing] = useState(false)
  const [isInvestigacionShaking, setIsInvestigacionShaking] = useState(false)
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    serviceArea: "gestion", // Preseleccionamos gestión
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Handlers for image effects
  const handleGestionImageClick = () => {
    setIsGestionGlowing(true)
    setIsGestionShaking(true)
    setTimeout(() => setIsGestionShaking(false), 500)
    setTimeout(() => setIsGestionGlowing(false), 800)
  }

  const handleImplementacionImageClick = () => {
    setIsImplementacionGlowing(true)
    setIsImplementacionShaking(true)
    setTimeout(() => setIsImplementacionShaking(false), 500)
    setTimeout(() => setIsImplementacionGlowing(false), 800)
  }

  const handleInvestigacionImageClick = () => {
    setIsInvestigacionGlowing(true)
    setIsInvestigacionShaking(true)
    setTimeout(() => setIsInvestigacionShaking(false), 500)
    setTimeout(() => setIsInvestigacionGlowing(false), 800)
  }

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
      setFormData({ name: "", email: "", message: "", serviceArea: "gestion" })
    }, 3000)
  }

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <section className="w-full py-24 font-sans relative">
      <BokehBackground style={{ zIndex: -1 }} />
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
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4.Gesti%C3%B3n%20y%20Administraci%C3%B3n-R8D188udT4MtMe8ylzroLrg8kyDGbQ.png"
                alt="Gestión de proyectos"
                width={600}
                height={700}
                onClick={handleGestionImageClick}
                className={`rounded-md object-cover transition-all duration-700 ease-in-out hover:scale-105 animate-gentle-balance ${
                  isGestionGlowing ? "animate-glow-pulse" : ""
                } ${isGestionShaking ? "animate-shake" : ""}`}
                style={{
                  cursor: "pointer",
                }}
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
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5.Implementaci%C3%B3n%20y%20Construcci%C3%B3n-XU7vx6pK0Db2AtJM9LYdgRiw9RCRmN.png"
                alt="Implementación de proyectos"
                width={500}
                height={600}
                onClick={handleImplementacionImageClick}
                className={`rounded-md object-cover transition-all duration-700 ease-in-out hover:scale-105 animate-gentle-balance ${
                  isImplementacionGlowing ? "animate-glow-pulse" : ""
                } ${isImplementacionShaking ? "animate-shake" : ""}`}
                style={{
                  cursor: "pointer",
                }}
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
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6.Investigaci%C3%B3n%20e%20Innovaci%C3%B3n-PIlANEYVc9afLnITb6iCdVZBfYKIeH.png"
                alt="Investigación e innovación"
                width={500}
                height={600}
                onClick={handleInvestigacionImageClick}
                className={`rounded-md object-cover transition-all duration-700 ease-in-out hover:scale-105 animate-gentle-balance ${
                  isInvestigacionGlowing ? "animate-glow-pulse" : ""
                } ${isInvestigacionShaking ? "animate-shake" : ""}`}
                style={{
                  cursor: "pointer",
                }}
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
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10.%20Consultor%C3%ADa%20Estrat%C3%A9gica-Yz6QndJVgiLx2MFSC6T8OWxut93Kjs.png"
                alt="Consultoría estratégica - Análisis de datos avanzado"
                width={500}
                height={600}
                className="rounded-md object-cover transition-all duration-700 ease-in-out hover:scale-105 animate-gentle-balance"
                style={{
                  cursor: "pointer",
                }}
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
            <button
              onClick={() => setIsContactPopupOpen(true)}
              className="flex items-center gap-2 bg-primary hover:bg-opacity-90 transition-all px-6 py-3 rounded-md text-textPrimary"
            >
              <span>Solicitar asesoramiento</span>
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
              <h3 className="text-xl font-bold text-textPrimary">Solicitar asesoramiento</h3>
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
