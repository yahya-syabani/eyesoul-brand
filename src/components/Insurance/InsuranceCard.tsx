'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { InsuranceType } from '@/type/InsuranceType'
import * as Icon from '@phosphor-icons/react/dist/ssr'

interface InsuranceCardProps {
  insurance: InsuranceType
  index: number
  compact?: boolean
}

const InsuranceCard: React.FC<InsuranceCardProps> = ({
  insurance,
  index,
  compact = false,
}) => {
  const t = useTranslations()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        scale: 1.05,
        y: -5,
        transition: { duration: 0.3 },
      }}
      className="insurance-card bg-white rounded-xl overflow-hidden border border-line hover:border-black transition-all duration-300 cursor-pointer h-full flex flex-col"
    >
      <div className="insurance-logo-container relative w-full h-[180px] bg-surface flex items-center justify-center p-6">
        <div className="relative w-full h-full">
          <Image
            src={insurance.logo}
            alt={insurance.name}
            fill
            className="object-contain transition-transform duration-300 hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            onError={(e) => {
              // Fallback to text if image fails to load
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent) {
                parent.innerHTML = `<div class="text-center"><div class="heading6 text-black">${insurance.name}</div></div>`
              }
            }}
          />
        </div>
      </div>
      
      {!compact && (
        <div className="insurance-content p-6 flex-1 flex flex-col">
          <h3 className="heading6 mb-2">{insurance.name}</h3>
          <p className="caption1 text-secondary mb-4 flex-1">{insurance.description}</p>
          
          <div className="coverage-types mb-4">
            <div className="flex flex-wrap gap-2">
              {insurance.coverageTypes.map((type, idx) => (
                <span
                  key={idx}
                  className="caption2 bg-surface text-black px-2 py-1 rounded"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className="insurance-details space-y-2">
            {insurance.phone && (
              <div className="flex items-center gap-2 caption1 text-secondary">
                <Icon.Phone size={16} />
                <span>{insurance.phone}</span>
              </div>
            )}
            {insurance.acceptsOnline && (
              <div className="flex items-center gap-2 caption1 text-success">
                <Icon.CheckCircle size={16} />
                <span>{t('pages.insurance.acceptsOnlineClaims')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default InsuranceCard

