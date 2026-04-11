import type { Store } from '@/payload-types'

import { getPayloadInstance } from '@/lib/payload/getPayload'

import { mergePublishedWhere } from './published'

export async function getStores(
  options: { limit?: number; depth?: number } = {},
): Promise<Store[]> {
  const payload = await getPayloadInstance()
  const where = await mergePublishedWhere({})
  const res = await payload.find({
    collection: 'stores',
    where,
    limit: options.limit ?? 100,
    sort: 'name',
    depth: options.depth ?? 2,
  })
  return res.docs as Store[]
}
