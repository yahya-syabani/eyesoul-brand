import { Metadata } from 'next'

import SectionGridPosts from '@/components/blog/SectionGridPosts'
import SectionMagazine5 from '@/components/blog/SectionMagazine5'
import { getPosts, type CmsPost } from '@/lib/cms/posts'
import type { BlogCardPost } from '@/lib/cms/ui-types'

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Stories, guides, and insights from the Eyesoul team.',
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

function toBlogPost(post: CmsPost): BlogCardPost {
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
    date: formatDate(post.updatedAt),
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

export default async function JournalIndexPage() {
  const postsRes = await getPosts({ limit: 24, depth: 2 })
  const posts = postsRes.docs.map(toBlogPost)

  if (!posts.length) {
    return (
      <section className="container py-12">
        <h1 className="text-3xl font-semibold">Journal</h1>
        <p className="mt-3 text-neutral-500">No published articles yet.</p>
      </section>
    )
  }

  return (
    <section className="container py-10 md:py-14">
      <h1 className="text-3xl font-semibold">Journal</h1>
      <p className="mt-3 text-neutral-500">Stories, guides, and insights from the Eyesoul team.</p>
      <SectionMagazine5 posts={posts} className="mt-10" />
      <SectionGridPosts posts={posts.slice(1)} className="py-16 lg:py-20" heading="Latest articles" />
    </section>
  )
}
