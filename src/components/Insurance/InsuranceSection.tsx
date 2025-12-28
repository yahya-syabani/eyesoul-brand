'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import InsuranceGrid from './InsuranceGrid'
import { InsuranceType } from '@/type/InsuranceType'
import insuranceData from '@/data/Insurance.json'

interface InsuranceSectionProps {
  props?: string
  limit?: number
}

const InsuranceSection: React.FC<InsuranceSectionProps> = ({
  props = '',
  limit = 6,
}) => {
  const t = useTranslations()
  const insurances = insuranceData as InsuranceType[]

  return (
    <section className={`insurance-section ${props}`}>
      <div className="container">
        <div className="insurance-section-header text-center mb-12">
          <h2 className="heading2 mb-4">{t('pages.insurance.heading')}</h2>
          <p className="body1 text-secondary max-w-2xl mx-auto">
            {t('pages.insurance.sectionDescription')}
          </p>
        </div>
      </div>
      
      <div className="insurance-grid-wrapper w-full">
        <div className="container">
          <InsuranceGrid insurances={insurances} compact={true} limit={limit} />
        </div>
      </div>
      
      <div className="container">
        <div className="text-center mt-10">
          <Link href="/pages/insurance" className="button-main">
            {t('pages.insurance.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default InsuranceSection

