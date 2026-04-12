import type { Media, Product, ProductCollection, Service } from '@/payload-types'
import type { TProductItem, TCollection, TBlogPost } from '@/data/data'

/**
 * Maps Payload Media to template image format
 */
export function toTImage(media: number | Media | null | undefined) {
  if (!media || typeof media === 'number') return null

  return {
    src: media.url || '',
    width: media.width || 0,
    height: media.height || 0,
    alt: media.alt || '',
  }
}

/**
 * Maps Payload Product to template TProductItem
 */
export function toTProductItem(product: Product): TProductItem {
  const featuredImage = toTImage(product.images?.[0])
  const images = (product.images || [])
    .map(toTImage)
    .filter((img): img is NonNullable<ReturnType<typeof toTImage>> => img !== null)

  return {
    id: product.id.toString(),
    title: product.name,
    handle: product.slug,
    price: product.price,
    featuredImage: featuredImage || undefined,
    images: images,
    // Phase 1 Shim fields
    status: product._status === 'draft' ? 'Draft' : undefined,
    rating: 0,
    reviewNumber: 0,
    options: [],
    selectedOptions: [],
    createdAt: product.createdAt,
  }
}

/**
 * Maps Payload ProductCollection to template TCollection
 */
export function toTCollection(collection: ProductCollection): TCollection {
  return {
    id: collection.id.toString(),
    title: collection.title,
    handle: collection.slug,
    description: collection.description || '',
    image: toTImage(collection.coverImage) || undefined,
    count: 0, // In practice, you might want to query this or hardcode
  }
}

/**
 * Adapt a list of products
 */
export function toTProductItems(products: Product[]): TProductItem[] {
  return products.map(toTProductItem)
}

/**
 * Adapt a list of collections
 */
export function toTCollections(collections: ProductCollection[]): TCollection[] {
  return collections.map(toTCollection)
}
