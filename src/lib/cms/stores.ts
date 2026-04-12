import type { Store } from '@/payload-types'

import { cmsFind } from './client'
import { mergePublishedWhere } from './published'

export async function getStores(options: { limit?: number; depth?: number } = {}): Promise<Store[]> {
  const where = await mergePublishedWhere({})
  const res = await cmsFind<Store>('stores', {
    where,
    limit: options.limit ?? 100,
    sort: 'name',
    depth: options.depth ?? 2,
  })
  return res.docs
}

