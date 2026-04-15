import Image from 'next/image'

import type { Media } from '@/payload-types'

import { normalizeExternalUrl } from '@/lib/links'

import { BrandButton } from './BrandButton'
import { resolveBrandImage } from './brandMedia'

type Props = {
  eyebrow?: string | null
  heading: string
  subheading?: string | null
  image?: number | Media | null
  ctaLabel?: string | null
  ctaHref?: string | null
}

export function BrandHomeHero({ eyebrow, heading, subheading, image, ctaLabel, ctaHref }: Props) {
  const img = resolveBrandImage(image, 'hero')
  const href = ctaHref ? normalizeExternalUrl(ctaHref) || ctaHref : ''

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#F7F0EA] dark:bg-neutral-800/60">
      <div className="relative z-[1] px-8 pt-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10 lg:pt-12 lg:pb-10">
        <div className="flex max-w-lg flex-col items-start gap-y-5 xl:max-w-2xl xl:gap-y-6">
          {eyebrow ? (
            <span className="font-semibold text-neutral-600 dark:text-neutral-300 sm:text-lg md:text-xl">{eyebrow}</span>
          ) : null}
          <h2 className="text-3xl leading-[1.15] font-bold text-neutral-950 dark:text-neutral-50 sm:text-4xl md:text-5xl">{heading}</h2>
          {subheading ? <p className="text-neutral-600 dark:text-neutral-400 sm:text-lg">{subheading}</p> : null}
          {href && ctaLabel ? (
            <div className="pt-2">
              <BrandButton href={href} variant="primary">
                {ctaLabel}
              </BrandButton>
            </div>
          ) : null}
        </div>
        {img ? (
          <div className="relative mt-8 aspect-[4/3] w-full max-w-xl lg:mt-0 lg:max-w-none">
            <Image
              src={img.src}
              alt={img.alt || heading}
              fill
              className="object-contain object-bottom"
              sizes="(min-width: 1024px) 45vw, 100vw"
              priority
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
