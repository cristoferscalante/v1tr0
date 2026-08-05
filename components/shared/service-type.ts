import {
  Layout,
  ShoppingCart,
  AppWindow,
  Smartphone,
  Palette,
  Wrench,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import type { IconKind } from "@/components/home/sections/AnimatedIcon"

/**
 * Fuente única de verdad para los 7 tipos de servicio de un proyecto.
 * Cada uno lleva un ícono Lucide + un "kind" de animación en loop
 * (ver components/home/sections/AnimatedIcon.tsx) para las tarjetas de
 * proyecto y los nodos del árbol de navegación.
 */
export const SERVICE_TYPES = [
  "landing_page",
  "ecommerce",
  "web_app",
  "mobile_app",
  "branding",
  "maintenance",
  "other",
] as const

export type ServiceType = (typeof SERVICE_TYPES)[number]

export const SERVICE_TYPE_META: Record<
  ServiceType,
  { label: string; icon: LucideIcon; kind: IconKind }
> = {
  landing_page: { label: "Landing Page", icon: Layout, kind: "grid-ripple" },
  ecommerce: { label: "E-commerce", icon: ShoppingCart, kind: "cart-bounce" },
  web_app: { label: "Web App", icon: AppWindow, kind: "workflow-cycle" },
  mobile_app: { label: "App Móvil", icon: Smartphone, kind: "phone-tilt" },
  branding: { label: "Branding", icon: Palette, kind: "chip-pulse" },
  maintenance: { label: "Mantenimiento", icon: Wrench, kind: "gear-spin" },
  other: { label: "Otro", icon: Sparkles, kind: "trend-rise" },
}

export function serviceTypeMeta(value: string) {
  return SERVICE_TYPE_META[value as ServiceType] ?? SERVICE_TYPE_META.other
}

/**
 * Un proyecto puede tener un ícono elegido a mano (projects.icon, uno de los
 * 7 de aquí mismo) independiente de su serviceType real — por ejemplo, el
 * ícono que el cliente escogió al cotizar puede no coincidir con la
 * categoría de servicio inferida de su respuesta en texto libre. Si no hay
 * ícono manual, cae de vuelta al que corresponde al serviceType.
 */
export function resolveProjectIconMeta(project: { serviceType: string; icon?: string | null | undefined }) {
  if (project.icon && project.icon in SERVICE_TYPE_META) {
    return SERVICE_TYPE_META[project.icon as ServiceType]
  }
  return serviceTypeMeta(project.serviceType)
}

/**
 * Color de la tarjeta según la etapa: rojo mientras es solo una cotización
 * sin empezar, verde en cuanto avanza a cualquier etapa de trabajo real,
 * amarillo en mantenimiento (soporte post-entrega), gris para pausado o
 * cancelado.
 */
export type ProjectCardTone = "danger" | "success" | "warning" | "muted"

export function projectCardTone(status: string): ProjectCardTone {
  if (status === "planning") {return "danger"}
  if (status === "maintenance") {return "warning"}
  if (status === "paused" || status === "cancelled") {return "muted"}
  return "success"
}

/** Borde + resplandor de tarjeta a juego con projectCardTone. */
export const PROJECT_CARD_TONE_CLASSES: Record<ProjectCardTone, string> = {
  danger: "border-[#ff2c10]/40 shadow-[0_0_0_1px_rgba(255,44,16,0.15)]",
  success: "border-[#10b981]/40 shadow-[0_0_0_1px_rgba(16,185,129,0.15)]",
  warning: "border-[#f26a1b]/40 shadow-[0_0_0_1px_rgba(242,106,27,0.15)]",
  muted: "border-white/10",
}
