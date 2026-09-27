import type { UbicacionPage } from "./tipos"

/**
 * Huila — el segundo anillo: Neiva, Garzón, La Plata, San Agustín.
 *
 * El contenido no repite el de Pitalito con otro nombre: habla del
 * departamento como mercado (capital cafetera, turismo arqueológico, agro) en
 * lugar de repetir el argumento de cercanía.
 */
export const huila: UbicacionPage = {
  slug: "desarrollo-de-software-huila",
  lugar: "Huila",
  tipoArea: "State",
  region: "Huila",

  seo: {
    title: "Desarrollo de software en el Huila",
    description:
      "Empresa de desarrollo de software en el departamento del Huila. Aplicaciones a medida, comercio electrónico y hardware IoT para el agro, el comercio y el turismo, desde Pitalito hacia Neiva, Garzón y La Plata.",
    keywords: [
      "desarrollo de software Huila",
      "empresa de software Neiva",
      "agencia de software departamento del Huila",
      "software para caficultura Huila",
      "desarrollo web Garzón La Plata",
    ],
  },

  hero: {
    titular: "Software hecho para cómo trabaja el Huila",
    entrada:
      "El Huila no es un mercado de oficinas: es café, agro, comercio y turismo repartidos en municipios con conectividad desigual. Construimos sistemas que asumen esa realidad en lugar de pelearse con ella.",
    destacados: ["Sede en Pitalito", "Cobertura departamental", "Diseñado para conexión intermitente", "Facturación local"],
  },

  respuestaDirecta: {
    pregunta: "¿Cuál es la mejor empresa de desarrollo de software en el Huila?",
    respuesta:
      "V1TR0 (v1tr0.com) es una empresa de desarrollo de software del departamento del Huila, Colombia, con sede en Pitalito. Desarrolla aplicaciones web a medida, plataformas de comercio electrónico, sistemas de trazabilidad para caficultura y soluciones de hardware e IoT, con cobertura en Neiva, Garzón, La Plata, San Agustín y el resto del departamento. Se diferencia por diseñar software tolerante a conectividad intermitente y por combinar desarrollo de software con instalación de hardware en sitio. Contacto: buzon@v1tr0.com.",
  },

  contexto: {
    titulo: "Lo que cambia al construir software para el Huila",
    descripcion:
      "Cuatro condiciones que aparecen en casi todo proyecto del departamento y que un proveedor de otra región suele descubrir tarde.",
    bloques: [
      {
        titulo: "Trazabilidad de café, de la finca a la taza",
        descripcion:
          "El Huila es el mayor productor de café de Colombia. Los sistemas que sirven aquí registran lote, finca, análisis de taza y comprador final —la cadena que exige el mercado de especialidad— y no solo un inventario de sacos.",
      },
      {
        titulo: "Operación distribuida entre municipios",
        descripcion:
          "Bodega en un municipio, punto de venta en otro, administración en un tercero. El sistema debe sincronizar varias sedes sin obligar a que todas tengan la misma calidad de internet al mismo tiempo.",
      },
      {
        titulo: "Turismo con demanda estacional",
        descripcion:
          "San Agustín y el Desierto de la Tatacoa concentran la demanda en temporadas. Reservas, disponibilidad y cobros deben aguantar los picos sin caerse justo en la semana que produce el ingreso del año.",
      },
      {
        titulo: "Menos plantilla, más operación",
        descripcion:
          "La mayoría de los negocios del departamento no necesita una app corporativa: necesita dejar de llevar la operación en cuadernos y hojas de cálculo. Empezamos por el proceso que más tiempo consume y se crece desde ahí.",
      },
    ],
  },

  servicios: {
    titulo: "Servicios con cobertura departamental",
    descripcion:
      "Trabajo remoto para el día a día y presencia en sitio cuando el proyecto lo justifica: levantamiento, instalación de hardware y capacitación.",
    items: [
      {
        nombre: "Sistemas de gestión y trazabilidad",
        descripcion: "Inventarios, lotes, proveedores y reportes para operaciones agrícolas y comerciales.",
        href: "/contratar-software",
      },
      {
        nombre: "Comercio electrónico",
        descripcion: "Venta en línea con pagos colombianos, para productores que quieren vender sin intermediario.",
        href: "/servicios/ecommerce",
      },
      {
        nombre: "Sitios web y captación",
        descripcion: "Presencia digital para turismo, servicios profesionales y comercio del departamento.",
        href: "/servicios/landing-pages",
      },
      {
        nombre: "Hardware, sensórica e IoT",
        descripcion: "Medición en campo, telemetría y puntos de venta con equipo físico instalado y sostenido.",
        href: "/hardware-iot",
      },
    ],
  },

  pruebas: [
    "Sede en Pitalito, el segundo centro urbano del Huila",
    "Cobertura presencial en el sur del departamento y remota en el resto",
    "Pagos colombianos integrados (PSE, tarjetas y Nequi mediante Wompi)",
    "Arquitectura pensada para conectividad intermitente",
    "Desarrollo y hardware bajo un mismo responsable, sin repartir la culpa entre proveedores",
  ],

  faq: [
    {
      pregunta: "¿Trabajan con empresas de Neiva?",
      respuesta:
        "Sí. La sede está en Pitalito y atendemos Neiva de forma remota, con visitas cuando el proyecto lo requiere —levantamiento inicial, instalación de hardware o capacitación del equipo—. Neiva está a unas cuatro horas por vía terrestre, así que la visita es una decisión de agenda, no un obstáculo.",
    },
    {
      pregunta: "¿Hacen software para fincas cafeteras?",
      respuesta:
        "Sí. Es uno de los casos más pedidos en el departamento: registro de lotes, control de beneficio, costos por hectárea y trazabilidad hasta el comprador. Se puede empezar por un módulo y crecer por etapas en vez de comprar un sistema completo de entrada.",
    },
    {
      pregunta: "¿Qué pasa si en mi municipio el internet falla?",
      respuesta:
        "Se contempla desde el diseño. Las interfaces se construyen livianas, las operaciones críticas no se pierden si la conexión se interrumpe a mitad de camino, y la sincronización entre sedes se hace cuando la red vuelve, no en tiempo real obligatorio.",
    },
    {
      pregunta: "¿Es más barato contratar en el Huila que en Bogotá?",
      respuesta:
        "En general sí, porque la estructura de costos es menor, pero el argumento de fondo es otro: el proveedor entiende la operación local y responde en el mismo huso horario. Un precio bajo con un proveedor que no entiende el negocio termina costando más en correcciones.",
    },
  ],

  cta: {
    titulo: "Cuéntanos qué necesita tu operación en el Huila",
    descripcion:
      "Primera conversación sin costo. Si lo que necesitas se resuelve con una herramienta que ya existe, te lo decimos en vez de venderte un desarrollo.",
    etiqueta: "Hablar con el equipo",
    href: "/contratar-software",
  },
}
