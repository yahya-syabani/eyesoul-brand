'use client'

import React from 'react'
import Image from 'next/image'
import { PromotionalPageType } from '@/type/PromotionalPageType'
import { useModalPromotionContext } from '@/context/ModalPromotionContext'

interface PromotionPageProps {
  promotions: PromotionalPageType[]
}

const PromotionPage: React.FC<PromotionPageProps> = ({ promotions }) => {
  const { openPromotion } = useModalPromotionContext()

  if (promotions.length === 0) {
    return (
      <div className="promotion-page py-16">
        <div className="container">
          <div className="text-center">
            <p className="body1 text-secondary">No promotional content available at this time.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="promotion-page py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="bg-surface rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => openPromotion(promotion)}
            >
              {/* Image */}
              <div className="relative w-full aspect-video">
                <Image
                  src={promotion.imageUrl}
                  alt={promotion.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Title */}
              <div className="p-6">
                <h3 className="heading6">{promotion.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PromotionPage

