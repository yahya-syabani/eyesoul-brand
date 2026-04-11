import { MapEmbed } from '@/components/brand/MapEmbed'
import { StoreCard } from '@/components/brand/StoreCard'
import { BrandH1, BrandLead } from '@/components/brand/BrandTypography'
import { getStores } from '@/lib/cms/stores'

export default async function StoresPage() {
  const stores = await getStores()
  const primary = stores[0]

  return (
    <section className="container py-10 md:py-14">
      <BrandH1>Stores</BrandH1>
      <BrandLead className="mt-3">Visit us in person — hours and directions below.</BrandLead>
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
          <p className="mt-6 text-brand-sm text-brand-muted-foreground">No stores published yet.</p>
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
