/**
 * URL query contract for `/catalog` (shareable filter state).
 * Param names: `q`, `type`, `collection`, `status`, `minPrice`, `maxPrice`, `sort`, `page`.
 */
import type { CatalogProductType, CatalogSort, CatalogStatusFilter } from '@/lib/cms/products'

export type CatalogSearchParams = {
  q?: string
  type?: CatalogProductType
  collection?: string
  status: CatalogStatusFilter
  minPrice?: string
  maxPrice?: string
  frameShape?: string
  rimType?: string
  polarized?: string
  replacementSchedule?: string
  accessoryType?: string
  sort: CatalogSort
  page: string
}

const SORT_VALUES: CatalogSort[] = [
  'newest',
  'oldest',
  'price-low-to-high',
  'price-high-to-low',
  'name-a-z',
  'name-z-a',
]

const STATUS_VALUES: CatalogStatusFilter[] = ['all', 'in-stock', 'available']
const TYPE_VALUES: CatalogProductType[] = [
  'all',
  'optical-frame',
  'sunglasses',
  'contact-soft',
  'contact-care',
  'accessory',
]

function firstString(raw: string | string[] | undefined): string | undefined {
  if (typeof raw === 'string') return raw
  if (Array.isArray(raw) && typeof raw[0] === 'string') return raw[0]
  return undefined
}

export function parseCatalogSearchParams(
  raw: Record<string, string | string[] | undefined>,
): CatalogSearchParams {
  const qRaw = firstString(raw.q)?.trim()
  const q = qRaw && qRaw.length > 0 ? qRaw : undefined

  const collectionRaw = firstString(raw.collection)?.trim()
  const collection = collectionRaw && collectionRaw.length > 0 ? collectionRaw : undefined

  const typeRaw = firstString(raw.type)?.trim()
  const type = TYPE_VALUES.includes(typeRaw as CatalogProductType) ? (typeRaw as CatalogProductType) : undefined

  const sortRaw = firstString(raw.sort)
  const sort = SORT_VALUES.includes(sortRaw as CatalogSort) ? (sortRaw as CatalogSort) : 'newest'

  const statusRaw = firstString(raw.status)
  const status = STATUS_VALUES.includes(statusRaw as CatalogStatusFilter)
    ? (statusRaw as CatalogStatusFilter)
    : 'all'

  const minPriceRaw = firstString(raw.minPrice)?.trim()
  const maxPriceRaw = firstString(raw.maxPrice)?.trim()

  const pageRaw = firstString(raw.page)
  let page = '1'
  if (pageRaw) {
    const n = Number(pageRaw)
    if (Number.isFinite(n) && n >= 1) page = String(Math.floor(n))
  }

  return {
    q,
    type,
    collection,
    status,
    minPrice: minPriceRaw && minPriceRaw.length > 0 ? minPriceRaw : undefined,
    maxPrice: maxPriceRaw && maxPriceRaw.length > 0 ? maxPriceRaw : undefined,
    frameShape: firstString(raw.frameShape) || undefined,
    rimType: firstString(raw.rimType) || undefined,
    polarized: firstString(raw.polarized) || undefined,
    replacementSchedule: firstString(raw.replacementSchedule) || undefined,
    accessoryType: firstString(raw.accessoryType) || undefined,
    sort,
    page,
  }
}

export function buildCatalogQueryString(params: CatalogSearchParams): string {
  const query = new URLSearchParams()
  if (params.q) query.set('q', params.q)
  if (params.type && params.type !== 'all') query.set('type', params.type)
  if (params.collection) query.set('collection', params.collection)
  if (params.status && params.status !== 'all') query.set('status', params.status)
  if (params.minPrice) query.set('minPrice', params.minPrice)
  if (params.maxPrice) query.set('maxPrice', params.maxPrice)
  if (params.frameShape) query.set('frameShape', params.frameShape)
  if (params.rimType) query.set('rimType', params.rimType)
  if (params.polarized) query.set('polarized', params.polarized)
  if (params.replacementSchedule) query.set('replacementSchedule', params.replacementSchedule)
  if (params.accessoryType) query.set('accessoryType', params.accessoryType)
  if (params.sort && params.sort !== 'newest') query.set('sort', params.sort)
  if (params.page && params.page !== '1') query.set('page', params.page)
  const text = query.toString()
  return text ? `?${text}` : ''
}

export type CatalogFilterChip =
  | { key: 'q'; label: string }
  | { key: 'type'; label: string }
  | { key: 'collection'; label: string; slug: string }
  | { key: 'status'; label: string }
  | { key: 'minPrice'; label: string }
  | { key: 'maxPrice'; label: string }
  | { key: 'frameShape'; label: string }
  | { key: 'rimType'; label: string }
  | { key: 'polarized'; label: string }
  | { key: 'replacementSchedule'; label: string }
  | { key: 'accessoryType'; label: string }
  | { key: 'sort'; label: string }
  | { key: 'page'; label: string }

const SORT_LABELS: Record<CatalogSort, string> = {
  newest: 'Newest',
  oldest: 'Oldest',
  'price-low-to-high': 'Price: low to high',
  'price-high-to-low': 'Price: high to low',
  'name-a-z': 'Name: A–Z',
  'name-z-a': 'Name: Z–A',
}

/**
 * Active filters to show as removable chips (non-default values only).
 */
export function getCatalogFilterChips(
  params: CatalogSearchParams,
  collectionTitleBySlug: Map<string, string>,
): CatalogFilterChip[] {
  const chips: CatalogFilterChip[] = []
  if (params.q?.trim()) chips.push({ key: 'q', label: `Search: ${params.q.trim()}` })
  if (params.type && params.type !== 'all') {
    chips.push({ key: 'type', label: `Type: ${params.type}` })
  }
  if (params.collection) {
    const title = collectionTitleBySlug.get(params.collection) ?? params.collection
    chips.push({ key: 'collection', label: `Collection: ${title}`, slug: params.collection })
  }
  if (params.status && params.status !== 'all') {
    chips.push({
      key: 'status',
      label: params.status === 'in-stock' ? 'Availability: In stock' : 'Availability: Available',
    })
  }
  if (params.minPrice) chips.push({ key: 'minPrice', label: `Min price: ${params.minPrice}` })
  if (params.maxPrice) chips.push({ key: 'maxPrice', label: `Max price: ${params.maxPrice}` })
  if (params.frameShape) chips.push({ key: 'frameShape', label: `Shape: ${params.frameShape}` })
  if (params.rimType) chips.push({ key: 'rimType', label: `Rim: ${params.rimType}` })
  if (params.polarized) chips.push({ key: 'polarized', label: `Polarized: ${params.polarized}` })
  if (params.replacementSchedule) {
    chips.push({ key: 'replacementSchedule', label: `Schedule: ${params.replacementSchedule}` })
  }
  if (params.accessoryType) chips.push({ key: 'accessoryType', label: `Accessory: ${params.accessoryType}` })
  if (params.sort && params.sort !== 'newest') {
    chips.push({ key: 'sort', label: `Sort: ${SORT_LABELS[params.sort]}` })
  }
  if (params.page && params.page !== '1') {
    chips.push({ key: 'page', label: `Page ${params.page}` })
  }
  return chips
}

export function catalogParamsWithoutChip(
  params: CatalogSearchParams,
  chip: CatalogFilterChip,
): CatalogSearchParams {
  const next: CatalogSearchParams = { ...params, page: '1' }
  switch (chip.key) {
    case 'q':
      delete next.q
      break
    case 'type':
      delete next.type
      break
    case 'collection':
      delete next.collection
      break
    case 'status':
      next.status = 'all'
      break
    case 'minPrice':
      delete next.minPrice
      break
    case 'maxPrice':
      delete next.maxPrice
      break
    case 'frameShape':
      delete next.frameShape
      break
    case 'rimType':
      delete next.rimType
      break
    case 'polarized':
      delete next.polarized
      break
    case 'replacementSchedule':
      delete next.replacementSchedule
      break
    case 'accessoryType':
      delete next.accessoryType
      break
    case 'sort':
      next.sort = 'newest'
      break
    case 'page':
      next.page = '1'
      break
    default:
      break
  }
  return next
}
