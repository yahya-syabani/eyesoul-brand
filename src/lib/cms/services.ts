import type { Service } from '@/payload-types'

import { cmsFind } from './client'
import { mergePublishedWhere } from './published'

export async function getServices(
  options: { limit?: number; depth?: number } = {},
): Promise<Service[]> {
  const where = await mergePublishedWhere({})
  const res = await cmsFind<Service>('services', {
    where,
    limit: options.limit ?? 100,
    sort: 'displayOrder',
    depth: options.depth ?? 2,
  })
  return res.docs
}

