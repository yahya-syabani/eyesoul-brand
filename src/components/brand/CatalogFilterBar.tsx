'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useTransition } from 'react'

import type { ProductCollection } from '@/payload-types'

import { cn } from '@/lib/cn'

export function CatalogFilterBar({ collections }: { collections: ProductCollection[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  const activeSlug = searchParams.get('collection') ?? ''

  const setCollection = useCallback(
    (slug: string) => {
      startTransition(() => {
        const next = new URLSearchParams(searchParams.toString())
        if (!slug) next.delete('collection')
        else next.set('collection', slug)
        const q = next.toString()
        router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false })
      })
    },
    [pathname, router, searchParams],
  )

  const labels = useMemo(() => [{ slug: '', title: 'All collections' }, ...collections.map((c) => ({ slug: c.slug, title: c.title }))], [collections])

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <p className="text-brand-sm font-medium text-brand-muted-foreground">Filter by collection</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Collection filters">
        {labels.map(({ slug, title }) => {
          const isActive = slug === activeSlug || (slug === '' && activeSlug === '')
          return (
            <button
              key={slug || 'all'}
              type="button"
              disabled={pending}
              onClick={() => setCollection(slug)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-brand-sm font-medium motion-safe:transition-colors',
                isActive
                  ? 'border-brand-ink bg-brand-ink text-brand-surface'
                  : 'border-brand-border bg-brand-surface text-brand-ink hover:bg-brand-muted',
              )}
            >
              {title}
            </button>
          )
        })}
      </div>
    </div>
  )
}
