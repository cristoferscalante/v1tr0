import type { Plan, Product, FolioRecharge } from "@/components/shop/packages/PackagePromotion"

export const posPlans: Plan[] = [
  {
    id: "pos-free",
    name: "Plan Gratis",
    price: 0,
    billingPeriod: "7 días",
    features: [
      "Prueba gratuita por 7 días",
      "Gestión básica de inventario",
      "Registro de ventas",
      "Panel de control básico",
      "Soporte por email",
      "Sin facturación electrónica",
    ],
    folios: 0,
    cta: "Probar Gratis",
  },
  {
    id: "pos-standard",
    name: "Plan Estándar",
    price: 400000,
    billingPeriod: "mes",
    features: [
      "Gestión completa de inventario",
      "Múltiples usuarios y permisos",
      "Reportes y estadísticas avanzadas",
      "Gestión de clientes y proveedores",
      "Soporte prioritario 24/7",
      "Sin facturación electrónica",
    ],
    folios: 0,
    isPopular: true,
    cta: "Comenzar Ahora",
  },
  {
    id: "pos-premium",
    name: "Plan Premium",
    price: 570000,
    billingPeriod: "mes",
    features: [
      "Todo lo del Plan Estándar",
      "Facturación electrónica DIAN",
      "100 folios mensuales incluidos",
      "Integración con bancos",
      "API para integraciones",
      "Soporte VIP dedicado",
    ],
    folios: 100,
    cta: "Actualizar a Premium",
  },
]

export const posProducts: Product[] = [
  {
    id: "pos-printer",
    name: "Impresora Térmica",
    description: "Impresora de tickets de alta velocidad con conectividad USB y Bluetooth",
    image: "/imagenes/productos/impresora-termica.jpg",
    price: 180000,
    features: [
      "Impresión de 80mm",
      "Velocidad 200mm/s",
      "Conexión USB + Bluetooth",
      "Compatible con todos los sistemas POS",
    ],
  },
  {
    id: "pos-cash-drawer",
    name: "Cajón de Dinero",
    description: "Cajón electrónico de seguridad con apertura automática",
    image: "/imagenes/productos/cajon-dinero.jpg",
    price: 120000,
    features: [
      "5 compartimentos de monedas",
      "4 compartimentos de billetes",
      "Apertura electrónica",
      "Sistema de seguridad con llave",
    ],
  },
  {
    id: "pos-barcode-scanner",
    name: "Lector de Códigos",
    description: "Pistola lectora de códigos de barras 1D y 2D de alta precisión",
    image: "/imagenes/productos/pistola-scanner.jpg",
    price: 95000,
    features: [
      "Lectura 1D y 2D",
      "Conexión USB",
      "Lectura hasta 30cm",
      "Diseño ergonómico",
    ],
  },
]

export const folioRecharges: FolioRecharge[] = [
  {
    id: "folios-50",
    quantity: 50,
    price: 45000,
  },
  {
    id: "folios-100",
    quantity: 100,
    price: 85000,
    savings: 5000,
  },
  {
    id: "folios-250",
    quantity: 250,
    price: 200000,
    savings: 12500,
  },
  {
    id: "folios-500",
    quantity: 500,
    price: 375000,
    savings: 50000,
  },
]
