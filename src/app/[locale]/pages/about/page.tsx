'use client'
import React, { useRef } from 'react'
import Image from 'next/image';
import { useTranslations } from 'next-intl'
import { motion, useInView } from 'framer-motion'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Benefit from '@/components/Home1/Benefit'
import Instagram from '@/components/Home6/Instagram'
import Brand from '@/components/Home1/Brand'
import Footer from '@/components/Footer/Footer'

// Animation variants for text content
const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
            duration: 0.6,
        },
    },
}

const textItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
}

// Animation variants for image grid
const imageContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            duration: 0.6,
        },
    },
}

const imageItemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
}

const AboutUs = () => {
    const t = useTranslations()
    const textRef = useRef(null)
    const imageRef = useRef(null)
    const instagramRef = useRef(null)
    const brandRef = useRef(null)
    
    const isTextInView = useInView(textRef, { once: true, margin: '-100px' })
    const isImageInView = useInView(imageRef, { once: true, margin: '-100px' })
    const isInstagramInView = useInView(instagramRef, { once: true, margin: '-100px' })
    const isBrandInView = useInView(brandRef, { once: true, margin: '-100px' })

    return (
        <>
            <div id="header" className='relative w-full'>
                <Breadcrumb heading={t('pages.about.heading')} subHeading={t('pages.about.heading')} />
            </div>
            <div className='about md:pt-20 pt-10'>
                <div className="about-us-block">
                    <div className="container">
                        <motion.div
                            ref={textRef}
                            className="text flex items-center justify-center"
                            variants={textContainerVariants}
                            initial="hidden"
                            animate={isTextInView ? 'visible' : 'hidden'}
                        >
                            <div className="content md:w-5/6 w-full">
                                <motion.div
                                    className="heading3 text-center"
                                    variants={textItemVariants}
                                >
                                    {t('pages.about.content')}
                                </motion.div>
                                <motion.div
                                    className="body1 text-center md:mt-7 mt-5"
                                    variants={textItemVariants}
                                >
                                    {t('pages.about.description')}
                                </motion.div>
                            </div>
                        </motion.div>
                        <motion.div
                            ref={imageRef}
                            className="list-img grid sm:grid-cols-3 gap-[30px] md:pt-20 pt-10"
                            variants={imageContainerVariants}
                            initial="hidden"
                            animate={isImageInView ? 'visible' : 'hidden'}
                        >
                            <motion.div
                                className="bg-img overflow-hidden rounded-[30px]"
                                variants={imageItemVariants}
                                whileHover={{
                                    scale: 1.05,
                                    y: -5,
                                    transition: { duration: 0.3 },
                                }}
                            >
                                <Image
                                    src={'/images/other/about-us1.png'}
                                    width={2000}
                                    height={3000}
                                    alt='bg-img'
                                    className='w-full rounded-[30px] transition-transform duration-500 hover:scale-110'
                                />
                            </motion.div>
                            <motion.div
                                className="bg-img overflow-hidden rounded-[30px]"
                                variants={imageItemVariants}
                                whileHover={{
                                    scale: 1.05,
                                    y: -5,
                                    transition: { duration: 0.3 },
                                }}
                            >
                                <Image
                                    src={'/images/other/about-us2.png'}
                                    width={2000}
                                    height={3000}
                                    alt='bg-img'
                                    className='w-full rounded-[30px] transition-transform duration-500 hover:scale-110'
                                />
                            </motion.div>
                            <motion.div
                                className="bg-img overflow-hidden rounded-[30px]"
                                variants={imageItemVariants}
                                whileHover={{
                                    scale: 1.05,
                                    y: -5,
                                    transition: { duration: 0.3 },
                                }}
                            >
                                <Image
                                    src={'/images/other/about-us3.png'}
                                    width={2000}
                                    height={3000}
                                    alt='bg-img'
                                    className='w-full rounded-[30px] transition-transform duration-500 hover:scale-110'
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
            <Benefit props="md:pt-20 pt-10" />
            <div ref={instagramRef}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInstagramInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Instagram />
                </motion.div>
            </div>
            <div ref={brandRef}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isBrandInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Brand />
                </motion.div>
            </div>
            <Footer />
        </>
    )
}

export default AboutUs