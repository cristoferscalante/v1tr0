"use client";
import * as React from "react"; // <-- Se agregó esta línea
import { useState, ReactNode, FC, HTMLAttributes } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { Copy, Check } from "lucide-react";
import { slugify } from "@/src/lib/utils";

interface MDXContentProps {
  content: string;
}

function CopyButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Error al copiar el texto:", error);
    }
  };

  return (
    <button
      onClick={copy}
      className="absolute top-3 right-3 p-2 rounded-md bg-custom-1/50 hover:bg-custom-1/80 transition-colors z-10"
      aria-label="Copiar código"
      title="Copiar código"
    >
      {isCopied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 text-highlight" />
      )}
    </button>
  );
}

// Actualizamos MDXImageProps para aceptar width y height como string o number
type MDXImageProps = {
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
} & Omit<ImageProps, "src" | "alt" | "width" | "height">;

// Define un tipo para las props del bloque de código, incluyendo 'node' opcional:
interface CodeBlockProps extends HTMLAttributes<HTMLElement> {
  node?: unknown;
  inline?: boolean;
  className?: string;
  children?: ReactNode; // Cambiado de required a optional
}

const CodeBlock: FC<CodeBlockProps> = ({ inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  if (inline) {
    return (
      <code
        className="rounded bg-custom-1/30 px-1.5 py-0.5 text-highlight font-mono text-sm"
        {...props}
      >
        {children}
      </code>
    );
  }
  return (
    <div className="relative mb-6">
      {language && (
        <div className="absolute top-2 left-2 text-xs px-2 py-1 rounded-md bg-custom-2/30 text-highlight z-10">
          {language}
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        className="rounded-lg !mt-0 !bg-custom-1/30"
        showLineNumbers
        wrapLines
        customStyle={{
          margin: 0,
          padding: "2rem 1rem 1rem 1rem",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
        }}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
      <CopyButton text={String(children)} />
    </div>
  );
};

export function MDXContent({ content }: MDXContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSlug]}
      components={{
        h1: ({ children, ...props }) => {
          const text = React.Children.toArray(children).join("");
          const id = slugify(text);

          return (
            <h1
              id={id}
              data-section="1"
              className="mt-10 mb-6 text-3xl font-bold text-highlight scroll-mt-20"
              {...props}
            >
              {children}
            </h1>
          );
        },
        h2: ({ children, ...props }) => {
          const text = React.Children.toArray(children).join("");
          const id = slugify(text);

          return (
            <h2
              id={id}
              data-section="2"
              className="mt-8 mb-4 text-2xl font-bold text-highlight scroll-mt-20 border-b border-custom-2/20 pb-2"
              {...props}
            >
              {children}
            </h2>
          );
        },
        h3: ({ children, ...props }) => {
          const text = React.Children.toArray(children).join("");
          const id = slugify(text);

          return (
            <h3
              id={id}
              data-section="3"
              className="mt-6 mb-4 text-xl font-bold text-highlight scroll-mt-20"
              {...props}
            >
              {children}
            </h3>
          );
        },
        h4: ({ children, ...props }) => {
          const text = React.Children.toArray(children).join("");
          const id = slugify(text);

          return (
            <h4
              id={id}
              data-section="4"
              className="mt-6 mb-4 text-lg font-bold text-highlight scroll-mt-20"
              {...props}
            >
              {children}
            </h4>
          );
        },
        p: ({ children, ...props }) => {
          // Verifica si el párrafo contiene únicamente una imagen
          const childrenArray = React.Children.toArray(children);
          const hasOnlyImage =
            childrenArray.length === 1 &&
            React.isValidElement(childrenArray[0]) &&
            childrenArray[0].type === "img";

          if (hasOnlyImage && React.isValidElement(childrenArray[0])) {
            const imgElement = childrenArray[0] as React.ReactElement<MDXImageProps>;
            const { src, alt } = imgElement.props;

            return (
              <figure className="my-8">
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={alt || ""}
                    width={1200}
                    height={630}
                    className="w-full h-auto transition-transform duration-500 hover:scale-105"
                  />
                </div>
                {alt && (
                  <figcaption className="mt-2 text-center text-sm text-textMuted">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          }

          return (
            <p className="mb-6 leading-relaxed" {...props}>
              {children}
            </p>
          );
        },
        a: ({ href, ...props }) => (
          <Link
            href={href || "#"}
            className="text-accent hover:underline decoration-2 underline-offset-2 font-medium transition-colors"
            {...props}
          />
        ),
        ul: ({ ...props }) => <ul className="mb-6 ml-6 list-disc space-y-2" {...props} />,
        ol: ({ ...props }) => <ol className="mb-6 ml-6 list-decimal space-y-2" {...props} />,
        li: ({ ...props }) => <li className="mb-1" {...props} />,
        blockquote: ({ ...props }) => (
          <blockquote
            className="mb-6 border-l-4 border-custom-3 pl-6 italic bg-custom-1/20 py-4 pr-4 rounded-r-md text-textMuted"
            {...props}
          />
        ),
        hr: () => <hr className="my-10 border-custom-2/30" />,
        img: ({ src, alt, ...props }: MDXImageProps) => {
          // Convertir width y height a números, usando valores por defecto si no se proveen
          const numericWidth = props.width ? Number(props.width) : 1200;
          const numericHeight = props.height ? Number(props.height) : 630;
          return (
            <Image
              {...props}
              src={src || "/placeholder.svg"}
              alt={alt || ""}
              width={numericWidth}
              height={numericHeight}
              className="w-full h-auto rounded-lg shadow-lg my-4"
            />
          );
        },
        code: CodeBlock, // Se asigna directamente sin usar 'any'
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
