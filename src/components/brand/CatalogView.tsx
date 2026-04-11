'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import type { Product, ProductCollection } from '@/payload-types'

import { CatalogFilterBar } from './CatalogFilterBar'
import { ProductGrid } from './ProductGrid'

export function CatalogView({
  products,
  collections,
}: {
  products: Product[]
  collections: ProductCollection[]
}) {
  const searchParams = useSearchParams()
  const collectionSlug = searchParams.get('collection')?.trim() ?? ''

  const filtered = useMemo(() => {
    if (!collectionSlug) return products
    return products.filter((p) => {
      const c = p.collection
      if (c == null || typeof c === 'number') return false
      return c.slug === collectionSlug
    })
  }, [products, collectionSlug])

  return (
    <div className="flex flex-col gap-8">
      <CatalogFilterBar collections={collections} />
      <ProductGrid products={filtered} />
    </div>
  )
}
