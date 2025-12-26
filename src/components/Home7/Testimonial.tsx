'use client'

import React, { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import { motion, useInView } from 'framer-motion';
import TestimonialItem from '../Testimonial/TestimonialItem';
import { TestimonialType } from '@/type/TestimonialType'

interface Props {
    data: Array<TestimonialType>;
    limit: number;
}

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            staggerChildren: 0.2,
        },
    },
}

const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    },
}

const Testimonial: React.FC<Props> = ({ data, limit }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <>
            <motion.div
                ref={ref}
                className="testimonial-block mt-5 md:py-20 py-14 bg-surface"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
            >
                <div className="container">
                    <motion.div
                        className="heading3 text-center"
                        variants={textVariants}
                    >
                        The Ultimate Guide to Guest Reviews
                    </motion.div>
                    <motion.div
                        className="body1 font-normal text-secondary text-center mt-4"
                        variants={textVariants}
                    >
                        Discover What Our Guests Really Think About Their Stay
                    </motion.div>
                    <motion.div
                        className="list-testimonial pagination-mt40 mt-10"
                        variants={textVariants}
                    >
                        <Swiper
                            spaceBetween={12}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            loop={true}
                            modules={[Pagination, Autoplay]}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            speed={800}
                            breakpoints={{
                                680: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                1200: {
                                    slidesPerView: 3,
                                    spaceBetween: 30,
                                },
                            }}
                        >
                            {data.slice(0, limit).map((prd, index) => (
                                <SwiperSlide key={index}>
                                    <TestimonialItem data={prd} type='style-seven' />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </motion.div>
                </div>
            </motion.div>
        </>
    )
}

export default Testimonial