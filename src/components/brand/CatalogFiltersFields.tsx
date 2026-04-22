import type { ProductCollection } from '@/payload-types'

import type { CatalogSearchParams } from '@/lib/catalog/searchParams'

export const SORT_OPTIONS: Array<{ label: string; value: CatalogSearchParams['sort'] }> = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Price: low to high', value: 'price-low-to-high' },
  { label: 'Price: high to low', value: 'price-high-to-low' },
  { label: 'Name: A to Z', value: 'name-a-z' },
  { label: 'Name: Z to A', value: 'name-z-a' },
]

export function CatalogFiltersFields({
  queryParams,
  collections,
}: {
  queryParams: CatalogSearchParams
  collections: ProductCollection[]
}) {
  const sectionBaseClass =
    'group rounded-2xl border border-neutral-200 bg-white/60 p-3.5 dark:border-neutral-800 dark:bg-neutral-950/40'

  return (
    <div className="space-y-5">
      <details open className={sectionBaseClass}>
        <summary className="cursor-pointer list-none text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
          Basics
        </summary>
        <div className="mt-3 grid gap-3">
          <label className="text-sm">
            <span className="mb-1.5 block text-neutral-600 dark:text-neutral-300">Collection</span>
            <select
              name="collection"
              defaultValue={queryParams.collection ?? ''}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 dark:border-neutral-700 dark:bg-neutral-900"
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
            <span className="mb-1.5 block text-neutral-600 dark:text-neutral-300">Type</span>
            <select
              name="type"
              defaultValue={queryParams.type ?? ''}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option value="">All types</option>
              <option value="optical-frame">Frames</option>
              <option value="sunglasses">Sunglasses</option>
              <option value="contact-soft">Soft contact lenses</option>
              <option value="contact-care">Lens care</option>
              <option value="accessory">Accessories</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block text-neutral-600 dark:text-neutral-300">Availability</span>
            <select
              name="status"
              defaultValue={queryParams.status ?? 'all'}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option value="all">All</option>
              <option value="in-stock">In stock</option>
              <option value="available">Available</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block text-neutral-600 dark:text-neutral-300">Sort by</span>
            <select
              name="sort"
              defaultValue={queryParams.sort ?? 'newest'}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 dark:border-neutral-700 dark:bg-neutral-900"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </details>

      <details open className={sectionBaseClass}>
        <summary className="cursor-pointer list-none text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
          Price
        </summary>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="text-sm">
            <span className="mb-1.5 block text-neutral-600 dark:text-neutral-300">Min</span>
            <input
              type="number"
              min={0}
              name="minPrice"
              defaultValue={queryParams.minPrice ?? ''}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block text-neutral-600 dark:text-neutral-300">Max</span>
            <input
              type="number"
              min={0}
              name="maxPrice"
              defaultValue={queryParams.maxPrice ?? ''}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 dark:border-neutral-700 dark:bg-neutral-900"
            />
          </label>
        </div>
      </details>

      <details className={sectionBaseClass}>
        <summary className="cursor-pointer list-none text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
          Product-specific
        </summary>
        <div className="mt-3 grid gap-3">
          <label className="text-sm">
            <span className="mb-1.5 block text-neutral-600 dark:text-neutral-300">Frame shape</span>
            <select
              name="frameShape"
              defaultValue={queryParams.frameShape ?? ''}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option value="">Any</option>
              <option value="round">Round</option>
              <option value="rectangle">Rectangle</option>
              <option value="square">Square</option>
              <option value="aviator">Aviator</option>
              <option value="cat-eye">Cat-eye</option>
              <option value="browline">Browline</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block text-neutral-600 dark:text-neutral-300">Rim type</span>
            <select
              name="rimType"
              defaultValue={queryParams.rimType ?? ''}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option value="">Any</option>
              <option value="full-rim">Full rim</option>
              <option value="semi-rimless">Semi-rimless</option>
              <option value="rimless">Rimless</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block text-neutral-600 dark:text-neutral-300">Polarized (sunglasses)</span>
            <select
              name="polarized"
              defaultValue={queryParams.polarized ?? ''}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option value="">Any</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block text-neutral-600 dark:text-neutral-300">Replacement schedule (softlens)</span>
            <select
              name="replacementSchedule"
              defaultValue={queryParams.replacementSchedule ?? ''}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option value="">Any</option>
              <option value="daily">Daily</option>
              <option value="biweekly">Biweekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block text-neutral-600 dark:text-neutral-300">Accessory type</span>
            <select
              name="accessoryType"
              defaultValue={queryParams.accessoryType ?? ''}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option value="">Any</option>
              <option value="case">Case</option>
              <option value="cloth">Cloth</option>
              <option value="chain">Chain</option>
              <option value="kit">Kit</option>
            </select>
          </label>
        </div>
      </details>
    </div>
  )
}
