export type CmsUiImage = {
  src: string
  alt?: string
  width?: number
  height?: number
}

export type BlogCardAuthor = {
  name: string
  avatar: CmsUiImage
  description?: string
}

export type BlogCardPost = {
  id: string
  title: string
  handle: string
  excerpt: string
  featuredImage: CmsUiImage
  date: string
  datetime?: string
  timeToRead: string
  author: BlogCardAuthor
  category?: {
    title: string
    href: string
  }
}

export type ProductReviewItem = {
  id: string
  title?: string
  author: string
  authorAvatar?: CmsUiImage
  date: string
  datetime?: string
  rating: number
  content: string
}
