import type { StoreLocatorSetting } from '@/payload-types'

import { cmsGetGlobal } from './client'

export type StoreLocatorSettingsModel = {
  enabled: boolean
  defaultCenterLat: number
  defaultCenterLng: number
  defaultZoom: number
  selectedZoom: number
  maxZoom: number
  fitBoundsPadding: number
  markerRadius: number
  markerColor: string
  selectedMarkerColor: string
  tileUrl: string
  tileAttribution: string
  scrollWheelZoom: boolean
  dragging: boolean
  touchZoom: boolean
  doubleClickZoom: boolean
  showZoomControl: boolean
  showPopupDirections: boolean
}

export const defaultStoreLocatorSettings: StoreLocatorSettingsModel = {
  enabled: true,
  defaultCenterLat: -6.2,
  defaultCenterLng: 106.816666,
  defaultZoom: 11,
  selectedZoom: 14,
  maxZoom: 18,
  fitBoundsPadding: 32,
  markerRadius: 8,
  markerColor: '#1f2937',
  selectedMarkerColor: '#2563eb',
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  tileAttribution: '&copy; OpenStreetMap contributors',
  scrollWheelZoom: true,
  dragging: true,
  touchZoom: true,
  doubleClickZoom: true,
  showZoomControl: true,
  showPopupDirections: true,
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

export function normalizeStoreLocatorSettings(
  raw: StoreLocatorSetting | null | undefined,
): StoreLocatorSettingsModel {
  if (!raw) return defaultStoreLocatorSettings

  return {
    enabled: asBoolean(raw.enabled, defaultStoreLocatorSettings.enabled),
    defaultCenterLat: asNumber(raw.defaultCenterLat, defaultStoreLocatorSettings.defaultCenterLat),
    defaultCenterLng: asNumber(raw.defaultCenterLng, defaultStoreLocatorSettings.defaultCenterLng),
    defaultZoom: asNumber(raw.defaultZoom, defaultStoreLocatorSettings.defaultZoom),
    selectedZoom: asNumber(raw.selectedZoom, defaultStoreLocatorSettings.selectedZoom),
    maxZoom: asNumber(raw.maxZoom, defaultStoreLocatorSettings.maxZoom),
    fitBoundsPadding: asNumber(raw.fitBoundsPadding, defaultStoreLocatorSettings.fitBoundsPadding),
    markerRadius: asNumber(raw.markerRadius, defaultStoreLocatorSettings.markerRadius),
    markerColor: asString(raw.markerColor, defaultStoreLocatorSettings.markerColor),
    selectedMarkerColor: asString(raw.selectedMarkerColor, defaultStoreLocatorSettings.selectedMarkerColor),
    tileUrl: asString(raw.tileUrl, defaultStoreLocatorSettings.tileUrl),
    tileAttribution: asString(raw.tileAttribution, defaultStoreLocatorSettings.tileAttribution),
    scrollWheelZoom: asBoolean(raw.scrollWheelZoom, defaultStoreLocatorSettings.scrollWheelZoom),
    dragging: asBoolean(raw.dragging, defaultStoreLocatorSettings.dragging),
    touchZoom: asBoolean(raw.touchZoom, defaultStoreLocatorSettings.touchZoom),
    doubleClickZoom: asBoolean(raw.doubleClickZoom, defaultStoreLocatorSettings.doubleClickZoom),
    showZoomControl: asBoolean(raw.showZoomControl, defaultStoreLocatorSettings.showZoomControl),
    showPopupDirections: asBoolean(raw.showPopupDirections, defaultStoreLocatorSettings.showPopupDirections),
  }
}

export async function getStoreLocatorSettings(): Promise<StoreLocatorSettingsModel> {
  const global = await cmsGetGlobal<StoreLocatorSetting>('store-locator-settings')
  return normalizeStoreLocatorSettings(global)
}
