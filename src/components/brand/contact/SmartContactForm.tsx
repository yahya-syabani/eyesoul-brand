'use client'

import { useEffect, useActionState } from 'react'
import { submitContact, type FormState } from '@/app/(brand)/actions'
import { capturePosthogEvent } from '@/lib/analytics/posthog'
import { BrandButton } from '../BrandButton'

const initial: FormState = { ok: false, message: '' }

export function SmartContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial)
  const hasFieldErrors = Boolean(
    state.fieldErrors?.name ||
    state.fieldErrors?.email ||
    state.fieldErrors?.message ||
    state.fieldErrors?.inquiryType ||
    state.fieldErrors?.preferredDate
  )

  useEffect(() => {
    if (!state.message) return
    capturePosthogEvent(state.ok ? 'contact_submit_success' : 'contact_submit_error', {
      hasFieldErrors,
      message: state.message,
    })
  }, [hasFieldErrors, state.message, state.ok])

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50/50 p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-semibold text-green-900 mb-2">Message Sent</h3>
        <p className="text-green-700 text-sm max-w-sm mx-auto">
          {state.message}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 text-sm font-medium text-green-800 hover:text-green-900 underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5"
      noValidate
      onSubmit={() => capturePosthogEvent('contact_submit_attempt')}
    >
      {hasFieldErrors && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Please correct the following errors:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
            {Object.values(state.fieldErrors || {}).map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Honeypot */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="contact-website">Do not fill</label>
        <input type="text" id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="relative">
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder=" "
            autoComplete="name"
            defaultValue={state.values?.name ?? ''}
            aria-invalid={state.fieldErrors?.name ? true : undefined}
            className="peer w-full rounded-xl border border-brand-border bg-brand-surface px-4 pb-2 pt-6 text-brand-base text-brand-ink focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent transition-colors disabled:opacity-50"
            disabled={pending}
          />
          <label
            htmlFor="contact-name"
            className="absolute left-4 top-2 text-xs font-medium text-brand-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-muted-foreground/70 peer-focus:top-2 peer-focus:text-xs peer-focus:text-brand-accent"
          >
            Full Name
          </label>
        </div>

        <div className="relative">
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder=" "
            autoComplete="email"
            defaultValue={state.values?.email ?? ''}
            aria-invalid={state.fieldErrors?.email ? true : undefined}
            className="peer w-full rounded-xl border border-brand-border bg-brand-surface px-4 pb-2 pt-6 text-brand-base text-brand-ink focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent transition-colors disabled:opacity-50"
            disabled={pending}
          />
          <label
            htmlFor="contact-email"
            className="absolute left-4 top-2 text-xs font-medium text-brand-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-muted-foreground/70 peer-focus:top-2 peer-focus:text-xs peer-focus:text-brand-accent"
          >
            Email Address
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="relative">
          <select
            id="contact-inquiryType"
            name="inquiryType"
            defaultValue={state.values?.inquiryType ?? 'general'}
            className="w-full rounded-xl border border-brand-border bg-brand-surface px-4 pb-2 pt-6 text-brand-base text-brand-ink focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent transition-colors appearance-none disabled:opacity-50"
            disabled={pending}
          >
            <option value="general">General Inquiry</option>
            <option value="appointment">Book Appointment</option>
            <option value="support">Order Support</option>
            <option value="feedback">Feedback</option>
          </select>
          <label
            htmlFor="contact-inquiryType"
            className="absolute left-4 top-2 text-xs font-medium text-brand-muted-foreground"
          >
            Inquiry Type
          </label>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-muted-foreground">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        <div className="relative">
          <input
            id="contact-preferredDate"
            name="preferredDate"
            type="date"
            defaultValue={state.values?.preferredDate ?? ''}
            className="w-full rounded-xl border border-brand-border bg-brand-surface px-4 pb-2 pt-6 text-brand-base text-brand-ink focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent transition-colors disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
            disabled={pending}
          />
          <label
            htmlFor="contact-preferredDate"
            className="absolute left-4 top-2 text-xs font-medium text-brand-muted-foreground"
          >
            Preferred Date (Optional)
          </label>
        </div>
      </div>

      <div className="relative">
        <textarea
          id="contact-message"
          name="message"
          required
          placeholder=" "
          rows={4}
          defaultValue={state.values?.message ?? ''}
          aria-invalid={state.fieldErrors?.message ? true : undefined}
          className="peer w-full rounded-xl border border-brand-border bg-brand-surface px-4 pb-2 pt-6 text-brand-base text-brand-ink focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent transition-colors resize-y min-h-[120px] disabled:opacity-50"
          disabled={pending}
        />
        <label
          htmlFor="contact-message"
          className="absolute left-4 top-2 text-xs font-medium text-brand-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-brand-muted-foreground/70 peer-focus:top-2 peer-focus:text-xs peer-focus:text-brand-accent"
        >
          Message
        </label>
      </div>

      {state.message && !state.ok && !hasFieldErrors && (
        <p role="status" className="text-sm text-red-700">
          {state.message}
        </p>
      )}

      <div className="mt-2">
        <BrandButton type="submit" disabled={pending} variant="primary" className="w-full md:w-auto px-8 py-3.5 text-base">
          {pending ? 'Sending...' : 'Send Message'}
        </BrandButton>
      </div>
      
      <p className="text-xs text-brand-muted-foreground/80 text-center md:text-left mt-2">
        By submitting this form, you agree to our privacy policy. We never share your data.
      </p>
    </form>
  )
}
