import React from 'react'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Footer from '@/components/Footer/Footer'
import { generatePageMetadata } from '@/lib/metadata'
import { ProductType } from '@/type/ProductType'
import prisma from '@/lib/prisma'
import { transformProductForFrontend } from '@/utils/transformProduct'

export const metadata: Metadata = generatePageMetadata(
  'Eyesoul Eyewear',
  'Discover premium eyewear: sunglasses, prescription-ready frames, and blue-light protection with fast delivery.'
)

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

async function fetchProducts(): Promise<ProductType[]> {
  try {
    // Directly use Prisma in server component for better performance
    const products = await prisma.product.findMany({
      take: 50,
      include: { variations: true, attributes: true, sizes: true },
      orderBy: { createdAt: 'desc' },
    })
    return products.map(transformProductForFrontend)
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

async function fetchTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
    })
    // Transform to match TestimonialType format
    return testimonials.map((t) => ({
      id: t.id,
      category: t.category,
      title: t.title,
      name: t.name,
      avatar: t.avatar || '/images/avatar/1.png',
      date: t.date,
      address: t.address || '',
      description: t.description,
      images: t.images,
      star: t.star,
    }))
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
}

export default async function Home() {
  const productData = await fetchProducts()
  const testimonialData = await fetchTestimonials()

  return (
    <>
      <div id="header" className='relative w-full'>
        <SliderSeven />
      </div>
      <TrendingNow />
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
