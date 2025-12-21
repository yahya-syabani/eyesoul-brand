'use client'

import React, { memo, useMemo, useState } from 'react'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import Marquee from 'react-fast-marquee'
import { useRouter } from 'next/navigation'
import { ProductType } from '@/type/ProductType'
import { useCart } from '@/context/CartContext'
import { useModalCartContext } from '@/context/ModalCartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useModalWishlistContext } from '@/context/ModalWishlistContext'
import { useCompare } from '@/context/CompareContext'
import { useModalCompareContext } from '@/context/ModalCompareContext'
import { useModalQuickviewContext } from '@/context/ModalQuickviewContext'
import ProductTags from './ProductTags'
import ProductImage from './ProductImage'
import ProductVariations from './ProductVariations'
import ProductQuickShop from './ProductQuickShop'
import ProductInfo from './ProductInfo'
import { ActionButton, CompareCheckedIcon, CompareIcon, QuickViewIcon, WishlistIcon } from './ProductActions'

type Props = {
  data: ProductType
}

const ProductGrid: React.FC<Props> = ({ data }) => {
  const [activeColor, setActiveColor] = useState<string>('')
  const [activeSize, setActiveSize] = useState<string>('')
  const [openQuickShop, setOpenQuickShop] = useState<boolean>(false)

  const { addToCart, updateCart, cartState } = useCart()
  const { openModalCart } = useModalCartContext()
  const { addToWishlist, removeFromWishlist, wishlistState } = useWishlist()
  const { openModalWishlist } = useModalWishlistContext()
  const { addToCompare, removeFromCompare, compareState } = useCompare()
  const { openModalCompare } = useModalCompareContext()
  const { openQuickview } = useModalQuickviewContext()
  const router = useRouter()

  const percentSale = useMemo(() => Math.floor(100 - (data.price / data.originPrice) * 100), [data.originPrice, data.price])
  const percentSold = useMemo(() => Math.floor((data.sold / data.quantity) * 100), [data.quantity, data.sold])

  const isWishlisted = wishlistState.wishlistArray.some((item) => item.id === data.id)
  const isCompared = compareState.compareArray.some((item) => item.id === data.id)

  const handleAddToCart = () => {
    if (!cartState.cartArray.find((item) => item.id === data.id)) {
      addToCart({ ...data })
      updateCart(data.id, data.quantityPurchase, activeSize, activeColor)
    } else {
      updateCart(data.id, data.quantityPurchase, activeSize, activeColor)
    }
    openModalCart()
  }

  const handleAddToWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(data.id)
    } else {
      addToWishlist(data)
    }
    openModalWishlist()
  }

  const handleAddToCompare = () => {
    if (compareState.compareArray.length < 3) {
      if (isCompared) {
        removeFromCompare(data.id)
      } else {
        addToCompare(data)
      }
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
    <div className="product-item grid-type">
      <div onClick={handleDetailProduct} className="product-main cursor-pointer block">
        <div className="product-thumb bg-white relative overflow-hidden rounded-2xl">
          <ProductTags isNew={data.new} isSale={data.sale} />

          <div className="list-action-right absolute top-3 right-3 max-lg:hidden">
            <ActionButton
              className="add-wishlist-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative"
              tooltip="Add To Wishlist"
              active={isWishlisted}
              onClick={(e) => {
                e.stopPropagation()
                handleAddToWishlist()
              }}
            >
              <WishlistIcon active={isWishlisted} />
            </ActionButton>

            <ActionButton
              className="compare-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative mt-2"
              tooltip="Compare Product"
              active={isCompared}
              onClick={(e) => {
                e.stopPropagation()
                handleAddToCompare()
              }}
            >
              <CompareIcon />
              <CompareCheckedIcon />
            </ActionButton>
          </div>

          <ProductImage
            data={data}
            activeColor={activeColor}
            className="product-img w-full h-full aspect-[3/4]"
            imageClassName="w-full h-full object-cover duration-700"
            showAllThumbs={true}
          />

          {data.sale && (
            <Marquee className="banner-sale-auto bg-black absolute bottom-0 left-0 w-full py-1.5">
              <div className="caption2 font-semibold uppercase text-white px-2.5">Hot Sale {percentSale}% OFF</div>
              <Icon.Lightning weight="fill" className="text-red" />
              <div className="caption2 font-semibold uppercase text-white px-2.5">Hot Sale {percentSale}% OFF</div>
              <Icon.Lightning weight="fill" className="text-red" />
              <div className="caption2 font-semibold uppercase text-white px-2.5">Hot Sale {percentSale}% OFF</div>
              <Icon.Lightning weight="fill" className="text-red" />
              <div className="caption2 font-semibold uppercase text-white px-2.5">Hot Sale {percentSale}% OFF</div>
              <Icon.Lightning weight="fill" className="text-red" />
              <div className="caption2 font-semibold uppercase text-white px-2.5">Hot Sale {percentSale}% OFF</div>
              <Icon.Lightning weight="fill" className="text-red" />
            </Marquee>
          )}

          <div className="list-action grid grid-cols-2 gap-3 px-5 absolute w-full bottom-5 max-lg:hidden">
            <div
              className="quick-view-btn w-full text-button-uppercase py-2 text-center rounded-full duration-300 bg-white hover:bg-black hover:text-white"
              onClick={(e) => {
                e.stopPropagation()
                handleQuickviewOpen()
              }}
            >
              Quick View
            </div>

            {data.action === 'add to cart' ? (
              <div
                className="add-cart-btn w-full text-button-uppercase py-2 text-center rounded-full duration-500 bg-white hover:bg-black hover:text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddToCart()
                }}
              >
                Add To Cart
              </div>
            ) : (
              <ProductQuickShop
                data={data}
                open={openQuickShop}
                activeSize={activeSize}
                onToggle={setOpenQuickShop}
                onSelectSize={setActiveSize}
                onAddToCart={handleAddToCart}
              />
            )}
          </div>

          <div className="list-action-icon flex items-center justify-center gap-2 absolute w-full bottom-3 z-[1] lg:hidden">
            <div
              className="quick-view-btn w-9 h-9 flex items-center justify-center rounded-lg duration-300 bg-white hover:bg-black hover:text-white"
              onClick={(e) => {
                e.stopPropagation()
                handleQuickviewOpen()
              }}
            >
              <QuickViewIcon size={18} />
            </div>
            <div
              className="add-cart-btn w-9 h-9 flex items-center justify-center rounded-lg duration-300 bg-white hover:bg-black hover:text-white"
              onClick={(e) => {
                e.stopPropagation()
                handleAddToCart()
              }}
            >
              <Icon.ShoppingBagOpen className="text-lg" />
            </div>
          </div>
        </div>

        <div className="product-infor mt-4 lg:mb-7">
          <div className="product-sold sm:pb-4 pb-2">
            <div className="progress bg-line h-1.5 w-full rounded-full overflow-hidden relative">
              <div className="progress-sold bg-red absolute left-0 top-0 h-full" style={{ width: `${percentSold}%` }}></div>
            </div>
            <div className="flex items-center justify-between gap-3 gap-y-1 flex-wrap mt-2">
              <div className="text-button-uppercase">
                <span className="text-secondary2 max-sm:text-xs">Sold: </span>
                <span className="max-sm:text-xs">{data.sold}</span>
              </div>
              <div className="text-button-uppercase">
                <span className="text-secondary2 max-sm:text-xs">Available: </span>
                <span className="max-sm:text-xs">{data.quantity - data.sold}</span>
              </div>
            </div>
          </div>

          <ProductInfo data={data} percentSale={percentSale} nameClassName="product-name text-title duration-300" />

          {data.variation.length > 0 && data.action === 'add to cart' ? (
            <ProductVariations data={data} activeColor={activeColor} onColorChange={setActiveColor} mode="dot" />
          ) : null}

          {data.variation.length > 0 && data.action === 'quick shop' ? (
            <ProductVariations data={data} activeColor={activeColor} onColorChange={setActiveColor} mode="image" />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default memo(ProductGrid)


