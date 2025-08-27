import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import TableOfContents from "@/components/blog/TableOfContents"
import PostHeader from "@/components/blog/PostHeader"
import { getPostBySlug, getAllPostSlugs } from "@/lib/mdx"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import BackgroundAnimation from "@/components/home/BackgroundAnimation"
import { MDXContent } from "@/components/blog/MDXContent"

// Ajustamos para deshabilitar la regla eslint sobre 'any' solo en este caso específico
// donde necesitamos cumplir con los tipos internos de Next.js
/* eslint-disable @typescript-eslint/no-explicit-any */

// Usamos los mismos tipos que usa Next.js internamente
export async function generateMetadata(props: any): Promise<Metadata> {
  const { slug } = await props.params

  try {
    const post = await getPostBySlug(slug)
    if (!post) {
      return {
        title: "Post no encontrado",
        description: "El artículo que buscas no existe",
      }
    }
    return {
      title: post.meta.title,
      description: post.meta.excerpt,
      openGraph: {
        title: post.meta.title,
        description: post.meta.excerpt,
        type: "article",
        publishedTime: post.meta.date,
        authors: [post.meta.author],
        images: [
          {
            url: post.meta.coverImage,
            width: 1200,
            height: 630,
            alt: post.meta.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.meta.title,
        description: post.meta.excerpt,
        images: [post.meta.coverImage],
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Error",
      description: "Ocurrió un error al cargar el artículo",
    }
  }
}

export async function generateStaticParams() {
  const posts = await getAllPostSlugs()
  return posts.map(({ slug }) => ({
    slug,
  }))
}

// Componente para el contenido del post
async function PostContent({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-4xl mx-auto">
      <PostHeader
        title={post.meta.title}
        date={post.meta.date}
        author={post.meta.author}
        coverImage={post.meta.coverImage}
        readingTime={post.meta.readingTime || ""}
        tags={post.meta.tags}
      />

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <aside className="md:w-72 md:sticky md:top-24 h-fit order-2 md:order-1">
          <TableOfContents headings={post.headings} />
        </aside>

        <div className="flex-1 order-1 md:order-2">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDXContent content={post.content} />
          </div>
        </div>
      </div>
    </article>
  )
}

// Componente de carga para usar con Suspense
function PostLoading() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="mb-12">
        <div className="flex gap-2 mb-6">
          <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>
        <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
        <div className="flex gap-6 mb-8">
          <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="aspect-[21/9] w-full bg-gray-300 dark:bg-gray-700 rounded-xl mb-4"></div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-72 order-2 md:order-1">
          <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
        </div>
        <div className="flex-1 order-1 md:order-2 space-y-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-4/5"></div>
        </div>
      </div>
    </div>
  )
}

// Usamos el mismo enfoque para el componente de página
export default async function PostPage(props: any) {
  const { slug } = await props.params

  return (
    <>
      <BackgroundAnimation />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-32">
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-textMuted hover:text-highlight transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al blog
          </Link>
        </div>

        <Suspense fallback={<PostLoading />}>
          <PostContent slug={slug} />
        </Suspense>
      </div>
    </>
  )
}
/* eslint-enable @typescript-eslint/no-explicit-any */
