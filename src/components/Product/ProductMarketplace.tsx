'use client'

import React, { memo } from 'react'
import Image from 'next/image'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { useRouter } from 'next/navigation'
import { ProductType } from '@/type/ProductType'
import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useModalWishlistContext } from '@/context/ModalWishlistContext'
import { useCompare } from '@/context/CompareContext'
import { useModalCompareContext } from '@/context/ModalCompareContext'
import { useModalQuickviewContext } from '@/context/ModalQuickviewContext'
import Rate from '../Other/Rate'

type Props = {
  data: ProductType
}

const ProductMarketplace: React.FC<Props> = ({ data }) => {
  const { addToCart, updateCart, cartState } = useCart()
  const { openModalCart } = useModalCartContext()
  const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist()
  const { openModalWishlist } = useModalWishlistContext()
  const { addToCompare, removeFromCompare, compareState } = useCompare()
  const { openModalCompare } = useModalCompareContext()
  const { openQuickview } = useModalQuickviewContext()
  const router = useRouter()

  const isWishlisted = wishlistState.wishlistArray.some((item) => item.id === data.id)
  const isCompared = compareState.compareArray.some((item) => item.id === data.id)

  const handleAddToCart = () => {
    if (!cartState.cartArray.find((item) => item.id === data.id)) {
      addToCart({ ...data })
      updateCart(data.id, data.quantityPurchase, '', '')
    } else {
      updateCart(data.id, data.quantityPurchase, '', '')
    }
    openModalCart()
  }

  const handleAddToWishlist = () => {
    if (isWishlisted) removeFromWishlist(data.id)
    else addToWishlist(data)
    openModalWishlist()
  }

  const handleAddToCompare = () => {
    if (compareState.compareArray.length < 3) {
      if (isCompared) removeFromCompare(data.id)
      else addToCompare(data)
    } else {
      alert('Compare up to 3 products')
    }
    openModalCompare()
  }

  const handleQuickviewOpen = () => {
    openQuickview(data)
  }

  const handleDetailProduct = () => {
    router.push(`/product/default?id=${data.id}`)
  }

  return (
    <div className="product-item style-marketplace p-4 border border-line rounded-2xl" onClick={handleDetailProduct}>
      <div className="bg-img relative w-full">
        <Image className="w-full aspect-square" width={5000} height={5000} src={data.thumbImage[0]} alt="img" />
        <div className="list-action flex flex-col gap-1 absolute top-0 right-0">
          <span
            className={`add-wishlist-btn w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-small duration-300 ${
              isWishlisted ? 'active' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation()
              handleAddToWishlist()
            }}
          >
            {isWishlisted ? <Icon.Heart size={18} weight="fill" className="text-white" /> : <Icon.Heart size={18} />}
          </span>

          <span
            className={`compare-btn w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-small duration-300 ${
              isCompared ? 'active' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation()
              handleAddToCompare()
            }}
          >
            <Icon.Repeat size={18} className="compare-icon" />
            <Icon.CheckCircle size={20} className="checked-icon" />
          </span>

          <span
            className="quick-view-btn w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-small duration-300"
            onClick={(e) => {
              e.stopPropagation()
              handleQuickviewOpen()
            }}
          >
            <Icon.Eye />
          </span>

          <span
            className="add-cart-btn w-8 h-8 bg-white flex items-center justify-center rounded-full box-shadow-small duration-300"
            onClick={(e) => {
              e.stopPropagation()
              handleAddToCart()
            }}
          >
            <Icon.ShoppingBagOpen />
          </span>
        </div>
      </div>

      <div className="product-infor mt-4">
        <span className="text-title">{data.name}</span>
        <div className="flex gap-0.5 mt-1">
          <Rate currentRate={data.rate} size={16} />
        </div>
        <span className="text-title inline-block mt-1">${data.price}.00</span>
      </div>
    </div>
  )
}

export default memo(ProductMarketplace)


