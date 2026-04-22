'use client'

import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'

import type { StoreLocatorSettingsModel } from '@/lib/cms/storeLocatorSettings'
import type { Store } from '@/payload-types'

type StoresInteractiveMapProps = {
  stores: Store[]
  settings: StoreLocatorSettingsModel
  selectedStoreId?: number | null
  onSelectStore?: (storeId: number) => void
  onOpenDirections?: (store: Store) => void
}

const DEFAULT_CENTER: [number, number] = [-6.2, 106.816666]

function asFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

function storesWithCoordinates(stores: Store[]) {
  return stores
    .map((store) => {
      const latitude = asFiniteNumber(store.latitude)
      const longitude = asFiniteNumber(store.longitude)
      if (latitude == null || longitude == null) return null
      return { store, latitude, longitude }
    })
    .filter(Boolean) as Array<{ store: Store; latitude: number; longitude: number }>
}

function markerIcon(color: string, radius: number) {
  const size = Math.max(8, Math.round(radius * 2))
  return L.divIcon({
    className: 'stores-marker',
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></span>`,
    iconSize: [size, size],
    iconAnchor: [Math.round(size / 2), Math.round(size / 2)],
  })
}

function FitBounds({
  stores,
  selectedStoreId,
  selectedZoom,
  fitBoundsPadding,
  maxZoom,
}: {
  stores: Array<{ store: Store; latitude: number; longitude: number }>
  selectedStoreId?: number | null
  selectedZoom: number
  fitBoundsPadding: number
  maxZoom: number
}) {
  const map = useMap()

  const selected = useMemo(
    () => stores.find((entry) => entry.store.id === selectedStoreId),
    [stores, selectedStoreId],
  )

  useEffect(() => {
    if (!stores.length) return

    if (selected) {
      map.flyTo([selected.latitude, selected.longitude], selectedZoom, { duration: 0.35 })
      return
    }

    if (stores.length === 1) {
      const first = stores[0]
      map.setView([first.latitude, first.longitude], selectedZoom)
      return
    }

    const bounds = stores.map((entry) => [entry.latitude, entry.longitude] as [number, number])

    if (bounds.length) {
      map.fitBounds(bounds, { padding: [fitBoundsPadding, fitBoundsPadding], maxZoom })
    }
  }, [fitBoundsPadding, map, maxZoom, selected, selectedZoom, stores])

  return null
}

export function StoresInteractiveMap({
  stores,
  settings,
  selectedStoreId,
  onSelectStore,
  onOpenDirections,
}: StoresInteractiveMapProps) {
  const mappableStores = useMemo(() => storesWithCoordinates(stores), [stores])
  const defaultIcon = useMemo(() => markerIcon(settings.markerColor, settings.markerRadius), [settings.markerColor, settings.markerRadius])
  const selectedIcon = useMemo(
    () => markerIcon(settings.selectedMarkerColor, settings.markerRadius + 2),
    [settings.markerRadius, settings.selectedMarkerColor],
  )

  if (!mappableStores.length) return null

  const selected = mappableStores.find((entry) => entry.store.id === selectedStoreId) ?? mappableStores[0]
  const center: LatLngExpression =
    selected
      ? [selected.latitude, selected.longitude]
      : [settings.defaultCenterLat ?? DEFAULT_CENTER[0], settings.defaultCenterLng ?? DEFAULT_CENTER[1]]

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-border bg-brand-muted">
      <MapContainer
        center={center}
        zoom={settings.defaultZoom}
        className="aspect-16/10 w-full"
        scrollWheelZoom={settings.scrollWheelZoom}
        dragging={settings.dragging}
        touchZoom={settings.touchZoom}
        doubleClickZoom={settings.doubleClickZoom}
        zoomControl={settings.showZoomControl}
      >
        <TileLayer
          attribution={settings.tileAttribution}
          url={settings.tileUrl}
        />
        {mappableStores.map(({ store, latitude, longitude }) => (
          <Marker
            key={store.id}
            position={[latitude, longitude]}
            icon={store.id === selectedStoreId ? selectedIcon : defaultIcon}
            eventHandlers={{
              click: () => {
                if (onSelectStore) onSelectStore(store.id)
              },
            }}
          >
            <Popup>
              <div className="space-y-1">
                <p className="font-medium">{store.name}</p>
                {store.city ? <p className="text-xs text-neutral-600">{store.city}</p> : null}
                {settings.showPopupDirections && store.mapsUrl ? (
                  <a
                    className="text-xs font-medium text-blue-600 underline"
                    href={store.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onOpenDirections?.(store)}
                  >
                    Directions
                  </a>
                ) : null}
              </div>
            </Popup>
          </Marker>
        ))}
        <FitBounds
          stores={mappableStores}
          selectedStoreId={selectedStoreId}
          selectedZoom={settings.selectedZoom}
          fitBoundsPadding={settings.fitBoundsPadding}
          maxZoom={settings.maxZoom}
        />
      </MapContainer>
    </div>
  )
}
