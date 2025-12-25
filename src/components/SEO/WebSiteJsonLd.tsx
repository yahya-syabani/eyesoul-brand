import React from 'react'

type Props = {
  siteName?: string
  siteUrl?: string
  searchPath?: string
  queryParam?: string
}

export default function WebSiteJsonLd({
  siteName = 'Eyesoul Eyewear',
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eyesoul-eyewear.com',
  searchPath = '/search-result',
  queryParam = 'query',
}: Props) {
  const target = `${siteUrl}${searchPath}?${queryParam}={search_term_string}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target,
      'query-input': 'required name=search_term_string',
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}


