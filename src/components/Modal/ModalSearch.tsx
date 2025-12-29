'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useRouter, Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Product from '../Product/Product';
import { useModalSearchContext } from '@/context/ModalSearchContext'
import { useModalA11y } from '@/hooks/useModalA11y'
import { ProductType } from '@/type/ProductType'

const ModalSearch = () => {
    const t = useTranslations()
    const { isModalOpen, closeModalSearch } = useModalSearchContext();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [productData, setProductData] = useState<ProductType[]>([]);
    const router = useRouter()
    const dialogRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (isModalOpen) {
            const fetchProducts = async () => {
                try {
                    const res = await fetch('/api/products?limit=4', { cache: 'no-store' })
                    if (res.ok) {
                        const json = await res.json()
                        setProductData(json.data || [])
                    }
                } catch (error) {
                    console.error('Error fetching products:', error)
                }
            }
            fetchProducts()
        }
    }, [isModalOpen])

    useModalA11y({ isOpen: isModalOpen, onClose: closeModalSearch, containerRef: dialogRef, initialFocusRef: inputRef })

    const handleSearch = (value: string) => {
        router.push(`/search-result?query=${encodeURIComponent(value)}` as '/search-result')
        closeModalSearch()
        setSearchKeyword('')
    }

    return (
        <>
            <div className={`modal-search-block`} onClick={closeModalSearch} aria-hidden={!isModalOpen} role="presentation">
                <div
                    className={`modal-search-main md:p-10 p-6 rounded-[32px] ${isModalOpen ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation() }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="search-modal-title"
                    tabIndex={-1}
                    ref={dialogRef}
                >
                    <h2 id="search-modal-title" className="sr-only">{t('modals.search.title')}</h2>
                    <div className="form-search relative">
                        <button
                            type="button"
                            className="absolute right-6 top-1/2 -translate-y-1/2"
                            onClick={() => handleSearch(searchKeyword)}
                            aria-label={t('common.search')}
                        >
                            <Icon.MagnifyingGlass className="heading5" aria-hidden="true" />
                        </button>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={t('modals.search.placeholder')}
                            className='text-button-lg h-14 rounded-2xl border border-line w-full pl-6 pr-12'
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchKeyword)}
                            aria-label={t('modals.search.title')}
                        />
                    </div>
                    <div className="keyword mt-8">
                        <div className="heading5">{t('modals.search.featureKeywords')}</div>
                        <div className="list-keyword flex items-center flex-wrap gap-3 mt-4">
                            <button
                                type="button"
                                className="item px-4 py-1.5 border border-line rounded-full cursor-pointer duration-300 hover:bg-black hover:text-white"
                                onClick={() => handleSearch('dress')}
                            >
                                Dress
                            </button>
                            <button
                                type="button"
                                className="item px-4 py-1.5 border border-line rounded-full cursor-pointer duration-300 hover:bg-black hover:text-white"
                                onClick={() => handleSearch('t-shirt')}
                            >
                                T-shirt
                            </button>
                            <button
                                type="button"
                                className="item px-4 py-1.5 border border-line rounded-full cursor-pointer duration-300 hover:bg-black hover:text-white"
                                onClick={() => handleSearch('underwear')}
                            >
                                Underwear
                            </button>
                            <button
                                type="button"
                                className="item px-4 py-1.5 border border-line rounded-full cursor-pointer duration-300 hover:bg-black hover:text-white"
                                onClick={() => handleSearch('top')}
                            >
                                Top
                            </button>
                        </div>
                    </div>
                    <div className="list-recent mt-8">
                        <div className="heading6">{t('modals.search.recentlyViewed')}</div>
                        <div className="list-product pb-5 hide-product-sold grid xl:grid-cols-4 sm:grid-cols-2 gap-7 mt-4">
                            {productData.slice(0, 4).map((product) => (
                                <Product key={product.id} data={product} type='grid' />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalSearch