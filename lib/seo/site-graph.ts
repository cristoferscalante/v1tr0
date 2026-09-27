import { siteConfig } from "@/config/site"

/**
 * Grafo de datos estructurados del sitio.
 *
 * Una sola definición de "quiénes somos" que el resto de páginas referencia
 * por `@id` en lugar de repetir. Eso importa más de lo que parece: los
 * motores de respuesta (ChatGPT, Perplexity, AI Overviews) construyen una
 * ficha de la entidad "V1TR0" uniendo lo que encuentran en cada URL, y dos
 * descripciones distintas de la misma empresa se leen como dos entidades
 * débiles en vez de una fuerte.
 *
 * Los `@id` son URIs, no enlaces: nunca deben cambiar aunque cambie el diseño.
 */

export const ORGANIZATION_ID = `${siteConfig.url}/#organization`
export const WEBSITE_ID = `${siteConfig.url}/#website`

const { company } = siteConfig

/**
 * La entidad principal. `ProfessionalService` es subtipo de `LocalBusiness`:
 * conserva la dirección y el horario que alimentan el paquete local de Google,
 * y a la vez declara que lo que se vende es un servicio profesional, no un
 * local de paso.
 */
export const organizationSchema = {
  "@type": ["Organization", "ProfessionalService"],
  "@id": ORGANIZATION_ID,
  name: company.name,
  legalName: company.legalName,
  url: siteConfig.url,
  description: siteConfig.description,
  email: company.email,
  telephone: company.phone,
  foundingDate: company.foundingDate,
  priceRange: "$$",
  logo: {
    "@type": "ImageObject",
    url: `${siteConfig.url}/imagenes/logos/v1tr01.ico`,
  },
  image: `${siteConfig.url}${siteConfig.seo.openGraph.images[0].url}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address.street,
    addressLocality: company.address.city,
    addressRegion: company.address.region,
    postalCode: company.address.postalCode,
    addressCountry: company.address.countryCode,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: company.geo.latitude,
    longitude: company.geo.longitude,
  },
  areaServed: company.areaServed.map((name) => ({
    "@type": "AdministrativeArea",
    name,
  })),
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "18:00",
  },
  knowsAbout: [
    "Desarrollo de software a medida",
    "Aplicaciones web con Next.js",
    "Comercio electrónico",
    "Hardware e IoT",
    "Automatización de procesos",
    "Gestión de proyectos de software",
  ],
  sameAs: Object.values(siteConfig.social),
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: company.email,
    telephone: company.phone,
    areaServed: "CO",
    availableLanguage: ["es"],
  },
}

export const webSiteSchema = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: siteConfig.url,
  name: siteConfig.name,
  description: siteConfig.description,
  inLanguage: "es-CO",
  publisher: { "@id": ORGANIZATION_ID },
}

/** Grafo que se inyecta una sola vez, en el layout raíz. */
export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [organizationSchema, webSiteSchema],
}
