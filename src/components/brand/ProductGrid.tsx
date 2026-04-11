import type { Product } from '@/payload-types'

import { ProductCard } from './ProductCard'
import { BrandBody } from './BrandTypography'

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-border bg-brand-muted/40 px-6 py-16 text-center">
        <BrandBody className="text-brand-muted-foreground">No products match the current filters.</BrandBody>
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  )
}
