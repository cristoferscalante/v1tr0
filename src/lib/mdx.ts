"use server"

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { compileMDX } from "next-mdx-remote/rsc"
import type { ReactElement } from "react"
import React from "react"

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
  content: ReactElement
  headings: Array<{ level: number; text: string; id: string }>
}

// Función para verificar y crear el directorio si no existe
function ensureDirectoryExists() {
  if (!fs.existsSync(postsDirectory)) {
    console.log(`Creando directorio: ${postsDirectory}`)
    console.log(`Current working directory: ${process.cwd()}`)
    fs.mkdirSync(postsDirectory, { recursive: true })
  } else {
    console.log(`Found directory: ${postsDirectory}`)
    try {
      const files = fs.readdirSync(postsDirectory)
      console.log(`Files in directory: ${files.join(", ")}`)
    } catch (error) {
      console.error(`Error reading directory: ${error}`)
    }
  }
}

// Función para obtener todos los slugs de los posts
export async function getAllPostSlugs() {
  ensureDirectoryExists()

  try {
    const fileNames = fs.readdirSync(postsDirectory)
    console.log(`Archivos encontrados: ${fileNames.length}`)

    return fileNames
      .filter((fileName) => {
        const isMdx = fileName.endsWith(".mdx")
        if (!isMdx) {
          console.log(`Ignorando archivo no MDX: ${fileName}`)
        }
        return isMdx
      })
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
    console.log(`Total de archivos encontrados: ${fileNames.length}`)

    const allPostsData = fileNames
      .filter((fileName) => {
        const isMdx = fileName.endsWith(".mdx")
        if (!isMdx) {
          console.log(`Ignorando archivo no MDX: ${fileName}`)
        }
        return isMdx
      })
      .map((fileName) => {
        try {
          // Eliminar la extensión ".mdx" para obtener el slug
          const slug = fileName.replace(/\.mdx$/, "")

          // Leer el contenido del archivo MDX
          const fullPath = path.join(postsDirectory, fileName)
          const fileContents = fs.readFileSync(fullPath, "utf8")

          // Usar gray-matter para analizar la sección de metadatos (frontmatter)
          const { data } = matter(fileContents)

          // Construimos los metadatos
          const metadata: PostMetadata = {
            ...(data as Omit<PostMetadata, "slug">),
            slug,
          }

          // Validar campos requeridos
          const requiredFields = ["title", "date", "excerpt", "author", "coverImage"] as const
          const missingFields = requiredFields.filter((field) => !metadata[field as keyof typeof metadata])

          if (missingFields.length > 0) {
            console.warn(`Campos faltantes en ${fileName}: ${missingFields.join(", ")}`)
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
      // Convertimos a Date para mayor confiabilidad
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

  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings: { level: number; text: string; id: string }[] = []
  let match

  try {
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "-")
      headings.push({ level, text, id })
    }
  } catch (error) {
    console.error("Error extracting headings:", error)
  }

  return headings
}

// Agregar logging adicional para depuración
// Add a simple in-memory cache for posts
const postCache = new Map<string, Post>()

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // If we've already compiled this post, return it
  if (postCache.has(slug)) {
    return postCache.get(slug)!
  }

  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    console.log(`[getPostBySlug] Buscando post con slug: ${slug}`)
    console.log(`[getPostBySlug] Directorio de posts: ${postsDirectory}`)
    console.log(`[getPostBySlug] Ruta completa del archivo: ${fullPath}`)

    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${fullPath}`)
      return null
    }

    // Leer contenido del archivo
    const source = fs.readFileSync(fullPath, "utf8")
    console.log(`[getPostBySlug] Contenido leído: ${source.substring(0, 100)}...`)

    // Usar gray-matter para extraer frontmatter y contenido
    const { data, content } = matter(source)

    // Verificar si hay frontmatter
    if (Object.keys(data).length === 0) {
      console.log("El contenido MDX no tiene frontmatter")
      // Si no hay frontmatter, vamos a crear uno predeterminado
    }

    if (!content || content.trim() === "") {
      console.warn(`Invalid or empty content in MDX file: ${slug}.mdx`)
      // Podemos devolver un post con contenido predeterminado en lugar de null
    }

    const headings = extractHeadings(content)

    // Asigna valores predeterminados usando un objeto para metadatos por defecto
    const defaultMetadata: PostMetadata = {
      title: `Post: ${slug.replace(/-/g, " ")}`,
      date: new Date().toISOString(),
      excerpt: "Este es un post de ejemplo sin descripción proporcionada.",
      author: "Sistema",
      coverImage: "/placeholder.svg?height=630&width=1200",
      slug: slug,
      readingTime: "1 min read",
      tags: ["sin-categorizar"],
    }

    // Combina los datos existentes con los valores predeterminados
    const metadata = {
      ...defaultMetadata,
      ...(data as Partial<PostMetadata>),
      slug, // Aseguramos que el slug siempre esté establecido correctamente
    }

    // Si hay una imagen de portada personalizada, verificarla
    if (metadata.coverImage && metadata.coverImage !== defaultMetadata.coverImage) {
      const publicImagePath = path.join(process.cwd(), "public", metadata.coverImage)
      if (!fs.existsSync(publicImagePath)) {
        console.warn(`La imagen ${metadata.coverImage} no se encontró. Usando placeholder.`)
        metadata.coverImage = defaultMetadata.coverImage
      }
    }

    // Crear contenido ficticio si el contenido está vacío
    const actualContent =
      content && content.trim()
        ? content
        : `# ${metadata.title}\n\nEste post no tiene contenido. Por favor, edita el archivo ${slug}.mdx para agregar contenido.`

    // Compilación MDX usando la API de React Server Components
    let compiledContent: ReactElement
    try {
      console.log(`[getPostBySlug] Compilando MDX con contenido: ${actualContent.substring(0, 100)}...`)
      const compiled = await compileMDX({ source: actualContent })
      console.log(`[getPostBySlug] Compilación MDX exitosa`)
      compiledContent = compiled.content
    } catch (compileError: unknown) {
      console.error(`Error compiling MDX for post "${slug}":`, compileError)
      compiledContent = React.createElement("div", null, actualContent)
    }

    // Asegurarse de que el tiempo de lectura se calcule correctamente
    const wordsCount = actualContent.split(/\s+/).length
    metadata.readingTime = `${Math.max(1, Math.ceil(wordsCount / 200))} min read`

    const post: Post = {
      meta: metadata as PostMetadata,
      content: compiledContent,
      headings,
    }

    // Cache the result to avoid re-compilation on subsequent calls
    postCache.set(slug, post)

    return post
  } catch (error: unknown) {
    console.error(`Error processing post ${slug}:`)

    // Safe error handling
    if (error) {
      if (typeof error === "object") {
        console.error("Error details:", error instanceof Error ? error.message : "Unknown error object")
      } else {
        console.error("Error value:", error)
      }
    } else {
      console.error("Unknown error (undefined)")
    }

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

