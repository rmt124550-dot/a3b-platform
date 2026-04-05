/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // Export estático — sin servidor Node
  trailingSlash: false,
  images: {
    unoptimized: true,       // Requerido para static export
  },
}

module.exports = nextConfig
