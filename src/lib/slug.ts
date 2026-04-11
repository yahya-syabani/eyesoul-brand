/**
 * URL-safe slug (must stay aligned with `src/payload/utils/slug.js` / Payload hooks).
 */
export function buildSlug(input: string): string {
  if (!input || typeof input !== 'string') return ''
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
