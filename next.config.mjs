/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Output standalone para Docker
  output: 'standalone',
  
  images: {
    domains: [
      'localhost',
      'placeholder.com',
      'via.placeholder.com',
      'hebbkx1anhila5yf.public.blob.vercel-storage.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    },
    optimizePackageImports: [
      '@headlessui/react',
      '@radix-ui/react-icons',
      'lucide-react',
      'framer-motion'
    ]
  }
};

export default nextConfig;
