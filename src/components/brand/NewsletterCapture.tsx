'use client'

import { useActionState } from 'react'

import { subscribeNewsletter, type FormState } from '@/app/(brand)/actions'

import { BrandButton } from './BrandButton'

const initial: FormState = { ok: false, message: '' }

export function NewsletterCapture() {
  const [state, formAction, pending] = useActionState(subscribeNewsletter, initial)

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end" noValidate>
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="newsletter-trap">Do not fill</label>
        <input type="text" id="newsletter-trap" name="trap" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="min-w-0 flex-1">
        <label htmlFor="newsletter-email" className="mb-1 block text-brand-sm font-medium text-brand-ink">
          Email
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-brand-sm text-brand-ink placeholder:text-brand-muted-foreground focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
        />
      </div>
      <BrandButton type="submit" disabled={pending} variant="secondary">
        {pending ? '…' : 'Subscribe'}
      </BrandButton>
      {state.message ? (
        <p
          role="status"
          className={`text-brand-sm sm:w-full ${state.ok ? 'text-green-700' : 'text-red-700'}`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  )
}
