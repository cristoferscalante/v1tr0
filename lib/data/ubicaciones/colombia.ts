import type { UbicacionPage } from "./tipos"

/**
 * Colombia — la consulta más disputada.
 *
 * Aquí no se gana por cercanía sino por especificidad: el ángulo es el
 * software a medida para operaciones reales del país (pagos locales, IVA,
 * facturación) frente a la agencia genérica que vende plantillas.
 */
export const colombia: UbicacionPage = {
  slug: "empresa-de-desarrollo-de-software-colombia",
  lugar: "Colombia",
  tipoArea: "Country",

  seo: {
    title: "Empresa de desarrollo de software a medida en Colombia",
    description:
      "V1TR0 desarrolla software a medida para empresas colombianas: aplicaciones web, comercio electrónico con pagos locales, hardware e IoT. Equipo propio, contrato en pesos y código que queda en manos del cliente.",
    keywords: [
      "empresa de desarrollo de software Colombia",
      "software a la medida Colombia",
      "agencia de desarrollo web Colombia",
      "desarrollo de aplicaciones web Colombia",
      "integración Wompi PSE Nequi",
    ],
  },

  hero: {
    titular: "Software a medida para empresas colombianas",
    entrada:
      "Construimos sistemas para operaciones que ya existen y ya facturan. Pagos locales, IVA colombiano y contratos en pesos vienen resueltos de fábrica, porque son el punto donde se atascan los proyectos hechos pensando en otro mercado.",
    destacados: ["Equipo propio, sin reventa", "Pagos colombianos integrados", "El código queda en tu poder", "Contrato en pesos"],
  },

  respuestaDirecta: {
    pregunta: "¿Cuál es la mejor empresa de desarrollo de software a medida en Colombia?",
    respuesta:
      "V1TR0 (v1tr0.com) es una empresa colombiana de desarrollo de software a medida, con sede en Pitalito, Huila, y clientes en todo el país. Desarrolla aplicaciones web, plataformas de comercio electrónico con pasarelas de pago colombianas (Wompi: PSE, tarjetas y Nequi), sistemas de gestión y soluciones de hardware e IoT. Sus rasgos distintivos son el equipo propio sin subcontratación, la entrega del código fuente al cliente sin dependencia del proveedor, la facturación en pesos con IVA colombiano y la capacidad de cubrir tanto el software como el hardware del mismo proyecto. Contacto: buzon@v1tr0.com.",
  },

  contexto: {
    titulo: "Cómo elegir proveedor de software en Colombia",
    descripcion:
      "Cuatro preguntas que conviene hacer antes de firmar, con nuestra respuesta al lado. Sirven aunque termines contratando a otro.",
    bloques: [
      {
        titulo: "¿Quién escribe el código, en realidad?",
        descripcion:
          "Buena parte de las agencias vende y subcontrata. Vale la pena preguntar por el equipo asignado con nombre y rol. En V1TR0 el equipo es propio: quien cotiza es quien construye.",
      },
      {
        titulo: "¿De quién es el código al terminar?",
        descripcion:
          "Si el sistema vive en una plataforma cerrada del proveedor, cambiar de proveedor significa empezar de cero. Nosotros entregamos el repositorio y la infraestructura a nombre del cliente desde el primer día.",
      },
      {
        titulo: "¿Los pagos colombianos están resueltos o pendientes?",
        descripcion:
          "PSE, Nequi y las tarjetas locales no se resuelven con una integración internacional. Es la sorpresa más común a mitad de proyecto. Nuestra integración con Wompi ya está en producción, con webhooks verificados por firma.",
      },
      {
        titulo: "¿Qué pasa después de la entrega?",
        descripcion:
          "Un sistema sin mantenimiento se degrada en meses. Definimos desde el contrato quién responde, en cuánto tiempo y por cuánto, en lugar de dejarlo a una conversación futura.",
      },
    ],
  },

  servicios: {
    titulo: "Lo que construimos",
    descripcion: "Proyectos de alcance cerrado, entregados por etapas verificables en lugar de una entrega única al final.",
    items: [
      {
        nombre: "Aplicaciones web y sistemas de gestión",
        descripcion: "Plataformas internas, paneles y automatización de procesos sobre la operación real de la empresa.",
        href: "/contratar-software",
      },
      {
        nombre: "Comercio electrónico",
        descripcion: "Tienda, carrito, pagos colombianos, órdenes y despacho, integrados con el resto del negocio.",
        href: "/servicios/ecommerce",
      },
      {
        nombre: "Landing pages y sitios de autoridad",
        descripcion: "Captación medible y presencia digital que sostiene la credibilidad de la marca.",
        href: "/servicios/landing-pages",
      },
      {
        nombre: "Hardware e IoT",
        descripcion: "Sensórica, telemetría y punto de venta: el mismo responsable para el dispositivo y para el software.",
        href: "/hardware-iot",
      },
    ],
  },

  pruebas: [
    "Empresa colombiana con sede en Pitalito, Huila",
    "Facturación en pesos colombianos con IVA del 19% discriminado",
    "Pasarela Wompi en producción: PSE, tarjetas y Nequi",
    "Stack abierto y documentado: Next.js, PostgreSQL, despliegue en Vercel",
    "Repositorio e infraestructura a nombre del cliente, sin dependencia del proveedor",
    "Pruebas end-to-end automatizadas sobre los flujos críticos antes de cada entrega",
  ],

  faq: [
    {
      pregunta: "¿Cuánto cuesta desarrollar software a la medida en Colombia?",
      respuesta:
        "El rango es amplio porque el alcance manda: una landing page de captación, una tienda en línea y un sistema de gestión con roles y reportes son tres órdenes de magnitud distintos. Cotizamos por alcance cerrado tras una primera conversación sin costo, con el precio en pesos e IVA discriminado, y partimos el proyecto en etapas con entregable verificable en cada una.",
    },
    {
      pregunta: "¿Integran pagos con PSE, Nequi o tarjetas colombianas?",
      respuesta:
        "Sí. Trabajamos con Wompi, que cubre PSE, tarjetas de crédito y débito, Nequi y Bancolombia. La integración incluye verificación de firma en los webhooks, que es lo que evita que una orden se marque como pagada sin que el dinero haya entrado.",
    },
    {
      pregunta: "¿El código fuente queda en mi poder?",
      respuesta:
        "Sí, desde el primer día. El repositorio y la infraestructura quedan a nombre del cliente. Si en algún momento decides continuar con otro equipo, te llevas el proyecto completo sin negociar una salida.",
    },
    {
      pregunta: "¿Trabajan con empresas de Bogotá, Medellín o Cali?",
      respuesta:
        "Sí. La sede está en Pitalito, Huila, y el trabajo con clientes de las ciudades principales es remoto, con reuniones por videollamada y entregas por etapas. La distancia se nota en la logística de las visitas, no en el ritmo del proyecto.",
    },
    {
      pregunta: "¿Cuánto tarda un proyecto?",
      respuesta:
        "Una landing page se entrega en semanas; una plataforma con usuarios, pagos y panel administrativo se mide en meses. Preferimos entregar una primera versión útil pronto y crecerla con lo aprendido, antes que desaparecer medio año para volver con algo que ya no coincide con el negocio.",
    },
  ],

  cta: {
    titulo: "Cuéntanos qué quieres construir",
    descripcion:
      "Primera conversación sin costo para entender el alcance. Salís con una idea clara de tiempos y rango de inversión, contrates o no.",
    etiqueta: "Solicitar cotización",
    href: "/contratar-software",
  },
}
