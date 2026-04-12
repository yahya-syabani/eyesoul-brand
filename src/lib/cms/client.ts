/**
 * Typed REST client for the Payload CMS API.
 *
 * The storefront has no Payload process — all content reads go through
 * Payload's REST API. This module is the single point of contact.
 *
 * Environment variable: NEXT_PUBLIC_CMS_URL
 *   Development:  http://localhost:3001   (CMS app running locally)
 *   Production:   https://cms.eyesoul.id  (deployed CMS server)
 */

const CMS_URL = (process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001').replace(/\/$/, '')

export type WhereField =
  | { equals: unknown }
  | { not_equals: unknown }
  | { in: unknown[] }
  | { contains: unknown }
  | { exists: boolean }

export type WhereClause = {
  and?: WhereClause[]
  or?: WhereClause[]
  [field: string]: WhereField | WhereClause[] | undefined
}

export type CmsQueryOptions = {
  where?: WhereClause
  limit?: number
  sort?: string
  depth?: number
  page?: number
  draft?: boolean
}

export type CmsListResponse<T> = {
  docs: T[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/**
 * Serialise a nested where clause to Payload REST query params.
 * Payload's REST API accepts `where[field][operator]=value` for simple
 * conditions and `where[and][0][field][operator]=value` for compound ones.
 */
function encodeWhere(where: WhereClause, prefix = 'where'): URLSearchParams {
  const params = new URLSearchParams()

  function encode(obj: Record<string, unknown>, path: string) {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = `${path}[${key}]`
      if (value === null || value === undefined) continue
      if (Array.isArray(value)) {
        value.forEach((item, i) => {
          if (typeof item === 'object' && item !== null) {
            encode(item as Record<string, unknown>, `${fullKey}[${i}]`)
          } else {
            params.append(`${fullKey}[${i}]`, String(item))
          }
        })
      } else if (typeof value === 'object') {
        encode(value as Record<string, unknown>, fullKey)
      } else {
        params.append(fullKey, String(value))
      }
    }
  }

  encode(where as Record<string, unknown>, prefix)
  return params
}

/**
 * Fetch a list of documents from a Payload collection via REST.
 * Throws if the response is not ok, returns typed docs array.
 */
export async function cmsFind<T>(
  collection: string,
  options: CmsQueryOptions = {},
): Promise<CmsListResponse<T>> {
  const params = new URLSearchParams()

  if (options.limit != null) params.set('limit', String(options.limit))
  if (options.sort != null) params.set('sort', options.sort)
  if (options.depth != null) params.set('depth', String(options.depth))
  if (options.page != null) params.set('page', String(options.page))
  // Draft reads require authentication — skip in public storefront
  // (draft=false is the Payload default so we only set it when explicitly true)
  if (options.draft) params.set('draft', 'true')

  if (options.where) {
    const whereParams = encodeWhere(options.where)
    whereParams.forEach((value, key) => params.set(key, value))
  }

  const qs = params.toString()
  const url = `${CMS_URL}/api/${collection}${qs ? `?${qs}` : ''}`

  const res = await fetch(url, {
    // next.js cache: treat CMS responses as ISR-cacheable data
    next: { revalidate: 60 },
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    throw new Error(`CMS fetch failed [${res.status}] GET /api/${collection} — ${res.statusText}`)
  }

  return res.json() as Promise<CmsListResponse<T>>
}
