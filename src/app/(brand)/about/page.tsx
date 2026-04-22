import { notFound } from 'next/navigation'

import { PageBlocks } from '@/components/brand/PageBlocks'
import { getPageBySlug } from '@/lib/cms/pages'
import { buildFaqPageJsonLd, collectFaqItemsFromPageBlocks } from '@/lib/seo/faqJsonLd'

export default async function AboutPage() {
  const page = await getPageBySlug('about', { depth: 3 })
  if (!page) notFound()

  const faqItems = collectFaqItemsFromPageBlocks(page.blocks)
  const faqJsonLd = buildFaqPageJsonLd(faqItems)

  return (
    <div className="pb-16">
      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      ) : null}
      <PageBlocks blocks={page.blocks} />
    </div>
  )
}
