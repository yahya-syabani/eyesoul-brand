import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'

import { BrandRichText } from '@/components/brand/BrandRichText'
import SectionGridPosts from '@/components/blog/SectionGridPosts'
import { getPostBySlug, getPosts, type CmsPost } from '@/lib/cms/posts'
import type { BlogCardPost } from '@/lib/cms/ui-types'

type Params = { slug: string }

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

export async function generateStaticParams() {
  const posts = await getPosts({ limit: 200, depth: 1 })
  return posts.docs.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug, { depth: 2 })
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} — Eyesoul Journal`,
      description: post.excerpt,
      url: `https://eyesoul.brand/journal/${post.slug}`,
    },
  }
}

export default async function JournalDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug, { depth: 2 })
  if (!post) notFound()

  const related = (await getPosts({ limit: 4, depth: 2 })).docs
    .filter((item) => item.slug !== post.slug)
    .map(toBlogPost)

  const hero = post.featuredImage && typeof post.featuredImage === 'object' ? post.featuredImage : null

  return (
    <article className="container py-10 md:py-14">
      <p className="text-sm uppercase tracking-wide text-neutral-500">{post.category || 'Journal'}</p>
      <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{post.title}</h1>
      <p className="mt-3 text-neutral-500">{post.excerpt}</p>
      <p className="mt-4 text-sm text-neutral-500">
        {post.authorName || 'Eyesoul Team'} · {formatDate(post.updatedAt)} · {post.timeToRead || '3 min read'}
      </p>

      {hero?.url ? (
        <div className="relative mt-8 aspect-16/9 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700">
          <Image
            src={hero.url}
            alt={hero.alt || post.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 1024px, 100vw"
            priority
          />
        </div>
      ) : null}

      <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
        <BrandRichText data={post.content as any} />
      </div>

      {related.length > 0 ? (
        <SectionGridPosts className="py-16" posts={related} heading="Related articles" />
      ) : null}
    </article>
  )
}
