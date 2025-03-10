import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import TableOfContents from "@/src/components/blog/TableOfContents";
import PostHeader from "@/src/components/blog/PostHeader";
import { getPostBySlug, getAllPostSlugs } from "@/src/lib/mdx";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPostBySlug(slug);
    if (!post) {
      return {
        title: "Post no encontrado",
        description: "El artículo que buscas no existe",
      };
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
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "Ocurrió un error al cargar el artículo",
    };
  }
}

export async function generateStaticParams() {
  const posts = await getAllPostSlugs();
  return posts.map(({ slug }) => ({
    slug,
  }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  try {
    console.log(`Intentando cargar el post con slug: ${slug}`);
    const post = await getPostBySlug(slug);
    
    if (!post) {
      console.error(`Post no encontrado para el slug: ${slug}`);
      notFound();
    }

    // Verificar que el contenido del post sea válido
    if (!post.content) {
      console.error(`Contenido del post vacío para el slug: ${slug}`);
      notFound();
    }

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
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
            <aside className="md:w-64 md:sticky md:top-24 h-fit hidden md:block">
              <TableOfContents headings={post.headings} />
            </aside>

            <div className="flex-1">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <Suspense fallback={
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                }>
                  <div className="mdx-content prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:p-1 prose-code:rounded prose-img:rounded-lg prose-img:shadow-md hover:prose-a:text-blue-500">
                    {post.content}
                  </div>
                </Suspense>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  } catch (error) {
    console.error(`Error al renderizar el post ${slug}:`, error);
    console.error('Stack trace:', (error as Error).stack);
    notFound();
  }
}

