'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import ShopBreadCrumbImg from '@/components/Shop/ShopBreadCrumbImg';
import productData from '@/data/Product.json'
import Footer from '@/components/Footer/Footer'

const ShopDefaultContent = () => {
    const searchParams = useSearchParams()
    const type = searchParams.get('type')

    return (
        <>
            <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" />
            <div id="header" className='relative w-full'>
                <MenuOne props="bg-transparent" />
            </div>
            <ShopBreadCrumbImg data={productData} productPerPage={12} dataType={type} />
            <Footer />
        </>
    )
}

export default function Default() {
    return (
        <Suspense fallback={null}>
            <ShopDefaultContent />
        </Suspense>
    )
}
