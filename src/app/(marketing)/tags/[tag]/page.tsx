import type { Metadata } from "next"
import BlogCard from "@/src/components/blog/BlogCard"
import { getPostsByTag, getAllPosts } from "@/src/lib/mdx"

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const displayTag = tag.replace(/-/g, " ")

  return {
    title: `Artículos sobre ${displayTag}`,
    description: `Explora todos nuestros artículos relacionados con ${displayTag}. Contenido optimizado para SEO.`,
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  const tags = new Set<string>()

  posts.forEach((post) => {
    post.meta.tags?.forEach((tag) => {
      tags.add(tag)
    })
  })

  return Array.from(tags).map((tag) => ({
    tag,
  }))
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag)
  const displayTag = tag.replace(/-/g, " ")

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
      <header className="mb-16">
        <div className="inline-block bg-custom-2/30 text-highlight px-4 py-2 rounded-lg mb-4">{displayTag}</div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Artículos sobre {displayTag}</h1>
        <p className="text-lg text-textMuted max-w-2xl">
          Explora todos nuestros artículos relacionados con {displayTag}. Optimizados para SEO y escritos con las
          mejores prácticas.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogCard key={post.meta.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-textMuted">No se encontraron artículos con esta etiqueta.</p>
        </div>
      )}
    </div>
  )
}


