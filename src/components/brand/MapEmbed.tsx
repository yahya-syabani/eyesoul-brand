'use client'

import { normalizeExternalUrl } from '@/lib/links'

import { BrandButton } from './BrandButton'

export type MapEmbedProps = {
  latitude: number | null | undefined
  longitude: number | null | undefined
  label: string
  mapsUrl?: string | null
  contextLabel?: string
  onOpenMapClick?: () => void
}

/**
 * Provider-agnostic map region. DG-2 selects Google vs Mapbox; until then embed is optional and we fall back to mapsUrl.
 */
export function MapEmbed({ latitude, longitude, label, mapsUrl, contextLabel, onOpenMapClick }: MapEmbedProps) {
  const normalizedMaps = normalizeExternalUrl(mapsUrl)
  const provider = process.env.NEXT_PUBLIC_MAP_PROVIDER

  const canEmbed =
    provider === 'google' &&
    latitude != null &&
    longitude != null &&
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (canEmbed) {
    const src = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${latitude},${longitude}&zoom=14`
    return (
      <div className="overflow-hidden rounded-2xl border border-brand-border bg-brand-muted">
        {contextLabel ? (
          <div className="border-b border-brand-border/70 bg-brand-surface px-4 py-3 text-brand-sm text-brand-muted-foreground">
            {contextLabel}
          </div>
        ) : null}
        <iframe
          title={`Map: ${label}`}
          className="aspect-16/10 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={src}
        />
      </div>
    )
  }

  if (
    provider === 'mapbox' &&
    latitude != null &&
    longitude != null &&
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  ) {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    const style = 'mapbox/streets-v12'
    const zoom = 15
    const width = 800
    const height = 500
    const marker = `pin-s+brand-blue(${longitude},${latitude})` // Simple marker
    const src = `https://api.mapbox.com/styles/v1/${style}/static/${marker}/${longitude},${latitude},${zoom}/${width}x${height}@2x?access_token=${token}`

    return (
      <div className="relative overflow-hidden rounded-2xl border border-brand-border bg-brand-muted">
        <a
          href={normalizedMaps || `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
          onClick={onOpenMapClick}
        >
          <img
            src={src}
            alt={`Map location of ${label}`}
            className="aspect-16/10 w-full object-cover transition-opacity group-hover:opacity-90"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <div className="rounded-full bg-brand-ink/90 px-4 py-2 text-brand-xs font-medium text-brand-surface shadow-xl">
              View on larger map
            </div>
          </div>
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-brand-border bg-brand-muted/50 px-6 py-12 text-center">
      {contextLabel ? (
        <p className="text-brand-sm font-medium text-brand-ink">{contextLabel}</p>
      ) : null}
      <p className="text-brand-sm text-brand-muted-foreground">
        Interactive map preview is unavailable right now. Open your maps app for live directions.
      </p>
      {normalizedMaps ? (
        <BrandButton href={normalizedMaps} variant="primary" onClick={onOpenMapClick}>
          Open {label} in Maps
        </BrandButton>
      ) : latitude != null && longitude != null ? (
        <BrandButton
          href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
          variant="primary"
          onClick={onOpenMapClick}
        >
          Open in Google Maps
        </BrandButton>
      ) : null}
    </div>
  )
}
