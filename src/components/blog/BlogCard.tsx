import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock } from "lucide-react"
import type { PostMetadata } from "@/src/lib/mdx"

interface BlogCardProps {
  post: { meta: PostMetadata }
}

export default function BlogCard({ post }: BlogCardProps) {
  // Validar que el post y sus metadatos existan
  if (!post?.meta || !post.meta.slug) {
    console.error("Post inválido o sin slug:", post)
    return null
  }

  const formattedDate = new Date(post.meta.date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC", // Add timezone to ensure consistency
  })

  return (
    <article className="group relative overflow-hidden rounded-xl bg-backgroundSecondary border border-custom-2/20 shadow-md transition-all duration-500 hover:shadow-xl hover:translate-y-[-4px]">
      <Link href={`/blog/${encodeURIComponent(post.meta.slug)}`} className="block" prefetch={true}>
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={post.meta.coverImage || "/placeholder.svg?height=300&width=500"}
            alt={post.meta.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        <div className="p-6">
          {/* Tags and reading time */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {post.meta.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-3 py-1 rounded-full bg-custom-2/30 text-highlight transition-colors duration-300 group-hover:bg-custom-2/50"
              >
                {tag}
              </span>
            ))}
            <div className="ml-auto flex items-center text-xs text-textMuted">
              <Clock className="w-3 h-3 mr-1" />
              <span>{post.meta.readingTime}</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold mb-3 line-clamp-2 transition-colors duration-300 group-hover:text-highlight">
            {post.meta.title}
          </h2>

          {/* Excerpt */}
          <p className="text-textMuted text-sm line-clamp-3 mb-4">{post.meta.excerpt}</p>

          {/* Author and date */}
          <div className="flex items-center pt-4 border-t border-custom-2/10">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-custom-2/30">
              <Image
                src={post.meta.authorImage || "/placeholder.svg?height=40&width=40"}
                alt={post.meta.author}
                fill
                className="object-cover"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{post.meta.author}</p>
              <div className="flex items-center text-xs text-textMuted">
                <Calendar className="w-3 h-3 mr-1" />
                <time dateTime={post.meta.date}>{formattedDate}</time>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}



