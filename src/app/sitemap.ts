import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eyesoul-eyewear.com'

async function fetchProducts() {
  try {
    // Query database directly instead of making HTTP request
    const products = await prisma.product.findMany({
      select: {
        id: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 1000, // Limit to 1000 products
    })
    return products
  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/shop/default`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog/default`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/pages/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Add product pages from database
  const productData = await fetchProducts()
  const productRoutes: MetadataRoute.Sitemap = productData.map((product: { id: string }) => ({
    url: `${siteUrl}/product/default?id=${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...baseRoutes, ...productRoutes]
}

