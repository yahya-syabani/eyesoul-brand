'use client'

import React from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/effect-fade';
import { HeroSlideType } from '@/type/HeroSlideType'

interface SliderSevenProps {
    slides: HeroSlideType[]
}

const SliderSeven: React.FC<SliderSevenProps> = ({ slides }) => {
    const t = useTranslations()
    // Default slides if none are provided (backward compatibility)
    const defaultSlides: HeroSlideType[] = [
        {
            id: 'default-1',
            subtitle: 'Sale! Up To 50% Off!',
            title: 'Summer Sale Collections',
            imageUrl: '/images/slider/bg7-1.png',
            ctaText: t('home.shopNow'),
            ctaLink: '/shop/default',
            isActive: true,
            displayOrder: 0,
            imageWidth: 'sm:w-[48%] w-[54%]',
            imagePosition: '2xl:-right-[60px] right-0 bottom-0',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: 'default-2',
            subtitle: 'Sale! Up To 50% Off!',
            title: 'Discover the Latest Trends in Eyewear',
            imageUrl: '/images/slider/bg2-2.png',
            ctaText: t('home.shopNow'),
            ctaLink: '/shop/default',
            isActive: true,
            displayOrder: 1,
            imageWidth: 'sm:w-1/2 w-3/5',
            imagePosition: '2xl:-right-[60px] -right-4 bottom-0',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: 'default-3',
            subtitle: 'Sale! Up To 50% Off!',
            title: 'New season, new wardrobe!',
            imageUrl: '/images/slider/bg2-3.png',
            ctaText: t('home.shopNow'),
            ctaLink: '/shop/default',
            isActive: true,
            displayOrder: 2,
            imageWidth: 'sm:w-[43%] w-3/5',
            imagePosition: '2xl:-right-[36px] right-0 sm:bottom-0 -bottom-[30px]',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ]

    const activeSlides = slides && slides.length > 0 ? slides : defaultSlides

    if (activeSlides.length === 0) {
        return null
    }

    return (
        <>
            <div className={`slider-block style-seven bg-white xl:h-[860px] lg:h-[800px] md:h-[580px] sm:h-[500px] h-[350px] max-[420px]:h-[300px] w-full`}>
                <div className="slider-main h-full w-full">
                    <Swiper
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={activeSlides.length > 1}
                        pagination={{ clickable: true }}
                        modules={[Pagination, Autoplay]}
                        className='h-full relative'
                        autoplay={{
                            delay: 4000,
                        }}
                    >
                        {activeSlides.map((slide, index) => {
                            const imageWidthClass = slide.imageWidth || 'sm:w-[48%] w-[54%]'
                            const imagePositionClass = slide.imagePosition || '2xl:-right-[60px] right-0 bottom-0'
                            const ctaText = slide.ctaText || t('home.shopNow')
                            const ctaLink = slide.ctaLink || '/shop/default'

                            return (
                                <SwiperSlide key={slide.id}>
                                    <div className="slider-item h-full w-full relative">
                                        <div className="container w-full h-full flex items-center relative">
                                            <div className="text-content basis-1/2 flex flex-col items-center">
                                                <div className="text-sub-display text-center">{slide.subtitle}</div>
                                                <div className="text-display text-center md:mt-4 mt-2">{slide.title}</div>
                                                <Link href={ctaLink} className="button-main md:mt-8 mt-3">{ctaText}</Link>
                                            </div>
                                            <div className={`sub-img absolute ${imageWidthClass} ${imagePositionClass}`}>
                                                <Image
                                                    src={slide.imageUrl}
                                                    width={670}
                                                    height={936}
                                                    alt={slide.title}
                                                    priority={index === 0}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
            </div>
        </>
    )
}

export default SliderSeven