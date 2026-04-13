import { notFound } from 'next/navigation'
import { BrandRichText } from '@/components/brand/BrandRichText'
import { toTProductItem, toTProductItems } from '@/lib/cms/adapters'
import { getProductBySlug, getRelatedProducts, getProducts } from '@/lib/cms/products'
import Prices from '@/components/Prices'
import ProductStatus from '@/components/ProductStatus'
import SectionSliderProductCard from '@/components/SectionSliderProductCard'
import Breadcrumb from '@/shared/Breadcrumb'
import { StarIcon } from '@heroicons/react/24/solid'
import GalleryImages from '@/app/(shop)/(other-pages)/products/GalleryImages'
import Policy from '@/app/(shop)/(other-pages)/products/Policy'
import { Metadata, ResolvingMetadata } from 'next'
import AccordionInfo from '@/components/AccordionInfo'
import ProductReviews from '@/app/(shop)/(other-pages)/products/ProductReviews'
import type { ProductReviewItem } from '@/lib/cms/ui-types'

export async function generateStaticParams() {
  const products = await getProducts({ limit: 100 })
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
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
  const productRaw = await getProductBySlug(slug, { depth: 2 })
  if (!productRaw) notFound()

  const product = toTProductItem(productRaw)
  
  const collectionId =
    productRaw.collection != null && typeof productRaw.collection === 'object' 
      ? productRaw.collection.id 
      : null

  const relatedRaw =
    collectionId != null
      ? await getRelatedProducts({
          productId: productRaw.id,
          collectionId,
          limit: 8,
          depth: 2,
        })
      : []
  
  const relatedProducts = toTProductItems(relatedRaw)

  const breadcrumbs = [
    { id: 1, name: 'Home', href: '/' },
    { id: 2, name: 'Catalog', href: '/catalog' },
  ]

  const galleryImages = (product.images || []).map((img) => img.src).filter(Boolean)
  const reviews: ProductReviewItem[] = [
    {
      id: `${product.id}-r1`,
      author: 'Eyesoul Customer',
      date: 'Apr 10, 2026',
      rating: 5,
      content: `<p>Excellent lens clarity and a lightweight frame. Great for all-day wear.</p>`,
    },
    {
      id: `${product.id}-r2`,
      author: 'Verified Buyer',
      date: 'Apr 03, 2026',
      rating: 4,
      content: `<p>Premium finish and comfortable fit. I would recommend this style.</p>`,
    },
  ]

  const renderRightSide = () => {
    return (
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
                    <span>{product.rating || 0}</span>
                    <span className="mx-2 block">·</span>
                    <span className="text-neutral-600 underline dark:text-neutral-400">{product.reviewNumber || 0} reviews</span>
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

          <div className="hidden xl:block">
            <Policy />
          </div>
        </div>
      </div>
    )
  }

  const renderLeftSide = () => {
    return (
      <div className="w-full lg:w-[55%]">
        <div className="relative">
          <GalleryImages images={galleryImages} gridType="grid5" />
        </div>
      </div>
    )
  }

  const jsonLd = {
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

  return (
    <main className="container mt-5 lg:mt-11 mb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="lg:flex">
        {renderLeftSide()}
        {renderRightSide()}
      </div>

      <div className="mt-12 flex flex-col gap-y-10 sm:mt-16 sm:gap-y-16">
        <div className="block xl:hidden">
          <Policy />
        </div>

        <AccordionInfo />

        <ProductReviews
          rating={product.rating || 4.5}
          reviewNumber={reviews.length}
          reviews={reviews}
        />

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

