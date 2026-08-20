/**
 * Páginas de caída de las dos rutas del home: software y hardware.
 *
 * Reutilizan la estructura de las páginas de servicio (`SubcategoryPage`) para
 * no duplicar secciones, y añaden el bloque de principios —SOLID y Gestalt en
 * software, criterios de diseño físico en hardware— que es lo que explica
 * *cómo* trabajamos, no solo qué entregamos.
 */

import type { SubcategoryPage } from "@/lib/data/servicios/tipos"

/** Miniatura que ilustra un principio. */
export type PrincipleKind =
  | "srp"
  | "ocp"
  | "lsp"
  | "isp"
  | "dip"
  | "proximidad"
  | "similitud"
  | "continuidad"
  | "cierre"
  | "figura-fondo"
  | "jerarquia"

export interface Principle {
  /** Sigla o nombre corto en mono: "S — Responsabilidad única". */
  label: string
  title: string
  /** Qué dice el principio, en una frase sin jerga. */
  description: string
  /** La traducción a beneficio para quien contrata. */
  payoff: string
  diagram: PrincipleKind
}

export interface PrincipleGroup {
  eyebrow: string
  title: string
  description: string
  items: Principle[]
}

/** Una página de caída completa. */
export interface RoutePage extends SubcategoryPage {
  principles: PrincipleGroup[]
}
