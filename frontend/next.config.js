/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  // Permite importar desde node_modules en server components
  serverExternalPackages: [],
}

module.exports = nextConfig
