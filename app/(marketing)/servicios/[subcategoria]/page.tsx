import type { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  BenefitsSection,
  CasesSection,
  ComparisonSection,
  CtaSection,
  DetailHero,
  FaqSection,
  FlowsSection,
  ZonesSection,
} from "@/components/servicios/detalle/secciones"
import { getSubcategoryPage, subcategoryPages } from "@/lib/data/servicios"
import { siteConfig } from "@/config/site"

/**
 * Página de detalle de una subcategoría de servicio.
 *
 * Server Component a propósito: el contenido llega renderizado, con metadata
 * y datos estructurados, que es justo lo que faltaba en el resto de rutas
 * de marketing (todas "use client" y por tanto sin `generateMetadata`).
 */

interface PageProps {
  params: Promise<{ subcategoria: string }>
}

/** Solo existen las subcategorías del registro: cualquier otra ruta es 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return subcategoryPages.map((page) => ({ subcategoria: page.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subcategoria } = await params
  const page = getSubcategoryPage(subcategoria)

  if (!page) return { title: "Servicio no encontrado" }

  const url = `${siteConfig.url}/servicios/${page.slug}`
  const title = `${page.seo.title} | V1TR0`

  return {
    title,
    description: page.seo.description,
    keywords: page.seo.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "es_CO",
      url,
      title,
      description: page.seo.description,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.seo.description,
    },
  }
}

export default async function SubcategoriaPage({ params }: PageProps) {
  const { subcategoria } = await params
  const page = getSubcategoryPage(subcategoria)

  if (!page) notFound()

  const url = `${siteConfig.url}/servicios/${page.slug}`

  // Datos estructurados: el servicio en sí, la migaja y las preguntas.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: page.name,
        serviceType: page.name,
        description: page.seo.description,
        url,
        provider: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
        areaServed: "CO",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Servicios", item: `${siteConfig.url}/servicios` },
          { "@type": "ListItem", position: 2, name: page.name, item: url },
        ],
      },
      ...(page.faq.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: page.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ]
        : []),
    ],
  }

  return (
    <main className="min-h-screen bg-background text-textPrimary">
      <script
        type="application/ld+json"
        // El contenido es nuestro y estático: no hay entrada de usuario que escapar.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <DetailHero page={page} />
      <ZonesDivider />
      <ZonesSection page={page} />
      <ComparisonSection page={page} />
      <FlowsSection page={page} />
      <BenefitsSection page={page} />
      <CasesSection page={page} />
      <FaqSection page={page} />
      <CtaSection page={page} />
    </main>
  )
}

/** Línea de separación entre el hero y el cuerpo, con el acento de marca. */
function ZonesDivider() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 md:px-8" aria-hidden="true">
      <div className="h-px w-full bg-gradient-to-r from-[#08A696]/40 via-[#08A696]/10 to-transparent dark:from-[#26FFDF]/40 dark:via-[#26FFDF]/10" />
    </div>
  )
}
