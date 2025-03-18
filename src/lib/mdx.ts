"use server"

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { slugify, calculateReadingTime } from "./utils"

// Directorio donde se almacenarán los archivos MDX
const postsDirectory = path.join(process.cwd(), "src", "content", "blog")

// Tipo para los metadatos del post
export interface PostMetadata {
  title: string
  date: string
  excerpt: string
  author: string
  coverImage: string
  authorImage?: string
  tags?: string[]
  slug: string
  readingTime?: string
}

// Tipo para el post completo
export interface Post {
  meta: PostMetadata
  content: string
  headings: Array<{ level: number; text: string; id: string }>
}

// Función para verificar y crear el directorio si no existe
function ensureDirectoryExists() {
  if (!fs.existsSync(postsDirectory)) {
    console.log(`Creando directorio: ${postsDirectory}`)
    fs.mkdirSync(postsDirectory, { recursive: true })
  }
}

// Función para obtener todos los slugs de los posts
export async function getAllPostSlugs() {
  ensureDirectoryExists()

  try {
    const fileNames = fs.readdirSync(postsDirectory)

    return fileNames
      .filter((fileName) => fileName.endsWith(".mdx"))
      .map((fileName) => ({
        slug: fileName.replace(/\.mdx$/, ""),
      }))
  } catch (error) {
    console.error("Error al leer los slugs:", error)
    return []
  }
}

// Función para obtener los metadatos de todos los posts
export async function getAllPostsMetadata(): Promise<PostMetadata[]> {
  ensureDirectoryExists()

  try {
    const fileNames = fs.readdirSync(postsDirectory)

    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith(".mdx"))
      .map((fileName) => {
        try {
          // Eliminar la extensión ".mdx" para obtener el slug
          const slug = fileName.replace(/\.mdx$/, "")

          // Leer el contenido del archivo MDX
          const fullPath = path.join(postsDirectory, fileName)
          const fileContents = fs.readFileSync(fullPath, "utf8")

          // Usar gray-matter para analizar la sección de metadatos (frontmatter)
          const { data, content } = matter(fileContents)

          // Calcular tiempo de lectura si no está definido
          if (!data.readingTime) {
            data.readingTime = calculateReadingTime(content)
          }

          // Construimos los metadatos
          const metadata: PostMetadata = {
            ...(data as Omit<PostMetadata, "slug">),
            slug,
          }

          return metadata
        } catch (error) {
          console.error(`Error al procesar el archivo ${fileName}:`, error)
          return null
        }
      })
      // Filtra nulos para quedarnos solo con objetos válidos
      .filter((post): post is PostMetadata => post !== null)

    // Ordenar los posts por fecha, del más reciente al más antiguo
    return allPostsData.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  } catch (error) {
    console.error("Error al obtener los metadatos:", error)
    return []
  }
}

// Función para extraer encabezados del contenido
function extractHeadings(content: string) {
  if (!content) return []

  // Dividir el contenido en líneas para procesarlo
  const lines = content.split("\n")
  const headings: { level: number; text: string; id: string }[] = []

  // Variable para rastrear si estamos dentro de un bloque de código
  let inCodeBlock = false

  // Procesamos línea por línea
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Detectar inicio/fin de bloques de código
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock
      continue
    }

    // Ignorar líneas dentro de bloques de código
    if (inCodeBlock) continue

    // Expresión regular para detectar encabezados - solo al inicio de línea
    const headingMatch = line.match(/^(#{1,6})\s+(.+?)(?:\s*#*\s*)?$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = headingMatch[2].trim()
      // Generar ID usando la función unificada slugify
      const id = slugify(text)
      headings.push({ level, text, id })
    }
  }

  return headings
}

// Cache para posts
const postCache = new Map<string, Post>()

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Si ya tenemos el post en caché, lo devolvemos
  if (postCache.has(slug)) {
    return postCache.get(slug)!
  }

  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    // Leer contenido del archivo
    const source = fs.readFileSync(fullPath, "utf8")

    // Usar gray-matter para extraer frontmatter y contenido
    const { data, content } = matter(source)

    // Extraer encabezados del contenido
    const headings = extractHeadings(content)

    // Asigna valores predeterminados usando un objeto para metadatos por defecto
    const defaultMetadata: PostMetadata = {
      title: `Post: ${slug.replace(/-/g, " ")}`,
      date: new Date().toISOString(),
      excerpt: "Este es un post de ejemplo sin descripción proporcionada.",
      author: "Sistema",
      coverImage: "/placeholder.svg?height=630&width=1200",
      slug: slug,
      readingTime: calculateReadingTime(content),
      tags: ["sin-categorizar"],
    }

    // Combina los datos existentes con los valores predeterminados
    const metadata = {
      ...defaultMetadata,
      ...(data as Partial<PostMetadata>),
      slug,
    }

    // Si hay una imagen de portada personalizada, verificarla
    if (metadata.coverImage && metadata.coverImage !== defaultMetadata.coverImage) {
      const publicImagePath = path.join(process.cwd(), "public", metadata.coverImage)
      if (!fs.existsSync(publicImagePath)) {
        metadata.coverImage = defaultMetadata.coverImage
      }
    }

    const post: Post = {
      meta: metadata as PostMetadata,
      content: content || `# ${metadata.title}\n\nEste post no tiene contenido.`,
      headings,
    }

    // Guardar en caché
    postCache.set(slug, post)

    return post
  } catch (error) {
    console.error(`Error processing post ${slug}:`, error)
    return null
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const slugs = await getAllPostSlugs()
    const posts = await Promise.all(
      slugs.map(async ({ slug }) => {
        const post = await getPostBySlug(slug)
        return post
      }),
    )

    return posts
      .filter((post): post is Post => post !== null)
      .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime())
  } catch (error) {
    console.error("Error getting all posts:", error)
    return []
  }
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter((post) => post.meta.tags?.includes(tag))
}


