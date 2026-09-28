/**
 * Site Configuration - V1TR0
 * 
 * Configuración centralizada del sitio web.
 * Incluye metadata, URLs, navegación y configuraciones globales.
 */

export const siteConfig = {
  /**
   * Información básica del sitio
   */
  name: 'V1TR0',
  title: 'V1TR0 - Desarrollo de Software y Soluciones Digitales',
  description: 'Especialistas en desarrollo de software, automatización de procesos y soluciones digitales personalizadas. Transformamos ideas en productos digitales escalables.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://v1tr0.com',
  
  /**
   * Metadata
   */
  metadata: {
    keywords: [
      'desarrollo de software',
      'soluciones digitales',
      'automatización',
      'desarrollo web',
      'aplicaciones móviles',
      'consultoría tecnológica',
      'transformación digital',
      'ecommerce',
      'Colombia',
    ],
    author: 'V1TR0',
    language: 'es',
    locale: 'es_CO',
  },

  /**
   * Autor y empresa
   */
  company: {
    name: 'V1TR0',
    legalName: 'V1TR0 SAS',
    email: 'buzon@v1tr0.com',
    /** Debe escribirse idéntico aquí, en Google Business Profile y en el footer. */
    phone: '+57 315 817 3818',
    /** Mismo número en formato E.164, para `tel:` y para los datos estructurados. */
    phoneE164: '+573158173818',
    /** Línea de WhatsApp (distinta del teléfono de llamadas), sin '+' para `wa.me`. */
    whatsapp: '573222237026',
    /**
     * Ficha NAP (Name-Address-Phone). Es la fuente única del `LocalBusiness`
     * de `lib/seo/site-graph.ts`: Google y los motores de respuesta cruzan
     * estos datos con el directorio de Google Business Profile, así que
     * cualquier diferencia de escritura debilita la señal local.
     */
    address: {
      street: 'Av. 3 # 18-21 Sur',
      city: 'Pitalito',
      region: 'Huila',
      postalCode: '417020',
      country: 'Colombia',
      countryCode: 'CO',
    },
    /** Coordenadas del casco urbano de Pitalito; ajustar a la puerta de la oficina. */
    geo: { latitude: 1.8539, longitude: -76.0513 },
    foundingDate: '2023',
    /** Radio de atención presencial; el resto del país se atiende en remoto. */
    areaServed: ['Pitalito', 'Huila', 'Colombia'],
    openingHours: 'Mo-Fr 08:00-18:00',
  },

  /**
   * Redes sociales
   */
  /**
   * Perfiles reales y verificables.
   *
   * Estos valores salen tal cual a `sameAs` en los datos estructurados, que es
   * como Google y los motores de respuesta confirman que la entidad "V1TR0"
   * del sitio y la de cada red son la misma. Un perfil inventado o muerto no
   * es neutro: rompe la verificación y debilita toda la ficha. Si un perfil no
   * existe todavía, se omite en lugar de anticiparlo.
   */
  social: {
    github: 'https://github.com/v1tr0tech',
    linkedin: 'https://www.linkedin.com/company/v1tr0/',
    tiktok: 'https://www.tiktok.com/@v1tr0_tech',
  },

  /**
   * Navegación principal
   */
  navigation: {
    main: [
      { 
        label: 'Inicio', 
        href: '/',
        description: 'Página principal'
      },
      { 
        label: 'Servicios', 
        href: '/services',
        description: 'Nuestros servicios',
        children: [
          { label: 'Desarrollo de Software', href: '/services/dev' },
          { label: 'Project Management', href: '/services/pm' },
          { label: 'Consultoría', href: '/services/consulting' },
        ]
      },
      { 
        label: 'Portfolio', 
        href: '/portfolio',
        description: 'Casos de éxito'
      },
      { 
        label: 'Blog', 
        href: '/blog',
        description: 'Artículos y recursos'
      },
      { 
        label: 'Tienda', 
        href: '/shop',
        description: 'Productos y servicios',
        badge: 'Nuevo'
      },
      { 
        label: 'Contacto', 
        href: '/#contact',
        description: 'Contáctanos'
      },
    ],

    /**
     * Navegación del footer
     */
    footer: {
      company: [
        { label: 'Acerca de', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Portfolio', href: '/portfolio' },
        { label: 'Contacto', href: '/#contact' },
      ],
      services: [
        { label: 'Desarrollo Web', href: '/services/dev' },
        { label: 'Desarrollo Móvil', href: '/services/dev' },
        { label: 'Project Management', href: '/services/pm' },
        { label: 'Consultoría', href: '/services/consulting' },
      ],
      products: [
        { label: 'Tienda', href: '/shop' },
        { label: 'Productos Digitales', href: '/shop?category=digital' },
        { label: 'Servicios', href: '/shop?category=services' },
      ],
      legal: [
        { label: 'Privacidad', href: '/privacidad' },
        { label: 'Términos', href: '/terminos' },
        { label: 'Cookies', href: '/cookies' },
      ],
    },

    /**
     * Navegación del dashboard
     */
    dashboard: {
      admin: [
        { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        { label: 'Proyectos', href: '/dashboard/projects', icon: 'FolderKanban' },
        { label: 'Clientes', href: '/dashboard/clients', icon: 'Users' },
        { label: 'Pedidos', href: '/dashboard/orders', icon: 'ShoppingCart' },
        { label: 'Equipo', href: '/dashboard/team', icon: 'UsersRound' },
        { label: 'Mensajes', href: '/dashboard/messages', icon: 'MessageSquare' },
      ],
      client: [
        { label: 'Dashboard', href: '/client-dashboard', icon: 'LayoutDashboard' },
        { label: 'Mis Proyectos', href: '/client-dashboard/projects', icon: 'FolderKanban' },
        { label: 'Mis Pedidos', href: '/client-dashboard/orders', icon: 'ShoppingCart' },
      ],
    },
  },

  /**
   * Configuración de ecommerce
   */
  ecommerce: {
    enabled: true,
    currency: 'USD',
    currencySymbol: '$',
    locale: 'es-CO',
    taxRate: 0.19, // IVA Colombia 19%
    taxName: 'IVA',
    freeShippingThreshold: 100, // USD
    defaultShippingCost: 10, // USD
    
    /**
     * Métodos de pago aceptados
     */
    paymentMethods: [
      { id: 'stripe', name: 'Tarjeta de Crédito/Débito', enabled: true },
      { id: 'paypal', name: 'PayPal', enabled: false },
      { id: 'cash', name: 'Efectivo', enabled: false },
    ],

    /**
     * Categorías de productos
     */
    categories: [
      { slug: 'digital', name: 'Productos Digitales', icon: 'Download' },
      { slug: 'services', name: 'Servicios', icon: 'Briefcase' },
      { slug: 'courses', name: 'Cursos', icon: 'GraduationCap' },
      { slug: 'templates', name: 'Templates', icon: 'Layout' },
    ],
  },

  /**
   * Features flags
   */
  features: {
    blog: true,
    ecommerce: true,
    newsletter: true,
    chatbot: false,
    analytics: true,
    darkMode: true,
    i18n: false,
  },

  /**
   * Configuración de SEO
   */
  seo: {
    titleTemplate: '%s | V1TR0',
    defaultTitle: 'V1TR0 - Desarrollo de Software y Soluciones Digitales',
    openGraph: {
      type: 'website',
      locale: 'es_CO',
      siteName: 'V1TR0',
      images: [
        {
          url: '/imagenes/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'V1TR0',
        },
      ],
    },
    twitter: {
      handle: '@v1tr0',
      site: '@v1tr0',
      cardType: 'summary_large_image',
    },
  },

  /**
   * Analytics
   */
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '',
    facebookPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || '',
  },
} as const;

export type SiteConfig = typeof siteConfig;

// Helper functions
export function getPageTitle(title?: string) {
  if (!title) return siteConfig.seo.defaultTitle;
  return `${title} | ${siteConfig.name}`;
}

export function formatCurrency(amount: number, currency = siteConfig.ecommerce.currency) {
  return new Intl.NumberFormat(siteConfig.ecommerce.locale, {
    style: 'currency',
    currency,
  }).format(amount);
}
