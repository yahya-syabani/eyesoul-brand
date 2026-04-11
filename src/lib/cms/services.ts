import type { Service } from '@/payload-types'

import { getPayloadInstance } from '@/lib/payload/getPayload'

import { mergePublishedWhere } from './published'

export async function getServices(
  options: { limit?: number; depth?: number } = {},
): Promise<Service[]> {
  const payload = await getPayloadInstance()
  const where = await mergePublishedWhere({})
  const res = await payload.find({
    collection: 'services',
    where,
    limit: options.limit ?? 100,
    sort: 'displayOrder',
    depth: options.depth ?? 2,
  })
  return res.docs as Service[]
}
