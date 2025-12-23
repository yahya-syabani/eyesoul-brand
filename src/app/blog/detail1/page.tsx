import type { Metadata } from 'next'
import React, { Suspense } from 'react'
import { generatePageMetadata } from '@/lib/metadata'
import blogData from '@/data/Blog.json'
import BlogDetailOneContent from './BlogDetailOneContent'
import Spinner from '@/components/Loading/Spinner'

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ id?: string }> }): Promise<Metadata> {
  const params = await searchParams
  const id = params?.id || '14'
  const blog = blogData[Number(id) - 1]
  const title = blog ? blog.title : 'Blog Post'
  const description = blog ? blog.shortDesc : 'Read our latest blog post.'
  return generatePageMetadata(title, description, blog?.thumbImg)
}

const BlogDetailOne = () => {
    return (
        <Suspense fallback={
            <div className="blog detail1 md:py-20 py-10">
                <div className="container">
                    <Spinner size="lg" text="Loading blog post..." />
                </div>
            </div>
        }>
            <BlogDetailOneContent />
        </Suspense>
    )
}

export default BlogDetailOne