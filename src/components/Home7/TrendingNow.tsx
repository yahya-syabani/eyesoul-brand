'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Scrollbar } from 'swiper/modules';
import { useRouter } from 'next/navigation';
import 'swiper/css/bundle';

const TrendingNow = () => {
    const router = useRouter()

    const handleTypeClick = (type: string) => {
        router.push(`/shop/default?type=${type}`);
    };

    // Eyewear-focused categories for trending navigation
    const trendingItems = [
        { type: 'sunglasses', label: 'Sunglasses', count: 12, image: '/images/avatar/1.png' },
        { type: 'prescription-glasses', label: 'Prescription', count: 8, image: '/images/avatar/2.png' },
        { type: 'reading-glasses', label: 'Reading', count: 6, image: '/images/avatar/4.png' },
        { type: 'contact-lenses', label: 'Contact Lenses', count: 5, image: '/images/avatar/5.png' },
        { type: 'frames-only', label: 'Frames Only', count: 7, image: '/images/avatar/6.png' },
    ]

    return (
        <>
            <div className="trending-block style-six md:pt-20 pt-10">
                <div className="container">
                    <div className="heading3 text-center">Trending Right Now
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