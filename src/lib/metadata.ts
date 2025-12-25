import type { Metadata } from 'next'
import { ProductType } from '@/type/ProductType'

const siteName = 'Eyesoul Eyewear'
const siteDescription = 'Multipurpose eCommerce Template - Discover the latest eyewear trends and shop premium quality products'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eyesoul-eyewear.com'

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export function generatePageMetadata(
  title: string,
  description?: string,
  image?: string,
  path?: string
): Metadata {
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`
  const metaDescription = description || siteDescription
  const canonicalUrl = path ? `${siteUrl}${path}` : siteUrl

  return {
    title: fullTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url: canonicalUrl,
      ...(image && { images: [{ url: image }] }),
    },
    twitter: {
      title: fullTitle,
      description: metaDescription,
      ...(image && { images: [image] }),
    },
  }
}

export function generateProductMetadata(product?: ProductType): Metadata {
  if (!product) {
    return generatePageMetadata('Product Not Found', 'The product you are looking for could not be found.')
  }

  const title = `${product.name} | ${siteName}`
  const description = product.description || `Shop ${product.name} - ${siteDescription}`
  const price = `$${product.price}.00`
  const image = product.images?.[0] || product.thumbImage?.[0] || '/images/product/1000x1000.png'
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`

  const productUrl = `${siteUrl}/product/default?id=${product.id}`

  return {
    title,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      type: 'website',
      title,
      description,
      images: [{ url: fullImageUrl }],
      siteName,
      url: productUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
    },
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'USD',
      'product:availability': product.quantity > 0 ? 'in stock' : 'out of stock',
    },
  }
}

