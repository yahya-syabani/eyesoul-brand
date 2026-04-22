'use client'

import Link from 'next/link'

import { normalizeExternalUrl } from '@/lib/links'
import { cn } from '@/lib/cn'
import { getStoreHoursLabelForDate, isStoreOpenAtDate } from '@/lib/stores/hours'
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

type StoreCardProps = {
  store: Store
  selected?: boolean
  distanceLabel?: string | null
  onSelect?: () => void
  onDirectionsClick?: () => void
  onWhatsAppClick?: () => void
  onContactClick?: () => void
}

export function StoreCard({
  store,
  selected = false,
  distanceLabel,
  onSelect,
  onDirectionsClick,
  onWhatsAppClick,
  onContactClick,
}: StoreCardProps) {
  const maps = normalizeExternalUrl(store.mapsUrl)
  const wa = normalizeExternalUrl(store.whatsApp)
  const now = new Date()
  const isOpenNow = isStoreOpenAtDate(store, now)
  const todayHours = getStoreHoursLabelForDate(store, now)
  const locationLine = [store.city, store.region].filter(Boolean).join(', ')
  const hoursPreview = store.hours?.slice(0, 3) ?? []

  return (
    <article
      className={cn(
        'group relative overflow-hidden rounded-3xl border bg-brand-surface p-5 shadow-sm transition-all md:p-6',
        selected
          ? 'border-brand-ink ring-1 ring-brand-ink/20 shadow-md'
          : 'border-brand-border hover:-translate-y-0.5 hover:shadow-md',
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-brand-muted/50 to-transparent" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <BrandH3 className="text-brand-xl! leading-tight">{store.name}</BrandH3>
          {locationLine ? <p className="mt-1 text-brand-xs text-brand-muted-foreground">{locationLine}</p> : null}
        </div>
        <span
          className={cn(
            'inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide',
            isOpenNow ? 'bg-emerald-100 text-emerald-800' : 'bg-brand-muted text-brand-muted-foreground',
          )}
        >
          {isOpenNow ? 'OPEN NOW' : 'CLOSED'}
        </span>
      </div>

      <p className="relative mt-4 text-brand-sm leading-relaxed text-brand-muted-foreground">{store.address}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-brand-border bg-brand-surface px-2.5 py-1 text-brand-xs text-brand-muted-foreground">
          Today: {todayHours}
        </span>
        {distanceLabel ? (
          <span className="rounded-full border border-brand-border bg-brand-surface px-2.5 py-1 text-brand-xs text-brand-muted-foreground">
            {distanceLabel}
          </span>
        ) : null}
      </div>

      {(store.phone || store.email) && (
        <dl className="mt-4 grid gap-2 rounded-2xl border border-brand-border/70 bg-brand-muted/40 p-3">
          {store.phone ? (
            <div className="flex items-center justify-between gap-2 text-brand-sm">
              <dt className="text-brand-muted-foreground">Phone</dt>
              <dd>
                <a
                  href={`tel:${store.phone.replace(/\s/g, '')}`}
                  className="font-medium text-brand-ink underline decoration-brand-border underline-offset-2 hover:text-brand-accent-hover"
                >
                  {store.phone}
                </a>
              </dd>
            </div>
          ) : null}
          {store.email ? (
            <div className="flex items-center justify-between gap-2 text-brand-sm">
              <dt className="text-brand-muted-foreground">Email</dt>
              <dd>
                <a
                  href={`mailto:${store.email}`}
                  className="font-medium text-brand-ink underline decoration-brand-border underline-offset-2 hover:text-brand-accent-hover"
                >
                  {store.email}
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      )}

      {hoursPreview.length > 0 ? (
        <ul className="mt-4 grid gap-1.5 text-brand-xs text-brand-muted-foreground" aria-label="Opening hours">
          {hoursPreview.map((h) => (
            <li
              key={`${h.day}-${h.id ?? ''}`}
              className="flex items-center justify-between rounded-lg border border-brand-border/60 bg-brand-surface px-2.5 py-1.5"
            >
              <span className="font-medium text-brand-ink">{dayLabels[h.day] ?? h.day}</span>
              <span>
                {h.open ?? '—'} - {h.close ?? '—'}
              </span>
            </li>
          ))}
          {store.hours && store.hours.length > 3 ? (
            <li className="px-1 text-[11px] text-brand-muted-foreground">+ {store.hours.length - 3} more days</li>
          ) : null}
        </ul>
      ) : null}

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {maps ? (
          <BrandButton
            href={maps}
            variant="primary"
            onClick={onDirectionsClick}
            className="w-full rounded-xl py-3 font-semibold shadow-sm"
          >
            Directions
          </BrandButton>
        ) : null}
        {wa ? (
          <BrandButton
            href={wa}
            variant="secondary"
            onClick={onWhatsAppClick}
            className="w-full rounded-xl border-emerald-200 bg-emerald-50 py-3 font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-200 dark:hover:bg-emerald-900/40"
          >
            WhatsApp
          </BrandButton>
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-xl border border-brand-border bg-brand-surface px-3 py-2.5 text-brand-sm font-medium text-brand-ink hover:bg-brand-muted"
          onClick={onContactClick}
        >
          Contact page
        </Link>
        {onSelect ? (
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-brand-border bg-brand-surface px-3 py-2.5 text-brand-sm font-medium text-brand-ink hover:bg-brand-muted"
            onClick={onSelect}
          >
            View on map
          </button>
        ) : null}
      </div>
    </article>
  )
}
