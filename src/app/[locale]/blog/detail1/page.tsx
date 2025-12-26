import type { Metadata } from 'next'
import React, { Suspense } from 'react'
import { generatePageMetadata } from '@/lib/metadata'
import prisma from '@/lib/prisma'
import BlogDetailOneContent from './BlogDetailOneContent'
import Spinner from '@/components/Loading/Spinner'

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ id?: string }> }): Promise<Metadata> {
  const params = await searchParams
  const id = params?.id
  
  let blog = null
  if (id) {
    try {
      blog = await prisma.blog.findUnique({
        where: { id },
      })
    } catch (error) {
      console.error('Error fetching blog for metadata:', error)
    }
  }
  
  // Fallback to first blog if ID not found or not provided
  if (!blog) {
    try {
      const blogs = await prisma.blog.findMany({
        take: 1,
        orderBy: { createdAt: 'desc' },
      })
      blog = blogs[0] || null
    } catch (error) {
      console.error('Error fetching fallback blog for metadata:', error)
    }
  }
  
  const title = blog ? blog.title : 'Blog Post'
  const description = blog ? blog.shortDesc : 'Read our latest blog post.'
  return generatePageMetadata(title, description, blog?.thumbImg || undefined)
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