import { siteConfig } from "@/config/site"
import { getAllPostsMetadata } from "@/lib/mdx"

export const dynamic = "force-static"

const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

export async function GET() {
  const posts = await getAllPostsMetadata()
  const items = posts
    .slice(0, 60)
    .map((p) => {
      const url = `${siteConfig.url}/blog/${p.slug}`
      const pubDate = new Date(`${String(p.date).slice(0, 10)}T12:00:00-05:00`).toUTCString()
      const desc = p.resumen || p.excerpt || ""
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${esc(p.category || "Tecnología")}</category>
      <description>${esc(desc)}</description>
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog de ${esc(siteConfig.name)} — Desarrollo de software, e-commerce e IoT en Colombia</title>
    <link>${siteConfig.url}/blog</link>
    <atom:link href="${siteConfig.url}/blog/feed.xml" rel="self" type="application/rss+xml" />
    <description>${esc(siteConfig.description)}</description>
    <language>es-co</language>
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
