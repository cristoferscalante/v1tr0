"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"
import { Code, Database, Layers, Rocket, Server, Zap, X, Send } from "lucide-react"

// Add the import for BokehBackground at the top of the file, after the other imports
import BokehBackground from "@/components/about/BokehBackground"


export default function SoftwareDevelopment() {
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    serviceArea: "desarrollo", // Preseleccionamos desarrollo
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // States for image effects
  const [isGlowing, setIsGlowing] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [isTechGlowing, setIsTechGlowing] = useState(false)
  const [isTechShaking, setIsTechShaking] = useState(false)
  const [isDevGlowing, setIsDevGlowing] = useState(false)
  const [isDevShaking, setIsDevShaking] = useState(false)

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
      setFormData({ name: "", email: "", message: "", serviceArea: "desarrollo" })
    }, 3000)
  }

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handlers for image effects
  const handleImageClick = () => {
    setIsGlowing(true)
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 500)
    setTimeout(() => setIsGlowing(false), 800)
  }

  const handleTechImageClick = () => {
    setIsTechGlowing(true)
    setIsTechShaking(true)
    setTimeout(() => setIsTechShaking(false), 500)
    setTimeout(() => setIsTechGlowing(false), 800)
  }

  const handleDevImageClick = () => {
    setIsDevGlowing(true)
    setIsDevShaking(true)
    setTimeout(() => setIsDevShaking(false), 500)
    setTimeout(() => setIsDevGlowing(false), 800)
  }

  return (
    <section className="w-full py-24 font-sans relative">
      <BokehBackground style={{ zIndex: -1 }} />
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

          <div className="flex flex-col items-start">
            {/* Descripción principal */}
            <p className="text-textMuted text-lg mb-8 max-w-3xl text-left">
              Gestionamos cada fase del desarrollo con precisión y transparencia, desde la concepción inicial hasta el
              mantenimiento continuo, asegurando que tu software evolucione con tu negocio.
            </p>

            {/* Contenedor principal con la imagen en el centro */}
            <div className="relative w-full max-w-5xl mx-auto mb-12 pt-28 pb-28">
              {/* Imagen central */}
              <div className="flex justify-center relative z-10">
                <Image
                  src="/images/ciclo-vida-software.png"
                  alt="Ciclo de vida del desarrollo de software representado por una serpiente/pulpo formando un círculo"
                  width={500}
                  height={500}
                  onClick={handleImageClick}
                  className={`rounded-md object-contain transition-all duration-700 ease-in-out hover:scale-105 animate-gentle-balance ${
                    isGlowing ? "animate-glow-pulse" : ""
                  } ${isShaking ? "animate-shake" : ""}`}
                  style={{
                    cursor: "pointer",
                  }}
                />
              </div>

              {/* Fases del ciclo de vida - flotando alrededor de la imagen */}
              <div className="absolute inset-0">
                {/* Fase 1 - Arriba */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 md:w-80 w-full">
                  <div className="flex gap-4 justify-center">
                    <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                      <span className="text-highlight font-bold">1</span>
                    </div>
                    <div className="max-w-64">
                      <h4 className="text-xl font-bold text-textPrimary mb-2">Análisis y Planificación</h4>
                      <p className="text-textMuted">
                        Definimos objetivos, alcance y requisitos técnicos para crear una hoja de ruta clara.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fase 2 - Derecha */}
                <div className="absolute top-1/4 right-[-50px] transform md:w-80 w-full">
                  <div className="flex gap-4 justify-center md:justify-start">
                    <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                      <span className="text-highlight font-bold">2</span>
                    </div>
                    <div className="max-w-64">
                      <h4 className="text-xl font-bold text-textPrimary mb-2">Diseño y Arquitectura</h4>
                      <p className="text-textMuted">
                        Creamos la estructura técnica y visual que soportará tu solución.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fase 3 - Abajo a la derecha (alineada con fase 4) */}
                <div className="absolute bottom-1/4 left-[-50px] transform md:w-80 w-full">
                  <div className="flex gap-4 justify-center md:justify-end">
                    <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                      <span className="text-highlight font-bold">3</span>
                    </div>
                    <div className="max-w-64">
                      <h4 className="text-xl font-bold text-textPrimary mb-2">Desarrollo e Implementación</h4>
                      <p className="text-textMuted">
                        Construimos tu solución con código limpio y prácticas de desarrollo modernas.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fase 4 - Izquierda */}
                <div className="absolute top-1/4 left-[-50px] transform md:w-80 w-full">
                  <div className="flex gap-4 justify-center md:justify-end">
                    <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                      <span className="text-highlight font-bold">4</span>
                    </div>
                    <div className="max-w-64">
                      <h4 className="text-xl font-bold text-textPrimary mb-2">Pruebas y Calidad</h4>
                      <p className="text-textMuted">
                        Verificamos exhaustivamente cada aspecto para garantizar un producto sin fallos.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fase 5 - Izquierda Abajo (alineada con fase 2) */}
                <div className="absolute bottom-1/4 right-[-50px] transform md:w-80 w-full">
                  <div className="flex gap-4 justify-center md:justify-start">
                    <div className="w-12 h-12 rounded-full bg-custom-2 flex items-center justify-center flex-shrink-0">
                      <span className="text-highlight font-bold">5</span>
                    </div>
                    <div className="max-w-64">
                      <h4 className="text-xl font-bold text-textPrimary mb-2">Despliegue y Mantenimiento</h4>
                      <p className="text-textMuted">
                        Lanzamos tu solución y proporcionamos soporte continuo para su evolución.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5.Tecnolog%C3%ADas%20de%20vanguardia-GdVjQ7jR4EPoONqDpQbB56vZReTvZN.png"
                alt="Desarrollador con tecnologías modernas"
                width={600}
                height={700}
                onClick={handleTechImageClick}
                className={`rounded-md object-contain transition-all duration-700 ease-in-out hover:scale-105 animate-gentle-balance ${
                  isTechGlowing ? "animate-glow-pulse" : ""
                } ${isTechShaking ? "animate-shake" : ""}`}
                style={{
                  cursor: "pointer",
                }}
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
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6.Desarrollo%20a%20medida-GlPlVQW5PCinJdEn0ZpOo3YgbdIWwN.png"
                alt="Desarrollo a medida con bloques de aplicaciones personalizadas"
                width={600}
                height={700}
                onClick={handleDevImageClick}
                className={`rounded-md object-contain transition-all duration-700 ease-in-out hover:scale-105 animate-gentle-balance ${
                  isDevGlowing ? "animate-glow-pulse" : ""
                } ${isDevShaking ? "animate-shake" : ""}`}
                style={{
                  cursor: "pointer",
                }}
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
      {/* Estilos adicionales para mejorar la responsividad */}
      <style jsx>{`
        @media (max-width: 768px) {
          .absolute {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            bottom: auto !important;
            transform: none !important;
            margin-bottom: 1.5rem;
          }
          .relative {
            padding-top: 1rem !important;
            padding-bottom: 1rem !important;
          }
        }
      `}</style>
    </section>
  )
}
