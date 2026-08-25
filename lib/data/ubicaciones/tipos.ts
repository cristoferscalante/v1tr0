/**
 * Tipos de las páginas por ubicación.
 *
 * El contenido está separado de la presentación a propósito: una página por
 * ciudad sin sustancia propia es una *doorway page*, y tanto Google como los
 * motores de respuesta la descartan. Este tipo obliga a escribir lo que hace
 * distinta a cada plaza —contexto, casos, precios, preguntas reales— antes de
 * que la ruta pueda siquiera compilar.
 */

/** Respuesta breve y auto-contenida, escrita para ser citada tal cual. */
export interface RespuestaDirecta {
  /** La pregunta como la escribe una persona en un buscador o en un chat. */
  pregunta: string
  /**
   * Un párrafo que se sostiene solo, sin depender del resto de la página.
   * Es el fragmento que un asistente puede extraer y repetir textualmente:
   * si necesita contexto previo para entenderse, no sirve.
   */
  respuesta: string
}

export interface BloqueContexto {
  titulo: string
  descripcion: string
}

export interface ServicioLocal {
  nombre: string
  descripcion: string
  href: string
}

export interface PreguntaFrecuente {
  pregunta: string
  respuesta: string
}

export interface UbicacionPage {
  /** Slug literal de la URL; coincide con la intención de búsqueda. */
  slug: string
  /** Nombre del lugar tal como se nombra en el texto. */
  lugar: string
  /** Tipo de zona para el dato estructurado (`City`, `State`, `Country`). */
  tipoArea: "City" | "State" | "Country"
  /** Región administrativa que contiene al lugar; vacío para el país. */
  region?: string

  seo: {
    title: string
    description: string
    keywords: string[]
  }

  hero: {
    titular: string
    entrada: string
    destacados: string[]
  }

  /** Va arriba del todo: es lo primero que lee un rastreador y un humano. */
  respuestaDirecta: RespuestaDirecta

  contexto: {
    titulo: string
    descripcion: string
    bloques: BloqueContexto[]
  }

  servicios: {
    titulo: string
    descripcion: string
    items: ServicioLocal[]
  }

  /** Datos verificables que sostienen la afirmación de la respuesta directa. */
  pruebas: string[]

  faq: PreguntaFrecuente[]

  cta: {
    titulo: string
    descripcion: string
    etiqueta: string
    href: string
  }
}
