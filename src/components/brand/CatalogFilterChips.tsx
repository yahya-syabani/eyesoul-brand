import Link from 'next/link'

import type { CatalogFilterChip, CatalogSearchParams } from '@/lib/catalog/searchParams'
import { buildCatalogQueryString, catalogParamsWithoutChip } from '@/lib/catalog/searchParams'

type Props = {
  params: CatalogSearchParams
  chips: CatalogFilterChip[]
}

export function CatalogFilterChips({ params, chips }: Props) {
  if (!chips.length) return null

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="text-sm text-neutral-500 dark:text-neutral-400">Active filters:</span>
      {chips.map((chip) => {
        const next = catalogParamsWithoutChip(params, chip)
        const href = `/catalog${buildCatalogQueryString(next)}`
        return (
          <Link
            key={`${chip.key}-${chip.label}`}
            href={href}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-3 py-1 text-sm text-neutral-800 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            <span>{chip.label}</span>
            <span className="text-neutral-400" aria-hidden>
              ×
            </span>
            <span className="sr-only">Remove filter</span>
          </Link>
        )
      })}
      <Link href="/catalog" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
        Clear all
      </Link>
    </div>
  )
}
