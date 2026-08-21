"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { BarChartIcon, TrendingUpIcon, SettingsIcon, ShoppingCart, FileText, Smartphone, Globe, Database, Brain, Workflow, Bot, Link as LinkIcon, LayoutGrid, BarChart3, Cpu } from "lucide-react"
import { AnimatedIcon } from "./AnimatedIcon"
import { accentText, eyebrow, sectionTitle, surface, surfaceInner, surfaceInnerActive, surfaceInteractive } from "@/components/home/shared/surface"
import { subcategoryPageSlugById } from "@/lib/data/servicios"

function exampleHref(example: { href?: string }) {
  return example.href
}

export const servicesData = [
  {
    id: "desarrollo",
    title: "Desarrollo de Software",
    shortTitle: "Software",
    tabIcon: LayoutGrid,
    tabIconKind: "grid-ripple" as const,
    subcategories: [
      {
        id: "ecommerce",
        icon: ShoppingCart,
        iconKind: "cart-bounce" as const,
        name: "E-Commerce",
        description: "Tiendas online completas con pasarelas de pago, gestión de inventario y experiencia de compra optimizada.",
        features: [],
        examples: [
          { title: "Pet Gourmet", description: "Tienda de alimento natural para mascotas.", image: "/imagenes/proyectos/petgourmet.png", href: "https://www.petgourmet.mx/" },
          { title: "Mister LYA", description: "E-commerce de marca con catálogo y pagos.", image: "/imagenes/proyectos/misterlya.png", href: "https://www.misterlya.com/" },
          { title: "Casa de Fiestas", description: "Catálogo y pedidos para eventos.", image: "/imagenes/proyectos/casadefiesta.png", href: "http://casadefiesta.co/" },
        ],
      },
      {
        id: "landing",
        icon: FileText,
        iconKind: "type-blink" as const,
        name: "Landing Pages",
        description: "Páginas de aterrizaje de alto impacto diseñadas para convertir visitantes en clientes.",
        features: [],
        examples: [
          { title: "Portafolio", description: "Sitio personal con identidad y 3D.", image: "/imagenes/proyectos/portafolio.png", href: "https://efren-portafolio.v1tr0.com/" },
        ],
      },
      {
        id: "webapp",
        icon: Globe,
        iconKind: "globe-spin" as const,
        name: "Web Apps",
        description: "Aplicaciones web robustas y escalables para gestionar tu negocio de manera eficiente.",
        features: [],
        examples: [
        ],
      },
      {
        id: "mobile",
        icon: Smartphone,
        iconKind: "phone-tilt" as const,
        name: "Apps Móviles",
        description: "Aplicaciones móviles nativas para iOS y Android con experiencia de usuario excepcional.",
        features: [],
        examples: [
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
    tabIconKind: "bar-grow" as const,
    subcategories: [
      {
        id: "dashboards",
        icon: BarChartIcon,
        iconKind: "bar-grow" as const,
        name: "Dashboards",
        description: "Paneles interactivos que transforman tus datos en información visual clara y accionable.",
        features: [],
        examples: [
        ],
      },
      {
        id: "datamanagement",
        icon: Database,
        iconKind: "db-sync" as const,
        name: "Gestión de Datos",
        description: "Centraliza y organiza toda tu información empresarial en sistemas seguros y eficientes.",
        features: [],
        examples: [
        ],
      },
      {
        id: "analytics",
        icon: TrendingUpIcon,
        iconKind: "trend-rise" as const,
        name: "Análisis",
        description: "Análisis profundo de datos para descubrir patrones, tendencias y oportunidades de negocio.",
        features: [],
        examples: [
        ],
      },
      {
        id: "bi",
        icon: Brain,
        iconKind: "brain-think" as const,
        name: "Business Intelligence",
        description: "Soluciones inteligentes que convierten datos complejos en estrategias de negocio efectivas.",
        features: [],
        examples: [
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
    tabIconKind: "chip-pulse" as const,
    subcategories: [
      {
        id: "bots",
        icon: Bot,
        iconKind: "bot-idle" as const,
        name: "Bots & IA",
        description: "Agentes inteligentes que automatizan tareas repetitivas y mejoran la eficiencia operativa.",
        features: [],
        examples: [
        ],
      },
      {
        id: "workflows",
        icon: Workflow,
        iconKind: "workflow-cycle" as const,
        name: "Workflows",
        description: "Flujos de trabajo automatizados que conectan tus sistemas y eliminan tareas manuales.",
        features: [],
        examples: [
        ],
      },
      {
        id: "integrations",
        icon: LinkIcon,
        iconKind: "link-connect" as const,
        name: "Integraciones",
        description: "Conecta todas tus aplicaciones y servicios para que trabajen juntos sin fricción.",
        features: [],
        examples: [
        ],
      },
      {
        id: "optimization",
        icon: SettingsIcon,
        iconKind: "gear-spin" as const,
        name: "Optimización",
        description: "Mejora continua de procesos para maximizar productividad y reducir costos operativos.",
        features: [],
        examples: [
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
    <section className="relative min-h-[100svh] lg:min-h-[100dvh] w-full grid grid-rows-[var(--header-safe)_1fr] px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 pb-10 lg:pb-8 xl:pb-6 snap-start">
      {/* Fila 1: espacio reservado para el header flotante */}
      <div aria-hidden="true" className="row-start-1" />
      <div className="row-start-2 max-w-[90rem] 2xl:max-w-[100rem] mx-auto w-full self-start lg:self-center">

        {/* Encabezado de sección: da contexto antes del bento */}
        <div className="mb-5 sm:mb-6 xl:mb-8 text-center px-2">
          <h2 className={`${sectionTitle} text-balance`}>Servicios que se adaptan a tu operación</h2>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5 xl:gap-6 items-stretch">

          {/* BENTO 1: TABS PILLS (móvil) */}
          <div className="md:col-span-2 lg:hidden relative" ref={dropdownRef}>
            <div className="flex flex-nowrap gap-2 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center sm:overflow-visible sm:mx-0 sm:px-0">
              {servicesData.map((service, index) => {
                const TabIcon = service.tabIcon
                const isActive = activeTab === index
                return (
                  <button
                    key={service.id}
                    onClick={() => handleTabChange(index)}
                    aria-pressed={isActive}
                    aria-expanded={isActive ? isDropdownOpen : false}
                    className={`
                      relative group flex shrink-0 snap-start items-center gap-2 px-4 py-2 min-h-[44px] rounded-full
                      text-sm font-medium overflow-hidden whitespace-nowrap
                      transition-all duration-300
                      ${isActive
                        ? "text-[#26FFDF] scale-100"
                        : "text-textMuted/70 hover:text-textPrimary hover:scale-100"
                      }
                    `}
                  >
                    <div
                      className={`absolute inset-0 rounded-full backdrop-blur-sm border transition-all duration-300 ${
                        isActive
                          ? "bg-[#c5ebe7] border-[#08A696]/50 dark:bg-[#0d5d5d]/60 dark:border-[#26FFDF]/40"
                          : "bg-white/50 border-[#08A696]/20 dark:bg-black/20 dark:border-[#0d3d3d]/60 group-hover:border-[#08A696]/40"
                      }`}
                    />
                    <AnimatedIcon
                      kind={service.tabIconKind}
                      icon={TabIcon}
                      active={isActive}
                      size={16}
                      className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-[#26FFDF]' : 'text-textMuted/60 group-hover:text-[#26FFDF]/80'}`}
                    />
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
                  className="absolute top-full mt-3 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 z-50"
                >
                  <div className="flex flex-col gap-0 rounded-3xl overflow-hidden backdrop-blur-md border min-w-0 w-[calc(100vw-2rem)] max-w-[320px] md:min-w-[280px] md:w-auto bg-white/80 border-[#08A696]/20 dark:bg-[#02505950] dark:border-[#08A696]/15">
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
                              ? "bg-[#c5ebe7] text-[#08A696] dark:bg-[#0d5d5d]/60 dark:text-[#26FFDF]"
                              : "text-textMuted/80 hover:bg-[#08A696]/10 hover:text-textPrimary"
                          } ${index !== activeService.subcategories.length - 1 ? 'border-b border-white/5' : ''}`}
                        >
                          <AnimatedIcon
                            kind={subcat.iconKind}
                            icon={IconComponent}
                            active={activeSubcategory === index}
                            size={16}
                            className={`flex-shrink-0 ${activeSubcategory === index ? 'text-[#26FFDF]' : 'text-textMuted/60'}`}
                          />
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
          <div className={`hidden lg:flex lg:col-span-3 flex-col gap-4 lg:min-h-[36rem] pt-8 pb-4 px-4 xl:pt-10 xl:pb-5 xl:px-5 min-w-0 ${surface}`}>
            <div>
              <p className={`${eyebrow} mb-3`}>Categorías</p>
              <div className="space-y-2">
                {servicesData.map((service, index) => {
                  const TabIcon = service.tabIcon
                  const isActive = activeTab === index
                  return (
                    <button
                      key={service.id}
                      onClick={() => handleDesktopTabChange(index)}
                      aria-pressed={isActive}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2.5 min-h-[44px] text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60 ${
                        isActive ? surfaceInnerActive : `${surfaceInner} text-textMuted hover:text-textPrimary hover:border-[#08A696]/40`
                      }`}
                    >
                      <AnimatedIcon kind={service.tabIconKind} icon={TabIcon} active={isActive} size={16} />
                      <span className="text-sm font-medium break-words">{service.shortTitle}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="pt-2 border-t border-[#26FFDF]/15 flex-1 flex flex-col min-h-0">
              <p className={`${eyebrow} mb-3`}>Subcategorías</p>
              <div className="grid grid-cols-2 gap-2 flex-1 auto-rows-fr">
                {activeService.subcategories.map((subcat, index) => {
                  const IconComponent = subcat.icon
                  const isActive = activeSubcategory === index
                  return (
                    <button
                      key={subcat.id}
                      onClick={() => setActiveSubcategory(index)}
                      aria-pressed={isActive}
                      title={subcat.name}
                      className={`group/sub relative min-h-[5.5rem] flex flex-col items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60 ${
                        isActive ? surfaceInnerActive : `${surfaceInner} text-textMuted hover:text-textPrimary hover:border-[#08A696]/40`
                      }`}
                      aria-label={subcat.name}
                    >
                      <AnimatedIcon
                        kind={subcat.iconKind}
                        icon={IconComponent}
                        active={isActive}
                        size={20}
                        className="transition-transform duration-300 group-hover/sub:scale-110"
                      />
                      <span className="text-[11px] font-medium leading-tight text-center px-1.5 break-words line-clamp-2">
                        {subcat.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Título + descripción */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`title-${activeTab}-${activeSubcategory}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`relative md:col-span-2 lg:col-span-9 lg:min-h-[36rem] pt-6 px-4 pb-5 sm:pt-8 sm:px-6 sm:pb-6 md:pt-10 md:px-8 md:pb-8 xl:pt-10 xl:px-6 xl:pb-6 2xl:pt-12 2xl:px-8 2xl:pb-8 flex flex-col justify-center gap-3 min-w-0 ${surface}`}
            >
              {/* Figura flotante: se sale del panel por la esquina superior derecha */}
              <motion.div
                key={`float-${activeTab}`}
                initial={{ opacity: 0, x: 24, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="pointer-events-none hidden lg:block absolute -top-20 xl:-top-24 -right-8 xl:-right-12 w-60 xl:w-72 2xl:w-80 z-20"
              >
                <motion.div
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative aspect-square w-full motion-reduce:animate-none"
                >
                  <Image
                    src={activeService.imageSrc}
                    alt={activeService.imageAlt}
                    fill
                    sizes="320px"
                    className="object-contain"
                  />
                </motion.div>
              </motion.div>

              {/* Migaja: deja claro en qué categoría está parado el usuario */}
              <p className={eyebrow}>
                {activeService.title}
              </p>
              <h3 className={`text-xl sm:text-2xl lg:text-[1.75rem] font-bold leading-tight break-words ${accentText}`}>
                {activeSubcat.name}
              </h3>
              <p className="text-textMuted text-sm md:text-base leading-relaxed break-words">
                {activeSubcat.description}
              </p>

              {/* Solo las subcategorías que ya tienen página de detalle publicada muestran el botón */}
              {subcategoryPageSlugById[activeSubcat.id] && (
                <Link
                  href={`/servicios/${subcategoryPageSlugById[activeSubcat.id]}`}
                  className={`group/detail mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-semibold ${accentText} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF]/60 rounded-md`}
                >
                  Ver cómo funciona
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover/detail:translate-x-1">
                    →
                  </span>
                </Link>
              )}

              {/* Proyectos de la subcategoría activa: cambian con categoría y subcategoría */}
              {activeSubcat.examples.length > 0 && (
              <div className="relative mt-2">
              {/* Móvil: tarjetas apiladas en vertical; desde sm vuelve a la grilla de 3 */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {activeSubcat.examples.map((example) => {
                  const externalHref = exampleHref(example)
                  return (
                  <Link
                    key={example.title}
                    href={externalHref ?? activeService.link}
                    target={externalHref ? "_blank" : undefined}
                    rel={externalHref ? "noopener noreferrer" : undefined}
                    className={`group/proj relative flex w-full flex-row items-stretch gap-3.5 overflow-hidden sm:flex-col sm:gap-0 ${surface} ${surfaceInteractive}`}
                  >
                    <div className="relative w-[44%] max-w-[11rem] shrink-0 self-stretch overflow-hidden sm:w-full sm:max-w-none sm:aspect-video">
                      <Image
                        src={example.image}
                        alt={example.title}
                        fill
                        sizes="(max-width: 640px) 44vw, (max-width: 1024px) 33vw, 320px"
                        className="object-cover transition-transform duration-500 group-hover/proj:scale-110"
                      />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-center py-4 pr-4 sm:justify-start sm:p-2.5">
                      <p className={`text-sm sm:text-xs font-semibold leading-tight break-words line-clamp-2 ${accentText}`}>
                        {example.title}
                      </p>
                      <p className="mt-1.5 sm:mt-1 text-textMuted text-xs sm:text-[11px] leading-snug break-words line-clamp-3 sm:line-clamp-2">
                        {example.description}
                      </p>
                    </div>
                  </Link>
                  )
                })}
              </div>
              </div>
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </section>
  )
}
