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
    <div className="relative w-[100vw] h-[85vh] min-h-[600px] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden flex items-center justify-center bg-neutral-900 group">
      {img ? (
        <Image
          src={img.src}
          alt={img.alt || heading}
          fill
          className="object-cover transition-transform duration-[10000ms] ease-out group-hover:scale-110 opacity-70 mix-blend-overlay"
          sizes="100vw"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-900" />
      )}
      
      {/* Cinematic Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
      
      <div className="relative z-10 w-full max-w-5xl px-6 lg:px-8 mt-20 text-center flex flex-col items-center">
        {eyebrow ? (
          <span className="font-medium tracking-widest uppercase text-white/90 text-sm md:text-base fade--animation__subheading mb-4">
            {eyebrow}
          </span>
        ) : null}
        
        <h2 className="text-4xl leading-[1.1] font-display font-medium text-white sm:text-5xl md:text-6xl lg:text-7xl fade--animation__heading mb-6 max-w-4xl">
          {heading}
        </h2>
        
        {subheading ? (
          <p className="text-white/80 sm:text-lg max-w-2xl fade--animation__image mb-10">
            {subheading}
          </p>
        ) : null}
        
        {href && ctaLabel ? (
          <div className="fade--animation__button">
            <BrandButton 
              href={href} 
              variant="primary" 
              className="bg-white text-black hover:bg-neutral-200 border-none px-8 py-4 text-base font-medium rounded-full shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:scale-[1.02]"
            >
              {ctaLabel}
            </BrandButton>
          </div>
        ) : null}
      </div>
    </div>
  )
}
