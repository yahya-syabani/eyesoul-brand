import { MetadataRoute } from 'next'
import { getProducts } from '@/lib/cms/products'
import { getCollections } from '@/lib/cms/productCollections'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://eyesoul.brand'

  // Fetch all products and collections
  const [products, collections] = await Promise.all([
    getProducts({ limit: 1000 }),
    getCollections(),
  ])

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/catalog',
    '/stores',
    '/services',
    '/about',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/catalog/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((collection) => ({
    url: `${baseUrl}/collections/${collection.slug}`,
    lastModified: collection.updatedAt ? new Date(collection.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...productRoutes, ...collectionRoutes]
}
