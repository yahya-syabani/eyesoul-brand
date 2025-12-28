'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import InsuranceGrid from './InsuranceGrid'
import { InsuranceType } from '@/type/InsuranceType'
import insuranceData from '@/data/Insurance.json'

const InsurancePage: React.FC = () => {
  const t = useTranslations()
  const insurances = insuranceData as InsuranceType[]

  return (
    <div className="insurance-page">
      {/* Insurance Grid Section */}
      <section className="insurance-main py-16">
        <div className="container">
          <div className="insurance-section-header text-center mb-12">
            <h2 className="heading2 mb-4">{t('pages.insurance.sectionHeading')}</h2>
            <p className="body1 text-secondary max-w-2xl mx-auto">
              {t('pages.insurance.sectionDescription')}
            </p>
          </div>
        </div>
        
        <div className="insurance-grid-wrapper w-full">
          <div className="container">
            <InsuranceGrid insurances={insurances} compact={false} />
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="insurance-info py-16 bg-surface">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading3 text-center mb-8">{t('pages.insurance.infoHeading')}</h2>
            <div className="space-y-4 body1 text-secondary">
              <p>{t('pages.insurance.infoText1')}</p>
              <p>{t('pages.insurance.infoText2')}</p>
              <p>{t('pages.insurance.infoText3')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default InsurancePage

