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

  const handleDesktopTabChange = (index: number) => {
    if (activeTab !== index) {
      setActiveTab(index)
      setActiveSubcategory(0)
    }
    setIsDropdownOpen(false)
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
    <section className="relative min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 pt-12 pb-8 xl:pt-10 xl:pb-6 snap-start">
      <div className="max-w-[90rem] 2xl:max-w-[100rem] mx-auto w-full">

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5 xl:gap-6 auto-rows-auto">

          {/* BENTO 1: TABS PILLS (móvil) */}
          <div className="md:col-span-2 lg:hidden relative" ref={dropdownRef}>
            <div className="flex flex-wrap gap-2 justify-center">
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
                    {isActive && (
                      <>
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08A696]/40 to-[#26FFDF]/40 rounded-full blur opacity-60" />
                        <div className="absolute inset-0 bg-[#0d5d5d]/60 backdrop-blur-md border border-[#26FFDF]/40 rounded-full" />
                      </>
                    )}
                    {!isActive && (
                      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm border border-[#0d3d3d]/60 rounded-full transition-all duration-300 group-hover:border-[#26FFDF]/30 group-hover:bg-black/40" />
                    )}
                    <TabIcon className={`relative z-10 w-4 h-4 transition-all duration-300 ${isActive ? 'text-[#26FFDF]' : 'text-textMuted/60 group-hover:text-[#26FFDF]/80'}`} />
                    <span className="relative z-10">{service.shortTitle}</span>
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
                  <div className="flex flex-col gap-0 rounded-2xl overflow-hidden bg-black/60 backdrop-blur-xl border border-[#26FFDF]/20 shadow-2xl min-w-[280px]">
                    {activeService.subcategories.map((subcat, index) => {
                      const IconComponent = subcat.icon
                      return (
                        <motion.button
                          key={subcat.id}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
                          onMouseEnter={() => setActiveSubcategory(index)}
                          onClick={() => { setActiveSubcategory(index); setIsDropdownOpen(false) }}
                          className={`flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                            activeSubcategory === index
                              ? "bg-[#0d5d5d]/60 text-[#26FFDF]"
                              : "text-textMuted/80 hover:bg-white/5 hover:text-textPrimary"
                          } ${index !== activeService.subcategories.length - 1 ? 'border-b border-white/5' : ''}`}
                        >
                          <IconComponent className={`w-4 h-4 flex-shrink-0 ${activeSubcategory === index ? 'text-[#26FFDF]' : 'text-textMuted/60'}`} />
                          <span className="text-sm font-medium">{subcat.name}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar desktop: categorías + subcategorías */}
          <div className="hidden lg:flex lg:col-span-3 lg:row-span-2 flex-col gap-4 rounded-2xl bg-black/30 backdrop-blur-sm border border-[#26FFDF]/10 pt-8 pb-4 px-4 xl:pt-10 xl:pb-5 xl:px-5 min-w-0">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#26FFDF]/80 mb-3">Categorías</p>
              <div className="space-y-2">
                {servicesData.map((service, index) => {
                  const TabIcon = service.tabIcon
                  const isActive = activeTab === index
                  return (
                    <button
                      key={service.id}
                      onClick={() => handleDesktopTabChange(index)}
                      className={`w-full text-left flex items-center gap-2 rounded-xl px-3 py-2.5 border transition-all duration-300 ${
                        isActive
                          ? "bg-[#0d5d5d]/60 border-[#26FFDF]/40 text-[#26FFDF]"
                          : "bg-black/20 border-[#0d3d3d]/60 text-textMuted hover:text-textPrimary hover:border-[#26FFDF]/25"
                      }`}
                    >
                      <TabIcon className="w-4 h-4" />
                      <span className="text-sm font-medium break-words">{service.shortTitle}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="pt-2 border-t border-[#26FFDF]/15">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#26FFDF]/80 mb-3">Subcategorías</p>
              <div className="grid grid-cols-2 gap-2">
                {activeService.subcategories.map((subcat, index) => {
                  const IconComponent = subcat.icon
                  const isActive = activeSubcategory === index
                  return (
                    <button
                      key={subcat.id}
                      onClick={() => setActiveSubcategory(index)}
                      className={`group/sub relative aspect-square rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                        isActive
                          ? "bg-[#0d5d5d]/60 border-[#26FFDF]/40 text-[#26FFDF]"
                          : "bg-black/20 border-[#0d3d3d]/60 text-textMuted hover:text-textPrimary hover:border-[#26FFDF]/25 hover:bg-black/30"
                      }`}
                      aria-label={subcat.name}
                    >
                      <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover/sub:scale-110" />
                      <span className="text-[10px] font-medium leading-tight text-center px-1 break-words line-clamp-1">
                        {subcat.name}
                      </span>
                      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-9 z-50 whitespace-nowrap rounded-lg bg-black/90 border border-[#26FFDF]/30 px-2.5 py-1 text-[11px] font-medium text-[#26FFDF] opacity-0 -translate-y-1 transition-all duration-200 group-hover/sub:opacity-100 group-hover/sub:-translate-y-0">
                        {subcat.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Imagen principal */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="md:col-span-2 lg:col-span-4 rounded-2xl bg-gradient-to-br from-[#0d4d4d]/20 to-[#0a3d3d]/10 backdrop-blur-sm border border-[#26FFDF]/10 pt-8 px-6 pb-6 xl:pt-10 xl:px-6 xl:pb-6 2xl:pt-12 2xl:px-8 2xl:pb-8 flex items-center justify-center overflow-hidden"
            >
              <div className="relative w-full aspect-square max-w-[280px] xl:max-w-[320px] 2xl:max-w-[360px]">
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

          {/* Título + descripción */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`title-${activeTab}-${activeSubcategory}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:col-span-2 lg:col-span-5 rounded-2xl bg-black/30 backdrop-blur-sm border border-[#26FFDF]/10 pt-8 px-6 pb-6 md:pt-10 md:px-8 md:pb-8 xl:pt-10 xl:px-6 xl:pb-6 2xl:pt-12 2xl:px-8 2xl:pb-8 flex flex-col justify-center gap-4 min-w-0 overflow-hidden"
            >
              <h3
                onClick={() => router.push(activeService.link)}
                className="text-xl sm:text-2xl lg:text-[1.75rem] font-bold text-[#04423c] dark:text-[#26FFDF] leading-tight break-words cursor-pointer transition-all duration-300 hover:text-[#08A696]"
              >
                {activeSubcat.name}
              </h3>
              <p className="text-textMuted text-sm md:text-base leading-relaxed break-words">
                {activeSubcat.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Ejemplos - ancho completo */}
          <AnimatePresence mode="wait">
            {activeSubcat.examples && activeSubcat.examples.length > 0 && (
              <motion.div
                key={`examples-${activeTab}-${activeSubcategory}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                className="md:col-span-2 lg:col-span-9 rounded-2xl bg-black/20 backdrop-blur-sm border border-[#26FFDF]/10 pt-8 px-6 pb-6 md:pt-10 md:px-8 md:pb-8 xl:pt-10 xl:px-6 xl:pb-6 2xl:pt-12 2xl:px-8 2xl:pb-8 min-w-0 overflow-hidden"
              >
                <h4 className="text-lg font-semibold text-[#26FFDF] mb-4">Ejemplos</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {activeSubcat.examples.map((example, index) => (
                    <div
                      key={index}
                      className="bg-[#0d5d5d]/20 border border-[#26FFDF]/10 p-4 rounded-xl hover:border-[#26FFDF]/30 transition-all min-w-0"
                    >
                      <p className="text-[#26FFDF] text-sm font-medium mb-1 break-words">{example.title}</p>
                      <p className="text-textMuted text-xs leading-snug break-words">{example.description}</p>
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
