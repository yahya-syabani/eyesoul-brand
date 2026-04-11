import Image from 'next/image'
import Link from 'next/link'

import { BrandH1, BrandLead } from '@/components/brand/BrandTypography'
import { resolveBrandImage } from '@/components/brand/brandMedia'
import { getCollections } from '@/lib/cms/productCollections'

export default async function CollectionsIndexPage() {
  const collections = await getCollections({ depth: 2 })

  return (
    <section className="container py-10 md:py-14">
      <BrandH1>Collections</BrandH1>
      <BrandLead className="mt-3">Shop frames by collection — browse only in Phase 1.</BrandLead>
      {!collections.length ? (
        <p className="mt-10 text-brand-sm text-brand-muted-foreground">No collections yet.</p>
      ) : (
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => {
            const img = resolveBrandImage(c.coverImage, 'card')
            return (
              <li key={c.id}>
                <Link href={`/collections/${c.slug}`} className="group block overflow-hidden rounded-2xl border border-brand-border bg-brand-surface">
                  <div className="relative aspect-[16/10] bg-brand-muted">
                    {img ? (
                      <Image
                        src={img.src}
                        alt={img.alt || c.title}
                        fill
                        className="object-cover motion-safe:transition-transform group-hover:scale-[1.02]"
                        sizes="(min-width: 1024px) 33vw, 100vw"
                      />
                    ) : null}
                  </div>
                  <div className="p-5">
                    <h2 className="font-display text-brand-xl font-semibold text-brand-ink">{c.title}</h2>
                    {c.description ? <p className="mt-2 text-brand-sm text-brand-muted-foreground">{c.description}</p> : null}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
