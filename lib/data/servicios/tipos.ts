/**
 * Contenido de las páginas de detalle por subcategoría de servicio.
 *
 * La página es un Server Component: todo lo que se ve aquí se renderiza en el
 * servidor para que Google lo indexe. Editar una página de servicio significa
 * editar estos datos, nunca el JSX.
 */

/** Nombre de un ícono de lucide-react, resuelto en `iconMap`. */
export type IconName =
  | "ShoppingCart"
  | "CreditCard"
  | "MessageCircle"
  | "LayoutDashboard"
  | "Truck"
  | "Mail"
  | "Search"
  | "Filter"
  | "Package"
  | "Users"
  | "BarChart3"
  | "RefreshCw"
  | "Smartphone"
  | "ShieldCheck"
  | "Gauge"
  | "FileText"
  | "Sparkles"
  | "MousePointerClick"
  | "Award"
  | "Clock"
  | "Cpu"
  | "RadioTower"
  | "Radio"
  | "Layers"
  | "Boxes"
  | "Wrench"
  | "BatteryCharging"
  | "Thermometer"
  | "MapPin"
  | "GitBranch"
  | "Handshake"
  | "Rocket"
  | "Eye"
  | "Ruler"

/** Miniatura esquemática que acompaña a cada zona de la página. */
export type WireframeKind =
  | "navbar"
  | "form"
  | "proof"
  | "story"
  | "hero"
  | "grid"
  | "detail"
  | "cart"
  | "checkout"
  | "admin"

/** Una zona de la web explicada: qué es, qué hace y con qué piezas. */
export interface Zone {
  /** Número visible: "01", "02"… */
  number: string
  title: string
  description: string
  /** Chips en mono bajo el texto. */
  tags: string[]
  wireframe: WireframeKind
}

/** Una columna de la comparativa entre variantes de la solución. */
export interface SolutionType {
  id: string
  name: string
  /** Frase corta que resume para quién es. */
  tagline: string
  /** Marca la columna con el acento de marca. */
  featured?: boolean
  /** Valores por fila de `ComparisonRow.id`. `true`/`false` pintan ícono. */
  values: Record<string, string | boolean>
  /** Proyecto real que corresponde a esta variante. */
  example?: string
}

/** Fila de la comparativa. */
export interface ComparisonRow {
  id: string
  label: string
  /** Aclaración opcional bajo la etiqueta. */
  hint?: string
}

/** Paso de un recorrido (flujo del pedido). */
export interface FlowStep {
  label: string
  icon: IconName
}

/** Un recorrido completo, de producto a venta cerrada. */
export interface Flow {
  id: string
  title: string
  description: string
  steps: FlowStep[]
  /** Resalta el recorrido con el color de marca. */
  featured?: boolean
}

/** Beneficio de negocio, no característica técnica. */
export interface Benefit {
  icon: IconName
  title: string
  description: string
}

/** Proyecto real enlazado. */
export interface CaseStudy {
  name: string
  href: string
  image: string
  summary: string
  /** Etiquetas de lo que ese proyecto demuestra. */
  tags: string[]
}

/** Pregunta frecuente: también alimenta el JSON-LD `FAQPage`. */
export interface Faq {
  question: string
  answer: string
}

/** Una página de subcategoría completa. */
export interface SubcategoryPage {
  /** Segmento de URL: /servicios/[slug] */
  slug: string
  /** `id` de la subcategoría en `servicesData`, para enlazar desde el home. */
  subcategoryId: string
  /** Migaja superior: la categoría padre. */
  category: string
  /** Nombre de la subcategoría. */
  name: string
  seo: {
    title: string
    description: string
    keywords: string[]
  }
  hero: {
    headline: string
    subheadline: string
    highlights: string[]
  }
  zones: {
    title: string
    description: string
    items: Zone[]
  }
  comparison: {
    title: string
    description: string
    rows: ComparisonRow[]
    types: SolutionType[]
  }
  flows: {
    title: string
    description: string
    items: Flow[]
  }
  benefits: {
    title: string
    description: string
    items: Benefit[]
  }
  cases: {
    title: string
    description: string
    items: CaseStudy[]
  }
  faq: Faq[]
  cta: {
    title: string
    description: string
    label: string
    href: string
  }
}
