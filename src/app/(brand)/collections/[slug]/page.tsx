import { notFound } from 'next/navigation'

import Image from 'next/image'

import { ProductGrid } from '@/components/brand/ProductGrid'
import { BrandH1, BrandLead } from '@/components/brand/BrandTypography'
import { resolveBrandImage } from '@/components/brand/brandMedia'
import { Metadata } from 'next'
import { getCollectionBySlug, getCollections } from '@/lib/cms/productCollections'

export async function generateStaticParams() {
  const collections = await getCollections()
  return collections.map((collection) => ({
    slug: collection.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { collection } = await getCollectionBySlug(slug, { depth: 1 })
  if (!collection) return {}

  return {
    title: collection.title,
    description: collection.description || `Explore the ${collection.title} eyewear collection at Eyesoul.`,
    openGraph: {
      title: `${collection.title} — Eyesoul`,
      description: collection.description || `Explore the ${collection.title} eyewear collection.`,
      url: `https://eyesoul.brand/collections/${collection.slug}`,
    },
  }
}

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { collection, products } = await getCollectionBySlug(slug, { productDepth: 2 })
  if (!collection) notFound()

  const hero = resolveBrandImage(collection.coverImage, 'hero')

  return (
    <article className="pb-16">
      <div className="border-b border-brand-border bg-brand-muted/30">
        <div className="container py-10 md:py-14">
          {hero ? (
            <div className="relative mb-8 aspect-[21/9] max-h-[320px] overflow-hidden rounded-2xl border border-brand-border">
              <Image
                src={hero.src}
                alt={hero.alt || collection.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          ) : null}
          <BrandH1>{collection.title}</BrandH1>
          {collection.description ? (
            <BrandLead className="mt-4">{collection.description}</BrandLead>
          ) : (
            <BrandLead className="mt-4">Frames in this collection.</BrandLead>
          )}
        </div>
      </div>
      <div className="container mt-12">
        <ProductGrid products={products} />
      </div>
    </article>
  )
}
