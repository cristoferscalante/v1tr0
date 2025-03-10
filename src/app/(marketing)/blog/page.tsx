import BlogCard from "@/src/components/blog/BlogCard"
import { getAllPostsMetadata } from "@/src/lib/mdx"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description: "Explora todos nuestros artículos sobre desarrollo web, tecnología y más.",
}

export default async function BlogPage() {
  try {
    const posts = await getAllPostsMetadata()

    if (!posts || posts.length === 0) {
      return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
          <header className="mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-lg text-textMuted max-w-2xl">
              No hay artículos disponibles en este momento.
            </p>
          </header>
        </div>
      )
    }

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
        <header className="mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-textMuted max-w-2xl">
            Explora todos nuestros artículos sobre desarrollo web, tecnología y más. Optimizados para SEO y escritos con
            las mejores prácticas.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={{ meta: post }} />
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error al cargar los posts:', error)
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
        <header className="mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-red-600 dark:text-red-400 max-w-2xl">
            Ocurrió un error al cargar los artículos. Por favor, intenta más tarde.
          </p>
        </header>
      </div>
    )
  }
}
