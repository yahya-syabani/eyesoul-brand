'use client'

import { useActionState } from 'react'

import { submitContact, type FormState } from '@/app/(brand)/actions'

import { BrandButton } from './BrandButton'

const initial: FormState = { ok: false, message: '' }

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial)

  return (
    <form action={formAction} className="relative flex max-w-xl flex-col gap-4" noValidate>
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="contact-website">Do not fill</label>
        <input type="text" id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="contact-name" className="mb-1 block text-brand-sm font-medium text-brand-ink">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="w-full rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-brand-sm text-brand-ink focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1 block text-brand-sm font-medium text-brand-ink">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-brand-sm text-brand-ink focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1 block text-brand-sm font-medium text-brand-ink">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-brand-sm text-brand-ink focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
        />
      </div>
      {state.message ? (
        <p
          role="status"
          className={state.ok ? 'text-brand-sm text-green-700' : 'text-brand-sm text-red-700'}
        >
          {state.message}
        </p>
      ) : null}
      <BrandButton type="submit" disabled={pending} variant="primary">
        {pending ? 'Sending…' : 'Send message'}
      </BrandButton>
    </form>
  )
}
