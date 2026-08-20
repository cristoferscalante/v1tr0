/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evita que Next.js infiera mal el workspace root cuando hay otro
  // pnpm-lock.yaml en un directorio superior (p. ej. en el $HOME del usuario).
  outputFileTracingRoot: __dirname,
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Recorta el JS enviado al cliente en librerías con barrel files grandes.
    // Impacto directo en el peso de la primera carga móvil.
    optimizePackageImports: [
      '@headlessui/react',
      '@radix-ui/react-icons',
      'lucide-react',
      'framer-motion',
    ],
  },
  eslint: {
    // Errores de ESLint preexistentes en archivos no relacionados no deben
    // bloquear el deploy. El lint sigue corriendo en CI/local normalmente.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-95e2b14f2fe54500b9e9cb01e1ce9120.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
          protocol: 'https',
          hostname: 'v1tr0end.vercel.app',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
          port: '',
          pathname: '/**',
        },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Allow external video sources
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ]
  },
  // Las rutas públicas son en español. Los duplicados en inglés se conservan
  // solo como redirección permanente para no perder enlaces ni repartir el
  // posicionamiento entre dos URLs con el mismo contenido.
  async redirects() {
    return [
      { source: '/services/:path*', destination: '/servicios-referentes/:path*', permanent: true },
      { source: '/shop', destination: '/tienda', permanent: true },
      { source: '/shop/:path*', destination: '/tienda/:path*', permanent: true },
    ]
  },
}

module.exports = nextConfig