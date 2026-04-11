/**
 * Public URL builders — paths must match `generateURL` in `payload.config.ts` (SEO plugin).
 */

function baseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SERVER_URL ?? ''
  return raw.replace(/\/$/, '')
}

/** Absolute URL when `NEXT_PUBLIC_SERVER_URL` is set; otherwise same-path root-relative. */
export function buildProductUrl(slug: string): string {
  const path = `/catalog/${encodeURIComponent(slug)}`
  const b = baseUrl()
  return b ? `${b}${path}` : path
}

export function buildCollectionUrl(slug: string): string {
  const path = `/collections/${encodeURIComponent(slug)}`
  const b = baseUrl()
  return b ? `${b}${path}` : path
}

export function buildPageUrl(slug: string): string {
  const path = `/${encodeURIComponent(slug)}`
  const b = baseUrl()
  return b ? `${b}${path}` : path
}
