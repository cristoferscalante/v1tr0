import Link from "next/link"
import Image from "next/image"
import { Calendar, User } from "lucide-react"

interface BlogCardProps {
  post: {
    slug: string
    title: string
    excerpt: string
    date: string
    author: string
    coverImage: string
  }
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={post.coverImage || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <div className="flex items-center mr-4">
              <Calendar className="w-3 h-3 mr-1" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              <span>{post.author}</span>
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors">{post.title}</h2>
          <p className="text-gray-600">{post.excerpt}</p>
          <div className="mt-4 text-blue-600 font-medium">Leer más →</div>
        </div>
      </Link>
    </article>
  )
}

