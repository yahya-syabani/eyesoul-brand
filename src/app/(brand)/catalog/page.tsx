import { Suspense } from 'react'

import { CatalogView } from '@/components/brand/CatalogView'
import { BrandH1, BrandLead } from '@/components/brand/BrandTypography'
import { getCollections } from '@/lib/cms/productCollections'
import { getProducts } from '@/lib/cms/products'

function CatalogFallback() {
  return <p className="text-brand-sm text-brand-muted-foreground">Loading catalog…</p>
}

export default async function CatalogPage() {
  const [products, collections] = await Promise.all([getProducts({ depth: 2 }), getCollections({ depth: 1 })])

  return (
    <section className="container py-10 md:py-14">
      <BrandH1>Catalog</BrandH1>
      <BrandLead className="mt-3">Filter by collection. All frames are for browsing only in Phase 1.</BrandLead>
      <div className="mt-10">
        <Suspense fallback={<CatalogFallback />}>
          <CatalogView products={products} collections={collections} />
        </Suspense>
      </div>
    </section>
  )
}
