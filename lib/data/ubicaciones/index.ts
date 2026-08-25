import type { UbicacionPage } from "./tipos"
import { pitalito } from "./pitalito"
import { huila } from "./huila"
import { colombia } from "./colombia"

/**
 * Registro de páginas por ubicación.
 *
 * Agregar una plaza = crear su archivo y sumarlo aquí; la ruta, la metadata,
 * el dato estructurado y el sitemap salen solos del registro.
 *
 * Una advertencia deliberada para quien agregue la siguiente: una ubicación
 * nueva solo vale la pena si hay algo verdadero y distinto que decir sobre
 * ella. Duplicar esta página cambiando el nombre de la ciudad produce
 * *doorway pages*, que Google penaliza y que los motores de respuesta
 * descartan por redundantes. Menos páginas con sustancia rinden más.
 */
export const ubicacionPages: UbicacionPage[] = [pitalito, huila, colombia]

export function getUbicacionPage(slug: string): UbicacionPage | undefined {
  return ubicacionPages.find((page) => page.slug === slug)
}

export type { UbicacionPage } from "./tipos"
