/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  // Pour export statique (optionnel, décommente si besoin)
  // output: 'export',
}

module.exports = nextConfig
