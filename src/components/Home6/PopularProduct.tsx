'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Link, useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { ProductType } from '@/type/ProductType'

const PopularProduct = () => {
    const router = useRouter()
    const t = useTranslations()
    const [products, setProducts] = useState<ProductType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products?limit=3&page=1')
                if (res.ok) {
                    const data = await res.json()
                    setProducts(data.data || [])
                }
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const handleDetailProduct = (productId: string) => {
        // redirect to shop with category selected
        router.push(`/product/default?id=${productId}` as '/product/default');
    };

    if (loading) {
        return (
            <div className="popular-product md:pt-10 pt-5">
                <div className="container">
                    <div className="heading3 text-center">
                        {t('home.popularProducts')}
                    </div>
                    <div className="text-center py-10 text-secondary">Loading...</div>
                </div>
            </div>
        )
    }

    if (products.length === 0) {
        return null
    }

    return (
        <>
            <div className="popular-product md:pt-10 pt-5">
                <div className="container">
                    <div className="heading3 text-center">
                        {t('home.popularProducts')}
                    </div>
                    <div className="list-product grid sm:grid-cols-3 md:mt-10 mt-6">
                        {products.map((product, index) => {
                            const imageUrl = product.images?.[0] || product.thumbImage?.[0] || '/images/product/1000x1000.png'
                            const positions = [
                                { top: '38%', left: '45%', bottom: '12%', bottomLeft: '62%' },
                                { top: '30%', left: '70%', bottom: '15%', bottomLeft: '25%' },
                                { top: '34%', left: '35%', bottom: '10%', bottomLeft: '70%' },
                            ]
                            const pos = positions[index] || positions[0]
                            
                            return (
                                <div key={product.id} className="item relative overflow-hidden">
                                    <Image
                                        src={imageUrl}
                                        width={1000}
                                        height={1000}
                                        alt={product.name}
                                        priority={index < 2}
                                        className={index === 2 ? 'w-full' : 'lg:h-[150%] sm:h-[130%] object-cover lg:-mt-[150px] sm:-mt-[40px]'}
                                    />
                                    <div className="dots absolute cursor-pointer" style={{ top: pos.top, left: pos.left }}>
                                        <div className="top-dot w-8 h-8 rounded-full bg-outline flex items-center justify-center">
                                            <span className="bg-white w-3 h-3 rounded-full duration-300"></span>
                                        </div>
                                        <div className="product-infor bg-white rounded-2xl p-4" onClick={() => handleDetailProduct(product.id)}>
                                            <div className="text-title name">{product.name}</div>
                                            <div className="price text-center">${Number(product.price).toFixed(2)}</div>
                                            <div className="text-center underline mt-1 text-button-uppercase duration-300 text-secondary2 hover:text-black">
                                                View
                                            </div>
                                        </div>
                                    </div>
                                    <div className="dots bottom-dot absolute cursor-pointer" style={{ bottom: pos.bottom, left: pos.bottomLeft }}>
                                        <div className="w-8 h-8 rounded-full bg-outline flex items-center justify-center">
                                            <span className="bg-white w-3 h-3 rounded-full duration-300"></span>
                                        </div>
                                        <div className="product-infor bg-white rounded-2xl p-4" onClick={() => handleDetailProduct(product.id)}>
                                            <div className="text-title name">{product.name}</div>
                                            <div className="price text-center">${Number(product.price).toFixed(2)}</div>
                                            <div className="text-center underline mt-1 text-button-uppercase duration-300 text-secondary2 hover:text-black">
                                                View
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
            </div>
            </div>
        </>
    )
}

export default PopularProduct