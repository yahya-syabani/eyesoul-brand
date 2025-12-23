import React from 'react'

export type BreadcrumbItem = {
  name: string
  item: string
}

type Props = {
  items: BreadcrumbItem[]
}

export default function BreadcrumbJsonLd({ items }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: it.name,
      item: it.item,
    })),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}


