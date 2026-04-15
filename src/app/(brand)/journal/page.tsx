import SectionGridPosts from '@/components/blog/SectionGridPosts'
import SectionMagazine5 from '@/components/blog/SectionMagazine5'
import { JournalPageHeader } from '@/components/brand/JournalPageHeader'
import { JOURNAL_INDEX_METADATA } from '@/lib/cms/journalMetadata'
import { toBlogCardPost } from '@/lib/cms/postMappers'
import { getPosts } from '@/lib/cms/posts'

export const metadata = JOURNAL_INDEX_METADATA

export default async function JournalIndexPage() {
  const postsRes = await getPosts({ limit: 24, depth: 2 })
  const posts = postsRes.docs.map(toBlogCardPost)

  if (!posts.length) {
    return (
      <section className="container py-12">
        <JournalPageHeader title="Journal" />
        <p className="mt-3 text-neutral-500">No published articles yet.</p>
      </section>
    )
  }

  return (
    <section className="container py-10 md:py-14">
      <JournalPageHeader
        title="Journal"
        description="Stories, guides, and insights from the Eyesoul team."
      />
      <SectionMagazine5 posts={posts} className="mt-10" />
      <SectionGridPosts posts={posts.slice(1)} className="py-16 lg:py-20" heading="Latest articles" />
    </section>
  )
}
