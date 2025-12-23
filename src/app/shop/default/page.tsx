import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import ShopDefaultContent from './ShopDefaultContent'
import { generatePageMetadata } from '@/lib/metadata'
import ProductSkeleton from '@/components/Loading/ProductSkeleton'

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ type?: string }> }): Promise<Metadata> {
  const params = await searchParams
  const type = params?.type
  const title = type ? `${type.charAt(0).toUpperCase() + type.slice(1)} | Shop` : 'Shop'
  return generatePageMetadata(title, `Browse our collection of ${type || 'fashion'} products. Find the perfect style for you.`)
}

export default function Default() {
    return (
        <Suspense fallback={
            <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
                <div className="container">
                    <div className="list-product grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px]">
                        <ProductSkeleton count={12} />
                    </div>
                </div>
            </div>
        }>
            <ShopDefaultContent />
        </Suspense>
    )
}
