import React from 'react'

interface PromotionSkeletonProps {
  count?: number
}

const PromotionSkeleton: React.FC<PromotionSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-surface rounded-2xl overflow-hidden animate-pulse">
          {/* Image placeholder */}
          <div className="w-full aspect-video bg-line"></div>
          
          {/* Content placeholder */}
          <div className="p-6 space-y-4">
            {/* Title placeholder */}
            <div className="h-6 w-2/3 bg-line rounded"></div>
            
            {/* Description placeholder - multiple lines with varying widths */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-line rounded"></div>
              <div className="h-4 w-5/6 bg-line rounded"></div>
              <div className="h-4 w-4/6 bg-line rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PromotionSkeleton

