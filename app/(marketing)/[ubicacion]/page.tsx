import type { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  ContextoSection,
  PruebasSection,
  RespuestaDirecta,
  ServiciosSection,
  UbicacionCta,
  UbicacionFaq,
  UbicacionHero,
} from "@/components/ubicaciones/secciones"
import { JsonLd } from "@/components/global/JsonLd"
import { getUbicacionPage, ubicacionPages } from "@/lib/data/ubicaciones"
import { ORGANIZATION_ID } from "@/lib/seo/site-graph"
import { siteConfig } from "@/config/site"

/**
 * Páginas de aterrizaje por ubicación.
 *
 * El segmento dinámico vive en la raíz para que la URL sea literalmente la
 * consulta que la gente escribe (`/desarrollo-de-software-pitalito`). No
 * atrapa nada más: las rutas estáticas tienen prioridad sobre las dinámicas en
 * Next, y `dynamicParams = false` hace que cualquier slug fuera del registro
 * responda 404 en lugar de renderizar una página vacía.
 */

interface PageProps {
  params: Promise<{ ubicacion: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return ubicacionPages.map((page) => ({ ubicacion: page.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ubicacion } = await params
  const page = getUbicacionPage(ubicacion)

  if (!page) return { title: "Página no encontrada" }

  const url = `${siteConfig.url}/${page.slug}`

  return {
    title: page.seo.title,
    description: page.seo.description,
    keywords: page.seo.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "es_CO",
      url,
      title: `${page.seo.title} | V1TR0`,
      description: page.seo.description,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.seo.title} | V1TR0`,
      description: page.seo.description,
    },
    other: {
      // Señales geográficas heredadas, todavía leídas por varios rastreadores.
      "geo.region": page.region ? `CO-HUI` : "CO",
      "geo.placename": page.lugar,
    },
  }
}

export default async function UbicacionRoute({ params }: PageProps) {
  const { ubicacion } = await params
  const page = getUbicacionPage(ubicacion)

  if (!page) notFound()

  const url = `${siteConfig.url}/${page.slug}`

  /**
   * Dato estructurado de la página.
   *
   * Tres piezas que trabajan juntas: `WebPage` con `speakable` señala qué
   * párrafo responde la consulta, `Service` describe qué se ofrece y dónde, y
   * `FAQPage` expone las preguntas en el formato que los motores de respuesta
   * consumen literalmente. Todo cuelga de la organización por `@id`, así que
   * refuerza la misma entidad en lugar de crear una nueva por ciudad.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.seo.title,
        description: page.seo.description,
        inLanguage: "es-CO",
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        about: { "@id": ORGANIZATION_ID },
        primaryImageOfPage: `${siteConfig.url}${siteConfig.seo.openGraph.images[0].url}`,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["#respuesta-directa", "[data-speakable='respuesta']"],
        },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: `Desarrollo de software en ${page.lugar}`,
        serviceType: "Desarrollo de software a medida",
        description: page.seo.description,
        url,
        provider: { "@id": ORGANIZATION_ID },
        areaServed: {
          "@type": page.tipoArea,
          name: page.lugar,
          ...(page.region && page.region !== page.lugar ? { containedInPlace: { "@type": "State", name: page.region } } : {}),
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `Servicios en ${page.lugar}`,
          itemListElement: page.servicios.items.map((item) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: item.nombre, description: item.descripcion },
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: page.lugar, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: page.respuestaDirecta.pregunta,
            acceptedAnswer: { "@type": "Answer", text: page.respuestaDirecta.respuesta },
          },
          ...page.faq.map((item) => ({
            "@type": "Question",
            name: item.pregunta,
            acceptedAnswer: { "@type": "Answer", text: item.respuesta },
          })),
        ],
      },
    ],
  }

  return (
    <main className="min-h-screen bg-background text-textPrimary">
      <JsonLd data={jsonLd} />

      <UbicacionHero page={page} />
      <RespuestaDirecta page={page} />
      <ContextoSection page={page} />
      <ServiciosSection page={page} />
      <PruebasSection page={page} />
      <UbicacionFaq page={page} />
      <UbicacionCta page={page} />
    </main>
  )
}
