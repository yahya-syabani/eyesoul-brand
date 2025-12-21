import React, { memo, useMemo } from 'react'
import Image from 'next/image'
import { ProductType } from '@/type/ProductType'

type Props = {
  data: ProductType
  activeColor?: string
  className?: string
  imageClassName?: string
  showAllThumbs?: boolean
}

const ProductImage: React.FC<Props> = ({
  data,
  activeColor,
  className,
  imageClassName,
  showAllThumbs = true,
}) => {
  const activeSrc = useMemo(() => {
    if (!activeColor) return null
    const match = data.variation.find((v) => v.color === activeColor)?.image
    return match || null
  }, [activeColor, data.variation])

  const fallbackSrc = data.thumbImage?.[0] || data.images?.[0] || ''

  return (
    <div className={className}>
      {activeSrc ? (
        <Image
          src={activeSrc}
          width={500}
          height={500}
          alt={data.name}
          priority={true}
          className={imageClassName}
        />
      ) : showAllThumbs ? (
        <>
          {data.thumbImage.map((img, index) => (
            <Image
              key={index}
              src={img || fallbackSrc}
              width={500}
              height={500}
              priority={true}
              alt={data.name}
              className={imageClassName}
            />
          ))}
        </>
      ) : (
        <Image
          src={fallbackSrc}
          width={500}
          height={500}
          alt={data.name}
          priority={true}
          className={imageClassName}
        />
      )}
    </div>
  )
}

export default memo(ProductImage)


