import type { SubcategoryPage } from "./tipos"
import { ecommerce } from "./ecommerce"
import { landingPages } from "./landing-pages"

/**
 * Registro de páginas de detalle por subcategoría.
 *
 * Agregar una subcategoría = crear su archivo de datos y sumarlo aquí.
 * La ruta, el SEO y el sitemap salen solos de este registro.
 */
export const subcategoryPages: SubcategoryPage[] = [ecommerce, landingPages]

export function getSubcategoryPage(slug: string): SubcategoryPage | undefined {
  return subcategoryPages.find((page) => page.slug === slug)
}

/**
 * `id` de subcategoría en `servicesData` → slug de su página.
 * Las subcategorías que no aparecen aquí no muestran botón de detalle.
 */
export const subcategoryPageSlugById: Record<string, string> = Object.fromEntries(
  subcategoryPages.map((page) => [page.subcategoryId, page.slug])
)

export type { SubcategoryPage } from "./tipos"
