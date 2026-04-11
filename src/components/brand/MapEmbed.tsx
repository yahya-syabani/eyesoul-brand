import { normalizeExternalUrl } from '@/lib/links'

import { BrandButton } from './BrandButton'

export type MapEmbedProps = {
  latitude: number | null | undefined
  longitude: number | null | undefined
  label: string
  mapsUrl?: string | null
}

/**
 * Provider-agnostic map region. DG-2 selects Google vs Mapbox; until then embed is optional and we fall back to mapsUrl.
 */
export function MapEmbed({ latitude, longitude, label, mapsUrl }: MapEmbedProps) {
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
        <iframe
          title={`Map: ${label}`}
          className="aspect-[16/10] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={src}
        />
      </div>
    )
  }

  if (provider === 'mapbox' && latitude != null && longitude != null && process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    const src = `https://api.mapbox.com/styles/v1/mapbox/streets-v12.html?access_token=${token}#15/${latitude}/${longitude}`
    return (
      <div className="overflow-hidden rounded-2xl border border-brand-border bg-brand-muted">
        <iframe title={`Map: ${label}`} className="aspect-[16/10] w-full border-0" loading="lazy" src={src} />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-brand-border bg-brand-muted/50 px-6 py-12 text-center">
      <p className="text-brand-sm text-brand-muted-foreground">
        Map preview unavailable. Open in your maps app to get directions.
      </p>
      {normalizedMaps ? (
        <BrandButton href={normalizedMaps} variant="primary">
          Open {label} in Maps
        </BrandButton>
      ) : latitude != null && longitude != null ? (
        <BrandButton
          href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
          variant="primary"
        >
          Open in Google Maps
        </BrandButton>
      ) : null}
    </div>
  )
}
