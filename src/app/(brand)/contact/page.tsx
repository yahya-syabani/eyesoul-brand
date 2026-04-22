import { notFound } from 'next/navigation'
import { ChatBubbleOvalLeftEllipsisIcon, PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline'

import { getStores } from '@/lib/cms/stores'
import { getPageBySlug } from '@/lib/cms/pages'
import { buildFaqPageJsonLd, collectFaqItemsFromPageBlocks } from '@/lib/seo/faqJsonLd'

import { ContactHero } from '@/components/brand/contact/ContactHero'
import { ContactMethodCard } from '@/components/brand/contact/ContactMethodCard'
import { SmartContactForm } from '@/components/brand/contact/SmartContactForm'
import { LocationMapSection } from '@/components/brand/contact/LocationMapSection'
import { TrustSnippets } from '@/components/brand/contact/TrustSnippets'
import { FAQAccordion } from '@/components/brand/services/FAQAccordion'
import { StickyBookingCTA } from '@/components/brand/services/StickyBookingCTA'

export default async function ContactPage() {
  const [page, stores] = await Promise.all([getPageBySlug('contact', { depth: 3 }), getStores({ limit: 10, depth: 1 })])
  if (!page) notFound()

  const faqItems = collectFaqItemsFromPageBlocks(page.blocks)
  const faqJsonLd = buildFaqPageJsonLd(faqItems)
  const primaryStore = stores[0]
  
  const phoneRaw = primaryStore?.phone
  const phoneHref = phoneRaw ? `tel:${phoneRaw.replace(/\s/g, '')}` : undefined
  const email = primaryStore?.email
  const emailHref = email ? `mailto:${email}` : undefined
  const whatsAppRaw = primaryStore?.whatsApp
  const whatsAppHref = whatsAppRaw || (phoneRaw ? `https://wa.me/${phoneRaw.replace(/\D/g, '')}` : undefined)

  return (
    <div className="pb-24 md:pb-0">
      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      ) : null}

      {/* ── Hero ── */}
      <ContactHero />

      {/* ── Contact Options Grid ── */}
      <section className="container mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ContactMethodCard 
            title="WhatsApp Us"
            description="Fastest response for quick questions and booking."
            actionLabel="Start Chat"
            href={whatsAppHref || '#'}
            icon={<ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />}
            isPrimary
          />
          <ContactMethodCard 
            title="Call Store"
            description="Speak directly with our optical specialists."
            actionLabel={phoneRaw || 'Call Now'}
            href={phoneHref || '#'}
            icon={<PhoneIcon className="h-6 w-6" />}
          />
          <ContactMethodCard 
            title="Email Support"
            description="For detailed inquiries and order follow-ups."
            actionLabel="Send Email"
            href={emailHref || '#'}
            icon={<EnvelopeIcon className="h-6 w-6" />}
          />
          <ContactMethodCard 
            title="Visit Showroom"
            description="Walk in for adjustments or to browse."
            actionLabel="Get Directions"
            href={primaryStore?.mapsUrl || '#'}
            icon={<MapPinIcon className="h-6 w-6" />}
          />
        </div>
      </section>

      {/* ── Form & Trust Section ── */}
      <section className="container mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-start">
          <div>
            <h2 className="font-display text-3xl font-semibold text-brand-ink mb-2">Send us a message</h2>
            <p className="text-brand-sm text-brand-muted-foreground mb-8">
              Prefer to write? Fill out the form below and we'll route it to the right team member.
            </p>
            <SmartContactForm />
          </div>
          <div className="hidden lg:block sticky top-24">
            <TrustSnippets />
          </div>
        </div>
      </section>

      {/* ── Location Map ── */}
      <LocationMapSection store={primaryStore} />

      {/* ── FAQs ── */}
      {faqItems && faqItems.length > 0 && (
        <FAQAccordion faqs={faqItems} />
      )}

      {/* ── Mobile Sticky CTA ── */}
      <StickyBookingCTA 
        bookingUrl="/services" 
        whatsappNumber={phoneRaw} 
        ctaLabel="Book Appointment" 
      />
    </div>
  )
}
