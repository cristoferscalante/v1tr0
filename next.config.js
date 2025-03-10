import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // Removing non-serializable plugin functions; pass plugins at compile time if needed.
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { 
    domains: [] 
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  serverExternalPackages: ['next-mdx-remote'],
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default withMDX(nextConfig);
