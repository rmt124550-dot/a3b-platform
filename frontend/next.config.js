/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'a3bhub.cloud' },
    ],
  },
}

module.exports = nextConfig
