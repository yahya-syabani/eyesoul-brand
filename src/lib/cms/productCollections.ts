import type { Product, ProductCollection } from '@/payload-types'

import { cmsFind } from './client'
import { mergePublishedWhere } from './published'

export type CollectionWithProducts = {
  collection: ProductCollection | null
  products: Product[]
}

/**
 * Loads the collection and related products in two separate REST requests
 * (explicit, predictable depth — avoids over-fetching nested data).
 */
export async function getCollectionBySlug(
  slug: string,
  options: { collectionDepth?: number; productLimit?: number; productDepth?: number } = {},
): Promise<CollectionWithProducts> {
  const where = await mergePublishedWhere({ slug: { equals: slug } })
  const res = await cmsFind<ProductCollection>('product-collections', {
    where,
    limit: 1,
    depth: options.collectionDepth ?? 2,
  })
  const collection = res.docs[0] ?? null
  if (!collection) return { collection: null, products: [] }

  const productsWhere = await mergePublishedWhere({ collections: { equals: collection.id } })
  const productsRes = await cmsFind<Product>('products', {
    where: productsWhere,
    limit: options.productLimit ?? 200,
    sort: 'name',
    depth: options.productDepth ?? 1,
  })

  return { collection, products: productsRes.docs }
}

export async function getCollections(
  options: { limit?: number; depth?: number } = {},
): Promise<ProductCollection[]> {
  const where = await mergePublishedWhere({})
  const res = await cmsFind<ProductCollection>('product-collections', {
    where,
    limit: options.limit ?? 100,
    sort: 'displayOrder',
    depth: options.depth ?? 1,
  })
  return res.docs
}

