import type { MDXComponents } from "mdx/types"
import Image, { type ImageProps } from "next/image"
import Link from "next/link"

// Este archivo permite proporcionar componentes React personalizados
// para ser utilizados en archivos MDX.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Personalizar componentes integrados
    h1: ({ children }) => <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-bold mt-6 mb-3">{children}</h3>,
    p: ({ children }) => <p className="my-4 text-gray-700 leading-relaxed">{children}</p>,
    a: ({ href, children }) => (
      <Link href={href || "#"} className="text-blue-600 hover:underline">
        {children}
      </Link>
    ),
    ul: ({ children }) => <ul className="list-disc pl-6 my-4">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 my-4">{children}</ol>,
    li: ({ children }) => <li className="mb-1">{children}</li>,
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        className="rounded-lg my-6"
        {...(props as ImageProps)}
        alt={props.alt || "Blog image"}
      />
    ),
    code: ({ children, className }) => {
      // Para bloques de código con sintaxis resaltada
      const language = className ? className.replace("language-", "") : ""
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

