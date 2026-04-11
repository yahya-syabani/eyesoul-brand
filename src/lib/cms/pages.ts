import type { Page } from '@/payload-types'

import { getPayloadInstance } from '@/lib/payload/getPayload'

import { mergePublishedWhere } from './published'

export async function getPageBySlug(
  slug: string,
  options: { depth?: number } = {},
): Promise<Page | null> {
  const payload = await getPayloadInstance()
  const where = await mergePublishedWhere({
    slug: { equals: slug },
  })
  const res = await payload.find({
    collection: 'pages',
    where,
    limit: 1,
    depth: options.depth ?? 3,
  })
  return (res.docs[0] as Page | undefined) ?? null
}
