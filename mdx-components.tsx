import Image, { type ImageProps } from "next/image"
import Link from "next/link"
import { ReactNode } from "react"

// Definir el tipo MDXComponents manualmente
type MDXComponents = {
  [key: string]: React.ComponentType<any>
}

// Este archivo permite proporcionar componentes React personalizados
// para ser utilizados en archivos MDX.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Personalizar componentes integrados
    h1: ({ children }: { children: ReactNode }) => <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }: { children: ReactNode }) => <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>,
    h3: ({ children }: { children: ReactNode }) => <h3 className="text-2xl font-bold mt-6 mb-3">{children}</h3>,
    p: ({ children }: { children: ReactNode }) => <p className="my-4 text-gray-700 leading-relaxed">{children}</p>,
    a: ({ href, children }: { href?: string; children: ReactNode }) => (
      <Link href={href || "#"} className="text-blue-600 hover:underline">
        {children}
      </Link>
    ),
    ul: ({ children }: { children: ReactNode }) => <ul className="list-disc pl-6 my-4">{children}</ul>,
    ol: ({ children }: { children: ReactNode }) => <ol className="list-decimal pl-6 my-4">{children}</ol>,
    li: ({ children }: { children: ReactNode }) => <li className="mb-1">{children}</li>,
    img: (props: ImageProps & { alt?: string }) => (
      <Image
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        className="rounded-lg my-6"
        {...props}
        alt={props.alt || "Blog image"}
      />
    ),
    code: ({ children, className }: { children: ReactNode; className?: string }) => {
      // Para bloques de código con sintaxis resaltada
      if (className) {
        return (
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
            <code className={className}>{children}</code>
          </pre>
        )
      }
      // Para código en línea
      return <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{children}</code>
    },
    // Puedes añadir más componentes personalizados aquí
    ...components,
  }
}

