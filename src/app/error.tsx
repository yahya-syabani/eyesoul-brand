'use client'

import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-surface px-6 py-16 text-center font-sans text-brand-ink">
      <h1 className="font-display text-brand-3xl font-semibold">Something went wrong</h1>
      <p className="mt-4 max-w-md text-brand-sm text-brand-muted-foreground">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-brand-ink px-4 py-2.5 text-brand-sm font-medium text-brand-surface hover:bg-brand-ink/90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-brand-border px-4 py-2.5 text-brand-sm font-medium text-brand-ink hover:bg-brand-muted"
        >
          Home
        </Link>
      </div>
    </div>
  )
}
