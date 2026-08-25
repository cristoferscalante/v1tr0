"use client"

import Link from "next/link"
import Image from "next/image"
import { CalendarIcon, ClockIcon } from "@/lib/icons"
import type { PostMetadata } from "@/lib/mdx"

interface BlogCardProps {
  post: { meta: PostMetadata }
}

export default function BlogCard({ post }: BlogCardProps) {

  // Validar que el post y sus metadatos existan
  if (!post?.meta || !post.meta.slug) {
    console.error("Post inválido o sin slug:", post)
    return null
  }

  // Función para normalizar el texto a una longitud aproximada (3 líneas = ~150 caracteres)
  const normalizeExcerpt = (text: string, targetLength: number = 150) => {
    if (text.length <= targetLength) {
      return text
    }
    // Encontrar el último espacio antes del límite para no cortar palabras
    const truncated = text.substring(0, targetLength)
    const lastSpace = truncated.lastIndexOf(' ')
    return truncated.substring(0, lastSpace) + '...'
  }

  const normalizedExcerpt = normalizeExcerpt(post.meta.excerpt)

  const formattedDate = new Date(post.meta.date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })

  // Usar imágenes reales como fallback
  const coverImage = post.meta.coverImage || `/post/post.png`;
  const authorImage = post.meta.authorImage || `/imagenes/logos/v1tr0-logo.svg`;

  return (
    <Link
      href={`/blog/${encodeURIComponent(post.meta.slug)}`}
      className="relative group w-full h-full text-left focus:outline-none focus:ring-2 focus:ring-[#08A696] focus:ring-opacity-50 focus:ring-offset-2 rounded-2xl block transition-all duration-300 hover:transform hover:-translate-y-1"
      aria-label={post.meta.title}
      prefetch={true}
    >
      {/* Gradiente exterior igual a CardBanner */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r from-[#08a6961e] to-[#26ffde23] rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all duration-300`}
      ></div>
      
      {/* Card principal con mismo estilo que CardBanner */}
      <article
        className={`relative h-full flex flex-col bg-[#02505931] backdrop-blur-sm rounded-2xl border border-[#08A696]/20 transition-all duration-300 transform scale-95 group-hover:scale-100 group-hover:border-[#08A696] group-hover:bg-[#02505950] shadow-lg group-hover:shadow-xl group-hover:shadow-[#08A696]/10 overflow-hidden`}
      >
        {/* Imagen de portada */}
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={coverImage || "/imagenes/icons/svg/placeholder.svg"}
            alt={post.meta.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Gradiente overlay */}
          <div 
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
            }}
          />
        </div>

        <div className="flex-1 flex flex-col p-6">
          {/* Tags and reading time */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {post.meta.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm transition-all duration-300 bg-[#08A696]/10 text-[#26FFDF] border-[#08a696]/50 border`}
              >
                {tag}
              </span>
            ))}
            <div className={`ml-auto flex items-center text-xs text-[#a0a0a0]`}>
              <ClockIcon className="w-3 h-3 mr-1" />
              <span>{post.meta.readingTime}</span>
            </div>
          </div>

          {/* Title */}
          <h2 
            className={`text-xl font-bold mb-3 line-clamp-2 transition-colors duration-300 group-hover:opacity-90 text-[#26FFDF] group-hover:text-[#26FFDF]`}
          >
            {post.meta.title}
          </h2>

          {/* Excerpt - longitud normalizada para uniformidad */}
          <p 
            className={`text-sm mb-4 flex-1 text-[#a0a0a0]`}
            style={{
              lineHeight: '1.5rem',
              minHeight: '4.5rem', // Espacio para 3 líneas
              maxHeight: '4.5rem',
              overflow: 'hidden',
            }}
          >
            {normalizedExcerpt}
          </p>

          {/* Author and date - siempre al final */}
          <div 
            className={`flex items-center pt-4 border-t mt-auto border-[#08A696]/20`}
          >
            <div className={`relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#08A696]/30`}>
              <Image src={authorImage || "/imagenes/icons/svg/placeholder.svg"} alt={post.meta.author} fill sizes="(max-width:768px) 100vw, 800px" className="object-cover" />
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium text-[#26FFDF]`}>{post.meta.author}</p>
              <div className={`flex items-center text-xs text-[#a0a0a0]`}>
                <CalendarIcon className="w-3 h-3 mr-1" />
                <time dateTime={post.meta.date}>{formattedDate}</time>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
