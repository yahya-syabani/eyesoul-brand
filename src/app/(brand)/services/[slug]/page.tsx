import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/solid'

import { getServiceBySlug } from '@/lib/cms/services'
import { resolveBrandImage } from '@/components/brand/brandMedia'
import { BrandH1, BrandLead, BrandH2, BrandH3 } from '@/components/brand/BrandTypography'
import { BrandRichText } from '@/components/brand/BrandRichText'
import { BrandButton } from '@/components/brand/BrandButton'
import { BrandBadge } from '@/components/brand/BrandBadge'

import { ProcessSteps } from '@/components/brand/services/ProcessSteps'
import { FAQAccordion } from '@/components/brand/services/FAQAccordion'
import { StickyBookingCTA } from '@/components/brand/services/StickyBookingCTA'
import { ServiceBenefitCallouts } from '@/components/brand/services/ServiceBenefitCallouts'
import { ServiceHighlights } from '@/components/brand/services/ServiceHighlights'

// Static capability highlights keyed by slug.
// These are display-layer enhancements — not stored in CMS to avoid clutter.
const HIGHLIGHTS: Record<string, { label: string; icon: string }[]> = {
  'eye-exam': [
    { icon: '🔬', label: 'Digital Refraction Testing' },
    { icon: '💡', label: 'Acuity Assessment' },
    { icon: '🫀', label: 'Intraocular Pressure Check' },
    { icon: '🧠', label: 'Retinal Health Screening' },
  ],
  'contact-lens-fitting': [
    { icon: '📐', label: 'Corneal Topography Mapping' },
    { icon: '🔭', label: 'Trial Lens Fitting' },
    { icon: '💧', label: 'Dry Eye Compatibility' },
    { icon: '📋', label: 'Wear & Care Tutorial' },
  ],
  'frame-adjustment': [
    { icon: '🔧', label: 'Temple Arm Reshaping' },
    { icon: '👃', label: 'Nose Pad Positioning' },
    { icon: '🎯', label: 'Bridge Alignment' },
    { icon: '✅', label: 'Comfort Verification' },
  ],
  'consultation': [
    { icon: '💬', label: 'Prescription Guidance' },
    { icon: '👓', label: 'Frame Style Matching' },
    { icon: '🧬', label: 'Lens Type Advice' },
    { icon: '🤝', label: 'Post-Purchase Support' },
  ],
  'home-service': [
    { icon: '🏠', label: 'In-Home Eye Exam' },
    { icon: '🕶️', label: 'Frame Selection at Home' },
    { icon: '📋', label: 'On-Spot Prescription' },
    { icon: '🚚', label: 'Doorstep Delivery' },
  ],
}

// Callout bullets for premium benefit pages.
const BENEFIT_CALLOUTS: Record<string, string[]> = {
  'free-eye-exam': [
    'No hidden fees. No purchase required.',
    'Certified optometrists — same quality as paid exams.',
    'Available at every Eyesoul store location.',
    'Your full prescription shared immediately.',
  ],
  'free-home-service': [
    'Full eye exam carried out at your home.',
    'Bring your entire frame collection to you.',
    'Zero travel, zero waiting room.',
    'Available in selected service areas.',
  ],
  'frame-guarantee': [
    'Covers all manufacturing defects.',
    'Includes hinges, temples, and bridge.',
    'No receipt required — linked to your account.',
    'In-store repair or replacement within 7 days.',
  ],
  'trade-in-program': [
    'Trade in any Eyesoul frame, any age.',
    'Credit applied to your next purchase.',
    'No time limit — lifetime program.',
    'Supports our recycling & sustainability initiative.',
  ],
}

// Per-service accentuated back-story blurb shown below description on benefit pages.
const BENEFIT_TAGLINE: Record<string, string> = {
  'free-eye-exam': 'An Eyesoul promise — unconditional, for every customer.',
  'free-home-service': 'Eyesoul comes to you. Premium care, on your terms.',
  'frame-guarantee': 'Buy once. Wear with confidence. We have you covered.',
  'trade-in-program': 'Your eyewear journey doesn\'t end — it evolves.',
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const service = await getServiceBySlug(slug, { depth: 2 })

  if (!service) notFound()

  const isBenefit = service.category === 'premium_benefit'
  const heroImage = resolveBrandImage(service.heroImage, 'card') || resolveBrandImage(service.icon, 'card')
  const bookingHref = service.bookingUrl || undefined
  const phone = service.bookingPhone || undefined
  const tel = phone ? `tel:${phone.replace(/\s/g, '')}` : undefined
  const primaryLabel = service.primaryCtaLabel?.trim() || (isBenefit ? 'Get started' : 'Book appointment')
  const primaryActionHref = bookingHref || tel || '/stores'
  const processSteps = (service.processSteps || []) as { title: string; description: string }[]
  const faqs = (service.faqs || []) as { question: string; answer: string }[]
  const highlights = HIGHLIGHTS[slug] || []
  const callouts = BENEFIT_CALLOUTS[slug] || []
  const tagline = BENEFIT_TAGLINE[slug]

  // ─────────────────────────────────────────────────────────────────
  // CORE SERVICE LAYOUT
  // ─────────────────────────────────────────────────────────────────
  if (!isBenefit) {
    return (
      <div className="relative pb-24 md:pb-0">

        {/* ── Back nav ── */}
        <div className="container pt-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-brand-sm text-brand-muted-foreground hover:text-brand-ink transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            All services
          </Link>
        </div>

        {/* ── Hero — full-width, left-aligned, cinematic ── */}
        <section className="container mt-6 mb-4">
          <div className="relative overflow-hidden rounded-3xl bg-brand-surface border border-brand-border/30 px-8 py-16 md:px-16 md:py-24 lg:py-32">
            {/* subtle decorative blob */}
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-muted/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-brand-border/20 blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
              <BrandBadge className="mb-6 uppercase tracking-wider">Core Service</BrandBadge>
              <BrandH1 className="mb-6 text-balance">{service.name}</BrandH1>
              {service.description && (
                <BrandLead className="mb-10 max-w-xl">{service.description}</BrandLead>
              )}
              <div className="flex flex-wrap gap-4">
                <BrandButton href={primaryActionHref} variant="primary" className="px-8 py-3">
                  {primaryLabel}
                </BrandButton>
                {tel && !bookingHref && (
                  <BrandButton href={tel} variant="secondary" className="px-8 py-3">
                    Call us
                  </BrandButton>
                )}
                <BrandButton href="/stores" variant="ghost" className="px-8 py-3">
                  Find a store →
                </BrandButton>
              </div>
            </div>
          </div>
        </section>

        {/* ── Capability highlights grid ── */}
        {highlights.length > 0 && (
          <ServiceHighlights highlights={highlights} heading="What's included" />
        )}

        {/* ── Rich text content (CMS) ── */}
        {service.content && (
          <section className="container max-w-3xl py-8 md:py-12">
            <BrandRichText data={service.content as any} />
          </section>
        )}

        {/* ── How it works ── */}
        <ProcessSteps steps={processSteps} />

        {/* ── FAQ ── */}
        <FAQAccordion faqs={faqs} />

        {/* ── Bottom CTA — desktop ── */}
        <section className="container max-w-3xl py-16 hidden md:block">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-brand-surface border border-brand-border/50 rounded-3xl px-10 py-10">
            <div>
              <h2 className="text-2xl font-display font-semibold text-brand-ink">
                Ready to book?
              </h2>
              <p className="text-brand-sm text-brand-muted-foreground mt-1">
                Available at all Eyesoul locations.
              </p>
            </div>
            <BrandButton href={primaryActionHref} variant="primary" className="px-8 py-3 shrink-0">
              {primaryLabel}
            </BrandButton>
          </div>
        </section>

        {/* ── Sticky mobile CTA ── */}
        <StickyBookingCTA
          bookingUrl={bookingHref || '/stores'}
          whatsappNumber={phone}
          ctaLabel={primaryLabel}
        />
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────
  // PREMIUM BENEFIT LAYOUT
  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative pb-24 md:pb-0">

      {/* ── Back nav ── */}
      <div className="container pt-6">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-brand-sm text-brand-muted-foreground hover:text-brand-ink transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          All services
        </Link>
      </div>

      {/* ── Hero — bold, centred, premium ── */}
      <section className="container mt-6 mb-4">
        <div className="relative overflow-hidden rounded-3xl bg-brand-ink text-brand-surface px-8 py-16 md:px-16 md:py-28 text-center">
          {/* decorative radial glow */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, #fff 0%, transparent 70%)' }}
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/20 text-brand-xs font-medium text-white/70 uppercase tracking-wider">
              <SparklesIcon className="h-3.5 w-3.5" />
              Eyesoul Privilege
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-6 text-balance">
              {service.name}
            </h1>
            {service.description && (
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10">
                {service.description}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-4">
              <BrandButton
                href={primaryActionHref}
                variant="secondary"
                className="px-8 py-3 bg-white text-brand-ink border-white hover:bg-white/90"
              >
                {primaryLabel}
              </BrandButton>
              <BrandButton href="/stores" variant="ghost" className="px-8 py-3 text-white/80 hover:text-white hover:bg-white/10">
                Find a store →
              </BrandButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tagline / brand promise ── */}
      {tagline && (
        <div className="container max-w-2xl text-center py-10">
          <p className="text-brand-lg text-brand-ink font-medium italic">"{tagline}"</p>
        </div>
      )}

      {/* ── Benefit callouts ── */}
      {callouts.length > 0 && (
        <section className="container max-w-3xl mb-16">
          <BrandH2 className="mb-8 text-center">What this means for you</BrandH2>
          <ServiceBenefitCallouts callouts={callouts} />
        </section>
      )}

      {/* ── Rich text content (CMS) ── */}
      {service.content && (
        <section className="container max-w-3xl pb-8">
          <BrandRichText data={service.content as any} />
        </section>
      )}

      {/* ── How it works (conditional — not all benefits have steps) ── */}
      <ProcessSteps steps={processSteps} />

      {/* ── Trust badge block ── */}
      <section className="container max-w-4xl py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-brand-surface/50 rounded-3xl border border-brand-border/50 p-8">
          <ShieldCheckIcon className="h-10 w-10 text-brand-ink shrink-0" />
          <div>
            <BrandH3 className="mb-1">Our commitment to you</BrandH3>
            <p className="text-brand-sm text-brand-muted-foreground max-w-lg">
              Every Eyesoul privilege is backed by our service guarantee. If you ever feel something
              didn't meet expectations, speak to any team member and we'll make it right.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FAQAccordion faqs={faqs} />

      {/* ── Bottom CTA — desktop ── */}
      <section className="container max-w-3xl py-16 hidden md:block">
        <div className="rounded-3xl bg-brand-ink text-white px-10 py-12 text-center">
          <h2 className="text-2xl font-display font-semibold mb-2">
            Ready to take advantage?
          </h2>
          <p className="text-white/60 text-brand-sm mb-8">
            Visit any Eyesoul store or contact us to get started.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <BrandButton
              href={primaryActionHref}
              variant="secondary"
              className="px-8 py-3 bg-white text-brand-ink border-white hover:bg-white/90"
            >
              {primaryLabel}
            </BrandButton>
            <BrandButton href="/stores" variant="ghost" className="px-8 py-3 text-white/70 hover:text-white hover:bg-white/10">
              Store locator
            </BrandButton>
          </div>
        </div>
      </section>

      {/* ── Sticky mobile CTA ── */}
      <StickyBookingCTA
        bookingUrl={bookingHref || '/stores'}
        whatsappNumber={phone}
        ctaLabel={primaryLabel}
      />
    </div>
  )
}
