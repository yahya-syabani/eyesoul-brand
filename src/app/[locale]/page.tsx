import React from 'react'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Footer from '@/components/Footer/Footer'
import { generatePageMetadata } from '@/lib/metadata'
import { ProductType } from '@/type/ProductType'
import prisma from '@/lib/prisma'
import { transformProductForFrontend } from '@/utils/transformProduct'
import { getTranslatedText, TranslationObject } from '@/utils/translations'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata(
    'Eyesoul Eyewear',
    'Discover premium eyewear: sunglasses, prescription-ready frames, and blue-light protection with fast delivery.',
    undefined,
    '/',
    locale
  )
}

const SliderSeven = dynamic(() => import('@/components/Slider/SliderSeven'))
const TrendingNow = dynamic(() => import('@/components/Home7/TrendingNow'))
const Deal = dynamic(() => import('@/components/Home7/Deal'))
const PopularProduct = dynamic(() => import('@/components/Home6/PopularProduct'))
const TrendingProduct = dynamic(() => import('@/components/Home3/TrendingProduct'))
const Banner = dynamic(() => import('@/components/Home7/Banner'))
const Testimonial = dynamic(() => import('@/components/Home7/Testimonial'))
const Benefit = dynamic(() => import('@/components/Home1/Benefit'))
const Instagram = dynamic(() => import('@/components/Home6/Instagram'))
const Brand = dynamic(() => import('@/components/Home1/Brand'))

async function fetchProducts(locale: string): Promise<ProductType[]> {
  try {
    // Directly use Prisma in server component for better performance
    const products = await prisma.product.findMany({
      take: 50,
      include: { variations: true, attributes: true, sizes: true },
      orderBy: { createdAt: 'desc' },
    })
    return products.map((product) => transformProductForFrontend(product, locale))
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

async function fetchTestimonials(locale: string) {
  try {
    const testimonials = await prisma.testimonial.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
    })
    // Transform to match TestimonialType format with translations
    return testimonials.map((t) => ({
      id: t.id,
      category: t.category,
      title: t.titleTranslations
        ? getTranslatedText(t.titleTranslations as TranslationObject, locale)
        : t.title,
      name: t.name,
      avatar: t.avatar || '/images/avatar/1.png',
      date: t.date,
      address: t.address || '',
      description: t.descriptionTranslations
        ? getTranslatedText(t.descriptionTranslations as TranslationObject, locale)
        : t.description,
      images: t.images,
      star: t.star,
    }))
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
}

async function fetchProductCountsByCategory() {
  try {
    const categories = ['sunglasses', 'prescription_glasses', 'reading_glasses', 'contact_lenses', 'frames_only'] as const
    
    const counts = await Promise.all(
      categories.map(async (category) => {
        const count = await prisma.product.count({
          where: { category },
        })
        return { category, count }
      })
    )

    // Map database categories (with underscores) to URL-friendly format (with hyphens)
    return {
      'sunglasses': counts.find(c => c.category === 'sunglasses')?.count || 0,
      'prescription-glasses': counts.find(c => c.category === 'prescription_glasses')?.count || 0,
      'reading-glasses': counts.find(c => c.category === 'reading_glasses')?.count || 0,
      'contact-lenses': counts.find(c => c.category === 'contact_lenses')?.count || 0,
      'frames-only': counts.find(c => c.category === 'frames_only')?.count || 0,
    }
  } catch (error) {
    console.error('Error fetching product counts:', error)
    return {
      'sunglasses': 0,
      'prescription-glasses': 0,
      'reading-glasses': 0,
      'contact-lenses': 0,
      'frames-only': 0,
    }
  }
}

async function fetchHeroSlides(locale: string) {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    })
    // Transform slides to include translated content
    return slides.map((slide) => ({
      ...slide,
      subtitle: slide.subtitleTranslations
        ? getTranslatedText(slide.subtitleTranslations as TranslationObject, locale)
        : slide.subtitle,
      title: slide.titleTranslations
        ? getTranslatedText(slide.titleTranslations as TranslationObject, locale)
        : slide.title,
      ctaText: slide.ctaTextTranslations
        ? getTranslatedText(slide.ctaTextTranslations as TranslationObject, locale)
        : slide.ctaText,
    }))
  } catch (error) {
    console.error('Error fetching hero slides:', error)
    return []
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const productData = await fetchProducts(locale)
  const testimonialData = await fetchTestimonials(locale)
  const productCounts = await fetchProductCountsByCategory()
  const heroSlides = await fetchHeroSlides(locale)

  return (
    <>
      <div id="header" className='relative w-full'>
        <SliderSeven slides={heroSlides} />
      </div>
      <TrendingNow productCounts={productCounts} />
      <Deal data={productData} start={4} limit={8} />
      <PopularProduct />
      <TrendingProduct data={productData} start={12} limit={20} />
      <Banner />
      <Testimonial data={testimonialData} limit={5} />
      <Benefit props="md:pt-20 pt-10" />
      <Instagram />
      <Brand />
      <Footer />
    </>
  )
}
