'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { capturePosthogEvent } from '@/lib/analytics/posthog'
import { cn } from '@/lib/cn'
import type { StoreLocatorSettingsModel } from '@/lib/cms/storeLocatorSettings'
import { distanceKmBetweenPoints, formatDistanceKm } from '@/lib/stores/distance'
import { isStoreOpenAtDate } from '@/lib/stores/hours'
import type { Store } from '@/payload-types'

import { BrandButton } from './BrandButton'
import { MapEmbed } from './MapEmbed'
import { StoreCard } from './StoreCard'

const StoresInteractiveMap = dynamic(
  () => import('./StoresInteractiveMap').then((mod) => mod.StoresInteractiveMap),
  { ssr: false },
)

type StoresLocatorProps = {
  stores: Store[]
  locatorSettings: StoreLocatorSettingsModel
  initialCity?: string
  initialRegion?: string
  initialOpenNow?: boolean
  initialView?: 'list' | 'map'
}

type GeoLocation = {
  latitude: number
  longitude: number
}

function sortUnique(items: Array<string | null | undefined>): string[] {
  return [...new Set(items.filter(Boolean))].sort((a, b) => a!.localeCompare(b!)) as string[]
}

export function StoresLocator({
  stores,
  locatorSettings,
  initialCity,
  initialRegion,
  initialOpenNow = false,
  initialView = 'list',
}: StoresLocatorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [city, setCity] = useState(initialCity ?? '')
  const [region, setRegion] = useState(initialRegion ?? '')
  const [openNowOnly, setOpenNowOnly] = useState(initialOpenNow)
  const [mobileView, setMobileView] = useState<'list' | 'map'>(initialView)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [userLocation, setUserLocation] = useState<GeoLocation | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)

  const cities = useMemo(() => sortUnique(stores.map((s) => s.city)), [stores])
  const regions = useMemo(() => sortUnique(stores.map((s) => s.region)), [stores])

  const filteredStores = useMemo(() => {
    const now = new Date()
    const base = stores.filter((store) => {
      if (city && store.city !== city) return false
      if (region && store.region !== region) return false
      if (openNowOnly && !isStoreOpenAtDate(store, now)) return false
      return true
    })

    if (!userLocation) return base
    return [...base].sort((a, b) => {
      if (a.latitude == null || a.longitude == null) return 1
      if (b.latitude == null || b.longitude == null) return -1
      const aDistance = distanceKmBetweenPoints(userLocation, {
        latitude: a.latitude,
        longitude: a.longitude,
      })
      const bDistance = distanceKmBetweenPoints(userLocation, {
        latitude: b.latitude,
        longitude: b.longitude,
      })
      return aDistance - bDistance
    })
  }, [stores, city, region, openNowOnly, userLocation])

  useEffect(() => {
    if (!filteredStores.length) {
      setSelectedId(null)
      return
    }
    setSelectedId((current) => {
      if (current && filteredStores.some((store) => store.id === current)) return current
      return filteredStores[0]?.id ?? null
    })
  }, [filteredStores])

  useEffect(() => {
    const next = new URLSearchParams(searchParams.toString())
    if (city) next.set('city', city)
    else next.delete('city')
    if (region) next.set('region', region)
    else next.delete('region')
    if (openNowOnly) next.set('openNow', '1')
    else next.delete('openNow')
    if (mobileView !== 'list') next.set('view', mobileView)
    else next.delete('view')

    const currentQuery = searchParams.toString()
    const nextQuery = next.toString()
    if (currentQuery === nextQuery) return

    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname
    const timeout = window.setTimeout(() => {
      router.replace(nextUrl, { scroll: false })
    }, 150)

    return () => window.clearTimeout(timeout)
  }, [city, region, openNowOnly, mobileView, pathname, router, searchParams])

  const selectedStore = useMemo(
    () => filteredStores.find((store) => store.id === selectedId) ?? filteredStores[0],
    [filteredStores, selectedId],
  )

  async function useMyLocation() {
    if (!navigator.geolocation) return
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        setUserLocation(coords)
        setGeoLoading(false)
        capturePosthogEvent('stores_search', {
          method: 'geolocation',
          latitude: Number(coords.latitude.toFixed(5)),
          longitude: Number(coords.longitude.toFixed(5)),
        })
      },
      () => setGeoLoading(false),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 120000 },
    )
  }

  function distanceLabelFor(store: Store): string | null {
    if (!userLocation || store.latitude == null || store.longitude == null) return null
    const km = distanceKmBetweenPoints(userLocation, { latitude: store.latitude, longitude: store.longitude })
    return formatDistanceKm(km)
  }

  return (
    <>
      <div className="mt-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-brand-muted-foreground">Filter by city:</span>
          <button
            type="button"
            onClick={() => setCity('')}
            className={cn(
              'rounded-full px-3 py-1 text-sm font-medium',
              !city ? 'bg-brand-ink text-white' : 'border border-brand-border hover:bg-brand-muted',
            )}
          >
            All
          </button>
          {cities.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setCity(item)
                capturePosthogEvent('stores_filter', { filter: 'city', value: item })
              }}
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium',
                city === item ? 'bg-brand-ink text-white' : 'border border-brand-border hover:bg-brand-muted',
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="sticky top-16 z-20 rounded-2xl border border-brand-border bg-brand-surface/95 p-3 backdrop-blur">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={region}
              onChange={(event) => {
                setRegion(event.target.value)
                capturePosthogEvent('stores_filter', { filter: 'region', value: event.target.value || 'all' })
              }}
              className="rounded-md border border-brand-border bg-brand-surface px-3 py-2 text-brand-sm text-brand-ink"
            >
              <option value="">All regions</option>
              {regions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                const nextValue = !openNowOnly
                setOpenNowOnly(nextValue)
                capturePosthogEvent('stores_filter', { filter: 'openNow', value: nextValue })
              }}
              className={cn(
                'rounded-md border px-3 py-2 text-brand-sm font-medium',
                openNowOnly
                  ? 'border-brand-ink bg-brand-ink text-brand-surface'
                  : 'border-brand-border bg-brand-surface text-brand-ink',
              )}
            >
              Open now
            </button>

            <BrandButton variant="secondary" onClick={useMyLocation} disabled={geoLoading}>
              {geoLoading ? 'Locating...' : 'Use my location'}
            </BrandButton>

            <span className="ml-auto text-brand-sm text-brand-muted-foreground">
              {filteredStores.length} {filteredStores.length === 1 ? 'location' : 'locations'}
            </span>
          </div>

          <div className="mt-3 flex gap-2 md:hidden">
            {(['list', 'map'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMobileView(value)}
                className={cn(
                  'flex-1 rounded-md border px-3 py-2 text-brand-sm font-medium capitalize',
                  mobileView === value
                    ? 'border-brand-ink bg-brand-ink text-brand-surface'
                    : 'border-brand-border bg-brand-surface text-brand-ink',
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_1fr]">
        <section className={cn(mobileView === 'map' ? 'hidden md:block' : 'block')}>
          <h2 className="font-display text-brand-xl font-semibold text-brand-ink">All locations</h2>
          {!filteredStores.length ? (
            <p className="mt-6 text-brand-sm text-brand-muted-foreground">
              No stores match your filters yet. Try clearing city, region, or open-now.
            </p>
          ) : (
            <ul className="mt-6 space-y-4">
              {filteredStores.map((store) => (
                <li key={store.id}>
                  <StoreCard
                    store={store}
                    selected={selectedStore?.id === store.id}
                    distanceLabel={distanceLabelFor(store)}
                    onSelect={() => {
                      setSelectedId(store.id)
                      setMobileView('map')
                      capturePosthogEvent('stores_select', { storeId: store.id, storeName: store.name })
                    }}
                    onDirectionsClick={() =>
                      capturePosthogEvent('stores_directions_click', { storeId: store.id, storeName: store.name })
                    }
                    onWhatsAppClick={() =>
                      capturePosthogEvent('stores_whatsapp_click', { storeId: store.id, storeName: store.name })
                    }
                    onContactClick={() =>
                      capturePosthogEvent('stores_contact_click', { storeId: store.id, storeName: store.name })
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={cn(mobileView === 'list' ? 'hidden md:block' : 'block')}>
          <h2 className="font-display text-brand-xl font-semibold text-brand-ink">Map</h2>
          {selectedStore ? (
            <div className="mt-4">
              {locatorSettings.enabled && filteredStores.some((store) => store.latitude != null && store.longitude != null) ? (
                <StoresInteractiveMap
                  stores={filteredStores}
                  settings={locatorSettings}
                  selectedStoreId={selectedStore.id}
                  onSelectStore={(storeId) => {
                    setSelectedId(storeId)
                    const store = filteredStores.find((item) => item.id === storeId)
                    if (store) {
                      capturePosthogEvent('stores_select', { source: 'map', storeId: store.id, storeName: store.name })
                    }
                  }}
                  onOpenDirections={(store) =>
                    capturePosthogEvent('stores_directions_click', {
                      source: 'map',
                      storeId: store.id,
                      storeName: store.name,
                    })
                  }
                />
              ) : (
                <MapEmbed
                  latitude={selectedStore.latitude}
                  longitude={selectedStore.longitude}
                  label={selectedStore.name}
                  mapsUrl={selectedStore.mapsUrl}
                  contextLabel={`Selected location: ${selectedStore.name}${selectedStore.city ? `, ${selectedStore.city}` : ''}`}
                  onOpenMapClick={() =>
                    capturePosthogEvent('stores_directions_click', {
                      source: 'map',
                      storeId: selectedStore.id,
                      storeName: selectedStore.name,
                    })
                  }
                />
              )}
            </div>
          ) : (
            <p className="mt-6 text-brand-sm text-brand-muted-foreground">No map available without a selected store.</p>
          )}
        </section>
      </div>
    </>
  )
}
