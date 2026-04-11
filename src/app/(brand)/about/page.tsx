import { notFound } from 'next/navigation'

import { PageBlocks } from '@/components/brand/PageBlocks'
import { BrandH1 } from '@/components/brand/BrandTypography'
import { getPageBySlug } from '@/lib/cms/pages'

export default async function AboutPage() {
  const page = await getPageBySlug('about', { depth: 3 })
  if (!page) notFound()

  return (
    <div className="pb-16">
      <header className="border-b border-brand-border bg-brand-muted/30">
        <div className="container py-10 md:py-14">
          <BrandH1>{page.title}</BrandH1>
        </div>
      </header>
      <PageBlocks blocks={page.blocks} />
    </div>
  )
}
