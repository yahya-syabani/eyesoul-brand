'use client'

import { toVideoEmbedUrl } from '@/lib/video'
import { cn } from '@/lib/cn'
import Image from 'next/image'
import { useState } from 'react'

type Props = {
  videoUrl: string
  posterSrc?: string
  posterAlt?: string
  className?: string
}

/**
 * Lazy-loaded embed (no autoplay). User clicks play to load the iframe.
 */
export function ProductVideoEmbed({ videoUrl, posterSrc, posterAlt, className }: Props) {
  const embedUrl = toVideoEmbedUrl(videoUrl)
  const [active, setActive] = useState(false)

  if (!embedUrl) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Video URL is not a supported YouTube or Vimeo link.
      </p>
    )
  }

  if (!active) {
    return (
      <button
        type="button"
        onClick={() => setActive(true)}
        className={cn(
          'group relative aspect-video w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900',
          className,
        )}
        aria-label="Play product video"
      >
        {posterSrc ? (
          <Image src={posterSrc} alt={posterAlt ?? ''} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-200/80 text-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-200">
            <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium shadow dark:bg-neutral-900/90">
              Play video
            </span>
          </div>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30">
          <span className="flex size-16 items-center justify-center rounded-full bg-white/95 text-xl shadow-lg dark:bg-neutral-900/95">
            ▶
          </span>
        </span>
      </button>
    )
  }

  return (
    <div className={cn('aspect-video w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700', className)}>
      <iframe
        title={posterAlt ?? 'Product video'}
        src={embedUrl}
        className="size-full"
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
