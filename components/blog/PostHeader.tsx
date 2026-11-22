"use client"

import Image from "next/image"
import Link from "next/link"
import { CalendarIcon, ClockIcon, UserIcon } from "@/lib/icons"

interface PostHeaderProps {
  title: string
  date: string
  author: string
  coverImage: string
  readingTime: string
  tags?: string[]
}

export default function PostHeader({ title, date, author, coverImage, readingTime, tags }: PostHeaderProps) {
  // Format date using a consistent locale
  const formattedDate = new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC", // Add timezone to ensure consistency
  })

  // Usar la imagen de portada real o fallback a placeholder
  const imageToUse = coverImage || `/imagenes/icons/svg/placeholder.svg?height=630&width=1200&query=${encodeURIComponent(title)}`

  return (
    <header className="mb-12">
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tags?.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className={`text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105 bg-[#08A696]/10 text-[#26FFDF] border-[#08a696]/50 hover:bg-[#08A696]/20 border`}
          >
            {tag}
          </Link>
        ))}
      </div>

      {/* Title */}
      <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight text-[#26FFDF]`}>{title}</h1>

      {/* Meta info */}
      <div className={`flex flex-wrap items-center gap-6 text-sm mb-8 text-[#a0a0a0]`}>
        <div className="flex items-center">
          <CalendarIcon className={`w-4 h-4 mr-2 text-[#26FFDF]`} />
          <time dateTime={date}>{formattedDate}</time>
        </div>

        <div className="flex items-center">
          <ClockIcon className={`w-4 h-4 mr-2 text-[#26FFDF]`} />
          <span>{readingTime}</span>
        </div>

        <div className="flex items-center">
          <UserIcon className={`w-4 h-4 mr-2 text-[#26FFDF]`} />
          <span>Por {author}</span>
        </div>
      </div>

      {/* Portada: completa en su proporción nativa 1200×630 (la de las portadas generadas
          y la de Open Graph), sin recortes, sin oscurecer y sin encoger. */}
      <figure className="relative group m-0">
        <div
          aria-hidden="true"
          className="absolute -inset-1 rounded-[1.25rem] bg-gradient-to-r from-[#08A696]/25 via-[#26FFDF]/15 to-[#025159]/25 blur-lg opacity-60 transition-opacity duration-500 group-hover:opacity-90"
        />
        <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-2xl border border-[#26FFDF]/20 bg-[#030707] shadow-2xl shadow-black/40">
          <Image
            src={imageToUse}
            alt={title}
            fill
            priority
            quality={85}
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover object-center"
          />
        </div>
      </figure>
    </header>
  )
}
