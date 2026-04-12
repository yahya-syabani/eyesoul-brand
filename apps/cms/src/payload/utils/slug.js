/**
 * Normalize a string into a URL-safe slug: lowercase, hyphen-separated.
 * @param {string} input
 * @returns {string}
 */
export function normalizeSlug(input) {
  if (!input || typeof input !== 'string') return ''
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
