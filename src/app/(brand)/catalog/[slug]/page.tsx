import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BrandRichText } from '@/components/brand/BrandRichText'
import { ProductImageGallery } from '@/components/brand/ProductImageGallery'
import { ProductCard } from '@/components/brand/ProductCard'
import { BrandDivider } from '@/components/brand/BrandDivider'
import { BrandH1 } from '@/components/brand/BrandTypography'
import { getProductBySlug, getRelatedProducts } from '@/lib/cms/products'

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug, { depth: 2 })
  if (!product) notFound()

  const collectionId =
    product.collection != null && typeof product.collection === 'object' ? product.collection.id : null

  const related =
    collectionId != null
      ? await getRelatedProducts({
          productId: product.id,
          collectionId,
          limit: 4,
          depth: 2,
        })
      : []

  const price = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(product.price)

  return (
    <article className="container py-10 md:py-14">
      <nav className="text-brand-sm text-brand-muted-foreground" aria-label="Breadcrumb">
        <Link href="/catalog" className="hover:text-brand-ink">
          Catalog
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brand-ink">{product.name}</span>
      </nav>
      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <ProductImageGallery images={product.images ?? undefined} productName={product.name} />
        <div>
          <BrandH1 className="!text-brand-3xl">{product.name}</BrandH1>
          <p className="mt-4 text-2xl font-semibold text-brand-ink">{price}</p>
          <BrandDivider className="my-8" />
          <div className="prose-brand max-w-none">
            <BrandRichText data={product.description} />
          </div>
        </div>
      </div>
      {related.length > 0 ? (
        <>
          <BrandDivider className="my-16" />
          <section>
            <h2 className="font-display text-brand-2xl font-semibold text-brand-ink">Related products</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </>
      ) : null}
    </article>
  )
}
