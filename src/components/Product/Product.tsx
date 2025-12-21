'use client'

import React from 'react'
import { ProductType } from '@/type/ProductType'
import ProductGrid from './ProductGrid'
import ProductList from './ProductList'
import ProductMarketplace from './ProductMarketplace'

interface ProductProps {
    data: ProductType
    type: string
}

const Product: React.FC<ProductProps> = ({ data, type }) => {
    if (type === 'grid') return <ProductGrid data={data} />
    if (type === 'list') return <ProductList data={data} />
    if (type === 'marketplace') return <ProductMarketplace data={data} />
    return null
}

export default Product