import BlogCard from "@/components/blog/BlogCard"
import { getAllPostsMetadata } from "@/lib/mdx"
import type { Metadata } from "next"
import { BookOpenIcon } from "@/lib/icons"
import { Suspense } from "react"
import BackgroundAnimation from "@/components/home/BackgroundAnimation"

export const metadata: Metadata = {
  title: "Blog | Artículos sobre desarrollo web y tecnología",
  description: "Explora todos nuestros artículos sobre desarrollo web, tecnología y más.",
}

// Componente de carga para usar con Suspense
function PostsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-full">
          <div className="animate-pulse rounded-xl bg-backgroundSecondary border border-custom-2/20 shadow-md overflow-hidden h-full flex flex-col">
            <div className="aspect-video w-full bg-gray-300 dark:bg-gray-700"></div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex gap-2 mb-4">
                <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              </div>
              <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-4 flex-1"></div>
              <div className="flex items-center pt-4 border-t border-custom-2/10 mt-auto">
                <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <div className="ml-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Componente para mostrar los posts
async function PostsList() {
  const posts = await getAllPostsMetadata()

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-textMuted">No hay artículos disponibles en este momento.</p>
      </div>
    )
  }

  return (
    <div id="posts-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
      {posts.map((post) => (
        <div key={post.slug} className="h-full">
          <BlogCard post={{ meta: post }} />
        </div>
      ))}
    </div>
  )
}

export default function BlogPage() {
  return (
    <>
      <BackgroundAnimation />
      <div className="container mx-auto px-8 sm:px-6 lg:px-8 max-w-6xl py-32">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-custom-2/20 rounded-full mb-4">
            <BookOpenIcon className="w-6 h-6 text-highlight" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-textMuted max-w-2xl mx-auto">
            Explora todos nuestros artículos sobre desarrollo web, tecnología y más. Optimizados para SEO y escritos con
            las mejores prácticas.
          </p>
        </header>

        <Suspense fallback={<PostsLoading />}>
          <PostsList />
        </Suspense>
      </div>
    </>
  )
}
