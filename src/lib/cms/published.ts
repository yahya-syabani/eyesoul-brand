import { draftMode } from 'next/headers'

import type { WhereClause } from './client'

const publishedClause: WhereClause = {
  _status: { equals: 'published' },
}

/**
 * When Next draft mode is on, skip `_status` so previews can load drafts.
 * Hardening preview behind auth is deferred (post Phase 1).
 */
export async function shouldFilterPublishedOnly(): Promise<boolean> {
  try {
    const dm = await draftMode()
    return !dm.isEnabled
  } catch {
    // Throws during generateStaticParams because there is no HTTP request context
    return true
  }
}

/**
 * Merge `where` with published-only constraint for anonymous REST reads.
 * The resulting object is serialised to query-string params by the REST client.
 */
export async function mergePublishedWhere(where: WhereClause = {}): Promise<WhereClause> {
  const filter = await shouldFilterPublishedOnly()
  if (!filter) return where

  const keys = Object.keys(where)
  if (keys.length === 0) return { ...publishedClause }

  if ('and' in where && Array.isArray(where.and)) {
    return { and: [publishedClause, ...where.and] }
  }

  return { and: [publishedClause, where] }
}
