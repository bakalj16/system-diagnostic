/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // Añade aquí los dominios de las imágenes que uses
  },
}

module.exports = nextConfig