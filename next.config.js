
/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')(
  // Configuração do next-intl
  './src/i18n.ts'
);

const nextConfig = {
  // Suas outras configurações do Next.js
  images: {
    domains: ['firebasestorage.googleapis.com', 'images.unsplash.com'],
  },
}

module.exports = withNextIntl(nextConfig);
