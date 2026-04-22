'use client'

import { useEffect } from 'react'
import { useActionState } from 'react'

import { submitContact, type FormState } from '@/app/(brand)/actions'
import { capturePosthogEvent } from '@/lib/analytics/posthog'

import { BrandButton } from './BrandButton'

const initial: FormState = { ok: false, message: '' }

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial)
  const hasFieldErrors = Boolean(state.fieldErrors?.name || state.fieldErrors?.email || state.fieldErrors?.message)

  useEffect(() => {
    if (!state.message) return
    capturePosthogEvent(state.ok ? 'contact_submit_success' : 'contact_submit_error', {
      hasFieldErrors,
      message: state.message,
    })
  }, [hasFieldErrors, state.message, state.ok])

  return (
    <form
      action={formAction}
      className="relative flex max-w-xl flex-col gap-4"
      noValidate
      onSubmit={() => capturePosthogEvent('contact_submit_attempt')}
    >
      <p className="text-brand-xs text-brand-muted-foreground">
        Required fields are marked by your browser. We typically reply within 24 hours.
      </p>
      {hasFieldErrors ? (
        <div role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 text-brand-sm text-red-800">
          <p className="font-medium">There is a problem</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {state.fieldErrors?.name ? (
              <li>
                <a className="underline" href="#contact-name">
                  {state.fieldErrors.name}
                </a>
              </li>
            ) : null}
            {state.fieldErrors?.email ? (
              <li>
                <a className="underline" href="#contact-email">
                  {state.fieldErrors.email}
                </a>
              </li>
            ) : null}
            {state.fieldErrors?.message ? (
              <li>
                <a className="underline" href="#contact-message">
                  {state.fieldErrors.message}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
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
          defaultValue={state.values?.name ?? ''}
          aria-invalid={state.fieldErrors?.name ? true : undefined}
          aria-describedby={state.fieldErrors?.name ? 'contact-name-error' : undefined}
          className="w-full rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-brand-sm text-brand-ink focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
        />
        {state.fieldErrors?.name ? (
          <p id="contact-name-error" className="mt-1 text-brand-xs text-red-700">
            {state.fieldErrors.name}
          </p>
        ) : null}
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
          defaultValue={state.values?.email ?? ''}
          aria-invalid={state.fieldErrors?.email ? true : undefined}
          aria-describedby={state.fieldErrors?.email ? 'contact-email-error' : undefined}
          className="w-full rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-brand-sm text-brand-ink focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
        />
        {state.fieldErrors?.email ? (
          <p id="contact-email-error" className="mt-1 text-brand-xs text-red-700">
            {state.fieldErrors.email}
          </p>
        ) : null}
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
          defaultValue={state.values?.message ?? ''}
          aria-invalid={state.fieldErrors?.message ? true : undefined}
          aria-describedby={state.fieldErrors?.message ? 'contact-message-error' : undefined}
          className="w-full rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-brand-sm text-brand-ink focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
        />
        {state.fieldErrors?.message ? (
          <p id="contact-message-error" className="mt-1 text-brand-xs text-red-700">
            {state.fieldErrors.message}
          </p>
        ) : null}
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
      <p className="text-brand-xs text-brand-muted-foreground">
        We use your details only to respond to your request and do not add you to marketing lists from this form.
      </p>
    </form>
  )
}
