'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import BreadcrumbProduct from '@/components/Breadcrumb/BreadcrumbProduct'
import Default from '@/components/Product/Detail/Default';
import Footer from '@/components/Footer/Footer'
import ProductJsonLd from '@/components/SEO/ProductJsonLd'
import BreadcrumbJsonLd from '@/components/SEO/BreadcrumbJsonLd'
import FeatureErrorBoundary from '@/components/Error/FeatureErrorBoundary'
import { ProductType } from '@/type/ProductType'

const ProductDefaultContent = () => {
    const searchParams = useSearchParams()
    let productId = searchParams.get('id')

    if (productId === null) {
        productId = '1'
    }

    const [product, setProduct] = useState<ProductType | undefined>(undefined)
    const [productList, setProductList] = useState<ProductType[]>([])

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${productId}`, { cache: 'no-store' })
                if (res.ok) {
                    const json = await res.json()
                    setProduct(json)
                    setProductList([json])
                } else {
                    setProduct(undefined)
                    setProductList([])
                }
            } catch (error) {
                console.error(error)
                setProduct(undefined)
                setProductList([])
            }
        }
        fetchProduct()
    }, [productId])

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anvogue.com'

    return (
        <>
            <TopNavOne props="style-two bg-purple" slogan='Limited Offer: Free shipping on orders over $50' />
            <div id="header" className='relative w-full'>
                <MenuTwo />
                <BreadcrumbProduct data={productList} productPage='default' productId={productId} />
            </div>
            <BreadcrumbJsonLd
                items={[
                    { name: 'Home', item: `${siteUrl}/` },
                    { name: 'Product', item: `${siteUrl}/product/default?id=${productId}` },
                ]}
            />
            {product && <ProductJsonLd product={product} />}
            <FeatureErrorBoundary featureName="Product Details">
                <Default data={productList} productId={productId} />
            </FeatureErrorBoundary>
            <Footer />
        </>
    )
}

export default ProductDefaultContent

