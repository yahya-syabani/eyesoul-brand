import React from 'react'
import { ProductType } from '@/type/ProductType'

interface ProductJsonLdProps {
  product: ProductType
  siteUrl?: string
  localePrefix?: string
}

const ProductJsonLd: React.FC<ProductJsonLdProps> = ({ product, siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eyesoul-eyewear.com', localePrefix = '' }) => {
  const productUrl = `${siteUrl}${localePrefix}/product/default?id=${product.id}`
  const imageUrl = product.images?.[0] || product.thumbImage?.[0] || '/images/product/1000x1000.png'
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `Shop ${product.name} at Eyesoul Eyewear`,
    image: product.images?.map((img) => (img.startsWith('http') ? img : `${siteUrl}${img}`)) || [fullImageUrl],
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'USD',
      price: product.price,
      availability: product.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    aggregateRating: product.rate
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rate,
          reviewCount: product.sold || 0,
        }
      : undefined,
    sku: product.id,
  }

  // Remove undefined fields
  if (!jsonLd.aggregateRating) {
    delete jsonLd.aggregateRating
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default ProductJsonLd

