"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

/**
 * Primitivas de UI compartidas por el panel de admin y el portal del cliente.
 * Replican el lenguaje visual del sitio público (ver components/blog/BlogCard.tsx):
 * cristal turquesa, borde #08A696 y resplandor exterior.
 *
 * Los paneles son solo tema oscuro por decisión de producto, así que aquí no
 * se consulta useTheme: los colores están fijados a la variante oscura.
 */

const GLASS = "bg-[#02505931] backdrop-blur-sm border border-[#08A696]/20"

/**
 * Tarjeta "rica": resplandor exterior + gesto scale-95 → scale-100 al pasar el
 * cursor, igual que las tarjetas de blog. Para menús de entrada y navegación.
 */
export function GlowCard({
  children,
  href,
  onClick,
  className,
}: {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
}) {
  const inner = (
    <div className="relative group h-full">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all duration-300" />
      <div
        className={cn(
          "relative h-full flex flex-col rounded-2xl transition-all duration-300",
          GLASS,
          "transform scale-95 group-hover:scale-100",
          "group-hover:border-[#08A696] group-hover:bg-[#02505950]",
          "shadow-lg group-hover:shadow-xl group-hover:shadow-[#08A696]/10",
          className,
        )}
      >
        {children}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {inner}
      </Link>
    )
  }
  if (onClick) {
    return (
      <div onClick={onClick} className="cursor-pointer h-full">
        {inner}
      </div>
    )
  }
  return inner
}

/**
 * Tarjeta "sobria": mismo cristal y paleta, sin escalado ni resplandor.
 * Para tablas, listados y el tablero Kanban, donde el movimiento distrae.
 */
export function Panel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn("rounded-2xl", GLASS, className)}>{children}</div>
}

/** Fila de listado con realce de borde al pasar el cursor, sin movimiento. */
export function PanelRow({
  children,
  href,
  className,
}: {
  children: React.ReactNode
  href?: string
  className?: string
}) {
  const base = cn(
    "block rounded-xl border border-transparent px-4 py-3 transition-colors duration-200",
    "hover:border-[#08A696]/40 hover:bg-[#02505950]",
    className,
  )
  return href ? (
    <Link href={href} className={base}>
      {children}
    </Link>
  ) : (
    <div className={base}>{children}</div>
  )
}

/** Píldora de etiqueta, mismo tratamiento que los tags del blog. */
export function Pill({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode
  tone?: "default" | "success" | "warning" | "danger" | "muted"
  className?: string
}) {
  const tones: Record<string, string> = {
    default: "bg-[#08A696]/10 text-[#26FFDF] border-[#08A696]/50",
    success: "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/40",
    warning: "bg-[#f26a1b]/10 text-[#f26a1b] border-[#f26a1b]/40",
    danger: "bg-[#ff2c10]/10 text-[#ff6b5b] border-[#ff2c10]/40",
    muted: "bg-white/5 text-textSecondary border-white/10",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-medium px-3 py-1 rounded-full border backdrop-blur-sm whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Encabezado de sección centrado, con la barra degradada del home. */
export function SectionHeading({
  badge,
  title,
  subtitle,
  align = "left",
}: {
  badge?: string
  title: string
  subtitle?: string
  align?: "left" | "center"
}) {
  const centered = align === "center"
  return (
    <div className={cn("flex flex-col", centered ? "items-center text-center" : "items-start")}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.22em] uppercase bg-[#08A696]/10 border border-[#08A696]/30 text-[#26FFDF] mb-3">
          {badge}
        </span>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
      {subtitle && <p className="text-textSecondary text-sm mt-1 max-w-xl">{subtitle}</p>}
      <div
        className={cn(
          "w-20 h-1 bg-gradient-to-r from-[#08A696] to-[#26FFDF] rounded-full mt-4",
          centered && "mx-auto",
        )}
      />
    </div>
  )
}

/** Contenedor de página: ancho, respiración y tipografía consistentes. */
export function PanelPage({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "min-h-screen p-4 sm:p-6 lg:p-8 font-bricolage max-w-7xl mx-auto space-y-6 sm:space-y-8",
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Métrica compacta para filas de indicadores. */
export function StatTile({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <Panel className="p-4 flex items-center justify-between">
      <div className="min-w-0">
        <p className="text-textSecondary text-[10px] font-semibold uppercase tracking-wider truncate">
          {label}
        </p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
      {Icon && (
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#08A696]/20 to-[#26FFDF]/20 shrink-0">
          <Icon className="h-5 w-5 text-[#26FFDF]" />
        </div>
      )}
    </Panel>
  )
}

/** Estado vacío consistente en todas las listas. */
export function EmptyState({
  icon: Icon,
  message,
  hint,
}: {
  icon?: React.ComponentType<{ className?: string }>
  message: string
  hint?: string
}) {
  return (
    <Panel className="text-center py-16 px-6">
      {Icon && <Icon className="h-10 w-10 text-[#08A696]/50 mx-auto mb-3" />}
      <p className="text-textSecondary">{message}</p>
      {hint && <p className="text-textSecondary/60 text-sm mt-1">{hint}</p>}
    </Panel>
  )
}
