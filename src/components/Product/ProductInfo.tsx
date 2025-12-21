import React, { memo } from 'react'
import { ProductType } from '@/type/ProductType'

type Props = {
  data: ProductType
  percentSale: number
  showDescription?: boolean
  nameClassName?: string
}

const ProductInfo: React.FC<Props> = ({ data, percentSale, showDescription = false, nameClassName }) => {
  return (
    <>
      <div className={nameClassName ?? 'product-name duration-300'}>{data.name}</div>
      <div className="product-price-block flex items-center gap-2 flex-wrap mt-1 duration-300 relative z-[1]">
        <div className="product-price text-title">${data.price}.00</div>
        {percentSale > 0 && (
          <>
            <div className="product-origin-price caption1 text-secondary2">
              <del>${data.originPrice}.00</del>
            </div>
            <div className="product-sale caption1 font-medium bg-green px-3 py-0.5 inline-block rounded-full">
              -{percentSale}%
            </div>
          </>
        )}
      </div>
      {showDescription ? <div className="text-secondary desc mt-5 max-sm:hidden">{data.description}</div> : null}
    </>
  )
}

export default memo(ProductInfo)


