import type { Metadata } from 'next'
import type { CmsPost } from './posts'

export const JOURNAL_INDEX_METADATA: Metadata = {
  title: 'Journal',
  description: 'Stories, guides, and insights from the Eyesoul team.',
}

export function toJournalPostMetadata(post: CmsPost): Metadata {
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} — Eyesoul Journal`,
      description: post.excerpt,
      url: `https://eyesoul.brand/journal/${post.slug}`,
    },
  }
}
