import { TIPOS_PROYECTO, type CampoBrief } from "./brief"

/**
 * Guion del asistente del home. No hay modelo de lenguaje detrás: el chat
 * recorre estos pasos en orden, cada respuesta llena un campo del brief y solo
 * reconoce un puñado de dudas frecuentes. Todo lo demás se declina con
 * cortesía. Lo que se afirma aquí sale de /contratar-software y /hardware-iot;
 * si esas páginas cambian, este texto cambia con ellas.
 */

export interface Paso {
  campo: CampoBrief
  pregunta: (nombre: string) => string
  /** Respuestas rápidas; si hay, también se acepta texto libre. */
  opciones?: readonly string[]
  /** Opción que deja el campo vacío. */
  omitir?: string
  validar?: (texto: string) => string | null
}

export const PASOS: Paso[] = [
  {
    campo: "tipoProyecto",
    pregunta: () => "Bienvenido a V1TR0. ¿Qué te gustaría construir?",
    opciones: TIPOS_PROYECTO,
  },
  {
    campo: "necesidad",
    pregunta: () => "Cuéntanos en una o dos frases qué necesitas resolver.",
  },
  {
    campo: "funcionalidades",
    pregunta: () => "¿Qué funciones no pueden faltar?",
    omitir: "Aún no lo sé",
  },
  {
    campo: "plazo",
    pregunta: () => "¿Para cuándo lo necesitas?",
    opciones: ["Lo antes posible", "En 1 a 3 meses", "En más de 3 meses", "Sin fecha definida"],
  },
  {
    campo: "presupuesto",
    pregunta: () => "¿Con qué presupuesto aproximado cuentas?",
    opciones: ["Menos de 5 millones", "5 a 15 millones", "15 a 40 millones", "Más de 40 millones"],
    omitir: "Prefiero conversarlo",
  },
  {
    campo: "nombre",
    pregunta: () => "Perfecto. ¿Cómo te llamas?",
  },
  {
    campo: "empresa",
    pregunta: (nombre) => `Mucho gusto, ${nombre}. ¿Cuál es tu empresa o negocio?`,
    omitir: "Es un proyecto personal",
  },
  {
    campo: "ciudad",
    pregunta: () => "¿Desde qué ciudad nos escribes?",
  },
  {
    campo: "correo",
    pregunta: () => "Por último, si quieres, déjanos un correo para enviarte la propuesta.",
    omitir: "Prefiero solo WhatsApp",
    validar: (texto) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto) ? null : "Ese correo no parece válido. ¿Lo revisas?",
  },
]

export const CIERRE = (nombre: string) =>
  `Gracias, ${nombre}. Ya tenemos lo necesario: envíanos el resumen por WhatsApp y te respondemos con una propuesta.`

/** Dudas que el asistente sí responde. El orden importa: gana la primera que coincide. */
const DUDAS: Array<{ claves: RegExp; respuesta: string }> = [
  {
    claves: /(precio|cuesta|costo|valor|cobran|tarifa|cotiza)/,
    respuesta:
      "Depende del alcance. Un sitio o una automatización puntual arranca en el orden de unos pocos millones de pesos; lo demás se cotiza por fases después de un diagnóstico sin costo.",
  },
  {
    claves: /(tiempo|demora|tarda|cuando estaria|semanas|meses|plazo)/,
    respuesta:
      "Un proyecto puntual toma de 2 a 6 semanas y un producto a medida de 2 a 5 meses, con una versión funcionando cada dos semanas.",
  },
  {
    claves: /(codigo|repositorio|propiedad|dueno|a mi nombre)/,
    respuesta: "El repositorio, los dominios y los accesos quedan a tu nombre desde el primer día.",
  },
  {
    claves: /(soporte|mantenimiento|garantia|despues de entregar)/,
    respuesta:
      "Todo proyecto incluye garantía sobre lo entregado, y puedes tomar un plan mensual de mantenimiento si lo necesitas.",
  },
  {
    claves: /(lora|sensor|iot|hardware|gateway|nodo)/,
    respuesta:
      "Hacemos soluciones IoT con LoRa: nodos con sensores, un gateway por sitio y un panel con histórico y alertas, sin plan de datos por aparato.",
  },
  {
    claves: /(como trabajan|proceso|etapas|metodologia|como funciona)/,
    respuesta:
      "Empezamos con un diagnóstico sin costo, luego una propuesta por escrito con alcance, precio y fechas, un prototipo y entregas cada dos semanas.",
  },
]

const DECLINAR =
  "Con gusto te ayudaría, pero en este espacio solo podemos conversar sobre tu proyecto. Cualquier otra consulta la atendemos personalmente por WhatsApp."

const normalizar = (texto: string) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")

/**
 * Si el texto es una pregunta, devuelve qué contestar: una duda conocida o la
 * negativa cordial. Si no lo es, devuelve null y se toma como respuesta al
 * paso en curso.
 */
export function responderPregunta(texto: string): string | null {
  const limpio = normalizar(texto.trim())
  // Solo cuenta como pregunta si lo dice con signos: una respuesta como "que
  // venda tortas en línea" empieza igual que una pregunta y no lo es.
  if (!/[?¿]/.test(limpio)) {
    return null
  }
  return DUDAS.find((duda) => duda.claves.test(limpio))?.respuesta ?? DECLINAR
}
