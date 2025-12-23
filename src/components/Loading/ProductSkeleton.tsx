import React from 'react'

interface ProductSkeletonProps {
  count?: number
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="product-item grid-type animate-pulse">
          <div className="product-main">
            <div className="product-thumb bg-surface relative overflow-hidden rounded-2xl">
              <div className="w-full aspect-[3/4] bg-line"></div>
            </div>
            <div className="product-infor mt-4 lg:mb-7">
              <div className="product-sold sm:pb-4 pb-2">
                <div className="progress bg-line h-1.5 w-full rounded-full overflow-hidden">
                  <div className="progress-sold bg-line w-1/2 h-full"></div>
                </div>
                <div className="flex items-center justify-between gap-3 gap-y-1 flex-wrap mt-2">
                  <div className="h-4 w-20 bg-line rounded"></div>
                  <div className="h-4 w-24 bg-line rounded"></div>
                </div>
              </div>
              <div className="h-5 w-3/4 bg-line rounded mt-2"></div>
              <div className="h-4 w-1/2 bg-line rounded mt-3"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default ProductSkeleton

