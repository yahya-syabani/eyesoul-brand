import React from 'react'
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import productData from '@/data/Product.json'
import testimonialData from '@/data/Testimonial.json'
import Footer from '@/components/Footer/Footer'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata(
  'Anvogue',
  'Discover the latest fashion trends and shop premium quality products. Free shipping on orders over $50.'
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

export default function Home() {
  return (
    <>
      <TopNavOne props="style-two bg-purple" slogan='Limited Offer: Free shipping on orders over $50' />
      <div id="header" className='relative w-full'>
        <MenuTwo />
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
