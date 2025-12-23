import React from 'react'

type Props = {
  name?: string
  siteUrl?: string
  logoUrl?: string
  sameAs?: string[]
}

export default function OrganizationJsonLd({
  name = 'Anvogue',
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anvogue.com',
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


