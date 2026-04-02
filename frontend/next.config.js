/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'a3bhub.cloud' },
    ],
  },
}

module.exports = nextConfig
