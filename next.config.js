/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.cosmicjs.com', 'imgix.cosmicjs.com'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Enable static optimization
  output: 'standalone',
  // Enable compression
  compress: true,
  // Enable React strict mode for better performance
  reactStrictMode: true,
}

module.exports = nextConfig