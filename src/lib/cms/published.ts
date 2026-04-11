import { draftMode } from 'next/headers'

import type { Where } from 'payload'

const publishedClause: Where = {
  _status: {
    equals: 'published',
  },
}

/**
 * When Next draft mode is on, skip `_status` so previews can load drafts.
 * Hardening preview behind auth is deferred (EP-5/EP-6 per plan).
 */
export async function shouldFilterPublishedOnly(): Promise<boolean> {
  const dm = await draftMode()
  return !dm.isEnabled
}

/**
 * Merge `where` with published-only constraint for anonymous-style reads.
 * Does not bypass Payload collection access rules (staff still get full API reads when authenticated).
 */
export async function mergePublishedWhere(where: Where = {}): Promise<Where> {
  const filter = await shouldFilterPublishedOnly()
  if (!filter) {
    return where
  }

  const keys = Object.keys(where)
  if (keys.length === 0) {
    return { ...publishedClause }
  }

  if ('and' in where && Array.isArray((where as { and: Where[] }).and)) {
    const w = where as { and: Where[] }
    return {
      and: [publishedClause, ...w.and],
    }
  }

  return {
    and: [publishedClause, where],
  }
}
