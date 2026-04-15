/**
 * Convert a public YouTube or Vimeo watch URL to an embeddable iframe src.
 * Returns null when the URL is not a supported host.
 */
export function toVideoEmbedUrl(videoUrl: string): string | null {
  let u: URL
  try {
    u = new URL(videoUrl.trim())
  } catch {
    return null
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null

  const host = u.hostname.toLowerCase()

  if (host === 'youtu.be') {
    const id = u.pathname.replace(/^\//, '').split('/')[0]
    return id ? `https://www.youtube.com/embed/${encodeURIComponent(id)}` : null
  }

  if (host === 'www.youtube.com' || host === 'youtube.com' || host === 'm.youtube.com') {
    if (u.pathname.startsWith('/embed/')) {
      return u.href
    }
    const v = u.searchParams.get('v')
    if (v) {
      return `https://www.youtube.com/embed/${encodeURIComponent(v)}`
    }
    const parts = u.pathname.split('/').filter(Boolean)
    const shortIdx = parts.indexOf('shorts')
    if (shortIdx >= 0 && parts[shortIdx + 1]) {
      return `https://www.youtube.com/embed/${encodeURIComponent(parts[shortIdx + 1])}`
    }
  }

  if (host === 'vimeo.com' || host === 'www.vimeo.com') {
    const parts = u.pathname.split('/').filter(Boolean)
    const id = parts[0]
    if (id && /^\d+$/.test(id)) {
      return `https://player.vimeo.com/video/${id}`
    }
  }

  if (host === 'player.vimeo.com' && u.pathname.includes('/video/')) {
    return u.href
  }

  return null
}
