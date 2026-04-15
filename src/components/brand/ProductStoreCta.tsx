import Link from 'next/link'

export function ProductStoreCta() {
  return (
    <aside className="rounded-2xl border border-neutral-200 bg-primary-50/60 p-5 dark:border-neutral-700 dark:bg-primary-950/20">
      <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Prefer to try it on?</h2>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        Visit a store for a professional fitting or to compare frames in person.
      </p>
      <Link
        href="/stores"
        className="mt-3 inline-flex text-sm font-medium text-primary-700 underline hover:text-primary-600 dark:text-primary-400"
      >
        Find a store near you
      </Link>
    </aside>
  )
}
