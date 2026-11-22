import type { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"
import { subcategoryPages } from "@/lib/data/servicios"
import { ubicacionPages } from "@/lib/data/ubicaciones"
import { getAllPostsMetadata } from "@/lib/mdx"

/**
 * Sitemap del sitio público.
 *
 * Solo rutas de marketing: el panel, la autenticación y la API quedan fuera
 * a propósito. Las páginas de servicio salen del registro de subcategorías,
 * así que agregar una nueva no obliga a tocar este archivo.
 */

/** Rutas fijas con su prioridad relativa. */
const staticRoutes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/contratar-software", priority: 0.9, changeFrequency: "monthly" },
  { path: "/hardware-iot", priority: 0.9, changeFrequency: "monthly" },
  { path: "/servicios", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tienda", priority: 0.8, changeFrequency: "weekly" },
  { path: "/portfolio", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "yearly" },
  { path: "/terminos", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacidad", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  // Artículos del blog: cada uno con su fecha real (la de revisión si la tiene).
  const posts = await getAllPostsMetadata()

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...subcategoryPages.map((page) => ({
      url: `${siteConfig.url}/servicios/${page.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // Páginas por ubicación: prioridad alta porque son las que responden las
    // consultas con intención de contratación ("empresa de software en X").
    ...ubicacionPages.map((page) => ({
      url: `${siteConfig.url}/${page.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: new Date(`${String(post.updated || post.date).slice(0, 10)}T12:00:00-05:00`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]
}
