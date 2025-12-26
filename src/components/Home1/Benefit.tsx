'use client'

import { useTranslations } from 'next-intl'
import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Props {
    props: string;
}

// Animation variants for benefit items
const benefitContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
}

const benefitItemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    },
}

const Benefit: React.FC<Props> = ({ props }) => {
    const t = useTranslations()
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <>
            <div className="container">
                <div className={`benefit-block ${props}`}>
                    <motion.div
                        ref={ref}
                        className="list-benefit grid items-start lg:grid-cols-4 grid-cols-2 gap-[30px]"
                        variants={benefitContainerVariants}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                    >
                        <motion.div
                            className="benefit-item flex flex-col items-center justify-center"
                            variants={benefitItemVariants}
                            whileHover={{
                                scale: 1.05,
                                y: -5,
                                transition: { duration: 0.3 },
                            }}
                        >
                            <i className="icon-phone-call lg:text-7xl text-5xl"></i>
                            <div className="heading6 text-center mt-5">{t('benefit.customerService.title')}</div>
                            <div className="caption1 text-secondary text-center mt-3">{t('benefit.customerService.description')}</div>
                        </motion.div>
                        <motion.div
                            className="benefit-item flex flex-col items-center justify-center"
                            variants={benefitItemVariants}
                            whileHover={{
                                scale: 1.05,
                                y: -5,
                                transition: { duration: 0.3 },
                            }}
                        >
                            <i className="icon-return lg:text-7xl text-5xl"></i>
                            <div className="heading6 text-center mt-5">{t('benefit.moneyBack.title')}</div>
                            <div className="caption1 text-secondary text-center mt-3">{t('benefit.moneyBack.description')}</div>
                        </motion.div>
                        <motion.div
                            className="benefit-item flex flex-col items-center justify-center"
                            variants={benefitItemVariants}
                            whileHover={{
                                scale: 1.05,
                                y: -5,
                                transition: { duration: 0.3 },
                            }}
                        >
                            <i className="icon-guarantee lg:text-7xl text-5xl"></i>
                            <div className="heading6 text-center mt-5">{t('benefit.guarantee.title')}</div>
                            <div className="caption1 text-secondary text-center mt-3">{t('benefit.guarantee.description')}</div>
                        </motion.div>
                        <motion.div
                            className="benefit-item flex flex-col items-center justify-center"
                            variants={benefitItemVariants}
                            whileHover={{
                                scale: 1.05,
                                y: -5,
                                transition: { duration: 0.3 },
                            }}
                        >
                            <i className="icon-delivery-truck lg:text-7xl text-5xl"></i>
                            <div className="heading6 text-center mt-5">{t('benefit.shipping.title')}</div>
                            <div className="caption1 text-secondary text-center mt-3">{t('benefit.shipping.description')}</div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </>
    )
}

export default Benefit