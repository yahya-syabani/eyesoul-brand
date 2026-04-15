import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'

import { BrandRichText } from '@/components/brand/BrandRichText'
import { JournalPageHeader } from '@/components/brand/JournalPageHeader'
import SectionGridPosts from '@/components/blog/SectionGridPosts'
import { toJournalPostMetadata } from '@/lib/cms/journalMetadata'
import { formatCmsPostDate, toBlogCardPost } from '@/lib/cms/postMappers'
import { getPostBySlug, getPosts } from '@/lib/cms/posts'

type Params = { slug: string }

export async function generateStaticParams() {
  const posts = await getPosts({ limit: 200, depth: 1 })
  return posts.docs.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug, { depth: 2 })
  if (!post) return {}
  return toJournalPostMetadata(post)
}

export default async function JournalDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug, { depth: 2 })
  if (!post) notFound()

  const related = (await getPosts({ limit: 4, depth: 2 })).docs
    .filter((item) => item.slug !== post.slug)
    .map(toBlogCardPost)

  const hero = post.featuredImage && typeof post.featuredImage === 'object' ? post.featuredImage : null
  const metaLine = `${post.authorName || 'Eyesoul Team'} · ${formatCmsPostDate(post.updatedAt)} · ${post.timeToRead || '3 min read'}`

  return (
    <article className="container py-10 md:py-14">
      <JournalPageHeader
        categoryLabel={post.category || 'Journal'}
        title={post.title}
        description={post.excerpt}
        metaLine={metaLine}
      />

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
