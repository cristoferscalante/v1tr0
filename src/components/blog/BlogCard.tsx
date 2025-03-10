import Link from "next/link";
import Image from "next/image";
import type { PostMetadata } from "@/src/lib/mdx";

interface BlogCardProps {
  post: { meta: PostMetadata };
}

export default function BlogCard({ post }: BlogCardProps) {
  // Validar que el post y sus metadatos existan
  if (!post?.meta || !post.meta.slug) {
    console.error('Post inválido o sin slug:', post);
    return null;
  }
  const formattedDate = new Date(post.meta.date).toLocaleDateString("es-ES", {
    timeZone: 'UTC'  // Add timezone to ensure consistency
  });

  return (
    <article className="bg-backgroundSecondary rounded-lg shadow-lg overflow-hidden border border-custom-2/20 group transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
      <Link href={`/blog/${encodeURIComponent(post.meta.slug)}`} className="block" prefetch={true}>
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={post.meta.coverImage || "/placeholder.svg?height=300&width=500"}
            alt={post.meta.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            {post.meta.tags?.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded-full bg-custom-2/30 text-highlight">
                {tag}
              </span>
            ))}
            <span className="text-xs text-textMuted ml-auto">{post.meta.readingTime}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold mb-2 line-clamp-2 group-hover:text-highlight transition-colors">
            {post.meta.title}
          </h2>

          <p className="text-textMuted line-clamp-3 mb-4">{post.meta.excerpt}</p>

          <div className="flex items-center mt-4">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={post.meta.authorImage || "/placeholder.svg?height=40&width=40"}
                alt={post.meta.author}
                fill
                className="object-cover"
              />
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">{post.meta.author}</p>
              <p className="text-xs text-textMuted">{formattedDate}</p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}


