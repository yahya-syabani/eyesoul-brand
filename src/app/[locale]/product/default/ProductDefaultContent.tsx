'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl'
import BreadcrumbProduct from '@/components/Breadcrumb/BreadcrumbProduct'
import Default from '@/components/Product/Detail/Default';
import Footer from '@/components/Footer/Footer'
import ProductJsonLd from '@/components/SEO/ProductJsonLd'
import BreadcrumbJsonLd from '@/components/SEO/BreadcrumbJsonLd'
import FeatureErrorBoundary from '@/components/Error/FeatureErrorBoundary'
import { ProductType } from '@/type/ProductType'

const ProductDefaultContent = () => {
    const locale = useLocale()
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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eyesoul-eyewear.com'
    const localePrefix = locale !== 'en' ? `/${locale}` : ''

    return (
        <>
            <div id="header" className='relative w-full'>
                <BreadcrumbProduct data={productList} productPage='default' productId={productId} />
            </div>
            <BreadcrumbJsonLd
                items={[
                    { name: 'Home', item: `${siteUrl}${localePrefix}/` },
                    { name: 'Product', item: `${siteUrl}${localePrefix}/product/default?id=${productId}` },
                ]}
            />
            {product && <ProductJsonLd product={product} siteUrl={siteUrl} localePrefix={localePrefix} />}
            <FeatureErrorBoundary featureName="Product Details">
                <Default data={productList} productId={productId} />
            </FeatureErrorBoundary>
            <Footer />
        </>
    )
}

export default ProductDefaultContent

