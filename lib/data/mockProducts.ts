import type { Product } from "@/components/shop/products/ProductCard";

/**
 * Tipos de datos extendidos para la tienda V1TR0
 */

export interface ProductPackage {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  features: string[];
  price: number;
  originalPrice?: number;
  image: string;
  category: "package";
  badge?: string;
  productsIncluded: string[]; // IDs de productos incluidos
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface ProductDetailed extends Product {
  variants?: ProductVariant[];
  reviews?: Review[];
  relatedProducts?: string[]; // IDs de productos relacionados
  specifications?: Record<string, string>;
  images?: string[]; // Galería de imágenes
}

/**
 * Paquetes destacados para el Hero carrusel
 */
export const heroPackages: ProductPackage[] = [
  {
    id: "pkg-pos-business",
    name: "Sistema POS para Gestión de Negocio",
    slug: "sistema-pos-gestion-negocio",
    tagline: "Todo lo que necesitas para gestionar tu negocio",
    description: "Solución completa de punto de venta con gestión de inventario, ventas, clientes y reportes en tiempo real. Incluye hardware y software.",
    features: [
      "Sistema POS Cloud - Licencia Anual",
      "Tablet 10\" para POS",
      "Impresora térmica de tickets",
      "Lector de códigos de barras",
      "Cajón de dinero electrónico",
      "Capacitación y soporte 24/7",
    ],
    price: 1299,
    originalPrice: 1799,
    image: "/imagenes/tienda/pos.png",
    category: "package",
    badge: "Más Popular",
    productsIncluded: ["7", "pos-tablet", "pos-printer", "pos-scanner", "pos-cash-drawer"],
  },
  {
    id: "pkg-hardware-v1tr0",
    name: "Kit IoT de Ciberseguridad",
    slug: "hardware-v1tr0-pro",
    tagline: "Arsenal profesional de pentesting IoT",
    description: "El kit definitivo para profesionales de pentesting IoT y ethical hacking. Equipamiento de grado profesional para auditorías de seguridad WiFi, Bluetooth, LoRa y análisis de redes IoT.",
    features: [
      "Cyber Deck Pro - Herramientas avanzadas de pentesting WiFi",
      "ESP32 Heltec V4 - Comunicación LoRa de largo alcance",
      "Cardputer - Terminal portátil para trabajo en campo",
      "Kit de 20 sensores - Simulación de dispositivos IoT vulnerables",
      "Power Bank Solar - Autonomía total para auditorías remotas",
      "Acceso a V1TR0 Academy - Cursos de ciberseguridad IoT",
    ],
    price: 499,
    originalPrice: 649,
    image: "/imagenes/paquetes/hardware-v1tr0.jpg",
    category: "package",
    badge: "Elite Security",
    productsIncluded: ["1", "4", "3", "16", "18"],
  },
  {
    id: "pkg-iot-communication",
    name: "Sistemas de Comunicación IoT",
    slug: "sistemas-comunicacion-iot",
    tagline: "Conectividad avanzada para tus proyectos IoT",
    description: "Paquete especializado en comunicación de largo alcance con tecnologías LoRa, WiFi y Bluetooth. Ideal para redes mesh y telemetría remota.",
    features: [
      "ESP32 Heltec V4 WiFi LoRa x2",
      "M5Stack Core2 ESP32 Hub",
      "Antenas LoRa de alto alcance",
      "Módulos de comunicación RF",
      "Gateway IoT multicapa",
      "Software de gestión de red incluido",
    ],
    price: 349,
    originalPrice: 479,
    image: "/imagenes/tienda/heltec-duo-con-efecto.png",
    category: "package",
    badge: "Innovación",
    productsIncluded: ["4", "6"],
  },
];

/**
 * Productos individuales con detalles extendidos
 */
export const detailedProducts: ProductDetailed[] = [
  // Hardware - Cyber Decks
  {
    id: "1",
    name: "Cyber Deck Pro - Kit Completo",
    slug: "cyber-deck-pro-kit",
    description: "Plataforma profesional de pentesting WiFi y análisis de redes IoT. Incluye herramientas de deauthentication, packet sniffing, y auditoría de seguridad wireless. Firmware preconfigurado con scripts de ethical hacking.",
    price: 299,
    originalPrice: 399,
    image: "/imagenes/productos/cyber-deck-pro.jpg",
    images: [
      "/imagenes/productos/cyber-deck-pro.jpg",
      "/imagenes/productos/cyber-deck-pro-2.jpg",
      "/imagenes/productos/cyber-deck-pro-3.jpg",
      "/imagenes/productos/cyber-deck-pro-4.jpg",
    ],
    category: "hardware",
    stock: 8,
    featured: true,
    badge: "Destacado",
    specifications: {
      "Microcontrolador": "ESP32 Dual Core 240MHz con co-procesador seguro",
      "Conectividad": "WiFi 802.11 b/g/n dual-band, Bluetooth 4.2 + BLE 5.0",
      "Herramientas": "Deauth attack, Evil Twin, Packet Sniffer, WiFi Scanner",
      "Sensores": "12 módulos IoT + RFID/NFC reader",
      "Pantalla": "OLED 128x64 píxeles con interfaz CLI",
      "Batería": "Li-Po 2000mAh recargable - 8hrs autonomía continua",
      "Almacenamiento": "microSD hasta 32GB para logs y captures",
      "Firmware": "V1TR0-OS con toolkit de pentesting preinstalado",
      "Dimensiones": "120 x 80 x 25 mm - Formato portátil táctico",
      "Peso": "180g",
    },
    reviews: [
      {
        id: "r1",
        author: "Carlos Mendoza - Pentester Certificado",
        rating: 5,
        date: "2024-06-15",
        comment: "Herramienta imprescindible para auditorías WiFi. Las capacidades de deauth y análisis de tráfico son de nivel profesional. El firmware viene optimizado y listo para usar. Excelente relación calidad-precio.",
        verified: true,
      },
      {
        id: "r2",
        author: "Ana García - Security Researcher",
        rating: 5,
        date: "2024-06-10",
        comment: "Lo uso para análisis de redes IoT en entornos industriales. La capacidad de captura de paquetes y el análisis de protocolos es superior. Documentación técnica muy completa. Totalmente recomendado.",
        verified: true,
      },
      {
        id: "r3",
        author: "Miguel Torres - Red Team Lead",
        rating: 5,
        date: "2024-06-05",
        comment: "El mejor kit de pentesting WiFi portátil que he probado. Lo utilizo en evaluaciones de seguridad corporativa y funciona perfectamente. La batería dura todo el día de auditoría. Vale cada centavo.",
        verified: true,
      },
    ],
    relatedProducts: ["3", "4", "16"],
  },
  {
    id: "3",
    name: "Cardputer ESP32 - DevKit",
    slug: "cardputer-esp32",
    description: "Terminal portátil de pentesting con teclado mecánico QWERTY. Ideal para wardriving, análisis de redes WiFi en campo y ejecución de scripts de auditoría. Interfaz CLI para herramientas de seguridad.",
    price: 89,
    originalPrice: 119,
    image: "/imagenes/productos/cardputer.jpg",
    images: [
      "/imagenes/productos/cardputer.jpg",
      "/imagenes/productos/cardputer-2.jpg",
      "/imagenes/productos/cardputer-3.jpg",
    ],
    category: "hardware",
    stock: 22,
    featured: true,
    specifications: {
      "Procesador": "ESP32 PICO-D4 con encriptación de hardware",
      "Teclado": "QWERTY mecánico 56 teclas - Layout optimizado CLI",
      "Pantalla": "LCD 1.54\" 240x240 IPS - Alta visibilidad exterior",
      "Batería": "500mAh - 4hrs uso continuo pentesting",
      "Conectividad": "WiFi b/g/n, Bluetooth 4.2/BLE, microSD",
      "Uso": "Terminal portátil, wardriving, scripts automatizados",
      "Dimensiones": "95 x 60 x 12 mm - Ultra portátil",
    },
    reviews: [
      {
        id: "r4",
        author: "Pedro López - Ethical Hacker",
        rating: 5,
        date: "2024-06-20",
        comment: "Dispositivo portátil perfecto para trabajo en campo. El teclado mecánico permite escribir comandos rápidamente. Lo uso para wardriving y análisis de redes WiFi públicas. Imprescindible en mi arsenal.",
        verified: true,
      },
    ],
    relatedProducts: ["1", "4", "6"],
  },
  {
    id: "7",
    name: "Sistema POS Cloud - Licencia Anual",
    slug: "pos-cloud-anual",
    description: "Sistema de punto de venta en la nube con gestión de inventario, ventas, clientes y reportes en tiempo real.",
    price: 499,
    originalPrice: 699,
    image: "/imagenes/tienda/pos.png",
    images: [
      "/imagenes/tienda/pos.png",
      "/imagenes/tienda/pos.png",
      "/imagenes/tienda/pos.png",
    ],
    category: "software",
    stock: 999,
    featured: true,
    badge: "Más vendido",
    variants: [
      { id: "v1", name: "Básico (1 caja)", price: 499, stock: 999 },
      { id: "v2", name: "Profesional (3 cajas)", price: 899, stock: 999 },
      { id: "v3", name: "Empresarial (ilimitado)", price: 1499, stock: 999 },
    ],
    specifications: {
      "Tipo": "Software as a Service (SaaS)",
      "Plataforma": "Web + iOS + Android",
      "Usuarios": "Ilimitados",
      "Productos": "Hasta 10,000",
      "Reportes": "En tiempo real",
      "Soporte": "24/7 prioritario",
      "Actualizaciones": "Automáticas incluidas",
    },
    reviews: [
      {
        id: "r5",
        author: "Restaurant El Sabor",
        rating: 5,
        date: "2024-06-18",
        comment: "Transformó completamente nuestra operación. Los reportes en tiempo real son invaluables.",
        verified: true,
      },
      {
        id: "r6",
        author: "Tienda La Esquina",
        rating: 4,
        date: "2024-06-12",
        comment: "Muy bueno, fácil de usar. El soporte responde rápido.",
        verified: true,
      },
    ],
    relatedProducts: ["9", "10"],
  },
];

/**
 * Productos mock originales (simplificados para listado)
 */
export const mockProducts: Product[] = [
  ...detailedProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    ...(p.originalPrice !== undefined && { originalPrice: p.originalPrice }),
    image: p.image,
    category: p.category,
    stock: p.stock,
    ...(p.featured !== undefined && { featured: p.featured }),
    ...(p.badge !== undefined && { badge: p.badge }),
  })),
  // Resto de productos simplificados
  {
    id: "2",
    name: "Cyber Deck Lite - Básico",
    slug: "cyber-deck-lite",
    description: "Versión básica del Cyber Deck con ESP32 y herramientas esenciales para comenzar en IoT security.",
    price: 149,
    image: "/imagenes/productos/cyber-deck-lite.jpg",
    category: "hardware",
    stock: 15,
  },
  {
    id: "4",
    name: "ESP32 Heltec V4 WiFi LoRa",
    slug: "esp32-heltec-v4",
    description: "Módulo de comunicación de largo alcance para análisis de redes LoRa e IoT. Soporta sniffing de paquetes LoRaWAN, emulación de dispositivos y ataques de replay. WiFi dual band y BLE 5.0.",
    price: 45,
    image: "/imagenes/productos/esp32-heltec.jpg",
    category: "hardware",
    stock: 35,
  },
  {
    id: "5",
    name: "Raspberry Pi 5 - 8GB RAM",
    slug: "raspberry-pi-5-8gb",
    description: "La última generación de Raspberry Pi con 8GB de RAM, ideal para servidores y proyectos avanzados.",
    price: 125,
    image: "/imagenes/productos/raspberry-pi-5.jpg",
    category: "hardware",
    stock: 12,
    badge: "Nuevo",
  },
  {
    id: "6",
    name: "M5Stack Core2 ESP32",
    slug: "m5stack-core2",
    description: "Sistema IoT todo-en-uno con pantalla táctil, altavoz, micrófono y sensores integrados.",
    price: 69,
    image: "/imagenes/productos/m5stack.jpg",
    category: "hardware",
    stock: 18,
  },
  {
    id: "8",
    name: "Sistema POS Local - Licencia Perpetua",
    slug: "pos-local-perpetua",
    description: "Sistema POS instalable localmente con base de datos propia. Pago único, sin suscripciones.",
    price: 1299,
    image: "/imagenes/tienda/pos.png",
    category: "software",
    stock: 999,
    featured: true,
  },
  {
    id: "9",
    name: "App Móvil de Inventario",
    slug: "app-inventario-movil",
    description: "Aplicación móvil para gestión de inventario con escaneo de códigos QR/Barcode y sincronización en tiempo real.",
    price: 199,
    image: "/imagenes/productos/app-inventario.jpg",
    category: "software",
    stock: 999,
  },
  {
    id: "10",
    name: "Dashboard Analytics Pro",
    slug: "dashboard-analytics",
    description: "Panel de análisis avanzado con métricas de negocio, visualizaciones y reportes personalizables.",
    price: 299,
    originalPrice: 399,
    image: "/imagenes/productos/dashboard-analytics.jpg",
    category: "software",
    stock: 999,
  },
  {
    id: "11",
    name: "Desarrollo Web Personalizado",
    slug: "desarrollo-web-custom",
    description: "Desarrollo de sitio web o aplicación web a medida con React, Next.js y tecnologías modernas.",
    price: 2499,
    image: "/imagenes/productos/dev-web.jpg",
    category: "servicios",
    stock: 5,
    featured: true,
    badge: "Premium",
  },
  {
    id: "16",
    name: "Kit de Sensores IoT - 20 piezas",
    slug: "kit-sensores-iot",
    description: "Conjunto de 20 sensores para simular ecosistemas IoT vulnerables. Ideal para prácticas de pentesting, análisis de protocolos I2C/SPI y creación de honeypots IoT. Incluye sensores de temperatura, humedad, movimiento, RFID y más.",
    price: 59,
    originalPrice: 79,
    image: "/imagenes/productos/kit-sensores.jpg",
    category: "hardware",
    stock: 25,
  },
  {
    id: "18",
    name: "Power Bank Solar 20000mAh",
    slug: "power-bank-solar",
    description: "Batería táctica de alta capacidad con carga solar. Autonomía extendida para auditorías de seguridad en campo, wardriving prolongado y operaciones de pentesting sin acceso a red eléctrica. Incluye puertos USB-C PD y QC 3.0.",
    price: 79,
    image: "/imagenes/productos/power-bank.jpg",
    category: "hardware",
    stock: 0,
  },
];

/**
 * Helper function para obtener producto por slug
 */
export function getProductBySlug(slug: string): ProductDetailed | undefined {
  return detailedProducts.find((p) => p.slug === slug);
}

/**
 * Helper function para obtener productos relacionados
 */
export function getRelatedProducts(productId: string): Product[] {
  const product = detailedProducts.find((p) => p.id === productId);
  if (!product || !product.relatedProducts) {
    return [];
  }
  
  return mockProducts.filter((p) => product.relatedProducts?.includes(p.id));
}
