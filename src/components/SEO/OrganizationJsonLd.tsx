import React from 'react'

type Props = {
  name?: string
  siteUrl?: string
  logoUrl?: string
  sameAs?: string[]
}

export default function OrganizationJsonLd({
  name = 'Eyesoul Eyewear',
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eyesoul-eyewear.com',
  logoUrl,
  sameAs = [],
}: Props) {
  const resolvedLogoUrl =
    logoUrl || `${siteUrl}/images/brand/1.png`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: siteUrl,
    logo: resolvedLogoUrl,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}


