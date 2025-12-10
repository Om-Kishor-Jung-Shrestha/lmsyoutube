/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Example: add allowed image domains
  images: {
    domains: ['example.com', 'images.unsplash.com', 'lh3.googleusercontent.com','res.cloudinary.com'],
  },

  // Example: add environment variables
  env: {
    NEXT_PUBLIC_API_URL: 'https://api.example.com',
  },

  // Example: disable eslint during build (optional)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Example: experimental options (optional)
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
