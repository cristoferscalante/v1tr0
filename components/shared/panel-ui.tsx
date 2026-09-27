"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

/**
 * Primitivas de UI compartidas por el panel de admin y el portal del cliente.
 *
 * Comparten superficie con el sitio público: el gris carbón neutro de
 * `styles/globals.css` (`.panel-card`, `.inset-surface`, `.band`), con el
 * turquesa de marca reservado para lo focal — acción primaria, estado activo,
 * bloqueo. Antes el turquesa estaba también en el fondo de cada tarjeta, así
 * que no señalaba nada; esa es la regla de acento de `diagram-design`.
 *
 * Los paneles son solo tema oscuro por decisión de producto, y el tema del
 * sitio está bloqueado en oscuro (ver components/theme-provider.tsx), así que
 * aquí no se consulta useTheme.
 */

/** Acento de marca. Fuera de aquí no debería escribirse a mano. */
export const ACCENT = "#08A696"
export const ACCENT_BRIGHT = "#26FFDF"

/**
 * Tarjeta de entrada para menús y navegación. El realce vive en el borde, no
 * en un resplandor ni en un escalado: en una rejilla de accesos el movimiento
 * al pasar el cursor arrastra la vista y compite con lo que el usuario está
 * leyendo.
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
    <div
      className={cn(
        "panel-card group h-full flex flex-col",
        "hover:border-[#08A696]/60",
        className,
      )}
    >
      {children}
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
 * Superficie para tablas, listados y tableros.
 *
 * `label` monta un rótulo sobre el borde superior, como el cajetín de una
 * lámina técnica: dice qué es el panel sin gastar una fila de contenido.
 * `focal` cambia el borde continuo por cuatro esquineros — delimita con menos
 * tinta y marca el panel que importa en la pantalla. Uno por vista: si todos
 * llevan esquineros, ninguno destaca.
 */
export function Panel({
  children,
  className,
  label,
  focal = false,
}: {
  children: React.ReactNode
  className?: string
  label?: React.ReactNode
  focal?: boolean
}) {
  return (
    <div
      className={cn(
        "panel-card",
        focal && "brackets border-transparent",
        label && "relative",
        className,
      )}
    >
      {label && <span className="panel-tag text-[#08A696]">{label}</span>}
      {children}
    </div>
  )
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
    "block rounded-lg border border-transparent px-4 py-3 transition-colors duration-200",
    "hover:border-[#08A696]/40 hover:bg-white/[0.03]",
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

/**
 * Chip de estado o dato. Rectángulo (`rounded-[2px]`), nunca píldora: una
 * píldora lee como badge de otro sistema de diseño y le da a un dato el peso
 * visual de una acción (ver references/type-kanban.md de la skill).
 *
 * Los tonos usan color solo en texto y borde, sin relleno saturado: en una
 * tabla con muchas filas los rellenos compiten entre sí y el ojo pierde el
 * orden de lectura.
 */
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
    default: "text-[#26FFDF] border-[#08A696]/50",
    success: "text-[#10b981] border-[#10b981]/45",
    warning: "text-[#f7c163] border-[#f7c163]/50",
    danger: "text-[#ff8a7f] border-[#ff8a7f]/50",
    muted: "text-white/45 border-white/15",
  }
  return (
    <span className={cn("chip whitespace-nowrap", tones[tone], className)}>
      {children}
    </span>
  )
}

/**
 * Encabezado de sección. El badge es un eyebrow en mono, no una píldora
 * turquesa: es una etiqueta de categoría, y gastar el acento ahí lo resta de
 * donde sí hace falta.
 */
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
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
          {badge}
        </span>
      )}
      {/* 24px no le daba voz a la página. Las cuatro referencias entran entre
          54 y 112px; en una herramienta eso no cabe, pero 40px sí — el título
          pasa a ser el ancla de la pantalla en vez de una etiqueta más. */}
      <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-[40px] sm:leading-[1.05]">
        {title}
      </h1>
      {subtitle && <p className="mt-2 max-w-xl text-sm text-white/50">{subtitle}</p>}
      {/* Regla fina a todo el ancho en vez de la barra degradada: separa la
          cabecera del contenido sin reclamar atención para sí misma. */}
      <div className="mt-5 h-px w-full bg-white/10" />
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

/**
 * Métrica compacta. La cifra manda: va grande y en tabular-nums para que las
 * columnas de dígitos alineen entre tarjetas.
 */
export function StatTile({
  label,
  value,
  icon,
}: {
  label: string
  value: React.ReactNode
  /** Ícono ya renderizado (`<Users />`), no el componente — ver EmptyState. */
  icon?: React.ReactNode
}) {
  return (
    <Panel className="flex items-center justify-between p-4">
      <div className="min-w-0">
        <p className="truncate font-mono text-[10px] uppercase tracking-wider text-white/35">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-white">{value}</p>
      </div>
      {icon && (
        <div className="shrink-0 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-white/25">{icon}</div>
      )}
    </Panel>
  )
}

/** Estado vacío consistente en todas las listas. */
export function EmptyState({
  icon,
  message,
  hint,
}: {
  /**
   * El ícono ya renderizado (`<Users />`), no el componente (`Users`).
   * Este archivo es "use client", así que las páginas de servidor que usan
   * EmptyState cruzan la frontera server→client al pasar props: un componente
   * es una función y no se puede serializar, mientras que un elemento ya
   * renderizado sí. El tamaño y el color los pone el contenedor de abajo para
   * no repetirlos en cada llamada.
   */
  icon?: React.ReactNode
  message: string
  hint?: string
}) {
  return (
    <Panel className="px-6 py-16 text-center">
      {icon && (
        <div className="mb-3 flex justify-center [&>svg]:h-8 [&>svg]:w-8 [&>svg]:text-white/20">
          {icon}
        </div>
      )}
      <p className="text-white/60">{message}</p>
      {hint && <p className="mt-1 text-sm text-white/35">{hint}</p>}
    </Panel>
  )
}
