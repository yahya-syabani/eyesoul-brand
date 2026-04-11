/**
 * Best-effort normalization for outbound links (WhatsApp, Maps). Never throws.
 */
export function normalizeExternalUrl(raw: string | null | undefined): string {
  if (raw == null || typeof raw !== 'string') return ''
  let url = raw.trim()
  if (!url) return ''

  if (/^wa\.me\//i.test(url)) {
    url = `https://${url}`
  }
  if (/^maps\./i.test(url)) {
    url = `https://${url}`
  }
  if (!/^https?:\/\//i.test(url) && /^[\w.-]+\.[a-z]{2,}/i.test(url)) {
    url = `https://${url}`
  }

  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return ''
    }
    return parsed.href
  } catch {
    return url
  }
}
