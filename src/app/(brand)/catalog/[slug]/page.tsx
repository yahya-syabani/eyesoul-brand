import { notFound } from 'next/navigation'
import GalleryImages from '@/app/(shop)/(other-pages)/products/GalleryImages'
import Policy from '@/app/(shop)/(other-pages)/products/Policy'
import { BrandProductReviews, aggregateFromReviews } from '@/components/brand/BrandProductReviews'
import { BrandRichText } from '@/components/brand/BrandRichText'
import { ProductSpecs } from '@/components/brand/ProductSpecs'
import { ProductStoreCta } from '@/components/brand/ProductStoreCta'
import { ProductVideoEmbed } from '@/components/brand/ProductVideoEmbed'
import { resolveBrandImage } from '@/components/brand/brandMedia'
import Prices from '@/components/Prices'
import ProductStatus from '@/components/ProductStatus'
import SectionSliderProductCard from '@/components/SectionSliderProductCard'
import Breadcrumb from '@/shared/Breadcrumb'
import { toTProductItem, toTProductItems } from '@/lib/cms/adapters'
import { getReviewsForProduct } from '@/lib/cms/reviews'
import { getProductBySlug, getProducts, getRelatedProducts } from '@/lib/cms/products'
import { StarIcon } from '@heroicons/react/24/solid'
import { Metadata, ResolvingMetadata } from 'next'

export async function generateStaticParams() {
  const products = await getProducts({ limit: 100 })
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug, { depth: 2 })
  if (!product) return {}

  const previousImages = (await parent).openGraph?.images || []
  const productImages = (product.images || [])
    .map((img) => (typeof img === 'object' ? img.url : null))
    .filter((url): url is string => !!url)

  return {
    title: product.name,
    description: `Shop the ${product.name} eyewear collection. Designer frames with premium clarity and style.`,
    openGraph: {
      title: `${product.name} — Eyesoul`,
      description: `Shop the ${product.name} eyewear collection. Designer frames with premium clarity and style.`,
      url: `https://eyesoul.brand/catalog/${product.slug}`,
      images: [...productImages, ...previousImages],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — Eyesoul`,
      description: `Shop the ${product.name} eyewear collection.`,
      images: productImages,
    },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const productRaw = await getProductBySlug(slug, { depth: 3 })
  if (!productRaw) notFound()

  const [cmsReviews, relatedRaw] = await Promise.all([
    getReviewsForProduct(productRaw.id, { depth: 2 }),
    (async () => {
      const firstCollection =
        Array.isArray(productRaw.collections) && productRaw.collections.length > 0 ? productRaw.collections[0] : null
      const collectionId = firstCollection != null && typeof firstCollection === 'object' ? firstCollection.id : null
      if (collectionId == null) return []
      return getRelatedProducts({
        productId: productRaw.id,
        collectionId,
        limit: 8,
        depth: 2,
      })
    })(),
  ])

  const product = toTProductItem(productRaw)
  const relatedProducts = toTProductItems(relatedRaw)
  const { rating: aggRating, count: reviewCount } = aggregateFromReviews(cmsReviews)

  const breadcrumbs = [
    { id: 1, name: 'Home', href: '/' },
    { id: 2, name: 'Catalog', href: '/catalog' },
  ]

  const galleryImages = (product.images || []).map((img) => img.src).filter(Boolean)
  const poster = resolveBrandImage(productRaw.videoPoster, 'card') ?? (galleryImages[0] ? { src: galleryImages[0], alt: product.title } : null)

  const displayRating = reviewCount > 0 ? aggRating : product.rating || 0
  const displayReviewCount = reviewCount > 0 ? reviewCount : product.reviewNumber || 0

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: galleryImages,
    description: `Shop the ${product.title} eyewear collection. Designer frames with premium clarity and style.`,
    brand: {
      '@type': 'Brand',
      name: 'Eyesoul',
    },
    offers: {
      '@type': 'Offer',
      url: `https://eyesoul.brand/catalog/${product.handle}`,
      priceCurrency: 'USD',
      price: product.price,
      availability: 'https://schema.org/InStock',
    },
  }

  if (cmsReviews.length > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggRating,
      reviewCount,
    }
    jsonLd.review = cmsReviews.map((r) => ({
      '@type': 'Review',
      name: r.title,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
      },
      author: {
        '@type': 'Person',
        name: r.authorName,
      },
      datePublished: r.createdAt,
      reviewBody: r.title,
    }))
  }

  const productType = productRaw.productType || 'optical-frame'

  const detailRows: Array<{ label: string; value: string }> = []
  if (productRaw.brand) detailRows.push({ label: 'Brand', value: productRaw.brand })
  if (productRaw.gtin) detailRows.push({ label: 'GTIN', value: productRaw.gtin })

  if (productType === 'sunglasses') {
    if (productRaw.frame?.polarized != null) detailRows.push({ label: 'Polarized', value: productRaw.frame.polarized ? 'Yes' : 'No' })
    if (productRaw.frame?.uv400 != null) detailRows.push({ label: 'UV400', value: productRaw.frame.uv400 ? 'Yes' : 'No' })
    if (productRaw.frame?.lensCategory != null) detailRows.push({ label: 'Lens category', value: String(productRaw.frame.lensCategory) })
    if (productRaw.frame?.lensColor) detailRows.push({ label: 'Lens color', value: productRaw.frame.lensColor })
  }

  if (productType === 'contact-soft') {
    const cl = productRaw.contactLens
    if (cl?.replacementSchedule) detailRows.push({ label: 'Replacement schedule', value: cl.replacementSchedule })
    if (cl?.unitsPerBox != null) detailRows.push({ label: 'Units per box', value: String(cl.unitsPerBox) })
    if (Array.isArray(cl?.baseCurveOptionsMm) && cl.baseCurveOptionsMm.length > 0) {
      detailRows.push({ label: 'Base curve (mm)', value: cl.baseCurveOptionsMm.map(String).join(', ') })
    }
    if (Array.isArray(cl?.diameterOptionsMm) && cl.diameterOptionsMm.length > 0) {
      detailRows.push({ label: 'Diameter (mm)', value: cl.diameterOptionsMm.map(String).join(', ') })
    }
    if (cl?.materialType) detailRows.push({ label: 'Material type', value: cl.materialType })
    if (cl?.waterContentPercent != null) detailRows.push({ label: 'Water content', value: `${cl.waterContentPercent}%` })
    if (cl?.dkT != null) detailRows.push({ label: 'Dk/t', value: String(cl.dkT) })
    if (cl?.wearingModality) detailRows.push({ label: 'Wearing modality', value: cl.wearingModality })
  }

  if (productType === 'contact-care') {
    const care = productRaw.careProduct
    if (care?.unitOfMeasure) detailRows.push({ label: 'Unit', value: care.unitOfMeasure })
    if (care?.unitVolumeMl != null) detailRows.push({ label: 'Volume', value: `${care.unitVolumeMl} ml` })
    if (care?.unitsPerPack != null) detailRows.push({ label: 'Units per pack', value: String(care.unitsPerPack) })
    if (care?.compatibility) detailRows.push({ label: 'Compatibility', value: care.compatibility })
  }

  if (productType === 'accessory') {
    const acc = productRaw.accessory
    if (acc?.accessoryType) detailRows.push({ label: 'Accessory type', value: acc.accessoryType })
    if (acc?.unitsPerPack != null) detailRows.push({ label: 'Units per pack', value: String(acc.unitsPerPack) })
    if (acc?.compatibilityNotes) detailRows.push({ label: 'Compatibility', value: acc.compatibilityNotes })
  }

  return (
    <main className="container mt-5 mb-20 lg:mt-11">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="lg:flex">
        <div className="w-full lg:w-[55%]">
          <div className="relative">
            <GalleryImages images={galleryImages} gridType="grid5" />
          </div>
          {productRaw.videoUrl ? (
            <div className="mt-8 max-w-2xl">
              <h2 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Video</h2>
              <ProductVideoEmbed videoUrl={productRaw.videoUrl} posterSrc={poster?.src} posterAlt={poster?.alt || product.title} />
            </div>
          ) : null}
        </div>

        <div className="w-full pt-10 lg:w-[45%] lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">
          <div className="sticky top-8 flex flex-col gap-y-10">
            <div>
              <Breadcrumb breadcrumbs={breadcrumbs} currentPage={product.title} />
              <h1 className="mt-4 text-2xl font-semibold sm:text-3xl">{product.title}</h1>
              <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2.5 sm:gap-x-6">
                <Prices contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold" price={product.price || 0} />
                <div className="hidden h-7 border-l border-neutral-300 sm:block dark:border-neutral-700"></div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <div className="flex items-center text-sm font-medium">
                    <StarIcon className="size-5 pb-px text-yellow-400" />
                    <div className="ms-1.5 flex">
                      <span>{displayRating}</span>
                      <span className="mx-2 block">·</span>
                      <span className="text-neutral-600 underline dark:text-neutral-400">{displayReviewCount} reviews</span>
                    </div>
                  </div>
                  <span>·</span>
                  <ProductStatus status={product.status || 'In Stock'} />
                </div>
              </div>
            </div>

            <div className="prose prose-sm sm:prose sm:max-w-4xl dark:prose-invert">
              <BrandRichText data={productRaw.description} />
            </div>

            {productType === 'optical-frame' || productType === 'sunglasses' ? <ProductSpecs product={productRaw} /> : null}

            {detailRows.length > 0 ? (
              <section className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-700" aria-labelledby="product-details-heading">
                <h2 id="product-details-heading" className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Product details
                </h2>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  {detailRows.map((row) => (
                    <div key={row.label} className="flex flex-col gap-0.5 rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-800/50">
                      <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{row.label}</dt>
                      <dd className="text-sm text-neutral-900 dark:text-neutral-100">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            <ProductStoreCta />

            <div className="hidden xl:block">
              <Policy />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-y-10 sm:mt-16 sm:gap-y-16">
        <div className="block xl:hidden">
          <Policy />
        </div>

        <BrandProductReviews reviews={cmsReviews} />

        {relatedProducts.length > 0 && (
          <>
            <hr className="border-neutral-200 dark:border-neutral-700" />
            <SectionSliderProductCard
              data={relatedProducts}
              heading="Related Products"
              subHeading="Customers also liked these frames"
              headingFontClassName="text-2xl font-semibold md:text-3xl"
              headingClassName="mb-10 text-neutral-900 dark:text-neutral-50"
            />
          </>
        )}
      </div>
    </main>
  )
}
