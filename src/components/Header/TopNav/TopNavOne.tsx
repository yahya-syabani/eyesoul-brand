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
                                className="choose-type choose-language language-selector flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
                                onClick={() => {
                                    setIsOpenLanguage(!isOpenLanguage)
                                }}
                                onKeyDown={handleKeyDown}
                            >
                                <Icon.Globe size={16} className="text-white flex-shrink-0" />
                                <div className="select relative">
                                    <p className="selected caption2 text-white">{currentLanguage}</p>
                                    <AnimatePresence>
                                        {isOpenLanguage && (
                                            <motion.ul
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                                className="list-option bg-white open shadow-sm rounded-md min-w-[120px] py-1"
                                                role="listbox"
                                            >
                                                <motion.li
                                                    role="option"
                                                    aria-selected={locale === 'en'}
                                                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                    className={`caption2 cursor-pointer px-3 py-2 ${
                                                        locale === 'en' ? 'font-medium text-black' : 'text-secondary'
                                                    } ${focusedIndex === 0 ? 'bg-black/5' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleLanguageChange('en')
                                                    }}
                                                    onMouseEnter={() => setFocusedIndex(0)}
                                                >
                                                    {t('language.english')}
                                                </motion.li>
                                                <motion.li
                                                    role="option"
                                                    aria-selected={locale === 'id'}
                                                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                                                    className={`caption2 cursor-pointer px-3 py-2 ${
                                                        locale === 'id' ? 'font-medium text-black' : 'text-secondary'
                                                    } ${focusedIndex === 1 ? 'bg-black/5' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleLanguageChange('id')
                                                    }}
                                                    onMouseEnter={() => setFocusedIndex(1)}
                                                >
                                                    {t('language.indonesia')}
                                                </motion.li>
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <motion.div
                                    animate={{ rotate: isOpenLanguage ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-shrink-0"
                                >
                                    <Icon.CaretDown size={12} className="text-white" />
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