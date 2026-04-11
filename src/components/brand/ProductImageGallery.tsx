'use client'

import Image from 'next/image'
import { useState } from 'react'

import type { Media } from '@/payload-types'

import { resolveBrandImage } from './brandMedia'

type ResolvedSlide = { src: string; alt: string; key: number }

export function ProductImageGallery({ images, productName }: { images: (number | Media)[] | null | undefined; productName: string }) {
  const resolved: ResolvedSlide[] = []
  if (images) {
    for (let i = 0; i < images.length; i++) {
      const m = images[i]
      const r = resolveBrandImage(m, 'hero')
      if (!r) continue
      const key = typeof m === 'number' ? m : m.id
      resolved.push({ src: r.src, alt: r.alt, key })
    }
  }

  const [active, setActive] = useState(0)
  const current = resolved[active]

  if (!resolved.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-brand-border bg-brand-muted text-brand-sm text-brand-muted-foreground">
        No images
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-brand-border bg-brand-muted">
        {current ? (
          <Image
            src={current.src}
            alt={current.alt || productName}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 45vw, 100vw"
            priority
          />
        ) : null}
      </div>
      {resolved.length > 1 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Product thumbnails">
          {resolved.map((item, i) => (
            <li key={`${item.key}-${i}`}>
              <button
                type="button"
                onClick={() => setActive(i)}
                className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 motion-safe:transition-colors ${
                  i === active ? 'border-brand-accent' : 'border-transparent hover:border-brand-border'
                }`}
                aria-current={i === active ? 'true' : undefined}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={item.src} alt="" fill className="object-cover" sizes="64px" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
