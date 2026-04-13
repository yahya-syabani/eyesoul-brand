import type { Media } from '@/payload-types'

import { cmsFind } from './client'
import { mergePublishedWhere } from './published'

export type CmsPost = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: unknown
  featuredImage?: number | Media | null
  category?: string | null
  authorName?: string | null
  authorBio?: string | null
  authorAvatar?: number | Media | null
  timeToRead?: string | null
  updatedAt: string
  createdAt: string
}

export async function getPosts(options: { limit?: number; depth?: number; page?: number } = {}) {
  const where = await mergePublishedWhere({})
  const res = await cmsFind<CmsPost>('posts', {
    where,
    limit: options.limit ?? 100,
    depth: options.depth ?? 2,
    page: options.page ?? 1,
    sort: '-updatedAt',
  })
  return res
}

export async function getPostBySlug(slug: string, options: { depth?: number } = {}): Promise<CmsPost | null> {
  const where = await mergePublishedWhere({ slug: { equals: slug } })
  const res = await cmsFind<CmsPost>('posts', {
    where,
    limit: 1,
    depth: options.depth ?? 2,
  })
  return res.docs[0] ?? null
}
