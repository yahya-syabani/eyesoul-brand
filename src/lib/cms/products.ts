import type { Product } from '@/payload-types'

import { cmsFind } from './client'
import { mergePublishedWhere } from './published'

export async function getProductBySlug(
  slug: string,
  options: { depth?: number } = {},
): Promise<Product | null> {
  const where = await mergePublishedWhere({ slug: { equals: slug } })
  const res = await cmsFind<Product>('products', {
    where,
    limit: 1,
    depth: options.depth ?? 2,
  })
  return res.docs[0] ?? null
}

export async function getProducts(
  options: {
    collectionId?: number
    limit?: number
    sort?: string
    depth?: number
  } = {},
): Promise<Product[]> {
  const base = options.collectionId != null ? { collection: { equals: options.collectionId } } : {}
  const where = await mergePublishedWhere(base)
  const res = await cmsFind<Product>('products', {
    where,
    limit: options.limit ?? 200,
    sort: options.sort ?? '-updatedAt',
    depth: options.depth ?? 2,
  })
  return res.docs
}

/**
 * Same collection as the given product, excluding the product itself.
 */
export async function getRelatedProducts(options: {
  productId: number
  collectionId: number | null | undefined
  limit?: number
  depth?: number
}): Promise<Product[]> {
  if (options.collectionId == null) return []

  const inner = {
    and: [
      { collection: { equals: options.collectionId } },
      { id: { not_equals: options.productId } },
    ],
  }
  const where = await mergePublishedWhere(inner)
  const res = await cmsFind<Product>('products', {
    where,
    limit: options.limit ?? 4,
    sort: '-updatedAt',
    depth: options.depth ?? 1,
  })
  return res.docs
}

