import Image from 'next/image'
import Link from 'next/link'

import { buildProductUrl } from '@/lib/urls'
import type { Product, ProductCollection } from '@/payload-types'

import { BrandBadge } from './BrandBadge'
import { resolveBrandImage } from './brandMedia'

function firstCollectionLabel(collections: Product['collections']): string | null {
  if (!Array.isArray(collections) || collections.length === 0) return null
  const first = collections[0]
  if (first == null || typeof first === 'number') return null
  return (first as ProductCollection).title
}

export function ProductCard({ product }: { product: Product }) {
  const firstImage = product.images?.[0]
  const img = resolveBrandImage(firstImage, 'card')
  const href = buildProductUrl(product.slug)
  const collectionTitle = firstCollectionLabel(product.collections)

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-surface motion-safe:transition-shadow hover:shadow-md">
      <Link href={href} className="relative aspect-[4/5] overflow-hidden bg-brand-muted">
        {img ? (
          <Image
            src={img.src}
            alt={img.alt || product.name}
            fill
            className="object-cover motion-safe:transition-transform group-hover:scale-[1.02]"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-sm text-brand-muted-foreground">No image</div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {collectionTitle ? <BrandBadge>{collectionTitle}</BrandBadge> : null}
        <Link href={href} className="font-display text-brand-lg font-semibold text-brand-ink hover:text-brand-accent-hover">
          {product.name}
        </Link>
        <p className="text-brand-sm font-medium text-brand-muted-foreground">
          {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(product.price)}
        </p>
      </div>
    </article>
  )
}
