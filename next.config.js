/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Ignora erros de tipagem durante o build
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  output: 'standalone',
  experimental: {
    // Permite o uso da sintaxe Node.js
    serverComponentsExternalPackages: ['sharp'],
  },
};

module.exports = nextConfig;
