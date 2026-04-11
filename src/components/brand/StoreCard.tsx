import Link from 'next/link'

import { normalizeExternalUrl } from '@/lib/links'
import type { Store } from '@/payload-types'

import { BrandButton } from './BrandButton'
import { BrandH3 } from './BrandTypography'

const dayLabels: Record<string, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
}

export function StoreCard({ store }: { store: Store }) {
  const maps = normalizeExternalUrl(store.mapsUrl)
  const wa = normalizeExternalUrl(store.whatsApp)

  return (
    <article className="flex flex-col rounded-2xl border border-brand-border bg-brand-surface p-6">
      <BrandH3 className="!text-brand-xl">{store.name}</BrandH3>
      <p className="mt-2 text-brand-sm text-brand-muted-foreground whitespace-pre-line">
        {store.address}
        {store.city ? `\n${store.city}` : ''}
      </p>
      {store.phone ? (
        <p className="mt-3 text-brand-sm">
          <span className="text-brand-muted-foreground">Phone: </span>
          <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="text-brand-ink underline hover:text-brand-accent-hover">
            {store.phone}
          </a>
        </p>
      ) : null}
      {store.email ? (
        <p className="mt-1 text-brand-sm">
          <span className="text-brand-muted-foreground">Email: </span>
          <a href={`mailto:${store.email}`} className="text-brand-ink underline hover:text-brand-accent-hover">
            {store.email}
          </a>
        </p>
      ) : null}
      {store.hours?.length ? (
        <ul className="mt-4 space-y-1 text-brand-xs text-brand-muted-foreground" aria-label="Opening hours">
          {store.hours.map((h) => (
            <li key={`${h.day}-${h.id ?? ''}`}>
              {dayLabels[h.day] ?? h.day}: {h.open ?? '—'} – {h.close ?? '—'}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-2">
        {maps ? (
          <BrandButton href={maps} variant="secondary">
            Directions
          </BrandButton>
        ) : null}
        {wa ? (
          <BrandButton href={wa} variant="primary">
            WhatsApp
          </BrandButton>
        ) : null}
        <Link href="/contact" className="text-brand-sm font-medium text-brand-accent-hover underline">
          Contact page
        </Link>
      </div>
    </article>
  )
}
