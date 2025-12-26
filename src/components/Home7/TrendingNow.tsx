'use client'

import React from 'react'
import { Link, useRouter } from '@/i18n/routing'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Scrollbar } from 'swiper/modules';
import { useTranslations } from 'next-intl';
import 'swiper/css/bundle';

interface ProductCounts {
    'sunglasses': number;
    'prescription-glasses': number;
    'reading-glasses': number;
    'contact-lenses': number;
    'frames-only': number;
}

interface TrendingNowProps {
    productCounts: ProductCounts;
}

const TrendingNow: React.FC<TrendingNowProps> = ({ productCounts }) => {
    const router = useRouter()
    const t = useTranslations()

    const handleTypeClick = (type: string) => {
        router.push(`/shop/default?type=${type}`);
    };

    // Eyewear-focused categories for trending navigation
    const trendingItems = [
        { type: 'sunglasses', label: t('categories.sunglasses'), count: productCounts['sunglasses'], image: '/images/avatar/1.png' },
        { type: 'prescription-glasses', label: t('categories.prescriptionGlasses'), count: productCounts['prescription-glasses'], image: '/images/avatar/2.png' },
        { type: 'reading-glasses', label: t('categories.readingGlasses'), count: productCounts['reading-glasses'], image: '/images/avatar/4.png' },
        { type: 'contact-lenses', label: t('categories.contactLenses'), count: productCounts['contact-lenses'], image: '/images/avatar/5.png' },
        { type: 'frames-only', label: t('categories.framesOnly'), count: productCounts['frames-only'], image: '/images/avatar/6.png' },
    ]

    return (
        <>
            <div className="trending-block style-six md:pt-20 pt-10">
                <div className="container">
                    <div className="heading3 text-center">{t('home.trendingRightNow')}
                    </div>
                    <div className="list-trending section-swiper-navigation style-small-border style-outline md:mt-10 mt-6">
                        <Swiper
                            spaceBetween={12}
                            slidesPerView={2}
                            navigation
                            loop={true}
                            modules={[Navigation, Autoplay]}
                            breakpoints={{
                                576: {
                                    slidesPerView: 3,
                                    spaceBetween: 12,
                                },
                                768: {
                                    slidesPerView: 4,
                                    spaceBetween: 20,
                                },
                                992: {
                                    slidesPerView: 5,
                                    spaceBetween: 20,
                                },
                                1290: {
                                    slidesPerView: 6,
                                    spaceBetween: 30,
                                },
                            }}
                            className='h-full'
                        >
                            {trendingItems.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <div className="trending-item block relative cursor-pointer" onClick={() => handleTypeClick(item.type)}>
                                        <div className="bg-img rounded-full overflow-hidden">
                                            <Image
                                                src={item.image}
                                                width={1000}
                                                height={1000}
                                                alt={item.label}
                                                priority={true}
                                                className='w-full'
                                            />
                                        </div>
                                        <div className="trending-name text-center mt-5 duration-500">
                                            <span className='heading5'>{item.label}</span>
                                            <span className='text-secondary'> ({item.count})</span>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TrendingNow