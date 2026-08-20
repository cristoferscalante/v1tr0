import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, ChevronRight, Minus } from "lucide-react"

import { accentText, eyebrow, sectionTitle } from "@/components/home/shared/surface"
import type { SubcategoryPage } from "@/lib/data/servicios/tipos"
import { iconMap } from "./iconos"
import { Wireframe } from "./Wireframe"

/**
 * Secciones de una página de subcategoría.
 *
 * Todas son Server Components: el contenido llega renderizado al navegador y a
 * los buscadores. El lenguaje visual es el de la tienda —gris neutro que
 * sostiene, turquesa que dirige la mirada— con las superficies `.shop-*`.
 */

/** Chip en mono, para las etiquetas técnicas bajo cada zona. */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="shop-inset shop-border inline-flex items-center rounded-lg border px-2.5 py-1 font-mono text-[11px] leading-none text-textMuted">
      {children}
    </span>
  )
}

/** Encabezado común de sección: eyebrow + título + bajada. */
function SectionHead({
  eyebrowText,
  title,
  description,
}: {
  eyebrowText: string
  title: string
  description: string
}) {
  return (
    <header className="max-w-3xl">
      <p className={eyebrow}>{eyebrowText}</p>
      <h2 className={`mt-3 ${sectionTitle}`}>{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-textMuted md:text-base">{description}</p>
    </header>
  )
}

export function DetailHero({ page }: { page: SubcategoryPage }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pt-12 pb-14 md:px-8 md:pt-20 md:pb-20">
      <nav aria-label="Ruta de navegación" className="flex flex-wrap items-center gap-1.5 text-[11px] text-textMuted">
        <Link href="/servicios" className="transition-colors hover:text-textPrimary">
          Servicios
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span>{page.category}</span>
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
        <span className={accentText}>{page.name}</span>
      </nav>

      <h1 className="mt-6 text-3xl font-bold leading-tight text-textPrimary sm:text-4xl md:text-5xl md:leading-[1.1]">
        {page.hero.headline}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-textMuted md:text-lg">
        {page.hero.subheadline}
      </p>

      <ul className="mt-8 flex flex-wrap gap-2">
        {page.hero.highlights.map((item) => (
          <li key={item}>
            <Tag>{item}</Tag>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ZonesSection({ page }: { page: SubcategoryPage }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <SectionHead eyebrowText="Estructura" title={page.zones.title} description={page.zones.description} />

      <ol className="shop-panel mt-10 divide-y divide-[#08A696]/15 overflow-hidden dark:divide-[#2b2e31]">
        {page.zones.items.map((zone) => (
          <li key={zone.number} className="flex flex-col gap-5 p-6 md:flex-row md:items-start md:gap-8 md:p-8">
            <div className="shop-inset shop-border flex h-[86px] w-[130px] shrink-0 items-center justify-center rounded-xl border p-2.5">
              <Wireframe kind={zone.wireframe} />
            </div>

            <div className="min-w-0">
              <p className="font-mono text-[11px] tracking-[0.2em] text-textMuted">ZONA {zone.number}</p>
              <h3 className="mt-1.5 text-lg font-bold leading-tight text-textPrimary md:text-xl">{zone.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-textMuted md:text-[15px]">{zone.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {zone.tags.map((tag) => (
                  <li key={tag}>
                    <Tag>{tag}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function ComparisonSection({ page }: { page: SubcategoryPage }) {
  const { rows, types } = page.comparison

  /** Celda: los booleanos se dibujan, el texto se escribe. */
  const renderValue = (value: string | boolean | undefined) => {
    if (value === true) return <Check className={`h-4 w-4 ${accentText}`} aria-label="Incluido" />
    if (value === false) return <Minus className="h-4 w-4 text-textMuted/50" aria-label="No incluido" />
    return <span className="text-xs leading-snug text-textMuted">{value}</span>
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <SectionHead
        eyebrowText="Comparativa"
        title={page.comparison.title}
        description={page.comparison.description}
      />

      {/* Escritorio: una tabla real, legible y indexable */}
      <div className="shop-panel mt-10 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="shop-band border-b border-[#08A696]/15 dark:border-[#2b2e31]">
              <th scope="col" className="w-[26%] p-5 align-bottom">
                <span className={eyebrow}>Qué incluye</span>
              </th>
              {types.map((type) => (
                <th key={type.id} scope="col" className="p-5 align-bottom">
                  <span
                    className={`block text-base font-bold leading-tight ${
                      type.featured ? accentText : "text-textPrimary"
                    }`}
                  >
                    {type.name}
                  </span>
                  <span className="mt-1.5 block text-xs leading-snug text-textMuted">{type.tagline}</span>
                  {type.example && (
                    <span className="mt-3 block font-mono text-[11px] text-textMuted">{type.example}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[#08A696]/10 last:border-0 dark:border-[#2b2e31]/60">
                <th scope="row" className="p-5 align-top font-normal">
                  <span className="block text-sm font-medium text-textPrimary">{row.label}</span>
                  {row.hint && <span className="mt-1 block text-xs text-textMuted">{row.hint}</span>}
                </th>
                {types.map((type) => (
                  <td key={type.id} className="p-5 align-top">
                    {renderValue(type.values[row.id])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Móvil: la tabla se rompe en tarjetas, una por variante */}
      <div className="mt-10 grid gap-4 md:hidden">
        {types.map((type) => (
          <article key={type.id} className="shop-panel overflow-hidden">
            <header className="shop-band border-b border-[#08A696]/15 p-5 dark:border-[#2b2e31]">
              <h3 className={`text-base font-bold leading-tight ${type.featured ? accentText : "text-textPrimary"}`}>
                {type.name}
              </h3>
              <p className="mt-1.5 text-xs leading-snug text-textMuted">{type.tagline}</p>
              {type.example && <p className="mt-3 font-mono text-[11px] text-textMuted">{type.example}</p>}
            </header>
            <dl className="divide-y divide-[#08A696]/10 dark:divide-[#2b2e31]/60">
              {rows.map((row) => (
                <div key={row.id} className="flex items-start justify-between gap-4 px-5 py-3">
                  <dt className="text-xs text-textMuted">{row.label}</dt>
                  <dd className="flex shrink-0 items-center text-right">{renderValue(type.values[row.id])}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </section>
  )
}

export function FlowsSection({ page }: { page: SubcategoryPage }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <SectionHead eyebrowText="Recorrido" title={page.flows.title} description={page.flows.description} />

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {page.flows.items.map((flow) => (
          <article key={flow.id} className="shop-panel p-6 md:p-8">
            <h3 className={`text-lg font-bold leading-tight ${flow.featured ? accentText : "text-textPrimary"}`}>
              {flow.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-textMuted">{flow.description}</p>

            <ol className="mt-7 flex flex-col gap-3">
              {flow.steps.map((step, index) => {
                const Icon = iconMap[step.icon]
                const isLast = index === flow.steps.length - 1
                return (
                  <li key={step.label} className="flex items-center gap-3">
                    <span
                      className={`shop-inset flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                        flow.featured ? "border-[#08A696]/40 dark:border-[#26FFDF]/30" : "shop-border"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${flow.featured ? accentText : "text-textMuted"}`}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-sm font-medium text-textPrimary">{step.label}</span>
                    {!isLast && (
                      <span className="ml-auto h-px flex-1 bg-[#08A696]/15 dark:bg-[#2b2e31]" aria-hidden="true" />
                    )}
                  </li>
                )
              })}
            </ol>
          </article>
        ))}
      </div>
    </section>
  )
}

export function BenefitsSection({ page }: { page: SubcategoryPage }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <SectionHead eyebrowText="Beneficios" title={page.benefits.title} description={page.benefits.description} />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {page.benefits.items.map((benefit) => {
          const Icon = iconMap[benefit.icon]
          return (
            <article key={benefit.title} className="shop-panel shop-border-hover p-6">
              <span className="shop-inset shop-border mb-5 flex h-11 w-11 items-center justify-center rounded-xl border">
                <Icon className={`h-5 w-5 ${accentText}`} aria-hidden="true" />
              </span>
              <h3 className="text-base font-bold leading-tight text-textPrimary">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-textMuted">{benefit.description}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export function CasesSection({ page }: { page: SubcategoryPage }) {
  if (page.cases.items.length === 0) return null

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <SectionHead eyebrowText="Casos reales" title={page.cases.title} description={page.cases.description} />

      {/* Con uno o dos casos la fila no se estira: las tarjetas conservan su ancho */}
      <div
        className={`mt-10 grid gap-5 ${
          page.cases.items.length === 1
            ? "sm:max-w-md"
            : page.cases.items.length === 2
              ? "md:grid-cols-2 lg:max-w-4xl"
              : "md:grid-cols-3"
        }`}
      >
        {page.cases.items.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group shop-panel shop-border-hover flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={item.image}
                alt={`Captura del sitio ${item.name}`}
                fill
                sizes="(max-width: 768px) 90vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className={`flex items-center gap-1.5 text-base font-bold leading-tight ${accentText}`}>
                {item.name}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-textMuted">{item.summary}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <li key={tag}>
                    <Tag>{tag}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function FaqSection({ page }: { page: SubcategoryPage }) {
  if (page.faq.length === 0) return null

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <SectionHead
        eyebrowText="Preguntas frecuentes"
        title="Lo que suelen preguntarnos"
        description="Las dudas que aparecen en toda primera conversación, respondidas antes de que tengas que escribirlas."
      />

      <div className="shop-panel mt-10 divide-y divide-[#08A696]/15 overflow-hidden dark:divide-[#2b2e31]">
        {page.faq.map((item) => (
          <details key={item.question} className="group p-6 md:p-7">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
              <h3 className="text-base font-semibold leading-snug text-textPrimary">{item.question}</h3>
              <ChevronRight
                className={`mt-0.5 h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-90 ${accentText}`}
                aria-hidden="true"
              />
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-textMuted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function CtaSection({ page }: { page: SubcategoryPage }) {
  const isExternal = page.cta.href.startsWith("http")

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-20 pt-6 md:px-8 md:pb-28">
      <div className="shop-panel flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12">
        <div className="max-w-xl">
          <h2 className="text-xl font-bold leading-tight text-textPrimary md:text-2xl">{page.cta.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-textMuted md:text-base">{page.cta.description}</p>
        </div>
        <Link
          href={page.cta.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="shop-btn inline-flex shrink-0 items-center gap-2 rounded-xl px-6 py-3.5 text-sm"
        >
          {page.cta.label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
