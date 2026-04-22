import Link from 'next/link'

import type { ProductCollection } from '@/payload-types'

import type { CatalogSearchParams } from '@/lib/catalog/searchParams'

import { CatalogFiltersFields } from './CatalogFiltersFields'

export function CatalogFiltersSidebar({
  queryParams,
  collections,
}: {
  queryParams: CatalogSearchParams
  collections: ProductCollection[]
}) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Refine products by category and specs.</p>
        </div>

        <form method="get" className="space-y-5">
          <input type="hidden" name="q" value={queryParams.q ?? ''} />
          <CatalogFiltersFields queryParams={queryParams} collections={collections} />
          <div className="flex items-center gap-2 border-t border-neutral-200 pt-5 dark:border-neutral-800">
            <button
              type="submit"
              className="inline-flex flex-1 items-center justify-center rounded-full bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-500"
            >
              Apply filters
            </button>
            <Link
              href={queryParams.q ? `/catalog?q=${encodeURIComponent(queryParams.q)}` : '/catalog'}
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-4 py-2.5 text-sm font-medium transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Reset
            </Link>
          </div>
        </form>
      </div>
    </aside>
  )
}
