import React from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import InsurancePage from '@/components/Insurance/InsurancePage'
import { generatePageMetadata } from '@/lib/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })
  
  return generatePageMetadata(
    t('pages.insurance.title'),
    t('pages.insurance.heroDescription'),
    undefined,
    '/pages/insurance',
    locale
  )
}

export default async function Insurance({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb 
          heading={t('pages.insurance.heading')} 
          subHeading={t('pages.insurance.heading')}
        />
      </div>
      <InsurancePage />
      <Footer />
    </>
  )
}

