// next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true, // Enables /app directory routing (App Router)
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
