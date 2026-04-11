import Link from 'next/link'

import { BrandButton } from '@/components/brand/BrandButton'
import { BrandDivider } from '@/components/brand/BrandDivider'
import { NewsletterCapture } from '@/components/brand/NewsletterCapture'
import { ProductCard } from '@/components/brand/ProductCard'
import { BrandH2, BrandLead } from '@/components/brand/BrandTypography'
import { getCollections } from '@/lib/cms/productCollections'
import { getProducts } from '@/lib/cms/products'
import { getServices } from '@/lib/cms/services'

export default async function HomePage() {
  const [collections, services] = await Promise.all([getCollections({ depth: 2 }), getServices({ limit: 6 })])
  const featured = collections.find((c) => c.featured) ?? collections[0]
  const featuredProducts = featured
    ? await getProducts({ collectionId: featured.id, limit: 4, depth: 2 })
    : await getProducts({ limit: 4, depth: 2 })

  return (
    <>
      <section className="border-b border-brand-border bg-brand-muted/30">
        <div className="container flex flex-col gap-8 py-16 md:py-24">
          <p className="text-brand-sm font-medium uppercase tracking-widest text-brand-muted-foreground">
            Eyesoul
          </p>
          <h1 className="font-display max-w-3xl text-brand-4xl font-semibold tracking-tight text-brand-ink md:text-5xl md:leading-tight">
            Clarity in every frame — eyewear and care, crafted for daily life.
          </h1>
          <BrandLead className="max-w-2xl">
            Explore the catalog, discover services, and visit a store. Phase 1 is browse-only — no cart or checkout.
          </BrandLead>
          <div className="flex flex-wrap gap-3">
            <BrandButton href="/catalog" variant="primary">
              Browse catalog
            </BrandButton>
            <BrandButton href="/stores" variant="secondary">
              Find a store
            </BrandButton>
          </div>
        </div>
      </section>

      {featured ? (
        <section className="container py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <BrandH2>Featured collection</BrandH2>
              <BrandLead className="mt-2">{featured.title}</BrandLead>
            </div>
            <BrandButton href={`/collections/${featured.slug}`} variant="ghost">
              View collection
            </BrandButton>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}

      <BrandDivider className="container" />

      <section className="container py-16">
        <BrandH2>Services</BrandH2>
        <BrandLead className="mt-2">How we help you see better.</BrandLead>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.id} className="rounded-2xl border border-brand-border bg-brand-surface p-6">
              <h3 className="font-display text-brand-xl font-semibold text-brand-ink">{s.name}</h3>
              {s.description ? <p className="mt-2 text-brand-sm text-brand-muted-foreground">{s.description}</p> : null}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Link href="/services" className="text-brand-sm font-medium text-brand-accent-hover underline">
            All services
          </Link>
        </div>
      </section>

      <section className="border-t border-brand-border bg-brand-muted/30 py-16">
        <div className="container max-w-xl">
          <BrandH2>Newsletter</BrandH2>
          <BrandLead className="mt-2">Occasional updates — no spam.</BrandLead>
          <div className="mt-6">
            <NewsletterCapture />
          </div>
        </div>
      </section>
    </>
  )
}
