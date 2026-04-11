import Image from 'next/image'

import { BrandH1, BrandLead } from '@/components/brand/BrandTypography'
import { resolveBrandImage } from '@/components/brand/brandMedia'
import { getServices } from '@/lib/cms/services'

export default async function ServicesPage() {
  const services = await getServices({ depth: 2 })

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
            return (
              <li key={s.id} className="flex gap-6 rounded-2xl border border-brand-border bg-brand-surface p-6">
                {icon ? (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-brand-border bg-brand-muted">
                    <Image src={icon.src} alt={icon.alt || s.name} fill className="object-cover" sizes="80px" />
                  </div>
                ) : null}
                <div>
                  <h2 className="font-display text-brand-2xl font-semibold text-brand-ink">{s.name}</h2>
                  {s.description ? <p className="mt-2 text-brand-sm text-brand-muted-foreground">{s.description}</p> : null}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
