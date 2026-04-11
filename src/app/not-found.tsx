import Link from 'next/link'
import { Metadata } from 'next'

import { BrandButton } from '@/components/brand/BrandButton'
import { BrandShell } from '@/components/brand/BrandShell'
import { BrandH1, BrandLead } from '@/components/brand/BrandTypography'

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The page you were looking for does not exist.',
}

export default function NotFound() {
  return (
    <BrandShell>
      <div className="container flex flex-col items-center py-24 text-center">
        <BrandH1>404</BrandH1>
        <BrandLead className="mt-4">This page is not part of the Eyesoul site, or the link may be broken.</BrandLead>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <BrandButton href="/" variant="primary">
            Home
          </BrandButton>
          <BrandButton href="/catalog" variant="secondary">
            Catalog
          </BrandButton>
        </div>
        <Link href="/contact" className="mt-8 text-brand-sm text-brand-accent-hover underline">
          Contact support
        </Link>
      </div>
    </BrandShell>
  )
}
