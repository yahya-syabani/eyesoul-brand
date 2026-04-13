import type { Product } from '@/payload-types'

import { cmsFind } from './client'
import type { WhereClause } from './client'
import { mergePublishedWhere } from './published'

export type CatalogSort = 'newest' | 'oldest' | 'price-low-to-high' | 'price-high-to-low' | 'name-a-z' | 'name-z-a'

export type CatalogStatusFilter = 'all' | 'in-stock' | 'available'

export type CatalogProductFilters = {
  q?: string
  collectionId?: number
  minPrice?: number
  maxPrice?: number
  status?: CatalogStatusFilter
  page?: number
  limit?: number
  sort?: CatalogSort
  depth?: number
}

export type CatalogProductsResult = {
  docs: Product[]
  totalDocs: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

function resolveCatalogSort(sort: CatalogSort | undefined): string {
  switch (sort) {
    case 'oldest':
      return 'createdAt'
    case 'price-low-to-high':
      return 'price'
    case 'price-high-to-low':
      return '-price'
    case 'name-a-z':
      return 'name'
    case 'name-z-a':
      return '-name'
    case 'newest':
    default:
      return '-updatedAt'
  }
}

function normalizeFiniteNumber(value: number | undefined): number | undefined {
  if (value == null || Number.isNaN(value) || !Number.isFinite(value)) return undefined
  return value
}

function normalizeSearchTerm(value: string | undefined): string | undefined {
  if (!value) return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export async function getProductBySlug(
  slug: string,
  options: { depth?: number } = {},
): Promise<Product | null> {
  const where = await mergePublishedWhere({ slug: { equals: slug } })
  const res = await cmsFind<Product>('products', {
    where,
    limit: 1,
    depth: options.depth ?? 2,
  })
  return res.docs[0] ?? null
}

export async function getCatalogProducts(
  filters: CatalogProductFilters = {},
): Promise<CatalogProductsResult> {
  const and: WhereClause[] = []

  if (filters.collectionId != null) {
    and.push({ collection: { equals: filters.collectionId } })
  }

  const minPrice = normalizeFiniteNumber(filters.minPrice)
  if (minPrice != null) {
    and.push({ price: { greater_than_equal: minPrice } })
  }

  const maxPrice = normalizeFiniteNumber(filters.maxPrice)
  if (maxPrice != null) {
    and.push({ price: { less_than_equal: maxPrice } })
  }

  if (filters.status && filters.status !== 'all') {
    and.push({ availabilityStatus: { equals: filters.status } })
  }

  const q = normalizeSearchTerm(filters.q)
  if (q) {
    and.push({
      or: [
        { name: { contains: q } },
        { slug: { contains: q } },
      ],
    })
  }

  const where = await mergePublishedWhere(and.length ? { and } : {})
  const page = Math.max(1, filters.page ?? 1)
  const limit = Math.min(48, Math.max(1, filters.limit ?? 12))

  const res = await cmsFind<Product>('products', {
    where,
    page,
    limit,
    sort: resolveCatalogSort(filters.sort),
    depth: filters.depth ?? 2,
  })

  return {
    docs: res.docs,
    totalDocs: res.totalDocs,
    page: res.page,
    limit: res.limit,
    totalPages: res.totalPages,
    hasNextPage: res.hasNextPage,
    hasPrevPage: res.hasPrevPage,
  }
}

export async function getProducts(
  options: {
    collectionId?: number
    limit?: number
    sort?: string
    depth?: number
  } = {},
): Promise<Product[]> {
  const base = options.collectionId != null ? { collection: { equals: options.collectionId } } : {}
  const where = await mergePublishedWhere(base)
  const res = await cmsFind<Product>('products', {
    where,
    limit: options.limit ?? 200,
    sort: options.sort ?? '-updatedAt',
    depth: options.depth ?? 2,
  })
  return res.docs
}

/**
 * Same collection as the given product, excluding the product itself.
 */
export async function getRelatedProducts(options: {
  productId: number
  collectionId: number | null | undefined
  limit?: number
  depth?: number
}): Promise<Product[]> {
  if (options.collectionId == null) return []

  const inner = {
    and: [
      { collection: { equals: options.collectionId } },
      { id: { not_equals: options.productId } },
    ],
  }
  const where = await mergePublishedWhere(inner)
  const res = await cmsFind<Product>('products', {
    where,
    limit: options.limit ?? 4,
    sort: '-updatedAt',
    depth: options.depth ?? 1,
  })
  return res.docs
}

