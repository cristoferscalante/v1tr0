import type { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"
import { subcategoryPages } from "@/lib/data/servicios"
import { ubicacionPages } from "@/lib/data/ubicaciones"
import { getAllPostsMetadata } from "@/lib/mdx"

/**
 * Sitemap del sitio público (optimizado con reglas de seo-sitemap y seo-technical).
 *
 * - Evita marcas `<lastmod>` artificialmente idénticas en todo el sitio:
 *   cada artículo lleva su fecha real (`updated || date`), la portada y `/blog`
 *   reflejan la fecha del artículo más reciente, y las páginas estructurales
 *   llevan su fecha real de última actualización de contenido.
 * - Incluye las imágenes de portada (`images`) en cada entrada del blog para
 *   Google Image Sitemap (`<image:image><image:loc>`).
 */

const STABLE_CONTENT_DATE = new Date("2026-11-22T12:00:00-05:00")

const staticRoutes: Array<{
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  useLatestPost?: boolean
}> = [
  { path: "", priority: 1, changeFrequency: "weekly", useLatestPost: true },
  { path: "/contratar-software", priority: 0.9, changeFrequency: "monthly" },
  { path: "/hardware-iot", priority: 0.9, changeFrequency: "monthly" },
  { path: "/servicios", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tienda", priority: 0.8, changeFrequency: "weekly" },
  { path: "/portfolio", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "daily", useLatestPost: true },
  { path: "/about", priority: 0.6, changeFrequency: "yearly" },
  { path: "/terminos", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacidad", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPostsMetadata()
  const postDates = posts
    .map((p) => new Date(`${String(p.updated || p.date).slice(0, 10)}T12:00:00-05:00`))
    .filter((d) => !Number.isNaN(d.getTime()))
  const latestPostDate =
    postDates.length > 0
      ? new Date(Math.max(...postDates.map((d) => d.getTime())))
      : STABLE_CONTENT_DATE

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route.path}`,
      lastModified: route.useLatestPost ? latestPostDate : STABLE_CONTENT_DATE,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...subcategoryPages.map((page) => ({
      url: `${siteConfig.url}/servicios/${page.slug}`,
      lastModified: STABLE_CONTENT_DATE,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...ubicacionPages.map((page) => ({
      url: `${siteConfig.url}/${page.slug}`,
      lastModified: STABLE_CONTENT_DATE,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...posts.map((post) => {
      const cover = post.coverImage
        ? post.coverImage.startsWith("http")
          ? post.coverImage
          : `${siteConfig.url}${post.coverImage}`
        : undefined
      return {
        url: `${siteConfig.url}/blog/${post.slug}`,
        lastModified: new Date(`${String(post.updated || post.date).slice(0, 10)}T12:00:00-05:00`),
        changeFrequency: "monthly" as const,
        priority: 0.7,
        ...(cover ? { images: [cover] } : {}),
      }
    }),
  ]
}
