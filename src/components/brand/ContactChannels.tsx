'use client'

import Link from 'next/link'

import { capturePosthogEvent } from '@/lib/analytics/posthog'

import { BrandButton } from './BrandButton'

type ContactChannelsProps = {
  phoneHref?: string
  phoneLabel?: string
  emailHref?: string
  emailLabel?: string
}

export function ContactChannels({ phoneHref, phoneLabel, emailHref, emailLabel }: ContactChannelsProps) {
  return (
    <section className="rounded-2xl border border-brand-border bg-brand-muted/30 p-6">
      <h2 className="font-display text-brand-2xl font-semibold text-brand-ink">Get in touch quickly</h2>
      <p className="mt-2 text-brand-sm text-brand-muted-foreground">
        For urgent requests, call us directly. For non-urgent questions, send a message below and we usually reply
        within 24 hours.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {phoneHref ? (
          <BrandButton
            href={phoneHref}
            variant="primary"
            onClick={() => capturePosthogEvent('contact_channel_click', { channel: 'phone' })}
          >
            Call {phoneLabel ?? 'our team'}
          </BrandButton>
        ) : null}
        {emailHref ? (
          <BrandButton
            href={emailHref}
            variant="secondary"
            onClick={() => capturePosthogEvent('contact_channel_click', { channel: 'email' })}
          >
            Email {emailLabel ?? 'support'}
          </BrandButton>
        ) : null}
        <BrandButton
          href="/stores"
          variant="secondary"
          onClick={() => capturePosthogEvent('contact_channel_click', { channel: 'stores' })}
        >
          Find a store
        </BrandButton>
        <Link
          href="/services"
          className="self-center text-brand-sm font-medium text-brand-accent-hover underline"
          onClick={() => capturePosthogEvent('contact_channel_click', { channel: 'services' })}
        >
          View services
        </Link>
      </div>
      <p className="mt-4 text-brand-xs text-brand-muted-foreground">
        Live support hours are shown per location in Stores. Messages from this page are reviewed on business days.
      </p>
    </section>
  )
}
