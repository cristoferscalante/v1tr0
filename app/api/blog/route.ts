import { NextResponse } from "next/server"
import { getAllPostsMetadata } from "@/lib/mdx"

// Catálogo de blogs para el carrusel 3D del home (sección Blogs & Investigación).
// Solo los campos que usa el carrusel: título, portada y slug.
export async function GET() {
  try {
    const posts = await getAllPostsMetadata()
    const catalog = posts
      .filter((p) => p.coverImage)
      .map((p) => ({ title: p.title, coverImage: p.coverImage, slug: p.slug }))
    return NextResponse.json({ posts: catalog })
  } catch (error) {
    console.error("[api/blog] error:", error)
    return NextResponse.json({ posts: [] }, { status: 200 })
  }
}
