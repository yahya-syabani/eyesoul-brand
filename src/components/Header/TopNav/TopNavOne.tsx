'use client'

import React, { useState, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter, usePathname } from '@/i18n/routing'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useClickOutside } from '@/hooks/useClickOutside';

interface Props {
    props: string;
    slogan?: string;
}

const TopNavOne: React.FC<Props> = ({ props, slogan }) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const [isOpenLanguage, setIsOpenLanguage] = useState(false)
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
    const languageRef = useRef<HTMLDivElement>(null)
    const currentLanguage = locale === 'en' ? t('language.english') : t('language.indonesia')
    const displaySlogan = slogan || t('home.slogan')

    useClickOutside(languageRef, () => {
        setIsOpenLanguage(false)
        setFocusedIndex(null)
    })

    const handleLanguageChange = (newLocale: 'en' | 'id') => {
        setIsOpenLanguage(false)
        setFocusedIndex(null)
        router.replace(pathname, { locale: newLocale })
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpenLanguage(!isOpenLanguage)
            if (!isOpenLanguage) {
                setFocusedIndex(0)
            }
        } else if (e.key === 'Escape') {
            setIsOpenLanguage(false)
            setFocusedIndex(null)
            languageRef.current?.focus()
        } else if (isOpenLanguage && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            e.preventDefault()
            const languages: ('en' | 'id')[] = ['en', 'id']
            const currentIndex = focusedIndex ?? (locale === 'en' ? 0 : 1)
            let newIndex = currentIndex

            if (e.key === 'ArrowDown') {
                newIndex = (currentIndex + 1) % languages.length
            } else {
                newIndex = (currentIndex - 1 + languages.length) % languages.length
            }

            setFocusedIndex(newIndex)
        } else if (isOpenLanguage && e.key === 'Enter' && focusedIndex !== null) {
            e.preventDefault()
            const languages: ('en' | 'id')[] = ['en', 'id']
            handleLanguageChange(languages[focusedIndex])
        }
    }

    return (
        <>
            <div className={`top-nav md:h-[44px] h-[30px] ${props}`}>
                <div className="container mx-auto h-full">
                    <div className="top-nav-main flex justify-between max-md:justify-center h-full relative">
                        <div className="left-content flex items-center gap-5 max-md:hidden">
                            <div
                                ref={languageRef}
                                role="button"
                                aria-label={t('common.selectLanguage') || 'Select language'}
                                aria-expanded={isOpenLanguage}
                                aria-haspopup="true"
                                tabIndex={0}
                                className="choose-type choose-language language-selector flex items-center gap-2.5 px-4 py-2 bg-white/5 hover:bg-white/15 transition-[background-color] duration-200 ease-out cursor-pointer focus:outline-none"
                                onClick={() => {
                                    setIsOpenLanguage(!isOpenLanguage)
                                }}
                                onKeyDown={handleKeyDown}
                            >
                                <Icon.Globe size={18} className="text-white flex-shrink-0" />
                                <div className="select relative">
                                    <p className="selected caption1 font-medium text-white">{currentLanguage}</p>
                                    <AnimatePresence>
                                        {isOpenLanguage && (
                                            <motion.ul
                                                initial={{ opacity: 0, y: -8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                transition={{ 
                                                    duration: 0.2, 
                                                    ease: [0.4, 0, 0.2, 1],
                                                    staggerChildren: 0.05
                                                }}
                                                className="list-option bg-white open"
                                                role="listbox"
                                            >
                                                <motion.li
                                                    role="option"
                                                    aria-selected={locale === 'en'}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -8 }}
                                                    transition={{ duration: 0.15 }}
                                                    className={`caption1 cursor-pointer ${locale === 'en' ? 'selected font-semibold text-black' : 'text-secondary'} ${focusedIndex === 0 ? 'bg-surface' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleLanguageChange('en')
                                                    }}
                                                    onMouseEnter={() => setFocusedIndex(0)}
                                                >
                                                    {locale === 'en' && (
                                                        <Icon.Check size={16} weight="bold" className="text-green flex-shrink-0" />
                                                    )}
                                                    {t('language.english')}
                                                </motion.li>
                                                <motion.li
                                                    role="option"
                                                    aria-selected={locale === 'id'}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -8 }}
                                                    transition={{ duration: 0.15 }}
                                                    className={`caption1 cursor-pointer ${locale === 'id' ? 'selected font-semibold text-black' : 'text-secondary'} ${focusedIndex === 1 ? 'bg-surface' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleLanguageChange('id')
                                                    }}
                                                    onMouseEnter={() => setFocusedIndex(1)}
                                                >
                                                    {locale === 'id' && (
                                                        <Icon.Check size={16} weight="bold" className="text-green flex-shrink-0" />
                                                    )}
                                                    {t('language.indonesia')}
                                                </motion.li>
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <motion.div
                                    animate={{ rotate: isOpenLanguage ? 180 : 0 }}
                                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                                    className="flex-shrink-0"
                                >
                                    <Icon.CaretDown size={14} className="text-white" />
                                </motion.div>
                            </div>
                            <Link href={'/pages/store-location'} className='caption2 text-white hover:underline'>
                                {t('nav.storeLocation')}
                            </Link>
                        </div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-button-uppercase text-white max-md:hidden">
                            {displaySlogan}
                        </div>
                        <div className="right-content flex items-center gap-5 max-md:hidden">
                            <Link href={'https://www.instagram.com/'} target='_blank'>
                                <i className="icon-instagram text-white"></i>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default TopNavOne