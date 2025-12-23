import type { Metadata } from 'next'
import React, { Suspense } from 'react'
import { generatePageMetadata } from '@/lib/metadata'
import SearchResultContent from './SearchResultContent'
import ProductSkeleton from '@/components/Loading/ProductSkeleton'
import { sanitizeForMetadata } from '@/utils/sanitize'

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ query?: string }> }): Promise<Metadata> {
  const params = await searchParams
  const query = sanitizeForMetadata(params?.query || '')
  const title = query ? `Search Results for "${query}"` : 'Search Results'
  const desc = query
    ? `Find products matching "${query}". Browse our collection and discover your perfect style.`
    : 'Browse our collection and discover your perfect style.'
  return generatePageMetadata(title, desc)
}

const SearchResult = () => {
    return (
        <Suspense fallback={
            <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
                <div className="container">
                    <div className="list-product grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px]">
                        <ProductSkeleton count={8} />
                    </div>
                </div>
            </div>
        }>
            <SearchResultContent />
        </Suspense>
    )
}

export default SearchResult