import type { Store } from '@/payload-types'

import { cmsFind } from './client'
import type { WhereClause } from './client'
import { mergePublishedWhere } from './published'

export type GetStoresOptions = {
  limit?: number
  depth?: number
  /** Exact match on `city` (optional storefront filter). */
  city?: string
  /** Exact match on `region` (optional storefront filter). */
  region?: string
}

export async function getStores(options: GetStoresOptions = {}): Promise<Store[]> {
  const and: WhereClause[] = []
  const city = options.city?.trim()
  const region = options.region?.trim()
  if (city) and.push({ city: { equals: city } })
  if (region) and.push({ region: { equals: region } })

  const where = await mergePublishedWhere(and.length ? { and } : {})
  const res = await cmsFind<Store>('stores', {
    where,
    limit: options.limit ?? 100,
    sort: 'name',
    depth: options.depth ?? 2,
  })
  return res.docs
}

export function getStoresCompletenessReport(stores: Store[]) {
  const missingCoordinates = stores.filter((store) => store.latitude == null || store.longitude == null).length
  const missingMapsUrl = stores.filter((store) => !store.mapsUrl).length
  const missingHours = stores.filter((store) => !store.hours?.length).length

  return {
    total: stores.length,
    missingCoordinates,
    missingMapsUrl,
    missingHours,
  }
}

