import type { Metadata } from 'next'
import React, { Suspense } from 'react'
import { generatePageMetadata } from '@/lib/metadata'
import BlogDefaultContent from './BlogDefaultContent'
import Spinner from '@/components/Loading/Spinner'

export const metadata: Metadata = generatePageMetadata(
  'Blog',
  'Read the latest eyewear trends, styling tips, and brand updates from our blog.'
)

const BlogDefault = () => {
    return (
        <Suspense fallback={
            <div className="blog default md:py-20 py-10">
                <div className="container">
                    <Spinner size="lg" text="Loading blog..." />
                </div>
            </div>
        }>
            <BlogDefaultContent />
        </Suspense>
    )
}

export default BlogDefault