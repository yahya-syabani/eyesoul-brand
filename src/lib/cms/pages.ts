import type { Page } from '@/payload-types'

import { cmsFind } from './client'
import { mergePublishedWhere } from './published'

export async function getPageBySlug(
  slug: string,
  options: { depth?: number } = {},
): Promise<Page | null> {
  const where = await mergePublishedWhere({ slug: { equals: slug } })
  const res = await cmsFind<Page>('pages', {
    where,
    limit: 1,
    depth: options.depth ?? 3,
  })
  return res.docs[0] ?? null
}

