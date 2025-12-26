'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl'
import ShopBreadCrumbImg from '@/components/Shop/ShopBreadCrumbImg';
import FeatureErrorBoundary from '@/components/Error/FeatureErrorBoundary'
import Footer from '@/components/Footer/Footer'
import BreadcrumbJsonLd from '@/components/SEO/BreadcrumbJsonLd'
import { ProductType } from '@/type/ProductType'

const ShopDefaultContent = () => {
    const locale = useLocale()
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eyesoul-eyewear.com'
    const localePrefix = locale !== 'en' ? `/${locale}` : ''
    const [products, setProducts] = useState<ProductType[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = new URLSearchParams()
                if (type) params.set('category', type)
                params.set('limit', '60')
                const res = await fetch(`/api/products?${params.toString()}`, { cache: 'no-store' })
                if (!res.ok) throw new Error('Failed to load products')
                const json = await res.json()
                setProducts(json.data || [])
            } catch (error) {
                console.error(error)
                setProducts([])
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [type])

    return (
        <>
            <div id="header" className='relative w-full'>
            </div>
            <BreadcrumbJsonLd
                items={[
                    { name: 'Home', item: `${siteUrl}${localePrefix}/` },
                    { name: 'Shop', item: `${siteUrl}${localePrefix}/shop/default${type ? `?type=${encodeURIComponent(type)}` : ''}` },
                ]}
            />
            <FeatureErrorBoundary featureName="Shop Products">
                <ShopBreadCrumbImg data={products} productPerPage={12} dataType={type} isLoading={loading} />
            </FeatureErrorBoundary>
            <Footer />
        </>
    )
}

export default ShopDefaultContent

