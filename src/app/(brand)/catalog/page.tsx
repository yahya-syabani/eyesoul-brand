import {
  getCatalogProducts,
  type CatalogSort,
  type CatalogStatusFilter,
} from '@/lib/cms/products'
import { toTProductItems } from '@/lib/cms/adapters'
import { Metadata } from 'next'
import ProductCard from '@/components/ProductCard'
import SectionPromo1 from '@/components/SectionPromo1'
import { getCollections } from '@/lib/cms/productCollections'
import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from '@/shared/Pagination/Pagination'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

export const metadata: Metadata = {
  title: 'Catalog',
  description: 'Browse our exclusive collection of premium eyewear and designer frames.',
}

type CatalogSearchParams = {
  q?: string
  collection?: string
  status?: CatalogStatusFilter
  minPrice?: string
  maxPrice?: string
  sort?: CatalogSort
  page?: string
}

const SORT_OPTIONS: Array<{ label: string; value: CatalogSort }> = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Price: low to high', value: 'price-low-to-high' },
  { label: 'Price: high to low', value: 'price-high-to-low' },
  { label: 'Name: A to Z', value: 'name-a-z' },
  { label: 'Name: Z to A', value: 'name-z-a' },
]

function toQueryString(params: CatalogSearchParams): string {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (!value) continue
    query.set(key, value)
  }
  const text = query.toString()
  return text ? `?${text}` : ''
}

function parsePositiveNumber(value: string | undefined): number | undefined {
  if (!value) return undefined
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 0) return undefined
  return parsed
}

function buildPaginationModel(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1])
  const normalized = Array.from(pages).filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b)
  const model: Array<number | 'gap'> = []

  for (let i = 0; i < normalized.length; i += 1) {
    const current = normalized[i]
    const prev = normalized[i - 1]
    if (prev != null && current - prev > 1) model.push('gap')
    model.push(current)
  }

  return model
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const raw = await searchParams
  const queryParams: CatalogSearchParams = {
    q: typeof raw.q === 'string' ? raw.q : undefined,
    collection: typeof raw.collection === 'string' ? raw.collection : undefined,
    status: typeof raw.status === 'string' ? (raw.status as CatalogStatusFilter) : 'all',
    minPrice: typeof raw.minPrice === 'string' ? raw.minPrice : undefined,
    maxPrice: typeof raw.maxPrice === 'string' ? raw.maxPrice : undefined,
    sort: typeof raw.sort === 'string' ? (raw.sort as CatalogSort) : 'newest',
    page: typeof raw.page === 'string' ? raw.page : '1',
  }

  const collections = await getCollections({ depth: 1 })
  const collectionBySlug = new Map(collections.map((item) => [item.slug, item.id]))
  const selectedCollectionId = queryParams.collection ? collectionBySlug.get(queryParams.collection) : undefined

  const page = Math.max(1, Number(queryParams.page ?? '1') || 1)
  const result = await getCatalogProducts({
    q: queryParams.q,
    collectionId: selectedCollectionId,
    status: queryParams.status ?? 'all',
    minPrice: parsePositiveNumber(queryParams.minPrice),
    maxPrice: parsePositiveNumber(queryParams.maxPrice),
    sort: queryParams.sort ?? 'newest',
    page,
    limit: 12,
    depth: 2,
  })

  const products = toTProductItems(result.docs)

  return (
    <div className="nc-PageSearch relative">
      <div className={'h-24 w-full bg-primary-50 2xl:h-28 dark:bg-white/10'} />
      <div className="container">
        <header className="mx-auto -mt-10 flex max-w-4xl flex-col gap-4 lg:-mt-7">
          <h1 className="text-center text-3xl font-semibold md:text-4xl">Catalog</h1>
          <p className="text-center text-sm text-neutral-500">
            Discover our exclusive collection of premium eyewear.
          </p>
          <form method="get" className="relative">
            <label htmlFor="catalog-search" className="sr-only">
              Search catalog products
            </label>
            <HugeiconsIcon
              className="absolute top-1/2 left-3.5 -translate-y-1/2 text-2xl text-neutral-500"
              icon={Search01Icon}
              size={22}
            />
            <input
              id="catalog-search"
              name="q"
              defaultValue={queryParams.q ?? ''}
              placeholder="Type product name or keyword"
              className="block w-full rounded-full border bg-white py-4 pr-5 pl-12 placeholder:text-zinc-500 focus:border-primary-300 focus:ring-3 focus:ring-primary-200/50 sm:text-sm dark:bg-neutral-800 dark:placeholder:text-zinc-400 dark:focus:ring-primary-600/25"
            />
            <input type="hidden" name="collection" value={queryParams.collection ?? ''} />
            <input type="hidden" name="status" value={queryParams.status ?? 'all'} />
            <input type="hidden" name="minPrice" value={queryParams.minPrice ?? ''} />
            <input type="hidden" name="maxPrice" value={queryParams.maxPrice ?? ''} />
            <input type="hidden" name="sort" value={queryParams.sort ?? 'newest'} />
          </form>
        </header>
      </div>

      <div className="container flex flex-col gap-y-16 py-16 lg:gap-y-28 lg:pt-20 lg:pb-28">
        <main>
          <form method="get" className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <input type="hidden" name="q" value={queryParams.q ?? ''} />
              <label className="text-sm">
                <span className="mb-1 block text-neutral-600 dark:text-neutral-300">Collection</span>
                <select
                  name="collection"
                  defaultValue={queryParams.collection ?? ''}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                >
                  <option value="">All collections</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.slug}>
                      {collection.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-neutral-600 dark:text-neutral-300">Availability</span>
                <select
                  name="status"
                  defaultValue={queryParams.status ?? 'all'}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                >
                  <option value="all">All</option>
                  <option value="in-stock">In stock</option>
                  <option value="available">Available</option>
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-neutral-600 dark:text-neutral-300">Min price</span>
                <input
                  type="number"
                  min={0}
                  name="minPrice"
                  defaultValue={queryParams.minPrice ?? ''}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-neutral-600 dark:text-neutral-300">Max price</span>
                <input
                  type="number"
                  min={0}
                  name="maxPrice"
                  defaultValue={queryParams.maxPrice ?? ''}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-neutral-600 dark:text-neutral-300">Sort by</span>
                <select
                  name="sort"
                  defaultValue={queryParams.sort ?? 'newest'}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
              >
                Apply filters
              </button>
              <a
                href="/catalog"
                className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Reset
              </a>
            </div>
          </form>

          <p className="mt-6 text-sm text-neutral-500">
            Showing {products.length} of {result.totalDocs} products
          </p>

          <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((item) => (
              <ProductCard data={item} key={item.id} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h2 className="text-2xl font-semibold">No matching products</h2>
              <p className="mt-2 text-neutral-500">Try a broader keyword or clear some filters.</p>
            </div>
          )}

          {result.totalPages > 1 && (
            <div className="mt-14 flex justify-center">
              <Pagination className="mx-auto">
                <PaginationPrevious
                  href={
                    result.hasPrevPage
                      ? `/catalog${toQueryString({ ...queryParams, page: String(result.page - 1) })}`
                      : null
                  }
                />
                <PaginationList>
                  {buildPaginationModel(result.page, result.totalPages).map((item, index) => {
                    if (item === 'gap') return <PaginationGap key={`gap-${index}`} />
                    return (
                        <PaginationPage
                          key={item}
                          href={`/catalog${toQueryString({ ...queryParams, page: String(item) })}`}
                          current={item === result.page}
                        >
                          {item}
                        </PaginationPage>
                    )
                  })}
                </PaginationList>
                <PaginationNext
                  href={
                    result.hasNextPage
                      ? `/catalog${toQueryString({ ...queryParams, page: String(result.page + 1) })}`
                      : null
                  }
                />
              </Pagination>
            </div>
          )}
        </main>

        <SectionPromo1 />
      </div>
    </div>
  )
}

