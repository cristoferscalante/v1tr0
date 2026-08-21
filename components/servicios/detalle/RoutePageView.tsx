import type { Metadata } from "next"

import { siteConfig } from "@/config/site"
import type { RoutePage } from "@/lib/data/rutas/tipos"
import { PrinciplesSection } from "./principios"
import {
  BenefitsSection,
  CasesSection,
  ComparisonSection,
  CtaSection,
  DetailHero,
  FaqSection,
  FlowsSection,
  ZonesSection,
} from "./secciones"

/**
 * Vista compartida de las páginas de caída (software / hardware).
 *
 * Server Component: el contenido llega renderizado con metadata y JSON-LD,
 * que es justo lo que estas páginas necesitan para posicionar.
 */

/** Metadata a partir de los datos de la ruta, para no repetirla en cada page. */
export function buildRouteMetadata(page: RoutePage): Metadata {
  const url = `${siteConfig.url}/${page.slug}`
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

export function RoutePageView({ page }: { page: RoutePage }) {
  const url = `${siteConfig.url}/${page.slug}`

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
          { "@type": "ListItem", position: 1, name: "Inicio", item: siteConfig.url },
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
        // Contenido propio y estático: no hay entrada de usuario que escapar.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <DetailHero page={page} />
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8" aria-hidden="true">
        <div className="h-px w-full bg-gradient-to-r from-[#08A696]/40 via-[#08A696]/10 to-transparent dark:from-[#26FFDF]/40 dark:via-[#26FFDF]/10" />
      </div>

      <ZonesSection page={page} />
      <PrinciplesSection groups={page.principles} />
      <ComparisonSection page={page} />
      <FlowsSection page={page} />
      <BenefitsSection page={page} />
      <CasesSection page={page} />
      <FaqSection page={page} />
      <CtaSection page={page} />
    </main>
  )
}
