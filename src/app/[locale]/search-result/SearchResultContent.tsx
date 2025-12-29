'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/routing'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import { ProductType } from '@/type/ProductType'
import Product from '@/components/Product/Product'
import HandlePagination from '@/components/Other/HandlePagination'
import * as Icon from "@phosphor-icons/react/dist/ssr";

const SearchResultContent = () => {
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(0);
    const [productData, setProductData] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const productsPerPage = 8;
    const offset = currentPage * productsPerPage;

    const router = useRouter()
    const searchParams = useSearchParams()
    const query = searchParams.get('query') || ''

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = new URLSearchParams()
                if (query) {
                    params.set('search', query)
                }
                params.set('limit', '100')
                const res = await fetch(`/api/products?${params.toString()}`, { cache: 'no-store' })
                if (res.ok) {
                    const json = await res.json()
                    setProductData(json.data || [])
                }
            } catch (error) {
                console.error('Error fetching products:', error)
                setProductData([])
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [query])

    const handleSearch = (value: string) => {
        router.push(`/search-result?query=${value}` as '/search-result')
        setSearchKeyword('')
    }

    let filteredData = productData

    const noDataProduct: ProductType = {
        id: 'no-data',
        category: 'sunglasses',
        type: 'sunglasses' as const,
        name: 'no-data',
        gender: 'no-data',
        new: false,
        sale: false,
        rate: 0,
        price: 0,
        originPrice: 0,
        brand: 'no-data',
        sold: 0,
        quantity: 0,
        quantityPurchase: 0,
        sizes: [],
        variation: [],
        thumbImage: [],
        images: [],
        description: 'no-data',
        action: 'no-data',
        slug: 'no-data'
    }

    if (filteredData.length === 0 && !loading) {
        filteredData = [noDataProduct];
    }

    const pageCount = Math.ceil(filteredData.length / productsPerPage);

    if (pageCount === 0) {
        setCurrentPage(0);
    }

    let currentProducts: ProductType[];

    if (filteredData.length > 0) {
        currentProducts = filteredData.slice(offset, offset + productsPerPage);
    } else {
        currentProducts = []
    }

    const handlePageChange = (selected: number) => {
        setCurrentPage(selected);
    };

    return (
        <>
            <div id="header" className='relative w-full'>
                <Breadcrumb heading='Search Result' subHeading='Search Result' />
            </div>
            <div className="shop-product breadcrumb1 lg:py-20 md:py-14 py-10">
                <div className="container">
                    <div className="heading flex flex-col items-center">
                        <div className="heading4 text-center">
                            {loading ? 'Searching...' : `Found ${filteredData.length} results for ${query ? `"${query}"` : 'all products'}`}
                        </div>
                        <div className="input-block lg:w-1/2 sm:w-3/5 w-full md:h-[52px] h-[44px] sm:mt-8 mt-5">
                            <div className='w-full h-full relative'>
                                <input
                                    type="text"
                                    placeholder='Search...'
                                    className='caption1 w-full h-full pl-4 md:pr-[150px] pr-32 rounded-xl border border-line'
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchKeyword)}
                                />
                                <button
                                    className='button-main absolute top-1 bottom-1 right-1 flex items-center justify-center'
                                    onClick={() => handleSearch(searchKeyword)}
                                >
                                    search
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="list-product-block relative md:pt-10 pt-6">
                        <div className="heading6">product Search: {query}</div>
                        <div className={`list-product hide-product-sold grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 sm:gap-[30px] gap-[20px] mt-5`}>
                            {currentProducts.map((item) => (
                                item.id === 'no-data' ? (
                                    <div key={item.id} className="no-data-product">No products match the selected criteria.</div>
                                ) : (
                                    <Product key={item.id} data={item} type='grid' />
                                )
                            ))}
                        </div>

                        {pageCount > 1 && (
                            <div className="list-pagination flex items-center justify-center md:mt-10 mt-7">
                                <HandlePagination pageCount={pageCount} onPageChange={handlePageChange} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default SearchResultContent

