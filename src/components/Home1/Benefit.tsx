'use client'

import { useTranslations } from 'next-intl'
import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import * as Icon from "@phosphor-icons/react/dist/ssr"

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
                    <div className="heading3 text-center">
                        {t('home.whyChooseUs')}
                    </div>
                    <motion.div
                        ref={ref}
                        className="list-benefit grid items-start lg:grid-cols-4 grid-cols-2 gap-[30px] md:mt-10 mt-6"
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
                            <Icon.ShieldCheck className="w-12 h-12 lg:w-[72px] lg:h-[72px]" weight="fill" />
                            <div className="heading6 text-center mt-5">{t('benefit.frameGuarantee.title')}</div>
                            <div className="caption1 text-secondary text-center mt-3">{t('benefit.frameGuarantee.description')}</div>
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
                            <Icon.Eye className="w-12 h-12 lg:w-[72px] lg:h-[72px]" weight="fill" />
                            <div className="heading6 text-center mt-5">{t('benefit.eyeExamination.title')}</div>
                            <div className="caption1 text-secondary text-center mt-3">{t('benefit.eyeExamination.description')}</div>
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
                            <Icon.ArrowsClockwise className="w-12 h-12 lg:w-[72px] lg:h-[72px]" weight="fill" />
                            <div className="heading6 text-center mt-5">{t('benefit.tradeIn.title')}</div>
                            <div className="caption1 text-secondary text-center mt-3">{t('benefit.tradeIn.description')}</div>
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
                            <Icon.Wrench className="w-12 h-12 lg:w-[72px] lg:h-[72px]" weight="fill" />
                            <div className="heading6 text-center mt-5">{t('benefit.freeService.title')}</div>
                            <div className="caption1 text-secondary text-center mt-3">{t('benefit.freeService.description')}</div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </>
    )
}

export default Benefit