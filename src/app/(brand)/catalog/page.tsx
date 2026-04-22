import { CatalogFilterChips } from '@/components/brand/CatalogFilterChips'
import { CatalogFiltersDrawer } from '@/components/brand/CatalogFiltersDrawer'
import { CatalogFiltersSidebar } from '@/components/brand/CatalogFiltersSidebar'
import ProductCard from '@/components/ProductCard'
import {
  buildCatalogQueryString,
  type CatalogSearchParams,
  getCatalogFilterChips,
  parseCatalogSearchParams,
} from '@/lib/catalog/searchParams'
import { toTProductItems } from '@/lib/cms/adapters'
import { getCatalogProducts } from '@/lib/cms/products'
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
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catalog',
  description: 'Browse our exclusive collection of premium eyewear and designer frames.',
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

function withPricePreset(
  params: CatalogSearchParams,
  minPrice?: string,
  maxPrice?: string,
): CatalogSearchParams {
  const next: CatalogSearchParams = { ...params, page: '1' }
  if (minPrice) next.minPrice = minPrice
  else delete next.minPrice
  if (maxPrice) next.maxPrice = maxPrice
  else delete next.maxPrice
  return next
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const raw = await searchParams
  const queryParams = parseCatalogSearchParams(raw)

  const collections = await getCollections({ depth: 1 })
  const collectionBySlug = new Map(collections.map((item) => [item.slug, item.id]))
  const collectionTitleBySlug = new Map(collections.map((item) => [item.slug, item.title]))
  const selectedCollectionId = queryParams.collection ? collectionBySlug.get(queryParams.collection) : undefined

  const page = Math.max(1, Number(queryParams.page ?? '1') || 1)
  const result = await getCatalogProducts({
    q: queryParams.q,
    collectionId: selectedCollectionId,
    productType: queryParams.type ?? 'all',
    status: queryParams.status ?? 'all',
    minPrice: parsePositiveNumber(queryParams.minPrice),
    maxPrice: parsePositiveNumber(queryParams.maxPrice),
    frameShape: queryParams.frameShape,
    rimType: queryParams.rimType,
    polarized: queryParams.polarized ? queryParams.polarized === 'true' : undefined,
    replacementSchedule: queryParams.replacementSchedule,
    accessoryType: queryParams.accessoryType,
    sort: queryParams.sort ?? 'newest',
    page,
    limit: 12,
    depth: 2,
  })

  const products = toTProductItems(result.docs)
  const filterChips = getCatalogFilterChips(queryParams, collectionTitleBySlug)
  const activeFilterCount = filterChips.filter((chip) => chip.key !== 'page').length

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
            <input type="hidden" name="type" value={queryParams.type ?? ''} />
            <input type="hidden" name="status" value={queryParams.status ?? 'all'} />
            <input type="hidden" name="minPrice" value={queryParams.minPrice ?? ''} />
            <input type="hidden" name="maxPrice" value={queryParams.maxPrice ?? ''} />
            <input type="hidden" name="frameShape" value={queryParams.frameShape ?? ''} />
            <input type="hidden" name="rimType" value={queryParams.rimType ?? ''} />
            <input type="hidden" name="polarized" value={queryParams.polarized ?? ''} />
            <input type="hidden" name="replacementSchedule" value={queryParams.replacementSchedule ?? ''} />
            <input type="hidden" name="accessoryType" value={queryParams.accessoryType ?? ''} />
            <input type="hidden" name="sort" value={queryParams.sort ?? 'newest'} />
          </form>
        </header>
      </div>

      <div className="container py-16 lg:pt-20 lg:pb-28">
        <main className="grid items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <CatalogFiltersSidebar queryParams={queryParams} collections={collections} />

          <section>
            <div className="mb-4 flex items-center justify-between gap-3 lg:mb-5">
              <CatalogFiltersDrawer
                queryParams={queryParams}
                collections={collections}
                activeFilterCount={activeFilterCount}
              />
              <p className="text-sm text-neutral-500">
                Showing {products.length} of {result.totalDocs} products
              </p>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                Quick price
              </span>
              <a
                href={`/catalog${buildCatalogQueryString(withPricePreset(queryParams, undefined, '500000'))}`}
                className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              >
                Under 500k
              </a>
              <a
                href={`/catalog${buildCatalogQueryString(withPricePreset(queryParams, '500000', '1500000'))}`}
                className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              >
                500k - 1.5m
              </a>
              <a
                href={`/catalog${buildCatalogQueryString(withPricePreset(queryParams, '1500000', undefined))}`}
                className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm transition hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              >
                Over 1.5m
              </a>
            </div>

            <CatalogFilterChips params={queryParams} chips={filterChips} />

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
                        ? `/catalog${buildCatalogQueryString({ ...queryParams, page: String(result.page - 1) })}`
                        : null
                    }
                  />
                  <PaginationList>
                    {buildPaginationModel(result.page, result.totalPages).map((item, index) => {
                      if (item === 'gap') return <PaginationGap key={`gap-${index}`} />
                      return (
                        <PaginationPage
                          key={item}
                          href={`/catalog${buildCatalogQueryString({ ...queryParams, page: String(item) })}`}
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
                        ? `/catalog${buildCatalogQueryString({ ...queryParams, page: String(result.page + 1) })}`
                        : null
                    }
                  />
                </Pagination>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
