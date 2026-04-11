import type { Where } from 'payload'

import type { Product } from '@/payload-types'

import { getPayloadInstance } from '@/lib/payload/getPayload'

import { mergePublishedWhere } from './published'

export async function getProductBySlug(
  slug: string,
  options: { depth?: number } = {},
): Promise<Product | null> {
  const payload = await getPayloadInstance()
  const where = await mergePublishedWhere({
    slug: { equals: slug },
  })
  const res = await payload.find({
    collection: 'products',
    where,
    limit: 1,
    depth: options.depth ?? 2,
  })
  return (res.docs[0] as Product | undefined) ?? null
}

export async function getProducts(
  options: {
    collectionId?: number
    limit?: number
    sort?: string
    depth?: number
  } = {},
): Promise<Product[]> {
  const payload = await getPayloadInstance()
  const base: Where = {}
  if (options.collectionId != null) {
    base.collection = { equals: options.collectionId }
  }
  const where = await mergePublishedWhere(base)
  const res = await payload.find({
    collection: 'products',
    where,
    limit: options.limit ?? 200,
    sort: options.sort ?? '-updatedAt',
    depth: options.depth ?? 2,
  })
  return res.docs as Product[]
}

/**
 * Same collection, excluding the current product by id.
 */
export async function getRelatedProducts(options: {
  productId: number
  collectionId: number | null | undefined
  limit?: number
  depth?: number
}): Promise<Product[]> {
  if (options.collectionId == null) return []

  const payload = await getPayloadInstance()
  const inner: Where = {
    and: [{ collection: { equals: options.collectionId } }, { id: { not_equals: options.productId } }],
  }
  const where = await mergePublishedWhere(inner)
  const res = await payload.find({
    collection: 'products',
    where,
    limit: options.limit ?? 4,
    sort: '-updatedAt',
    depth: options.depth ?? 1,
  })
  return res.docs as Product[]
}
