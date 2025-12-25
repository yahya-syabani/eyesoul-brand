import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import ProductDefaultContent from './ProductDefaultContent'
import { generateProductMetadata } from '@/lib/metadata'
import ProductSkeleton from '@/components/Loading/ProductSkeleton'

async function fetchProduct(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/products/${id}`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error('Error fetching product for metadata:', error)
    return null
  }
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ id?: string }> }): Promise<Metadata> {
  const params = await searchParams
  const id = params?.id || '1'
  const product = await fetchProduct(id)
  return generateProductMetadata(product)
}

const ProductDefault = () => {
    return (
        <Suspense fallback={
            <div className="product-detail md:py-20 py-10">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-8">
                        <ProductSkeleton count={1} />
                        <div className="space-y-4">
                            <div className="h-8 w-3/4 bg-line rounded animate-pulse"></div>
                            <div className="h-4 w-full bg-line rounded animate-pulse"></div>
                            <div className="h-6 w-1/2 bg-line rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        }>
            <ProductDefaultContent />
        </Suspense>
    )
}

export default ProductDefault