import createMDX from "@next/mdx"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Configurar extensiones de página para incluir archivos markdown y MDX
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  // Otras configuraciones que puedas tener
}

const withMDX = createMDX({
  // Configuración de opciones MDX
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

// Asegúrate de que withMDX envuelva tu configuración
export default withMDX(nextConfig)

