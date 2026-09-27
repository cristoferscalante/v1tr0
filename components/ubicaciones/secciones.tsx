import Link from "next/link"
import { ChevronRight, MapPin, Check } from "lucide-react"

import type { UbicacionPage } from "@/lib/data/ubicaciones"

/**
 * Secciones de las páginas por ubicación.
 *
 * Todo Server Component, sin `use client`: el texto tiene que existir en el
 * HTML de la primera respuesta. Los rastreadores de los motores de respuesta
 * casi nunca ejecutan JavaScript, así que un párrafo que solo aparece tras
 * hidratar es un párrafo que ningún asistente podrá citar.
 */

const accentText = "text-[#08A696] dark:text-[#26FFDF]"

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${accentText}`}>{children}</span>
  )
}

export function UbicacionHero({ page }: { page: UbicacionPage }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-10 pt-28 md:px-8 md:pb-14 md:pt-36">
      <p className="flex items-center gap-2 text-sm text-textMuted">
        <MapPin className={`h-4 w-4 ${accentText}`} aria-hidden="true" />
        <span>
          {page.lugar}
          {page.region && page.region !== page.lugar ? `, ${page.region}` : ""} · Colombia
        </span>
      </p>

      <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight text-textPrimary md:text-5xl">
        {page.hero.titular}
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-relaxed text-textMuted md:text-lg">{page.hero.entrada}</p>

      <ul className="mt-7 flex flex-wrap gap-2">
        {page.hero.destacados.map((item) => (
          <li
            key={item}
            className="rounded-full border border-[#08A696]/30 px-3.5 py-1.5 text-xs font-medium text-textMuted dark:border-[#26FFDF]/25"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * El bloque que se escribió para ser citado.
 *
 * Se marca con `speakable` en el dato estructurado de la página: es la
 * declaración de cuál es el fragmento que responde la pregunta, en vez de
 * dejar que el motor adivine qué párrafo de la página resume el resto.
 */
export function RespuestaDirecta({ page }: { page: UbicacionPage }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 md:px-8">
      <div className="shop-panel p-7 md:p-9">
        <Eyebrow>Respuesta directa</Eyebrow>
        <h2 id="respuesta-directa" className="mt-3 text-xl font-bold leading-snug text-textPrimary md:text-2xl">
          {page.respuestaDirecta.pregunta}
        </h2>
        <p data-speakable="respuesta" className="mt-4 max-w-4xl text-base leading-relaxed text-textPrimary/90">
          {page.respuestaDirecta.respuesta}
        </p>
      </div>
    </section>
  )
}

export function ContextoSection({ page }: { page: UbicacionPage }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <Eyebrow>Contexto local</Eyebrow>
      <h2 className="mt-3 max-w-2xl text-2xl font-bold leading-tight text-textPrimary md:text-3xl">
        {page.contexto.titulo}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-textMuted md:text-base">{page.contexto.descripcion}</p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {page.contexto.bloques.map((bloque) => (
          <article key={bloque.titulo} className="shop-panel p-6 md:p-7">
            <h3 className="text-base font-semibold leading-snug text-textPrimary">{bloque.titulo}</h3>
            <p className="mt-3 text-sm leading-relaxed text-textMuted">{bloque.descripcion}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ServiciosSection({ page }: { page: UbicacionPage }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-14 md:px-8 md:pb-20">
      <Eyebrow>Servicios</Eyebrow>
      <h2 className="mt-3 max-w-2xl text-2xl font-bold leading-tight text-textPrimary md:text-3xl">
        {page.servicios.titulo}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-textMuted md:text-base">{page.servicios.descripcion}</p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {page.servicios.items.map((item) => (
          <Link
            key={item.nombre}
            href={item.href}
            className="shop-panel group flex flex-col p-6 transition-colors hover:border-[#08A696]/50 md:p-7 dark:hover:border-[#26FFDF]/40"
          >
            <h3 className="flex items-center gap-2 text-base font-semibold leading-snug text-textPrimary">
              {item.nombre}
              <ChevronRight
                className={`h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 ${accentText}`}
                aria-hidden="true"
              />
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-textMuted">{item.descripcion}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function PruebasSection({ page }: { page: UbicacionPage }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-14 md:px-8 md:pb-20">
      <div className="shop-panel p-7 md:p-9">
        <Eyebrow>Verificable</Eyebrow>
        <h2 className="mt-3 text-xl font-bold leading-snug text-textPrimary md:text-2xl">
          En qué se apoya lo anterior
        </h2>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {page.pruebas.map((prueba) => (
            <li key={prueba} className="flex items-start gap-3 text-sm leading-relaxed text-textMuted">
              <Check className={`mt-0.5 h-4 w-4 shrink-0 ${accentText}`} aria-hidden="true" />
              <span>{prueba}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function UbicacionFaq({ page }: { page: UbicacionPage }) {
  if (page.faq.length === 0) return null

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-14 md:px-8 md:pb-20">
      <Eyebrow>Preguntas frecuentes</Eyebrow>
      <h2 className="mt-3 text-2xl font-bold leading-tight text-textPrimary md:text-3xl">
        Sobre trabajar con nosotros en {page.lugar}
      </h2>

      <div className="shop-panel mt-9 divide-y divide-[#08A696]/15 overflow-hidden dark:divide-[#2b2e31]">
        {page.faq.map((item) => (
          // `open` en el primero: el contenido plegado se indexa, pero el
          // visitante que llega desde una respuesta de IA aterriza viendo algo.
          <details key={item.pregunta} className="group p-6 md:p-7" open={item === page.faq[0]}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
              <h3 className="text-base font-semibold leading-snug text-textPrimary">{item.pregunta}</h3>
              <ChevronRight
                className={`mt-0.5 h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-90 ${accentText}`}
                aria-hidden="true"
              />
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-textMuted">{item.respuesta}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function UbicacionCta({ page }: { page: UbicacionPage }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-20 md:px-8 md:pb-28">
      <div className="shop-panel flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12">
        <div className="max-w-xl">
          <h2 className="text-xl font-bold leading-tight text-textPrimary md:text-2xl">{page.cta.titulo}</h2>
          <p className="mt-3 text-sm leading-relaxed text-textMuted md:text-base">{page.cta.descripcion}</p>
        </div>
        <Link
          href={page.cta.href}
          className="shop-btn inline-flex shrink-0 items-center gap-2 rounded-xl px-6 py-3.5 text-sm"
        >
          {page.cta.etiqueta}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
