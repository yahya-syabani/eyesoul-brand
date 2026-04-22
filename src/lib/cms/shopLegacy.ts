import type { TBlogPost, TCollection, TOrder, TProductItem } from '@/data/data'
import { toTCollections, toTProductItem, toTProductItems } from '@/lib/cms/adapters'
import { toBlogCardPost } from '@/lib/cms/postMappers'
import { getPosts } from '@/lib/cms/posts'
import { getCollectionBySlug, getCollections } from '@/lib/cms/productCollections'
import { getProductBySlug, getProducts } from '@/lib/cms/products'
import type { ProductReviewItem } from '@/lib/cms/ui-types'

export type LegacyCartLine = {
  id?: string
  name?: string
  handle?: string
  image?: { src?: string; alt?: string; width?: number; height?: number }
  price?: number
  size?: string
  color?: string
  quantity?: number
}

export async function getLegacyShopProducts(): Promise<TProductItem[]> {
  const products = await getProducts({ limit: 200, depth: 2 })
  return toTProductItems(products)
}

export async function getLegacyShopProductDetailByHandle(
  handle: string,
): Promise<
  TProductItem & {
    description?: string
    breadcrumbs?: Array<{ id: number; name: string; href: string }>
  }
> {
  const product = await getProductBySlug(handle, { depth: 2 })
  if (!product) return {}

  return {
    ...toTProductItem(product),
    description: product.name,
    status: product.availabilityStatus || 'In Stock',
    breadcrumbs: [
      { id: 1, name: 'Home', href: '/' },
      { id: 2, name: 'Catalog', href: '/catalog' },
    ],
  }
}

export async function getLegacyShopProductReviews(handle: string): Promise<ProductReviewItem[]> {
  return [
    {
      id: `${handle}-review-1`,
      author: 'Eyesoul Customer',
      date: 'Apr 10, 2026',
      rating: 5,
      content: '<p>Excellent lens clarity and all-day comfort.</p>',
    },
    {
      id: `${handle}-review-2`,
      author: 'Verified Buyer',
      date: 'Apr 05, 2026',
      rating: 4,
      content: '<p>Great frame quality and premium finish.</p>',
    },
  ]
}

function toLegacyBlogPost(post: Awaited<ReturnType<typeof getPosts>>['docs'][number]): TBlogPost {
  const card = toBlogCardPost(post)
  return {
    id: card.id,
    handle: card.handle,
    title: card.title,
    excerpt: card.excerpt,
    date: card.date,
    timeToRead: card.timeToRead,
    category: card.category
      ? { title: card.category.title, href: card.category.href }
      : { title: 'Journal', href: '/journal' },
    featuredImage: {
      src: card.featuredImage.src,
      width: card.featuredImage.width ?? 1600,
      height: card.featuredImage.height ?? 900,
      alt: card.featuredImage.alt ?? '',
    },
    tags: ['eyesoul', 'journal'],
    author: {
      name: card.author.name,
      avatar: {
        src: card.author.avatar.src,
        width: card.author.avatar.width ?? 96,
        height: card.author.avatar.height ?? 96,
        alt: card.author.avatar.alt ?? '',
      },
      description: card.author.description ?? '',
    },
    content: post.content,
  } as TBlogPost
}

export async function getLegacyShopBlogPosts(): Promise<TBlogPost[]> {
  const postsRes = await getPosts({ limit: 24, depth: 2 })
  return postsRes.docs.map(toLegacyBlogPost)
}

export async function getLegacyShopBlogPostByHandle(handle: string): Promise<TBlogPost> {
  const postsRes = await getPosts({ limit: 200, depth: 2 })
  const post = postsRes.docs.find((item) => item.slug === handle)
  return post ? toLegacyBlogPost(post) : {}
}

function toCartLine(product: TProductItem, quantity = 1): LegacyCartLine {
  return {
    id: String(product.id),
    name: product.title,
    handle: product.handle,
    image: product.featuredImage,
    price: product.price || 0,
    size: 'Standard',
    color: product.selectedOptions?.find((option) => option.name === 'Color')?.value || 'Default',
    quantity,
  }
}

export async function getLegacyCart(): Promise<{
  id: string
  lines: LegacyCartLine[]
  cost: { subtotal: number; shipping: number; tax: number; total: number }
}> {
  const products = await getLegacyShopProducts()
  const lines = products.slice(0, 2).map((product, index) => toCartLine(product, index + 1))
  const subtotal = lines.reduce((sum, line) => sum + (line.price || 0) * (line.quantity || 1), 0)
  const shipping = lines.length ? 15 : 0
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  return {
    id: 'cms-legacy-cart',
    lines,
    cost: { subtotal, shipping, tax, total },
  }
}

export async function getLegacyOrders(): Promise<TOrder[]> {
  const cart = await getLegacyCart()
  return [
    {
      id: 'cms-legacy-order-1',
      number: 'CMS-2026-0001',
      products: cart.lines.map((line) => ({
        id: line.id,
        title: line.name,
        handle: line.handle,
        featuredImage: line.image,
        color: line.color,
        size: line.size,
        quantity: line.quantity,
        price: line.price,
      })),
      cost: cart.cost,
    },
  ] as unknown as TOrder[]
}

export async function getLegacyShopCollections(): Promise<TCollection[]> {
  const collections = await getCollections({ depth: 2 })
  return toTCollections(collections)
}

export async function getLegacyShopGroupCollections(): Promise<
  Array<{ id: string; title: string; iconSvg: string; collections: TCollection[] }>
> {
  const collections = await getLegacyShopCollections()
  return [
    {
      id: 'all',
      title: 'All Collections',
      iconSvg:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
      collections,
    },
  ]
}

export async function getLegacyRelatedProductsForHandle(handle: string): Promise<TProductItem[]> {
  const product = await getProductBySlug(handle, { depth: 2 })
  const firstCollection =
    product && Array.isArray(product.collections) && product.collections.length > 0 ? product.collections[0] : null
  if (!product || !firstCollection || typeof firstCollection !== 'object') {
    return (await getLegacyShopProducts()).slice(0, 6)
  }
  const { products } = await getCollectionBySlug(firstCollection.slug, { productDepth: 2, productLimit: 12 })
  return toTProductItems(products.filter((item) => item.slug !== handle)).slice(0, 6)
}
