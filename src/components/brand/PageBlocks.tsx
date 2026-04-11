import Image from 'next/image'

import type { Page } from '@/payload-types'

import { normalizeExternalUrl } from '@/lib/links'

import { BrandButton } from './BrandButton'
import { BrandRichText } from './BrandRichText'
import { BrandH2, BrandLead } from './BrandTypography'
import { resolveBrandImage } from './brandMedia'

type Block = NonNullable<Page['blocks']>[number]

export function PageBlocks({ blocks }: { blocks: Page['blocks'] }) {
  if (!blocks?.length) return null
  return (
    <div className="flex flex-col gap-16 py-10">
      {blocks.map((block, index) => (
        <PageBlock key={block.id ?? `block-${index}`} block={block} />
      ))}
    </div>
  )
}

function PageBlock({ block }: { block: Block }) {
  if (block.blockType === 'hero') {
    const img = resolveBrandImage(block.image, 'hero')
    return (
      <section className="container grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <BrandH2>{block.heading}</BrandH2>
          {block.subheading ? <BrandLead className="mt-4">{block.subheading}</BrandLead> : null}
        </div>
        {img ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-brand-border bg-brand-muted">
            <Image
              src={img.src}
              alt={img.alt || block.heading}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </div>
        ) : null}
      </section>
    )
  }

  if (block.blockType === 'content') {
    return (
      <section className="container max-w-3xl">
        <BrandRichText data={block.body} />
      </section>
    )
  }

  if (block.blockType === 'cta') {
    const href = normalizeExternalUrl(block.href) || block.href
    return (
      <section className="container flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-brand-border bg-brand-muted/50 px-6 py-10">
        <BrandButton href={href} variant="primary">
          {block.label}
        </BrandButton>
      </section>
    )
  }

  return null
}
