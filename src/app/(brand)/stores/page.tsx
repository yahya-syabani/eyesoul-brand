import { StoresLocator } from '@/components/brand/StoresLocator'
import { BrandH1, BrandLead } from '@/components/brand/BrandTypography'
import { getStores, getStoresCompletenessReport } from '@/lib/cms/stores'
import { getStoreLocatorSettings } from '@/lib/cms/storeLocatorSettings'

type Search = Record<string, string | string[] | undefined>

function firstString(v: string | string[] | undefined): string | undefined {
  if (typeof v === 'string') return v
  if (Array.isArray(v) && typeof v[0] === 'string') return v[0]
  return undefined
}

export default async function StoresPage({ searchParams }: { searchParams: Promise<Search> }) {
  const raw = await searchParams
  const cityFilter = firstString(raw.city)?.trim()
  const regionFilter = firstString(raw.region)?.trim()
  const openNowFilter = firstString(raw.openNow)?.trim() === '1'
  const view = firstString(raw.view) === 'map' ? 'map' : 'list'

  const allStores = await getStores({ limit: 200, depth: 2 })
  const locatorSettings = await getStoreLocatorSettings()
  const completeness = getStoresCompletenessReport(allStores)

  if (
    process.env.NODE_ENV !== 'production' &&
    (completeness.missingCoordinates || completeness.missingMapsUrl || completeness.missingHours)
  ) {
    console.warn('Stores completeness report:', completeness)
  }

  return (
    <section className="container py-10 md:py-14">
      <BrandH1>Stores</BrandH1>
      <BrandLead className="mt-3">Visit us in person — hours and directions below.</BrandLead>
      <StoresLocator
        stores={allStores}
        locatorSettings={locatorSettings}
        initialCity={cityFilter}
        initialRegion={regionFilter}
        initialOpenNow={openNowFilter}
        initialView={view}
      />
    </section>
  )
}
