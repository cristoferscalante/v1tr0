"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { BarChartIcon, TrendingUpIcon, SettingsIcon, ShoppingCart, FileText, Smartphone, Globe, Database, Brain, Workflow, Bot, Link as LinkIcon, LayoutGrid, BarChart3, Cpu } from "lucide-react"

const servicesData = [
  {
    id: "desarrollo",
    title: "Desarrollo de Software",
    shortTitle: "Software",
    tabIcon: LayoutGrid,
    subcategories: [
      {
        id: "ecommerce",
        icon: ShoppingCart,
        name: "E-Commerce",
        description: "Tiendas online completas con pasarelas de pago, gestión de inventario y experiencia de compra optimizada.",
        features: [],
        examples: [
          { title: "Tienda de Moda", description: "Plataforma con carrito y pagos." },
          { title: "Marketplace Local", description: "Gestión de múltiples vendedores." },
          { title: "Suscripciones", description: "Modelo recurrente automatizado." },
        ],
        pqr: [
          { q: "¿Cuánto tarda la implementación?", a: "Depende de la complejidad, pero entregamos MVP en semanas." },
          { q: "¿Es escalable?", a: "Sí, crecemos junto a tu volumen de ventas." },
          { q: "¿Qué pasarelas soportan?", a: "Integramos Stripe, PayPal y métodos locales según tu región." },
        ],
      },
      {
        id: "landing",
        icon: FileText,
        name: "Landing Pages",
        description: "Páginas de aterrizaje de alto impacto diseñadas para convertir visitantes en clientes.",
        features: [],
        examples: [
          { title: "Landing de Lanzamiento", description: "Campaña de producto nuevo." },
          { title: "Captación de Leads", description: "Página de registro optimizada." },
          { title: "Landing de Evento", description: "Inscripción y gestión de asistentes." },
        ],
        pqr: [
          { q: "¿Mejoran la conversión?", a: "Absolutamente, optimizamos cada elemento para convertir." },
          { q: "¿Incluyen analítica?", a: "Sí, integramos herramientas para medir visitas y conversiones." },
          { q: "¿Son rápidas?", a: "Garantizamos tiempos de carga optimizados para SEO." },
        ],
      },
      {
        id: "webapp",
        icon: Globe,
        name: "Web Apps",
        description: "Aplicaciones web robustas y escalables para gestionar tu negocio de manera eficiente.",
        features: [],
        examples: [
          { title: "Gestión Interna", description: "Dashboard de operaciones." },
          { title: "Portal de Clientes", description: "Área privada de usuario." },
          { title: "App de Reservas", description: "Gestión de citas profesional." },
        ],
        pqr: [
          { q: "¿Qué tecnología usan?", a: "Tecnologías modernas y escalables como React y Node.js." },
          { q: "¿Soportan miles de usuarios?", a: "Sí, nuestra arquitectura está diseñada para escalar bajo demanda." },
          { q: "¿Es segura?", a: "Implementamos los estándares más altos de ciberseguridad." },
        ],
      },
      {
        id: "mobile",
        icon: Smartphone,
        name: "Apps Móviles",
        description: "Aplicaciones móviles nativas para iOS y Android con experiencia de usuario excepcional.",
        features: [],
        examples: [
          { title: "App de Delivery", description: "Pedidos en tiempo real." },
          { title: "App de Fitness", description: "Seguimiento de entrenamientos." },
          { title: "App Social", description: "Comunidad y chat en vivo." },
        ],
        pqr: [
          { q: "¿Publicación en tiendas?", a: "Sí, gestionamos todo el proceso con Apple y Google." },
          { q: "¿Sincronización offline?", a: "Sí, la app funciona sin conexión y sincroniza al volver." },
          { q: "¿Diseño personalizado?", a: "Crearemos una interfaz única para tu marca." },
        ],
      },
    ],
    imageSrc: "/imagenes/home/carrusel/desarrollo_web_end_backup.webp",
    imageAlt: "Desarrollador con elementos de programación y tecnología",
    link: "/servicios-referentes/dev",
  },
  {
    id: "sistemas",
    title: "Sistemas de Información",
    shortTitle: "Análisis de datos",
    tabIcon: BarChart3,
    subcategories: [
      {
        id: "dashboards",
        icon: BarChartIcon,
        name: "Dashboards",
        description: "Paneles interactivos que transforman tus datos en información visual clara y accionable.",
        features: [],
        examples: [
          { title: "Dashboard Financiero", description: "Visualización de flujo de caja y rentabilidad." },
          { title: "Monitor de Ventas", description: "Seguimiento de KPIs en tiempo real." },
          { title: "Reporte de Marketing", description: "Análisis de conversión y ROI." },
        ],
        pqr: [
          { q: "¿Es seguro mi dashboard?", a: "Totalmente. Implementamos encriptación de extremo a extremo." },
          { q: "¿Se integra con otros sistemas?", a: "Sí, conectamos tus fuentes de datos actuales (SQL, APIs, Excel)." },
          { q: "¿Es personalizable?", a: "Totalmente, adaptamos los KPIs a tus necesidades reales." },
        ],
      },
      {
        id: "datamanagement",
        icon: Database,
        name: "Gestión de Datos",
        description: "Centraliza y organiza toda tu información empresarial en sistemas seguros y eficientes.",
        features: [],
        examples: [
          { title: "CRM Centralizado", description: "Gestión de base de clientes y prospectos." },
          { title: "Data Warehouse", description: "Consolidación de datos de múltiples fuentes." },
          { title: "Migración de Datos", description: "Traslado seguro a nuevas plataformas." },
        ],
        pqr: [
          { q: "¿Cómo garantizan la integridad?", a: "Mediante validaciones estrictas y backups automáticos." },
          { q: "¿Es escalable?", a: "Sí, nuestras bases de datos crecen con tu empresa." },
          { q: "¿Es compatible con GDPR?", a: "Sí, cumplimos con todas las normativas de protección de datos." },
        ],
      },
      {
        id: "analytics",
        icon: TrendingUpIcon,
        name: "Análisis",
        description: "Análisis profundo de datos para descubrir patrones, tendencias y oportunidades de negocio.",
        features: [],
        examples: [
          { title: "Análisis Predictivo", description: "Pronóstico de demanda y ventas." },
          { title: "Segmentación de Clientes", description: "Agrupación basada en comportamiento." },
          { title: "Estudio de Mercado", description: "Análisis de tendencias de industria." },
        ],
        pqr: [
          { q: "¿Qué tan precisos son los modelos?", a: "Usamos algoritmos de ML entrenados para alta precisión." },
          { q: "¿Es fácil de entender?", a: "Traducimos datos complejos a conclusiones simples." },
          { q: "¿Tienen alertas?", a: "Sí, notificamos anomalías o tendencias clave automáticamente." },
        ],
      },
      {
        id: "bi",
        icon: Brain,
        name: "Business Intelligence",
        description: "Soluciones inteligentes que convierten datos complejos en estrategias de negocio efectivas.",
        features: [],
        examples: [
          { title: "Tablero Estratégico", description: "Vista global del rendimiento empresarial." },
          { title: "Alertas de Riesgo", description: "Notificaciones proactivas de desviaciones." },
          { title: "Informe de Eficiencia", description: "Optimización de procesos internos." },
        ],
        pqr: [
          { q: "¿Es solo para grandes empresas?", a: "No, escalamos la solución según tu tamaño." },
          { q: "¿Soporta toma de decisiones?", a: "Proporcionamos las herramientas para decidir con datos." },
          { q: "¿Qué tan frecuente es la actualización?", a: "Los datos se actualizan en tiempo real o diario, según prefieras." },
        ],
      },
    ],
    imageSrc: "/imagenes/home/carrusel/sistemas_de_informacion.webp",
    imageAlt: "Analista de datos con visualizaciones y gráficos",
    link: "/servicios-referentes/new",
  },
  {
    id: "automatizacion",
    title: "Automatización de Tareas",
    shortTitle: "Automatización",
    tabIcon: Cpu,
    subcategories: [
      {
        id: "bots",
        icon: Bot,
        name: "Bots & IA",
        description: "Agentes inteligentes que automatizan tareas repetitivas y mejoran la eficiencia operativa.",
        features: [],
        examples: [
          { title: "Chatbot de Soporte", description: "Atención al cliente 24/7." },
          { title: "Agente de Ventas", description: "Cualificación de leads." },
          { title: "Asistente de Tareas", description: "Agente de productividad." },
        ],
        pqr: [
          { q: "¿Es natural el lenguaje?", a: "Usamos IA avanzada para interacciones fluidas." },
          { q: "¿Qué tareas automatiza?", a: "Atención, respuestas, tareas recurrentes y más." },
          { q: "¿Requiere mantenimiento?", a: "Nuestros agentes mejoran continuamente con el uso." },
        ],
      },
      {
        id: "workflows",
        icon: Workflow,
        name: "Workflows",
        description: "Flujos de trabajo automatizados que conectan tus sistemas y eliminan tareas manuales.",
        features: [],
        examples: [
          { title: "Gestión de Emails", description: "Clasificación automática." },
          { title: "Carga de Datos", description: "Sincronización entre CRM y ERP." },
          { title: "Automatización de Facturas", description: "Procesamiento y envío." },
        ],
        pqr: [
          { q: "¿Qué sistemas se pueden conectar?", a: "Cualquiera con API o soporte de integración." },
          { q: "¿Puedo personalizar el flujo?", a: "Sí, creamos flujos a la medida de tu proceso." },
          { q: "¿Qué pasa si hay un error?", a: "El sistema notifica al administrador de inmediato." },
        ],
      },
      {
        id: "integrations",
        icon: LinkIcon,
        name: "Integraciones",
        description: "Conecta todas tus aplicaciones y servicios para que trabajen juntos sin fricción.",
        features: [],
        examples: [
          { title: "Sincronización ERP-Tienda", description: "Inventario unificado." },
          { title: "Conector API", description: "Pasarelas personalizadas." },
          { title: "Integración CRM", description: "Datos unificados de clientes." },
        ],
        pqr: [
          { q: "¿Es seguro?", a: "Totalmente, usamos protocolos estándar de la industria." },
          { q: "¿Qué aplicaciones soportan?", a: "Casi cualquier aplicación moderna con API." },
          { q: "¿Tienen mantenimiento?", a: "Sí, monitoreamos las integraciones 24/7." },
        ],
      },
      {
        id: "optimization",
        icon: SettingsIcon,
        name: "Optimización",
        description: "Mejora continua de procesos para maximizar productividad y reducir costos operativos.",
        features: [],
        examples: [
          { title: "Auditoría de Procesos", description: "Identificación de cuellos de botella." },
          { title: "Reducción de Costos", description: "Automatización de tareas caras." },
          { title: "Mejora de Productividad", description: "Optimización de tiempo de equipo." },
        ],
        pqr: [
          { q: "¿Cómo se mide el éxito?", a: "Mediante KPIs claros y aumento de productividad." },
          { q: "¿Cuánto tarda la optimización?", a: "Depende del proceso, pero los resultados se ven pronto." },
          { q: "¿Es un proceso continuo?", a: "Sí, buscamos siempre nuevas áreas para mejorar." },
        ],
      },
    ],
    imageSrc: "/imagenes/home/carrusel/automatizacion_de_tareas.webp",
    imageAlt: "Especialista en automatización con elementos de IA",
    link: "/servicios-referentes/pm",
  },
]

export default function ServicesTabSection() {
  const [activeTab, setActiveTab] = useState(0)
  const [activeSubcategory, setActiveSubcategory] = useState(0)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const activeService = (servicesData[activeTab] ?? servicesData[0])!
  const activeSubcat = (activeService.subcategories[activeSubcategory] ?? activeService.subcategories[0])!

  // Reset subcategory cuando cambia el tab principal
  const handleTabChange = (index: number) => {
    if (activeTab === index) {
      // Si es el mismo tab, toggle el dropdown
      setIsDropdownOpen(!isDropdownOpen)
    } else {
      // Si es un tab diferente, cambia y abre el dropdown
      setActiveTab(index)
      setActiveSubcategory(0)
      setIsDropdownOpen(true)
    }
  }

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }

    return undefined
  }, [isDropdownOpen])

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center px-4 py-8 snap-start">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 auto-rows-auto">
          
          {/* BENTO 1: TABS PILLS */}
          <div className="md:col-span-2 lg:col-span-12 relative" ref={dropdownRef}>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {servicesData.map((service, index) => {
                const TabIcon = service.tabIcon
                const isActive = activeTab === index
                return (
                  <button
                    key={service.id}
                    onClick={() => handleTabChange(index)}
                    className={`
                      relative group flex items-center gap-2 px-4 py-2 rounded-full
                      text-sm font-medium overflow-hidden
                      transition-all duration-300
                      ${isActive 
                        ? "text-[#26FFDF] scale-100" 
                        : "text-textMuted/70 hover:text-textPrimary hover:scale-100"
                      }
                    `}
                  >
                    {/* Gradiente blur activo */}
                    {isActive && (
                      <>
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08A696]/40 to-[#26FFDF]/40 rounded-full blur opacity-60" />
                        <div className="absolute inset-0 bg-[#0d5d5d]/60 backdrop-blur-md border border-[#26FFDF]/40 rounded-full" />
                      </>
                    )}
                    
                    {/* Fondo inactivo */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm border border-[#0d3d3d]/60 rounded-full transition-all duration-300 group-hover:border-[#26FFDF]/30 group-hover:bg-black/40" />
                    )}
                    
                    {/* Contenido */}
                    <TabIcon className={`relative z-10 w-4 h-4 transition-all duration-300 ${isActive ? 'text-[#26FFDF]' : 'text-textMuted/60 group-hover:text-[#26FFDF]/80'}`} />
                    <span className="relative z-10">{service.shortTitle}</span>
                    
                    {/* Indicador de dropdown activo */}
                    {isActive && (
                      <motion.div
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10 ml-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.div>
                    )}
                  </button>
                )
              })}
            </div>


            {/* DROPDOWN FLOTANTE */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute top-full mt-3 left-0 z-50"
                >
                  <div className="flex flex-col gap-0 rounded-2xl overflow-hidden bg-black/60 backdrop-blur-xl border border-[#26FFDF]/20 shadow-2xl min-w-[280px] md:min-w-[340px]">
                    {activeService.subcategories.map((subcat, index) => {
                      const IconComponent = subcat.icon
                      return (
                        <motion.button
                          key={subcat.id}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ 
                            duration: 0.3,
                            delay: index * 0.06,
                            ease: [0.25, 0.1, 0.25, 1]
                          }}
                          onMouseEnter={() => setActiveSubcategory(index)}
                          onClick={() => {
                            setActiveSubcategory(index)
                            setIsDropdownOpen(false)
                          }}
                          className={`
                            flex items-center gap-3 px-4 py-3 text-left
                            transition-all duration-200 
                            ${activeSubcategory === index
                              ? "bg-[#0d5d5d]/60 text-[#26FFDF]"
                              : "text-textMuted/80 hover:bg-white/5 hover:text-textPrimary"
                            }
                            ${index !== activeService.subcategories.length - 1 ? 'border-b border-white/5' : ''}
                          `}
                        >
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ 
                              duration: 0.3,
                              delay: index * 0.06 + 0.15,
                              ease: "easeOut"
                            }}
                            className={`flex-shrink-0 ${activeSubcategory === index ? 'text-[#26FFDF]' : 'text-textMuted/60'}`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </motion.div>
                          <span className="text-sm font-medium">{subcat.name}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BENTO 2: IMAGEN GRANDE */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="md:col-span-2 lg:col-span-7 lg:row-span-2 rounded-2xl bg-gradient-to-br from-[#0d4d4d]/20 to-[#0a3d3d]/10 backdrop-blur-sm border border-[#26FFDF]/10 p-8 flex items-center justify-center overflow-hidden"
            >
              <div className="relative w-full aspect-square max-w-sm">
                <Image
                  src={activeService.imageSrc}
                  alt={activeService.imageAlt}
                  fill
                  className={`object-contain drop-shadow-2xl transition-all duration-700 ${
                    activeSubcategory % 2 === 0 ? '' : 'grayscale'
                  }`}
                  priority
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* BENTO 3: TÍTULO Y DESCRIPCIÓN */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`title-${activeTab}-${activeSubcategory}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:col-span-2 lg:col-span-5 rounded-2xl bg-black/30 backdrop-blur-sm border border-[#26FFDF]/10 p-6 md:p-8 flex flex-col justify-center gap-4"
            >
              <h3 
                onClick={() => router.push(activeService.link)}
                className="text-2xl lg:text-3xl font-bold text-textPrimary leading-tight cursor-pointer transition-all duration-300 hover:text-highlight"
              >
                {activeSubcat.name}
              </h3>
              <p className="text-textMuted text-base leading-relaxed">
                {activeSubcat.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* BENTO 4: EXAMPLES */}
          <AnimatePresence mode="wait">
            {activeSubcat.examples && activeSubcat.examples.length > 0 && (
              <motion.div
                key={`examples-${activeTab}-${activeSubcategory}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                className="md:col-span-2 lg:col-span-5 rounded-2xl bg-black/20 backdrop-blur-sm border border-[#26FFDF]/10 p-6 md:p-8"
              >
                <h4 className="text-lg font-semibold text-textPrimary mb-4">Ejemplos</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeSubcat.examples.map((example, index) => (
                    <div
                      key={index}
                      className="bg-[#0d5d5d]/20 border border-[#26FFDF]/10 p-4 rounded-xl hover:border-[#26FFDF]/30 transition-all"
                    >
                      <p className="text-textPrimary text-sm font-medium mb-1">{example.title}</p>
                      <p className="text-textMuted text-xs leading-snug">{example.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BENTO 6: PQR */}
          <AnimatePresence mode="wait">
            {activeSubcat.pqr && activeSubcat.pqr.length > 0 && (
              <motion.div
                key={`pqr-${activeTab}-${activeSubcategory}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
                className="md:col-span-2 lg:col-span-12 rounded-2xl bg-black/40 backdrop-blur-sm border border-[#26FFDF]/20 p-8"
              >
                <h4 className="text-xl font-bold text-textPrimary mb-6">Preguntas Recurrentes</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {activeSubcat.pqr.map((item, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <p className="text-[#26FFDF] font-semibold text-sm">Q: {item.q}</p>
                      <p className="text-textMuted text-sm leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  )
}
