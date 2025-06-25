"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import type { MDXComponents } from "mdx/types"
import { useMemo, Children, useState, useTransition } from "react"
import { Check, Copy } from "lucide-react"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-")
}

// Función para verificar si un elemento es un componente válido
function isValidElement(element: React.ReactNode): element is Exclude<React.ReactNode, boolean | null | undefined> {
  return element !== null && element !== undefined && typeof element !== "boolean"
}

// Componente para copiar código
function CopyButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false)
  const [isPending, startTransition] = useTransition()

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setIsCopied(true)
    startTransition(() => {
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={copy}
      className="absolute top-3 right-3 p-2 rounded-md bg-custom-1/50 hover:bg-custom-1/80 transition-colors"
      aria-label="Copiar código"
      title="Copiar código"
      disabled={isPending}
    >
      {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-highlight" />}
    </button>
  )
}

// Componente de depuración para verificar el renderizado
const Debug = ({ children }: { children: React.ReactNode }) => {
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="bg-yellow-100 dark:bg-yellow-900 p-2 my-2 rounded">
        <p className="text-xs text-yellow-800 dark:text-yellow-200">Debug:</p>
        <pre className="text-xs overflow-x-auto">{JSON.stringify(children, null, 2)}</pre>
      </div>
    )
  }
  return null
}

// Registramos los componentes MDX para ser utilizados en la aplicación
export const mdxComponents: MDXComponents = {
  Wrapper: ({ children }) => {
    const validChildren = useMemo(() => {
      return Children.toArray(children).filter(isValidElement)
    }, [children])

    return (
      <div className="mdx-wrapper relative">
        {process.env.NODE_ENV === "development" && <Debug>{children}</Debug>}
        {validChildren.length > 0 ? validChildren : <p>No se pudo cargar el contenido</p>}
      </div>
    )
  },
  h1: ({ children }) => {
    const id = slugify(children as string)
    return (
      <h1 id={id} className="mt-10 mb-6 text-3xl font-bold text-highlight scroll-mt-20">
        {children}
      </h1>
    )
  },
  h2: ({ children }) => {
    const id = slugify(children as string)
    return (
      <h2 id={id} className="mt-8 mb-4 text-2xl font-bold text-highlight scroll-mt-20 border-b border-custom-2/20 pb-2">
        {children}
      </h2>
    )
  },
  h3: ({ children }) => {
    const id = slugify(children as string)
    return (
      <h3 id={id} className="mt-6 mb-4 text-xl font-bold text-highlight scroll-mt-20">
        {children}
      </h3>
    )
  },
  h4: ({ children }) => {
    const id = slugify(children as string)
    return (
      <h4 id={id} className="mt-6 mb-4 text-lg font-bold text-highlight scroll-mt-20">
        {children}
      </h4>
    )
  },
  p: ({ children }) => <p className="mb-6 leading-relaxed">{children}</p>,
  a: ({ href, children }) => (
    <Link
      href={href as string}
      className="text-accent hover:underline decoration-2 underline-offset-2 font-medium transition-colors"
    >
      {children}
    </Link>
  ),
  ul: ({ children }) => <ul className="mb-6 ml-6 list-disc space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="mb-6 ml-6 list-decimal space-y-2">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mb-6 border-l-4 border-custom-3 pl-6 italic bg-custom-1/20 py-4 pr-4 rounded-r-md text-textMuted">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-custom-2/30" />,
  img: ({ src, alt }) => (
    <figure className="my-8">
      <div className="overflow-hidden rounded-lg shadow-lg">
        <Image
          src={(src as string) || "/placeholder.svg"}
          alt={alt as string}
          width={1200}
          height={630}
          className="w-full h-auto transition-transform duration-500 hover:scale-105"
        />
      </div>
      {alt && <figcaption className="mt-2 text-center text-sm text-textMuted">{alt}</figcaption>}
    </figure>
  ),
  code: ({ children, className }) => {
    // Si el código está dentro de un bloque pre, no aplicamos estilos adicionales
    if (className?.includes("language-")) {
      return <code className={className}>{children}</code>
    }
    // Para código en línea
    return <code className="rounded bg-custom-1/30 px-1.5 py-0.5 text-highlight font-mono text-sm">{children}</code>
  },
  pre: ({ children, className }) => {
    const language = className?.replace("language-", "")
    const reactChildren = Children.toArray(children).filter(isValidElement) as React.ReactElement<{
      children?: React.ReactNode
    }>[]
    const codeContent = reactChildren.find((child) => child.props.children)?.props.children || ""

    return (
      <pre
        className={`relative mb-6 overflow-hidden rounded-lg bg-custom-1/30 p-4 text-sm font-mono ${className || ""}`}
      >
        {language && (
          <div className="absolute top-2 left-2 text-xs px-2 py-1 rounded-md bg-custom-2/30 text-highlight">
            {language}
          </div>
        )}
        <div className="pt-6">{children}</div>
        <CopyButton text={typeof codeContent === "string" ? codeContent : ""} />
      </pre>
    )
  },
}
