/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  async redirects() {
    return [
      { source: '/dashboard', destination: '/app/dashboard', permanent: true },
      { source: '/library', destination: '/app/library', permanent: true },
      { source: '/community', destination: '/app/community', permanent: true },
      { source: '/contribute', destination: '/app/contribute', permanent: true },
    ]
  },
}

module.exports = nextConfig
