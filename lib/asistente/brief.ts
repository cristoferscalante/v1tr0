/**
 * El brief: la información primaria de un proyecto que el asistente del home
 * recopila conversando y que termina en un mensaje de Telegram para V1TR0.
 *
 * El guion (./guion) llena cada campo y el formulario de revisión lo muestra
 * y lo deja editar.
 */

export const CAMPOS_BRIEF = [
  { id: "nombre", etiqueta: "Nombre", max: 80 },
  { id: "empresa", etiqueta: "Empresa o negocio", max: 120 },
  { id: "ciudad", etiqueta: "Ciudad", max: 80 },
  { id: "correo", etiqueta: "Correo", max: 120 },
  { id: "tipoProyecto", etiqueta: "Tipo de proyecto", max: 80 },
  { id: "necesidad", etiqueta: "Qué necesita resolver", max: 600 },
  { id: "funcionalidades", etiqueta: "Funciones clave", max: 600 },
  { id: "presupuesto", etiqueta: "Presupuesto", max: 120 },
  { id: "plazo", etiqueta: "Plazo", max: 120 },
] as const

export type CampoBrief = (typeof CAMPOS_BRIEF)[number]["id"]
export type Brief = Record<CampoBrief, string>

export const TIPOS_PROYECTO = [
  "Tienda en línea",
  "Landing page o sitio web",
  "Aplicación web o sistema interno",
  "App móvil",
  "Datos y dashboards",
  "Automatización o bots",
  "Hardware IoT (LoRa)",
  "Otro",
] as const

export const briefVacio: Brief = Object.fromEntries(
  CAMPOS_BRIEF.map((campo) => [campo.id, ""]),
) as Brief

/** Lo mínimo para que el mensaje sirva: saber quién escribe y qué busca. */
export const CAMPOS_REQUERIDOS: CampoBrief[] = ["nombre", "necesidad"]

export function briefListo(brief: Brief) {
  return CAMPOS_REQUERIDOS.every((campo) => brief[campo].trim().length > 0)
}

export function mensajeContacto(brief: Brief) {
  const lineas = CAMPOS_BRIEF.filter((campo) => brief[campo.id].trim()).map(
    (campo) => `${campo.etiqueta}: ${brief[campo.id].trim()}`,
  )
  return ["Hola V1TR0, quiero contarles sobre un proyecto.", "", ...lineas].join("\n")
}

/**
 * Telegram no permite precargar el mensaje en un chat por número, así que el
 * botón copia el resumen al portapapeles y abre el chat para pegarlo.
 */
export async function copiarMensaje(brief: Brief) {
  try {
    await navigator.clipboard.writeText(mensajeContacto(brief))
    return true
  } catch {
    return false
  }
}
