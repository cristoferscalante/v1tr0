import Link from "next/link"
import Image from "next/image"
import type { MDXComponents } from "mdx/types"
import { useMemo, Children } from "react"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-")
}

// Función para verificar si un elemento es un componente válido
function isValidElement(
  element: React.ReactNode
): element is Exclude<React.ReactNode, boolean | null | undefined> {
  return element !== null && element !== undefined && typeof element !== 'boolean';
}

// Registramos los componentes MDX para ser utilizados en la aplicación
// Componente de depuración para verificar el renderizado
const Debug = ({ children }: { children: React.ReactNode }) => {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="bg-yellow-100 dark:bg-yellow-900 p-2 my-2 rounded">
        <p className="text-xs text-yellow-800 dark:text-yellow-200">Debug:</p>
        <pre className="text-xs overflow-x-auto">
          {JSON.stringify(children, null, 2)}
        </pre>
      </div>
    );
  }
  return null;
};

// Registramos los componentes MDX para ser utilizados en la aplicación
export const mdxComponents: MDXComponents = {
  Wrapper: ({ children }) => {
    const validChildren = useMemo(() => {
      return Children.toArray(children).filter(isValidElement);
    }, [children]);

    return (
      <div className="mdx-wrapper relative">
        {process.env.NODE_ENV === 'development' && <Debug>{children}</Debug>}
        {validChildren.length > 0 ? validChildren : <p>No se pudo cargar el contenido</p>}
      </div>
    );
  },
  h1: ({ children }) => {
    const id = slugify(children as string)
    return (
      <h1 id={id} className="mt-8 mb-4 text-3xl font-bold text-highlight">
        {children}
      </h1>
    )
  },
  h2: ({ children }) => {
    const id = slugify(children as string)
    return (
      <h2 id={id} className="mt-8 mb-4 text-2xl font-bold text-highlight">
        {children}
      </h2>
    )
  },
  h3: ({ children }) => {
    const id = slugify(children as string)
    return (
      <h3 id={id} className="mt-6 mb-4 text-xl font-bold text-highlight">
        {children}
      </h3>
    )
  },
  h4: ({ children }) => {
    const id = slugify(children as string)
    return (
      <h4 id={id} className="mt-6 mb-4 text-lg font-bold text-highlight">
        {children}
      </h4>
    )
  },
  p: ({ children }) => <p className="mb-4">{children}</p>,
  a: ({ href, children }) => (
    <Link href={href as string} className="text-accent hover:underline">
      {children}
    </Link>
  ),
  ul: ({ children }) => <ul className="mb-4 ml-6 list-disc">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-4 border-custom-3 pl-4 italic bg-custom-1/30 py-1 pr-4 rounded-r-md">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-custom-2/30" />,
  img: ({ src, alt }) => (
    <div className="my-6">
      <Image
        src={(src as string) || "/placeholder.svg"}
        alt={alt as string}
        width={1200}
        height={630}
        className="rounded-lg"
      />
    </div>
  ),
  code: ({ children, className }) => {
    // Si el código está dentro de un bloque pre, no aplicamos estilos adicionales
    if (className?.includes('language-')) {
      return <code className={className}>{children}</code>;
    }
    // Para código en línea
    return <code className="rounded bg-custom-1 px-1 py-0.5 text-highlight">{children}</code>;
  },
  pre: ({ children, className }) => {
    const language = className?.replace('language-', '');
    return (
      <pre className={`relative mb-4 overflow-x-auto rounded-lg bg-custom-1 p-4 text-sm ${className || ''}`}>
        {language && <div className="absolute top-2 right-2 text-xs text-gray-500">{language}</div>}
        {children}
      </pre>
    );
  },
}

