import React, { memo } from 'react'
import { ProductType } from '@/type/ProductType'

type Props = {
  data: ProductType
  open: boolean
  activeSize: string
  onToggle: (next: boolean) => void
  onSelectSize: (size: string) => void
  onAddToCart: () => void
  sizeItemClassName?: string
  getSizeItemClassName?: (size: string) => string
  showButton?: boolean
}

const ProductQuickShop: React.FC<Props> = ({
  data,
  open,
  activeSize,
  onToggle,
  onSelectSize,
  onAddToCart,
  sizeItemClassName,
  getSizeItemClassName,
  showButton = true,
}) => {
  return (
    <>
      {showButton ? (
        <div
          className="quick-shop-btn text-button-uppercase py-2 text-center rounded-full duration-500 bg-white hover:bg-black hover:text-white"
          onClick={(e) => {
            e.stopPropagation()
            onToggle(!open)
          }}
        >
          Quick Shop
        </div>
      ) : null}
      <div
        className={`quick-shop-block absolute left-5 right-5 bg-white p-5 rounded-[20px] ${open ? 'open' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <div className="list-size flex items-center justify-center flex-wrap gap-2">
          {data.sizes.map((item, index) => (
            <div
              className={`${getSizeItemClassName?.(item) ?? sizeItemClassName ?? 'size-item w-10 h-10'} rounded-full flex items-center justify-center text-button bg-white border border-line ${
                activeSize === item ? 'active' : ''
              }`}
              key={index}
              onClick={() => onSelectSize(item)}
            >
              {item}
            </div>
          ))}
        </div>
        <div
          className="button-main w-full text-center rounded-full py-3 mt-4"
          onClick={() => {
            onAddToCart()
            onToggle(false)
          }}
        >
          Add To cart
        </div>
      </div>
    </>
  )
}

export default memo(ProductQuickShop)


