import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { getAllPostsMetadata } from "@/src/lib/mdx"
import { Calendar, User, Tag } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog | V1TR0",
  description: "Explora nuestros artículos sobre tecnología, desarrollo web y más",
  openGraph: {
    title: "Blog | V1TR0",
    description: "Explora nuestros artículos sobre tecnología, desarrollo web y más",
    type: "website",
    url: "/blog",
  },
}

export default async function BlogPage() {
  console.log("Cargando página del blog...")
  const posts = await getAllPostsMetadata()
  console.log(`Posts encontrados: ${posts.length}`)

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Nuestro Blog</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Artículos, guías y recursos sobre desarrollo web, tecnología y más.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            No hay artículos publicados aún. Verifica que existan archivos .mdx en la carpeta content/blog.
          </p>
          <p className="mt-4 text-gray-500">Ruta de contenido: /content/blog/*.mdx</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative h-48 w-full">
                  <Image
                    src={post.coverImage || "/placeholder.svg?height=400&width=600"}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center text-sm text-gray-500 mb-2">
                    <div className="flex items-center mr-4 mb-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    <div className="flex items-center mb-1">
                      <User className="w-3 h-3 mr-1" />
                      <span>{post.author}</span>
                    </div>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h2 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors">{post.title}</h2>
                  <p className="text-gray-600">{post.excerpt}</p>
                  <div className="mt-4 text-blue-600 font-medium">Leer más →</div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

