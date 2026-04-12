/**
 * Storefront Next.js config — no Payload dependency.
 * The CMS runs as a separate app (apps/cms/). Update NEXT_PUBLIC_CMS_URL
 * and the remotePatterns hostname below before deploying to production.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 2678400 * 12, // 6 months
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        // CMS server media uploads — update to real host before production deploy
        protocol: 'https',
        hostname: 'cms.eyesoul.id',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig

