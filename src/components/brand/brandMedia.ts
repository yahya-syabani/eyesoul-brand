import type { Media } from '@/payload-types'

export function resolveBrandImage(
  media: number | Media | null | undefined,
  preferredSize: 'hero' | 'card' | 'thumbnail' = 'card',
): { src: string; alt: string; width?: number; height?: number } | null {
  if (media == null || typeof media === 'number') return null
  const sizeUrl =
    preferredSize === 'hero'
      ? (media.sizes?.hero?.url ?? media.url)
      : preferredSize === 'card'
        ? (media.sizes?.card?.url ?? media.sizes?.hero?.url ?? media.url)
        : (media.sizes?.thumbnail?.url ?? media.sizes?.card?.url ?? media.url)
  if (!sizeUrl) return null
  return {
    src: sizeUrl,
    alt: media.alt || '',
    width: media.width ?? undefined,
    height: media.height ?? undefined,
  }
}
