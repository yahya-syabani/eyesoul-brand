import type { ProductReview } from '@/payload-types'

import { cmsFind } from './client'
import { mergePublishedWhere } from './published'

export async function getReviewsForProduct(
  productId: number,
  options: { depth?: number; limit?: number } = {},
): Promise<ProductReview[]> {
  const where = await mergePublishedWhere({ product: { equals: productId } })
  const res = await cmsFind<ProductReview>('product-reviews', {
    where,
    limit: options.limit ?? 50,
    sort: '-createdAt',
    depth: options.depth ?? 2,
  })
  return res.docs
}
