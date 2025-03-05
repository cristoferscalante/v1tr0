"use server"; // Indica a Next.js 13 que este archivo se ejecute en el servidor

import type React from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

// Directorio donde se almacenarán los archivos MDX
const postsDirectory = path.join(process.cwd(), "content", "blog");

// Tipo para los metadatos del post
export type PostMetadata = {
  title: string;
  date: string;
  excerpt: string;
  author: string;
  coverImage: string;
  authorImage?: string;
  tags?: string[];
  slug: string;
};

// Tipo para el post completo
export type Post = {
  content: React.ReactNode;
  metadata: PostMetadata;
};

// Función para verificar y crear el directorio si no existe
function ensureDirectoryExists() {
  if (!fs.existsSync(postsDirectory)) {
    console.log(`Creando directorio: ${postsDirectory}`);
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
}

// Función para obtener todos los slugs de los posts
export async function getAllPostSlugs() {
  ensureDirectoryExists();

  try {
    const fileNames = fs.readdirSync(postsDirectory);
    console.log(`Archivos encontrados: ${fileNames.length}`);

    return fileNames
      .filter((fileName) => {
        const isMdx = fileName.endsWith(".mdx");
        if (!isMdx) {
          console.log(`Ignorando archivo no MDX: ${fileName}`);
        }
        return isMdx;
      })
      .map((fileName) => ({
        slug: fileName.replace(/\.mdx$/, ""),
      }));
  } catch (error) {
    console.error("Error al leer los slugs:", error);
    return [];
  }
}

// Función para obtener los metadatos de todos los posts
export async function getAllPostsMetadata(): Promise<PostMetadata[]> {
  ensureDirectoryExists();

  try {
    const fileNames = fs.readdirSync(postsDirectory);
    console.log(`Total de archivos encontrados: ${fileNames.length}`);

    const allPostsData = fileNames
      .filter((fileName) => {
        const isMdx = fileName.endsWith(".mdx");
        if (!isMdx) {
          console.log(`Ignorando archivo no MDX: ${fileName}`);
        }
        return isMdx;
      })
      .map((fileName) => {
        try {
          // Eliminar la extensión ".mdx" para obtener el slug
          const slug = fileName.replace(/\.mdx$/, "");

          // Leer el contenido del archivo MDX
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, "utf8");

          // Usar gray-matter para analizar la sección de metadatos (frontmatter)
          const { data } = matter(fileContents);

          // Construimos los metadatos
          const metadata: PostMetadata = {
            ...(data as Omit<PostMetadata, "slug">),
            slug,
          };

          // Validar campos requeridos
          const requiredFields = ["title", "date", "excerpt", "author", "coverImage"];
          const missingFields = requiredFields.filter((field) => !metadata[field]);

          if (missingFields.length > 0) {
            console.warn(`Campos faltantes en ${fileName}: ${missingFields.join(", ")}`);
          }

          return metadata;
        } catch (error) {
          console.error(`Error al procesar el archivo ${fileName}:`, error);
          return null;
        }
      })
      // Filtra nulos para quedarnos solo con objetos válidos
      .filter((post): post is PostMetadata => post !== null);

    // Ordenar los posts por fecha, del más reciente al más antiguo
    return allPostsData.sort((a, b) => {
      // Convertimos a Date para mayor confiabilidad
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error("Error al obtener los metadatos:", error);
    return [];
  }
}

// Función para obtener un post por su slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  ensureDirectoryExists();

  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);

    // Verificar si el archivo existe
    if (!fs.existsSync(fullPath)) {
      console.log(`Archivo no encontrado: ${fullPath}`);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    console.log(`Contenido leído para ${slug}`);

    // Usar gray-matter para analizar la sección de metadatos
    const { data, content } = matter(fileContents);

    // Compilar el contenido MDX a React
    const { content: mdxContent } = await compileMDX({
      source: content,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeHighlight, rehypeSlug],
        },
      },
    });

    return {
      content: mdxContent,
      metadata: {
        ...(data as Omit<PostMetadata, "slug">),
        slug,
      },
    };
  } catch (error) {
    console.error(`Error al procesar el post ${slug}:`, error);
    return null;
  }
}
