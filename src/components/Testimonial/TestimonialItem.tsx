'use client'

import React from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { motion } from 'framer-motion'
import { TestimonialType } from '@/type/TestimonialType'
import Rate from '../Other/Rate'

interface TestimonialProps {
    data: TestimonialType
    type: string
}

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
        },
    },
}

const hoverVariants = {
    rest: {
        scale: 1,
        y: 0,
        transition: {
            duration: 0.3,
        },
    },
    hover: {
        scale: 1.02,
        y: -4,
        transition: {
            duration: 0.3,
        },
    },
}

const TestimonialItem: React.FC<TestimonialProps> = ({ data, type }) => {
    return (
        <>
            {type === "style-one" ? (
                <motion.div
                    className="testimonial-item style-one h-full"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="testimonial-main bg-white p-8 rounded-2xl h-full"
                        variants={hoverVariants}
                        initial="rest"
                        whileHover="hover"
                        style={{ willChange: 'transform' }}
                    >
                        <Rate currentRate={data.star} size={14} />
                        <div className="heading6 title mt-4">{data.title}</div>
                        <div className="desc mt-2">{data.description}</div>
                        <div className="text-button name mt-4">{data.name}</div>
                        <div className="caption2 date text-secondary2 mt-1">{data.date}</div>
                    </motion.div>
                </motion.div>
            ) : (
                <>
                    {type === "style-four" ? (
                        <motion.div
                            className="testimonial-item style-four h-full"
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                className="testimonial-main h-full"
                                variants={hoverVariants}
                                initial="rest"
                                whileHover="hover"
                                style={{ willChange: 'transform' }}
                            >
                                <Rate currentRate={data.star} size={14} />
                                <div className="text-button-uppercase text-secondary mt-4">Customer reviews</div>
                                <div className="heading4 normal-case desc font-normal mt-2">{data.description}</div>
                                <div className="text-button name mt-4">{data.name}</div>
                                <div className="caption2 text-secondary2 date">{data.date}</div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <>
                            {type === "style-six" ? (
                                <motion.div
                                    className="testimonial-item style-six h-full"
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <motion.div
                                        className="testimonial-main h-full"
                                        variants={hoverVariants}
                                        initial="rest"
                                        whileHover="hover"
                                        style={{ willChange: 'transform' }}
                                    >
                                        <Rate currentRate={data.star} size={14} />
                                        <div className="text-button-uppercase text-secondary mt-4">Customer reviews</div>
                                        <div className="heading4 normal-case desc font-normal mt-2">{data.description}</div>
                                        <div className="flex items-center gap-3 mt-4">
                                            <div className="text-button name">{data.name}</div>
                                            <div className="caption1 date text-secondary2">From {data.address}</div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <>
                                    {type === "style-seven" ? (
                                        <>
                                            <motion.div
                                                className="testimonial-item style-seven h-full"
                                                variants={cardVariants}
                                                initial="hidden"
                                                animate="visible"
                                            >
                                                <motion.div
                                                    className="testimonial-main bg-white py-8 px-7 rounded-[20px] h-full transition-shadow duration-300"
                                                    variants={hoverVariants}
                                                    initial="rest"
                                                    whileHover="hover"
                                                    style={{
                                                        willChange: 'transform',
                                                    }}
                                                    onHoverStart={(e) => {
                                                        const target = e.currentTarget as HTMLElement | null;
                                                        if (target) {
                                                            target.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                                                        }
                                                    }}
                                                    onHoverEnd={(e) => {
                                                        const target = e.currentTarget as HTMLElement | null;
                                                        if (target) {
                                                            target.style.boxShadow = '';
                                                        }
                                                    }}
                                                >
                                                    <div className="heading flex items-center gap-4">
                                                        <motion.div
                                                            className="avatar w-10 h-10 rounded-full overflow-hidden"
                                                            whileHover={{ scale: 1.1 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <Image
                                                                src={data.avatar}
                                                                width={500}
                                                                height={500}
                                                                alt='avatar'
                                                                className='w-full h-full'
                                                            />
                                                        </motion.div>
                                                        <div className="infor">
                                                            <Rate currentRate={data.star} size={14} />
                                                            <div className="text-title name">{data.name}</div>
                                                        </div>
                                                    </div>
                                                    <div className="body1 desc mt-4">{data.description}</div>
                                                </motion.div>
                                            </motion.div>
                                        </>
                                    ) : (
                                        <></>
                                    )
                                    }
                                </>
                            )
                            }
                        </>
                    )
                    }
                </>
            )
            }
        </>
    )
}

export default TestimonialItem