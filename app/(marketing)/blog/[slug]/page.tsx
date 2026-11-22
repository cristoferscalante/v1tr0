import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import TableOfContents from "@/components/blog/TableOfContents"
import PostHeader from "@/components/blog/PostHeader"
import { getPostBySlug, getAllPostSlugs, type PostMetadata } from "@/lib/mdx"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import BackgroundAnimation from "@/components/home/animations/BackgroundAnimation"
import { MDXContent } from "@/components/blog/MDXContent"
import { siteConfig } from "@/config/site"
import ContactoDirecto from "@/components/global/ContactoDirecto"

/** Fecha YYYY-MM-DD a ISO con la zona de Colombia. */
const isoDate = (d: string) => new Date(/T/.test(d) ? d : `${d}T12:00:00-05:00`).toISOString()

/** Datos estructurados del artículo: BlogPosting + migas + FAQPage (si hay preguntas). */
function postJsonLd(meta: PostMetadata) {
  const url = `${siteConfig.url}/blog/${meta.slug}`
  const image = meta.coverImage.startsWith("http") ? meta.coverImage : `${siteConfig.url}${meta.coverImage}`
  const publisher = {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: { "@type": "ImageObject", url: `${siteConfig.url}/imagenes/logos/v1tr0-logo.svg` },
  }
  const graph: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: meta.title,
      description: meta.excerpt,
      image: [image],
      datePublished: isoDate(meta.date),
      dateModified: isoDate(meta.updated || meta.date),
      inLanguage: "es-CO",
      mainEntityOfPage: url,
      author: { "@type": "Person", name: meta.author },
      publisher,
      keywords: meta.tags?.join(", "),
      ...(meta.category && { articleSection: meta.category }),
      ...(meta.resumen && { abstract: meta.resumen }),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
        { "@type": "ListItem", position: 3, name: meta.title, item: url },
      ],
    },
  ]
  if (meta.faqs?.length) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: meta.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    })
  }
  return JSON.stringify(graph).replace(/</g, "\\u003c")
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
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
      alternates: { canonical: `${siteConfig.url}/blog/${slug}` },
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

  const headerProps = {
    title: post.meta.title,
    date: post.meta.date,
    author: post.meta.author,
    coverImage: post.meta.coverImage,
    readingTime: post.meta.readingTime || "",
    ...(post.meta.tags && { tags: post.meta.tags })
  }

  return (
    <article className="max-w-4xl mx-auto">
      <PostHeader {...headerProps} />

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <aside className="md:w-72 md:sticky md:top-24 h-fit order-2 md:order-1">
          <TableOfContents headings={post.headings} />
        </aside>

        <div className="flex-1 order-1 md:order-2">
          {post.meta.resumen && (
            <aside className="mb-8 rounded-xl border border-[#26FFDF]/40 bg-[#025159]/20 p-5">
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#26FFDF]">Respuesta corta</p>
              <p className="m-0 text-base leading-relaxed">{post.meta.resumen}</p>
            </aside>
          )}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MDXContent content={post.content} />
          </div>
          {post.meta.faqs && post.meta.faqs.length > 0 && (
            <section className="mt-12" aria-labelledby="preguntas-frecuentes">
              <h2 id="preguntas-frecuentes" className="mb-4 text-2xl font-bold">Preguntas frecuentes</h2>
              {post.meta.faqs.map((f) => (
                <details key={f.q} className="mb-3 rounded-xl border border-[#26FFDF]/20 p-4">
                  <summary className="cursor-pointer font-semibold">{f.q}</summary>
                  <p className="mt-3 mb-0 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </section>
          )}
        </div>
      </div>
      <ContactoDirecto
        className="mt-12"
        interes={`lo que leí en el artículo «${post.meta.title}»`}
        titulo="¿Quieres aplicarlo en tu empresa?"
        descripcion="Cuéntanos tu caso por Telegram (el mensaje ya va escrito) o por correo, y te decimos cómo lo haríamos y cuánto costaría."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: postJsonLd(post.meta) }} />
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
        <div className="aspect-[1200/630] w-full bg-gray-300 dark:bg-gray-700 rounded-2xl mb-4"></div>
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

export default async function PostPage(props: PageProps) {
  const { slug } = await props.params

  return (
    <>
      <BackgroundAnimation />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-16 md:py-32">
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
