import Image from 'next/image'

import { BrandButton } from '@/components/brand/BrandButton'
import { BrandH1, BrandLead } from '@/components/brand/BrandTypography'
import { resolveBrandImage } from '@/components/brand/brandMedia'
import { getServices } from '@/lib/cms/services'
import { getStores } from '@/lib/cms/stores'
import { normalizeExternalUrl } from '@/lib/links'
import Link from 'next/link'

export default async function ServicesPage() {
  const [services, stores] = await Promise.all([getServices({ depth: 2 }), getStores({ limit: 5, depth: 1 })])
  const fallbackPhone = stores.map((s) => s.phone).find(Boolean)

  return (
    <section className="container py-10 md:py-14">
      <BrandH1>Services</BrandH1>
      <BrandLead className="mt-3">Professional vision care and in-store experiences.</BrandLead>
      {!services.length ? (
        <p className="mt-10 text-brand-sm text-brand-muted-foreground">No services published yet.</p>
      ) : (
        <ul className="mt-10 grid gap-10 md:grid-cols-2">
          {services.map((s) => {
            const icon = resolveBrandImage(s.icon, 'card')
            const bookingHref = s.bookingUrl ? normalizeExternalUrl(s.bookingUrl) || s.bookingUrl : ''
            const phone = s.bookingPhone || fallbackPhone
            const tel = phone ? `tel:${phone.replace(/\s/g, '')}` : ''
            const primaryLabel = s.primaryCtaLabel?.trim() || 'Book appointment'

            return (
              <li key={s.id} className="flex flex-col gap-6 rounded-2xl border border-brand-border bg-brand-surface p-6 md:flex-row">
                {icon ? (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-brand-border bg-brand-muted">
                    <Image src={icon.src} alt={icon.alt || s.name} fill className="object-cover" sizes="80px" />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-brand-2xl font-semibold text-brand-ink">{s.name}</h2>
                  {s.description ? <p className="mt-2 text-brand-sm text-brand-muted-foreground">{s.description}</p> : null}
                  <div className="mt-6 flex flex-wrap gap-3">
                    {bookingHref ? (
                      <BrandButton href={bookingHref} variant="primary">
                        {primaryLabel}
                      </BrandButton>
                    ) : tel ? (
                      <BrandButton href={tel} variant="primary">
                        {primaryLabel}
                      </BrandButton>
                    ) : (
                      <BrandButton href="/stores" variant="primary">
                        Find a store
                      </BrandButton>
                    )}
                    {tel ? (
                      <BrandButton href={tel} variant="secondary">
                        Call
                      </BrandButton>
                    ) : null}
                    <Link href="/stores" className="self-center text-brand-sm font-medium text-brand-accent-hover underline">
                      Store locator
                    </Link>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
