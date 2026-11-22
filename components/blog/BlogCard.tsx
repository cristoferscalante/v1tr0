"use client"

import Link from "next/link"
import Image from "next/image"
import { CalendarIcon, ClockIcon } from "@/lib/icons"
import type { PostMetadata } from "@/lib/mdx"

interface BlogCardProps {
  post: { meta: PostMetadata }
  /** Tarjeta grande para el artículo más reciente: imagen a la izquierda en escritorio. */
  featured?: boolean
  /** Carga prioritaria (solo la primera imagen visible de la página). */
  priority?: boolean
}

// Corta el texto en la última palabra completa antes del límite.
const normalizeExcerpt = (text: string, targetLength = 150) => {
  if (!text || text.length <= targetLength) return text
  const truncated = text.substring(0, targetLength)
  return truncated.substring(0, truncated.lastIndexOf(" ")) + "…"
}

export default function BlogCard({ post, featured = false, priority = false }: BlogCardProps) {
  if (!post?.meta || !post.meta.slug) {
    console.error("Post inválido o sin slug:", post)
    return null
  }

  const { meta } = post
  const coverImage = meta.coverImage || "/post/post.png"
  const authorImage = meta.authorImage || "/imagenes/logos/v1tr0-logo.svg"
  const formattedDate = new Date(meta.date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })

  return (
    <Link
      href={`/blog/${encodeURIComponent(meta.slug)}`}
      className="relative group block h-full rounded-2xl text-left transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26FFDF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030707]"
      aria-label={meta.title}
      prefetch={true}
    >
      <div
        aria-hidden="true"
        className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#08A696]/20 to-[#26FFDF]/20 blur opacity-30 transition-opacity duration-300 group-hover:opacity-70"
      />

      <article
        className={`relative h-full overflow-hidden rounded-2xl border border-[#08A696]/20 bg-[#02505931] backdrop-blur-sm shadow-lg transition-colors duration-300 group-hover:border-[#08A696] group-hover:bg-[#02505950] ${
          featured ? "flex flex-col lg:grid lg:grid-cols-[1.35fr_1fr]" : "flex flex-col"
        }`}
      >
        {/* Portada en proporción 1200×630: se ve completa, sin franjas oscuras encima */}
        <div className={`relative aspect-[1200/630] w-full overflow-hidden bg-[#030707] ${featured ? "lg:self-center lg:rounded-xl lg:m-4 lg:w-auto lg:border lg:border-[#26FFDF]/15" : ""}`}>
          <Image
            src={coverImage}
            alt={meta.title}
            fill
            priority={priority}
            quality={80}
            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
            sizes={featured ? "(max-width: 1024px) 100vw, 640px" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"}
          />
          {meta.category && (
            <span className="absolute left-3 top-3 rounded-full border border-[#26FFDF]/40 bg-[#030707]/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#26FFDF] backdrop-blur-sm">
              {meta.category}
            </span>
          )}
        </div>

        <div className={`flex flex-1 flex-col ${featured ? "p-6 lg:p-8" : "p-6"}`}>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {meta.tags?.slice(0, featured ? 3 : 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#08a696]/50 bg-[#08A696]/10 px-3 py-1 text-xs font-medium text-[#26FFDF]"
              >
                {tag}
              </span>
            ))}
            <div className="ml-auto flex items-center text-xs text-[#a0a0a0]">
              <ClockIcon className="mr-1 h-3 w-3" />
              <span>{meta.readingTime}</span>
            </div>
          </div>

          <h2
            className={`mb-3 font-bold text-[#26FFDF] ${
              featured ? "text-2xl leading-tight lg:text-3xl line-clamp-3" : "text-xl line-clamp-2"
            }`}
          >
            {meta.title}
          </h2>

          <p className={`mb-4 flex-1 text-sm leading-6 text-[#a0a0a0] ${featured ? "lg:text-base line-clamp-4" : "line-clamp-3"}`}>
            {normalizeExcerpt(meta.resumen && featured ? meta.resumen : meta.excerpt, featured ? 260 : 150)}
          </p>

          <div className="mt-auto flex items-center border-t border-[#08A696]/20 pt-4">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-[#08A696]/30">
              <Image src={authorImage} alt={meta.author} fill sizes="40px" className="object-cover" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#26FFDF]">{meta.author}</p>
              <div className="flex items-center text-xs text-[#a0a0a0]">
                <CalendarIcon className="mr-1 h-3 w-3" />
                <time dateTime={meta.date}>{formattedDate}</time>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
