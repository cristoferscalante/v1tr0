"use client"
import * as React from "react" // <-- Se agregó esta línea
import { useState, type ReactNode, type FC, type HTMLAttributes } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSlug from "rehype-slug"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"
import Image, { type ImageProps } from "next/image"
import Link from "next/link"
import { Copy, Check } from "lucide-react"
import { slugify } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

interface MDXContentProps {
  content: string
}

function CopyButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error("Error al copiar el texto:", error)
    }
  }

  return (
    <button
      onClick={copy}
      className={`absolute top-3 right-3 p-2 rounded-md transition-all duration-300 z-10 ${isDark ? "bg-[#08A696]/10 hover:bg-[#08A696]/20 border border-[#08A696]/30" : "bg-[#08A696]/5 hover:bg-[#08A696]/10 border border-[#08A696]/20"} backdrop-blur-sm`}
      aria-label="Copiar código"
      title="Copiar código"
    >
      {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className={`h-4 w-4 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`} />}
    </button>
  )
}

// Actualizamos MDXImageProps para aceptar width y height como string o number
type MDXImageProps = {
  src?: string | Blob | undefined
  alt?: string | undefined
  width?: string | number | undefined
  height?: string | number | undefined
} & Omit<ImageProps, "src" | "alt" | "width" | "height">

// Define un tipo para las props del bloque de código:
interface CodeBlockProps extends HTMLAttributes<HTMLElement> {
  inline?: boolean
  className?: string | undefined
  children?: ReactNode
}

const CodeBlock: FC<CodeBlockProps> = ({ inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || "")
  const language = match ? match[1] : ""
  const { theme } = useTheme()
  const isDark = theme === "dark"
  
  if (inline) {
    return (
      <code className={`rounded px-1.5 py-0.5 font-mono text-sm backdrop-blur-sm transition-all duration-300 ${isDark ? "bg-[#08A696]/10 text-[#26FFDF] border border-[#08a696]/30" : "bg-[#08A696]/5 text-[#08a696] border border-[#08a696]/20"}`} {...props}>
        {children}
      </code>
    )
  }
  
  return (
    <div className="relative group mb-6">
      {/* Gradiente exterior igual a las cards */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${isDark ? "from-[#08a6961e] to-[#26ffde23]" : "from-[#08a69630] to-[#08a69620]"} rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all duration-300`}
      ></div>
      
      {/* Container del código con glassmorphism */}
      <div 
        className={`relative ${isDark ? "bg-[#02505931] backdrop-blur-sm" : "bg-[#e6f7f6] backdrop-blur-sm"} rounded-2xl border ${isDark ? "border-[#08A696]/20" : "border-[#08A696]/30"} transition-all duration-300 transform scale-95 group-hover:scale-100 group-hover:border-[#08A696] ${isDark ? "group-hover:bg-[#02505950]" : "group-hover:bg-[#c5ebe7]"} shadow-lg group-hover:shadow-xl group-hover:shadow-[#08A696]/10 overflow-hidden`}
      >
        {language && (
          <div className={`absolute top-3 left-4 text-xs px-3 py-1.5 rounded-full z-10 backdrop-blur-sm transition-all duration-300 ${isDark ? "bg-[#08A696]/10 text-[#26FFDF] border border-[#08a696]/50" : "bg-[#08A696]/5 text-[#08a696] border border-[#08a696]/30"}`}>
            {language}
          </div>
        )}
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          className="!mt-0 !bg-transparent !rounded-2xl"
          showLineNumbers
          wrapLines
          customStyle={{
            margin: 0,
            padding: language ? "3rem 1rem 1rem 1rem" : "1.5rem 1rem",
            borderRadius: "1rem",
            fontSize: "0.875rem",
            background: "transparent",
          }}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
        <CopyButton text={String(children)} />
      </div>
    </div>
  )
}

export function MDXContent({ content }: MDXContentProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSlug]}
      components={{
        h1: ({ children, ...props }) => {
          const text = React.Children.toArray(children).join("")
          const id = slugify(text)

          return (
            <h1
              id={id}
              data-section="1"
              className={`mt-10 mb-6 text-3xl font-bold scroll-mt-20 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`}
              {...props}
            >
              {children}
            </h1>
          )
        },
        h2: ({ children, ...props }) => {
          const text = React.Children.toArray(children).join("")
          const id = slugify(text)

          return (
            <h2
              id={id}
              data-section="2"
              className={`mt-8 mb-4 text-2xl font-bold scroll-mt-20 pb-2 ${isDark ? "text-[#26FFDF] border-b border-[#08A696]/20" : "text-[#08A696] border-b border-[#08A696]/30"}`}
              {...props}
            >
              {children}
            </h2>
          )
        },
        h3: ({ children, ...props }) => {
          const text = React.Children.toArray(children).join("")
          const id = slugify(text)

          return (
            <h3 id={id} data-section="3" className={`mt-6 mb-4 text-xl font-bold scroll-mt-20 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`} {...props}>
              {children}
            </h3>
          )
        },
        h4: ({ children, ...props }) => {
          const text = React.Children.toArray(children).join("")
          const id = slugify(text)

          return (
            <h4 id={id} data-section="4" className={`mt-6 mb-4 text-lg font-bold scroll-mt-20 ${isDark ? "text-[#26FFDF]" : "text-[#08A696]"}`} {...props}>
              {children}
            </h4>
          )
        },
        p: ({ children, ...props }) => {
          // Verifica si el párrafo contiene únicamente una imagen
          const childrenArray = React.Children.toArray(children)
          const hasOnlyImage =
            childrenArray.length === 1 && React.isValidElement(childrenArray[0]) && childrenArray[0].type === "img"

          if (hasOnlyImage && React.isValidElement(childrenArray[0])) {
            const imgElement = childrenArray[0] as React.ReactElement<MDXImageProps>
            const { src, alt } = imgElement.props
            // Convertir src a string si es un Blob
            const srcString = src instanceof Blob ? URL.createObjectURL(src) : (src || "/imagenes/icons/svg/placeholder.svg")

            return (
              <figure className="my-8 relative group">
                {/* Gradiente exterior para la imagen */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${isDark ? "from-[#08a6961e] to-[#26ffde23]" : "from-[#08a69630] to-[#08a69620]"} rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all duration-300`}
                ></div>
                
                <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl group-hover:shadow-[#08A696]/10 transition-all duration-300 transform scale-95 group-hover:scale-100">
                  <Image
                    src={srcString}
                    alt={alt || ""}
                    width={1200}
                    height={630}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                {alt && <figcaption className={`mt-2 text-center text-sm ${isDark ? "text-[#a0a0a0]" : "text-[#666666]"}`}>{alt}</figcaption>}
              </figure>
            )
          }

          return (
            <p className={`mb-6 leading-relaxed ${isDark ? "text-[#a0a0a0]" : "text-[#666666]"}`} {...props}>
              {children}
            </p>
          )
        },
        a: ({ href, ...props }) => {
          // Filtrar props undefined para evitar errores de tipo
          const filteredProps = Object.fromEntries(
            Object.entries(props).filter(([, value]) => value !== undefined)
          )
          return (
            <Link
              href={href || "#"}
              className={`font-medium transition-all duration-300 hover:underline decoration-2 underline-offset-2 ${isDark ? "text-[#26FFDF] hover:text-[#08A696]" : "text-[#08A696] hover:text-[#025159]"}`}
              {...filteredProps}
            />
          )
        },
        ul: ({ ...props }) => <ul className={`mb-6 ml-6 list-disc space-y-2 ${isDark ? "text-[#a0a0a0]" : "text-[#666666]"}`} {...props} />,
        ol: ({ ...props }) => <ol className={`mb-6 ml-6 list-decimal space-y-2 ${isDark ? "text-[#a0a0a0]" : "text-[#666666]"}`} {...props} />,
        li: ({ ...props }) => <li className="mb-1" {...props} />,
        blockquote: ({ ...props }) => (
          <blockquote
            className={`mb-6 pl-6 py-4 pr-4 italic relative rounded-r-2xl backdrop-blur-sm transition-all duration-300 ${isDark ? "border-l-4 border-[#08A696] bg-[#08A696]/10 text-[#a0a0a0]" : "border-l-4 border-[#08A696] bg-[#08A696]/5 text-[#666666]"}`}
            {...props}
          />
        ),
        hr: () => <hr className="my-10 border-custom-2/30" />,
        img: ({ src, alt, ...props }: MDXImageProps) => {
          // Convertir width y height a números, usando valores por defecto si no se proveen
          const numericWidth = props.width ? Number(props.width) : 1200
          const numericHeight = props.height ? Number(props.height) : 630
          // Convertir src a string si es un Blob
          const srcString = src instanceof Blob ? URL.createObjectURL(src) : (src || "/imagenes/icons/svg/placeholder.svg")
          // Filtrar props undefined
          const filteredProps = Object.fromEntries(
            Object.entries(props).filter(([, value]) => value !== undefined)
          )
          return (
            <Image
              {...filteredProps}
              src={srcString}
              alt={alt || ""}
              width={numericWidth}
              height={numericHeight}
              className="w-full h-auto rounded-lg shadow-lg my-4"
            />
          )
        },
        code: CodeBlock,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
