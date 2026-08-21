import { accentText, eyebrow, sectionTitle } from "@/components/home/shared/surface"
import type { PrincipleGroup, PrincipleKind } from "@/lib/data/rutas/tipos"

/**
 * Sección de principios: SOLID (cómo se sostiene el código) y Gestalt (cómo
 * se lee la interfaz), cada principio con una miniatura que lo muestra en vez
 * de describirlo.
 *
 * Mismo lenguaje que el resto del detalle: gris que sostiene, turquesa que
 * señala la pieza donde está la idea.
 */

const BLOCK = "fill-[#08A696]/20 dark:fill-[#3f4347]"
const BLOCK_SOFT = "fill-[#08A696]/12 dark:fill-[#2e3134]"
const ACCENT = "fill-[#08A696] dark:fill-[#26FFDF]"
const ACCENT_LINE = "stroke-[#08A696] dark:stroke-[#26FFDF]"
const FRAME = "stroke-[#08A696]/30 dark:stroke-[#4a4e52]"

/** Una responsabilidad por pieza: tres cajas separadas, ninguna invade a la otra. */
function Srp() {
  return (
    <>
      <rect x="6" y="14" width="16" height="16" rx="4" className={ACCENT} />
      <rect x="28" y="14" width="16" height="16" rx="4" className={BLOCK} />
      <rect x="50" y="14" width="16" height="16" rx="4" className={BLOCK} />
      <rect x="6" y="34" width="16" height="3" rx="1.5" className={BLOCK_SOFT} />
      <rect x="28" y="34" width="16" height="3" rx="1.5" className={BLOCK_SOFT} />
      <rect x="50" y="34" width="16" height="3" rx="1.5" className={BLOCK_SOFT} />
    </>
  )
}

/** Abierto a extensión: el núcleo no se toca, se le enchufan piezas nuevas. */
function Ocp() {
  return (
    <>
      <rect x="24" y="14" width="24" height="20" rx="5" className={BLOCK} />
      <path d="M20 24h4M48 24h4" className={ACCENT_LINE} strokeWidth="2" strokeLinecap="round" />
      <rect x="6" y="17" width="14" height="14" rx="4" className={ACCENT} />
      <rect x="52" y="17" width="14" height="14" rx="4" className={`fill-none ${ACCENT_LINE}`} strokeWidth="1.5" strokeDasharray="3 3" />
    </>
  )
}

/** Sustitución: dos formas distintas encajan en el mismo hueco. */
function Lsp() {
  return (
    <>
      <rect x="8" y="10" width="24" height="28" rx="5" className={`fill-none ${FRAME}`} strokeWidth="1.5" />
      <rect x="14" y="16" width="12" height="16" rx="3" className={BLOCK} />
      <rect x="40" y="10" width="24" height="28" rx="5" className={`fill-none ${ACCENT_LINE}`} strokeWidth="1.5" />
      <rect x="46" y="16" width="12" height="16" rx="3" className={ACCENT} />
    </>
  )
}

/** Interfaces pequeñas: cada consumidor pide solo el cable que usa. */
function Isp() {
  return (
    <>
      <rect x="6" y="18" width="16" height="12" rx="4" className={BLOCK} />
      <path d="M22 22h20M22 28h20" className={ACCENT_LINE} strokeWidth="2" strokeLinecap="round" />
      <rect x="46" y="10" width="20" height="12" rx="4" className={ACCENT} />
      <rect x="46" y="26" width="20" height="12" rx="4" className={BLOCK_SOFT} />
    </>
  )
}

/** Inversión de dependencias: ambos lados dependen del contrato del centro. */
function Dip() {
  return (
    <>
      <rect x="26" y="6" width="20" height="10" rx="4" className={ACCENT} />
      <path d="M20 32V24h32v8" className={`fill-none ${ACCENT_LINE}`} strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M36 24v-8" className={ACCENT_LINE} strokeWidth="1.5" />
      <rect x="8" y="32" width="24" height="10" rx="4" className={BLOCK} />
      <rect x="40" y="32" width="24" height="10" rx="4" className={BLOCK} />
    </>
  )
}

/** Proximidad: lo que va junto se agrupa y se lee como una unidad. */
function Proximidad() {
  return (
    <>
      {[10, 18, 26].map((x) => (
        <circle key={x} cx={x} cy="24" r="4" className={ACCENT} />
      ))}
      {[46, 54, 62].map((x) => (
        <circle key={x} cx={x} cy="24" r="4" className={BLOCK} />
      ))}
    </>
  )
}

/** Semejanza: el que cambia de forma se lee como otra categoría. */
function Similitud() {
  return (
    <>
      {[10, 24, 52, 66].map((x) => (
        <circle key={x} cx={x} cy="24" r="5" className={BLOCK} />
      ))}
      <rect x="33" y="19" width="10" height="10" rx="2" className={ACCENT} />
    </>
  )
}

/** Continuidad: el ojo sigue la línea aunque se interrumpa. */
function Continuidad() {
  return (
    <>
      <path d="M6 34C20 34 22 14 36 14s16 20 30 20" className={`fill-none ${FRAME}`} strokeWidth="1.5" />
      {[6, 20, 36, 52, 66].map((x, i) => (
        <circle key={x} cx={x} cy={[34, 27, 14, 27, 34][i]} r="3.5" className={i === 2 ? ACCENT : BLOCK} />
      ))}
    </>
  )
}

/** Cierre: el contorno incompleto se completa solo. */
function Cierre() {
  return (
    <>
      <path
        d="M36 8a16 16 0 1 1-11.3 27.3"
        className={`fill-none ${ACCENT_LINE}`}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M20 32a16 16 0 0 1 2-20" className={`fill-none ${FRAME}`} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 6" />
    </>
  )
}

/** Figura y fondo: el gris sostiene, el color es lo que hay que mirar. */
function FiguraFondo() {
  return (
    <>
      <rect x="4" y="6" width="64" height="36" rx="6" className={BLOCK_SOFT} />
      <rect x="12" y="14" width="26" height="4" rx="2" className={BLOCK} />
      <rect x="12" y="22" width="18" height="4" rx="2" className={BLOCK} />
      <rect x="44" y="16" width="18" height="14" rx="5" className={ACCENT} />
    </>
  )
}

/** Jerarquía: el tamaño ordena el recorrido de lectura. */
function Jerarquia() {
  return (
    <>
      <rect x="8" y="10" width="40" height="8" rx="4" className={ACCENT} />
      <rect x="8" y="24" width="52" height="5" rx="2.5" className={BLOCK} />
      <rect x="8" y="34" width="30" height="4" rx="2" className={BLOCK_SOFT} />
    </>
  )
}

const diagrams: Record<PrincipleKind, () => React.ReactElement> = {
  srp: Srp,
  ocp: Ocp,
  lsp: Lsp,
  isp: Isp,
  dip: Dip,
  proximidad: Proximidad,
  similitud: Similitud,
  continuidad: Continuidad,
  cierre: Cierre,
  "figura-fondo": FiguraFondo,
  jerarquia: Jerarquia,
}

/** Miniatura de un principio. Decorativa: el texto de al lado ya lo explica. */
export function PrincipleDiagram({ kind }: { kind: PrincipleKind }) {
  const Diagram = diagrams[kind]
  return (
    <svg viewBox="0 0 72 48" className="h-full w-full" role="presentation" aria-hidden="true">
      <Diagram />
    </svg>
  )
}

export function PrinciplesSection({ groups }: { groups: PrincipleGroup[] }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
      {groups.map((group) => (
        <div key={group.title} className="mb-14 last:mb-0 md:mb-20">
          <header className="max-w-3xl">
            <p className={eyebrow}>{group.eyebrow}</p>
            <h2 className={`mt-3 ${sectionTitle}`}>{group.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-textMuted md:text-base">{group.description}</p>
          </header>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => (
              <article key={item.title} className="shop-panel shop-border-hover flex flex-col p-6">
                <div className="shop-inset shop-border mb-5 flex h-[72px] w-[108px] items-center justify-center rounded-xl border p-2.5">
                  <PrincipleDiagram kind={item.diagram} />
                </div>
                <p className={`font-mono text-[11px] tracking-[0.18em] ${accentText}`}>{item.label}</p>
                <h3 className="mt-1.5 text-base font-bold leading-tight text-textPrimary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-textMuted">{item.description}</p>
                <p className="mt-3 text-sm leading-relaxed text-textMuted">
                  <span className="font-semibold text-textPrimary">Para ti significa: </span>
                  {item.payoff}
                </p>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
