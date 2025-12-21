'use client'

import React, { memo, useMemo, useState } from 'react'
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
import ProductTags from './ProductTags'
import ProductQuickShop from './ProductQuickShop'
import { ActionButton, CompareCheckedIcon, CompareIcon, WishlistIcon } from './ProductActions'

type Props = {
  data: ProductType
}

const ProductList: React.FC<Props> = ({ data }) => {
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
    <div className="product-item list-type">
      <div className="product-main cursor-pointer flex lg:items-center sm:justify-between gap-7 max-lg:gap-5">
        <div onClick={handleDetailProduct} className="product-thumb bg-white relative overflow-hidden rounded-2xl block max-sm:w-1/2">
          <ProductTags isNew={data.new} isSale={data.sale} />

          <div className="product-img w-full aspect-[3/4] rounded-2xl overflow-hidden">
            {data.thumbImage.map((img, index) => (
              <Image
                key={index}
                src={img}
                width={500}
                height={500}
                priority={true}
                alt={data.name}
                className="w-full h-full object-cover duration-700"
              />
            ))}
          </div>

          <div className="list-action px-5 absolute w-full bottom-5 max-lg:hidden">
            <ProductQuickShop
              data={data}
              open={openQuickShop}
              activeSize={activeSize}
              onToggle={setOpenQuickShop}
              onSelectSize={setActiveSize}
              onAddToCart={handleAddToCart}
              showButton={false}
              getSizeItemClassName={(size) => `size-item ${size !== 'freesize' ? 'w-10 h-10' : 'h-10 px-4'}`}
            />
          </div>
        </div>

        <div className="flex sm:items-center gap-7 max-lg:gap-4 max-lg:flex-wrap max-lg:w-full max-sm:flex-col max-sm:w-1/2">
          <div className="product-infor max-sm:w-full">
            <div onClick={handleDetailProduct} className="product-name heading6 inline-block duration-300">
              {data.name}
            </div>
            <div className="product-price-block flex items-center gap-2 flex-wrap mt-2 duration-300 relative z-[1]">
              <div className="product-price text-title">${data.price}.00</div>
              <div className="product-origin-price caption1 text-secondary2">
                <del>${data.originPrice}.00</del>
              </div>
              {data.originPrice && (
                <div className="product-sale caption1 font-medium bg-green px-3 py-0.5 inline-block rounded-full">-{percentSale}%</div>
              )}
            </div>

            {data.variation.length > 0 && data.action === 'add to cart' ? (
              <div className="list-color max-md:hidden py-2 mt-5 mb-1 flex items-center gap-3 flex-wrap duration-300">
                {data.variation.map((item, index) => (
                  <div
                    key={index}
                    className="color-item w-8 h-8 rounded-full duration-300 relative"
                    style={{ backgroundColor: `${item.colorCode}` }}
                  >
                    <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">{item.color}</div>
                  </div>
                ))}
              </div>
            ) : data.variation.length > 0 && data.action === 'quick shop' ? (
              <div className="list-color flex items-center gap-2 flex-wrap mt-5">
                {data.variation.map((item, index) => (
                  <div
                    className={`color-item w-12 h-12 rounded-xl duration-300 relative ${activeColor === item.color ? 'active' : ''}`}
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveColor(item.color)
                    }}
                  >
                    <Image src={item.colorImage} width={100} height={100} alt="color" priority={true} className="rounded-xl" />
                    <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">{item.color}</div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="text-secondary desc mt-5 max-sm:hidden">{data.description}</div>
          </div>

          <div className="action w-fit flex flex-col items-center justify-center">
            <div
              className="quick-shop-btn button-main whitespace-nowrap py-2 px-9 max-lg:px-5 rounded-full bg-white text-black border border-black hover:bg-black hover:text-white"
              onClick={(e) => {
                e.stopPropagation()
                setOpenQuickShop(!openQuickShop)
              }}
            >
              Quick Shop
            </div>

            <div className="list-action-right flex items-center justify-center gap-3 mt-4">
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
                className="compare-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative"
                tooltip="Compare Product"
                active={isCompared}
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddToCompare()
                }}
              >
                <CompareIcon variant="arrows" />
                <CompareCheckedIcon />
              </ActionButton>

              <div
                className="quick-view-btn-list w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative"
                onClick={(e) => {
                  e.stopPropagation()
                  handleQuickviewOpen()
                }}
              >
                <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm">Quick View</div>
                <Icon.Eye size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ProductList)


