import type { CmsPost } from '@/lib/cms/posts'
import type { BlogCardPost } from '@/lib/cms/ui-types'

export function formatCmsPostDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

export function toBlogCardPost(post: CmsPost): BlogCardPost {
  const featuredImage = post.featuredImage && typeof post.featuredImage === 'object'
    ? {
        src: post.featuredImage.url || '',
        alt: post.featuredImage.alt || post.title,
        width: post.featuredImage.width || 1600,
        height: post.featuredImage.height || 900,
      }
    : {
        src: '',
        alt: post.title,
        width: 1600,
        height: 900,
      }

  const authorAvatar = post.authorAvatar && typeof post.authorAvatar === 'object'
    ? {
        src: post.authorAvatar.url || '',
        alt: post.authorAvatar.alt || post.authorName || 'Author',
        width: post.authorAvatar.width || 96,
        height: post.authorAvatar.height || 96,
      }
    : {
        src: '',
        alt: post.authorName || 'Author',
        width: 96,
        height: 96,
      }

  return {
    id: String(post.id),
    handle: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    featuredImage,
    date: formatCmsPostDate(post.updatedAt),
    datetime: post.updatedAt,
    timeToRead: post.timeToRead || '3 min read',
    category: post.category ? { title: post.category, href: '/journal' } : undefined,
    author: {
      name: post.authorName || 'Eyesoul Team',
      avatar: authorAvatar,
      description: post.authorBio || 'Eyesoul editorial team.',
    },
  }
}
