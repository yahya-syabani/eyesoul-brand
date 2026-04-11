import type { Product, ProductCollection } from '@/payload-types'

import { getPayloadInstance } from '@/lib/payload/getPayload'

import { mergePublishedWhere } from './published'

export type CollectionWithProducts = {
  collection: ProductCollection | null
  products: Product[]
}

/**
 * Loads the collection and related products in a second query (explicit, predictable depth).
 */
export async function getCollectionBySlug(
  slug: string,
  options: { collectionDepth?: number; productLimit?: number; productDepth?: number } = {},
): Promise<CollectionWithProducts> {
  const payload = await getPayloadInstance()
  const where = await mergePublishedWhere({
    slug: { equals: slug },
  })
  const res = await payload.find({
    collection: 'product-collections',
    where,
    limit: 1,
    depth: options.collectionDepth ?? 2,
  })
  const collection = (res.docs[0] as ProductCollection | undefined) ?? null
  if (!collection) {
    return { collection: null, products: [] }
  }

  const productsWhere = await mergePublishedWhere({
    collection: { equals: collection.id },
  })

  const productsRes = await payload.find({
    collection: 'products',
    where: productsWhere,
    limit: options.productLimit ?? 200,
    sort: 'name',
    depth: options.productDepth ?? 1,
  })

  return {
    collection,
    products: productsRes.docs as Product[],
  }
}

export async function getCollections(
  options: { limit?: number; depth?: number } = {},
): Promise<ProductCollection[]> {
  const payload = await getPayloadInstance()
  const where = await mergePublishedWhere({})
  const res = await payload.find({
    collection: 'product-collections',
    where,
    limit: options.limit ?? 100,
    sort: 'displayOrder',
    depth: options.depth ?? 1,
  })
  return res.docs as ProductCollection[]
}
