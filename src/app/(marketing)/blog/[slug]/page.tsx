import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, User, Tag } from "lucide-react"
import { getPostBySlug, getAllPostSlugs } from "@/src/lib/mdx"

// Función para generar metadatos dinámicos basados en el slug
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  // Se espera a que params se resuelva y se extrae el slug
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: "Artículo no encontrado",
      description: "El artículo que buscas no existe",
    }
  }

  return {
    title: `${post.metadata.title} | Blog V1TR0`,
    description: post.metadata.excerpt,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.excerpt,
      type: "article",
      url: `/blog/${post.metadata.slug}`,
      images: [
        {
          url: post.metadata.coverImage,
          width: 1200,
          height: 630,
          alt: post.metadata.title,
        },
      ],
      publishedTime: post.metadata.date,
      authors: [post.metadata.author],
    },
  }
}

// Función para generar rutas estáticas en build time
export async function generateStaticParams() {
  const posts = await getAllPostSlugs()
  return posts
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  // Se espera a que params se resuelva y se extrae el slug
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/blog" className="inline-flex items-center text-blue-600 mb-8 hover:underline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al blog
      </Link>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.metadata.title}</h1>
          <div className="flex flex-wrap items-center text-gray-600 mb-4">
            <div className="flex items-center mr-6 mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              <time dateTime={post.metadata.date}>
                {new Date(post.metadata.date).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <div className="flex items-center mb-2">
              <User className="w-4 h-4 mr-2" />
              <span>{post.metadata.author}</span>
            </div>
          </div>

          {post.metadata.tags && post.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.metadata.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center text-sm bg-gray-100 px-3 py-1 rounded">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="relative w-full h-96 mb-8">
          <Image
            src={post.metadata.coverImage || "/placeholder.svg?height=600&width=1200"}
            alt={post.metadata.title}
            fill
            className="object-cover rounded-lg"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>

        <div className="prose prose-lg max-w-none">{post.content}</div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex items-center">
            <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
              <Image
                src={post.metadata.authorImage || "/placeholder.svg?height=100&width=100"}
                alt={post.metadata.author}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-medium">{post.metadata.author}</div>
              <div className="text-sm text-gray-600">Autor</div>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

