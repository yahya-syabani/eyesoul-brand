import { MapEmbed } from '@/components/brand/MapEmbed'
import { StoreCard } from '@/components/brand/StoreCard'
import { BrandH1, BrandLead } from '@/components/brand/BrandTypography'
import { getStores } from '@/lib/cms/stores'
import Link from 'next/link'

type Search = Record<string, string | string[] | undefined>

function firstString(v: string | string[] | undefined): string | undefined {
  if (typeof v === 'string') return v
  if (Array.isArray(v) && typeof v[0] === 'string') return v[0]
  return undefined
}

export default async function StoresPage({ searchParams }: { searchParams: Promise<Search> }) {
  const raw = await searchParams
  const cityFilter = firstString(raw.city)?.trim()

  const allStores = await getStores({ limit: 200, depth: 2 })
  const cities = [...new Set(allStores.map((s) => s.city).filter(Boolean))].sort() as string[]
  const stores = cityFilter ? allStores.filter((s) => s.city === cityFilter) : allStores
  const primary = stores[0] ?? allStores[0]

  return (
    <section className="container py-10 md:py-14">
      <BrandH1>Stores</BrandH1>
      <BrandLead className="mt-3">Visit us in person — hours and directions below.</BrandLead>

      {cities.length > 0 ? (
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="text-sm text-brand-muted-foreground">Filter by city:</span>
          <Link
            href="/stores"
            className={`rounded-full px-3 py-1 text-sm font-medium ${!cityFilter ? 'bg-brand-ink text-white' : 'border border-brand-border hover:bg-brand-muted'}`}
          >
            All
          </Link>
          {cities.map((city) => (
            <Link
              key={city}
              href={`/stores?city=${encodeURIComponent(city)}`}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                cityFilter === city ? 'bg-brand-ink text-white' : 'border border-brand-border hover:bg-brand-muted'
              }`}
            >
              {city}
            </Link>
          ))}
        </div>
      ) : null}

      {primary ? (
        <div className="mt-10">
          <h2 className="font-display text-brand-xl font-semibold text-brand-ink">Map</h2>
          <div className="mt-4 max-w-4xl">
            <MapEmbed
              latitude={primary.latitude}
              longitude={primary.longitude}
              label={primary.name}
              mapsUrl={primary.mapsUrl}
            />
          </div>
        </div>
      ) : null}
      <div className="mt-16">
        <h2 className="font-display text-brand-xl font-semibold text-brand-ink">All locations</h2>
        {!stores.length ? (
          <p className="mt-6 text-brand-sm text-brand-muted-foreground">
            {cityFilter ? 'No stores in this city.' : 'No stores published yet.'}
          </p>
        ) : (
          <ul className="mt-8 grid gap-8 lg:grid-cols-2">
            {stores.map((s) => (
              <li key={s.id}>
                <StoreCard store={s} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
