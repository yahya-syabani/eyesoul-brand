'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import ShopBreadCrumbImg from '@/components/Shop/ShopBreadCrumbImg';
import FeatureErrorBoundary from '@/components/Error/FeatureErrorBoundary'
import productData from '@/data/Product.json'
import Footer from '@/components/Footer/Footer'
import BreadcrumbJsonLd from '@/components/SEO/BreadcrumbJsonLd'

const ShopDefaultContent = () => {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anvogue.com'

    return (
        <>
            <TopNavOne props="style-two bg-purple" slogan='Limited Offer: Free shipping on orders over $50' />
            <div id="header" className='relative w-full'>
                <MenuTwo />
            </div>
            <BreadcrumbJsonLd
                items={[
                    { name: 'Home', item: `${siteUrl}/` },
                    { name: 'Shop', item: `${siteUrl}/shop/default${type ? `?type=${encodeURIComponent(type)}` : ''}` },
                ]}
            />
            <FeatureErrorBoundary featureName="Shop Products">
                <ShopBreadCrumbImg data={productData} productPerPage={12} dataType={type} />
            </FeatureErrorBoundary>
            <Footer />
        </>
    )
}

export default ShopDefaultContent

