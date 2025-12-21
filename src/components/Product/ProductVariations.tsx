import React, { memo } from 'react'
import Image from 'next/image'
import { ProductType } from '@/type/ProductType'

type Props = {
  data: ProductType
  activeColor: string
  onColorChange: (color: string) => void
  mode: 'dot' | 'image'
}

const ProductVariations: React.FC<Props> = ({ data, activeColor, onColorChange, mode }) => {
  if (!data.variation || data.variation.length === 0) return null

  if (mode === 'dot') {
    return (
      <div className="list-color py-2 max-md:hidden flex items-center gap-3 flex-wrap duration-500">
        {data.variation.map((item, index) => (
          <div
            key={index}
            className={`color-item w-8 h-8 rounded-full duration-300 relative ${activeColor === item.color ? 'active' : ''}`}
            style={{ backgroundColor: `${item.colorCode}` }}
            onClick={(e) => {
              e.stopPropagation()
              onColorChange(item.color)
            }}
          >
            <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">{item.color}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="list-color-image max-md:hidden flex items-center gap-3 flex-wrap duration-500">
      {data.variation.map((item, index) => (
        <div
          className={`color-item w-12 h-12 rounded-xl duration-300 relative ${activeColor === item.color ? 'active' : ''}`}
          key={index}
          onClick={(e) => {
            e.stopPropagation()
            onColorChange(item.color)
          }}
        >
          <Image
            src={item.colorImage}
            width={100}
            height={100}
            alt="color"
            priority={true}
            className="rounded-xl w-full h-full object-cover"
          />
          <div className="tag-action bg-black text-white caption2 capitalize px-1.5 py-0.5 rounded-sm">{item.color}</div>
        </div>
      ))}
    </div>
  )
}

export default memo(ProductVariations)


