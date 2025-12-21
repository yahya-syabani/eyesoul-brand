import React, { memo } from 'react'

type Props = {
  isNew: boolean
  isSale: boolean
}

const ProductTags: React.FC<Props> = ({ isNew, isSale }) => {
  return (
    <>
      {isNew && (
        <div className="product-tag text-button-uppercase bg-green px-3 py-0.5 inline-block rounded-full absolute top-3 left-3 z-[1]">
          New
        </div>
      )}
      {isSale && (
        <div className="product-tag text-button-uppercase text-white bg-red px-3 py-0.5 inline-block rounded-full absolute top-3 left-3 z-[1]">
          Sale
        </div>
      )}
    </>
  )
}

export default memo(ProductTags)


