'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Cancel01Icon, FilterVerticalIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { useState } from 'react'

import type { ProductCollection } from '@/payload-types'

import type { CatalogSearchParams } from '@/lib/catalog/searchParams'

import { CatalogFiltersFields } from './CatalogFiltersFields'

export function CatalogFiltersDrawer({
  queryParams,
  collections,
  activeFilterCount,
}: {
  queryParams: CatalogSearchParams
  collections: ProductCollection[]
  activeFilterCount: number
}) {
  const [open, setOpen] = useState(false)
  const resetHref = queryParams.q ? `/catalog?q=${encodeURIComponent(queryParams.q)}` : '/catalog'

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium transition hover:scale-[1.01] hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 lg:hidden"
      >
        <HugeiconsIcon icon={FilterVerticalIcon} size={18} />
        <span>Filters</span>
        {activeFilterCount > 0 ? (
          <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-xs text-white dark:bg-neutral-100 dark:text-neutral-900">
            {activeFilterCount}
          </span>
        ) : null}
      </button>

      <Dialog open={open} onClose={setOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop transition className="fixed inset-0 bg-neutral-900/50 duration-200 data-closed:opacity-0" />
        <div className="fixed inset-0 flex items-end justify-center">
          <DialogPanel
            transition
            className="flex h-[88vh] w-full max-w-2xl flex-col rounded-t-3xl bg-white shadow-xl duration-300 data-closed:translate-y-8 data-closed:scale-[0.99] data-closed:opacity-0 dark:bg-neutral-900"
          >
            <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
              <DialogTitle className="text-lg font-semibold">Filters</DialogTitle>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={20} />
                <span className="sr-only">Close filters</span>
              </button>
            </header>

            <form method="get" className="flex h-full flex-col overflow-hidden" onSubmit={() => setOpen(false)}>
              <input type="hidden" name="q" value={queryParams.q ?? ''} />
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <CatalogFiltersFields queryParams={queryParams} collections={collections} />
              </div>

              <footer className="flex items-center gap-2 border-t border-neutral-200 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">
                <button
                  type="submit"
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-500"
                >
                  Apply filters
                </button>
                <Link
                  href={resetHref}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-4 py-2.5 text-sm font-medium transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                >
                  Reset
                </Link>
              </footer>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
