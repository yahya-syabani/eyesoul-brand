import { notFound } from 'next/navigation'

import { ContactForm } from '@/components/brand/ContactForm'
import { PageBlocks } from '@/components/brand/PageBlocks'
import { BrandH1, BrandLead } from '@/components/brand/BrandTypography'
import { getPageBySlug } from '@/lib/cms/pages'

export default async function ContactPage() {
  const page = await getPageBySlug('contact', { depth: 3 })
  if (!page) notFound()

  return (
    <div className="pb-16">
      <header className="border-b border-brand-border bg-brand-muted/30">
        <div className="container py-10 md:py-14">
          <BrandH1>{page.title}</BrandH1>
          <BrandLead className="mt-4">Send a message — we will respond as soon as we can.</BrandLead>
        </div>
      </header>
      <PageBlocks blocks={page.blocks} />
      <section className="container mt-16 max-w-xl">
        <h2 className="font-display text-brand-2xl font-semibold text-brand-ink">Write to us</h2>
        <p className="mt-2 text-brand-sm text-brand-muted-foreground">Fields marked by the browser as required.</p>
        <div className="mt-6">
          <ContactForm />
        </div>
      </section>
    </div>
  )
}
