import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import PromotionPage from '@/components/Promotion/PromotionPage'
import PromotionSkeleton from '@/components/Loading/PromotionSkeleton'
import { generatePageMetadata } from '@/lib/metadata'
import prisma from '@/lib/prisma'
import { getTranslatedText, TranslationObject } from '@/utils/translations'
import { PromotionalPageType } from '@/type/PromotionalPageType'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })
  
  return generatePageMetadata(
    t('pages.promotion.title'),
    t('pages.promotion.heroDescription'),
    undefined,
    '/pages/promotion',
    locale
  )
}

async function fetchPromotionalPages(locale: string): Promise<PromotionalPageType[]> {
  try {
    const pages = await prisma.promotionalPage.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    })

    // Transform to include translated content
    return pages.map((page) => ({
      id: page.id,
      title: page.titleTranslations
        ? getTranslatedText(page.titleTranslations as TranslationObject, locale)
        : page.title,
      description: page.descriptionTranslations
        ? getTranslatedText(page.descriptionTranslations as TranslationObject, locale)
        : page.description,
      imageUrl: page.imageUrl,
      isActive: page.isActive,
      displayOrder: page.displayOrder,
      createdAt: page.createdAt.toISOString(),
      updatedAt: page.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error('Error fetching promotional pages:', error)
    return []
  }
}

export default async function Promotion({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  const promotionalPages = await fetchPromotionalPages(locale)

  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb 
          heading={t('pages.promotion.heading')} 
          subHeading={t('pages.promotion.heading')}
        />
      </div>
      <Suspense fallback={<PromotionSkeleton count={6} />}>
        <PromotionPage promotions={promotionalPages} />
      </Suspense>
      <Footer />
    </>
  )
}

