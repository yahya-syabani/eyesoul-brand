'use client'

import React, { useState, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter, usePathname } from '@/i18n/routing'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useClickOutside } from '@/hooks/useClickOutside';

interface Props {
    props: string;
}

const TopNavThree: React.FC<Props> = ({ props }) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const [isOpenLanguage, setIsOpenLanguage] = useState(false)
    const [isOpenCurrence, setIsOpenCurrence] = useState(false)
    const [currence, setCurrence] = useState('USD')
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
    const languageRef = useRef<HTMLDivElement>(null)
    const currentLanguage = locale === 'en' ? t('language.english') : t('language.indonesia')

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
            setIsOpenCurrence(false)
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
            <div className={`top-nav md:h-[44px] h-[30px] border-b border-line ${props}`}>
                <div className="container mx-auto h-full">
                    <div className="top-nav-main flex justify-between max-md:justify-center h-full">
                        <div className="left-content flex items-center">
                            <ul className='flex items-center gap-5'>
                                <li>
                                    <Link href={'/pages/about'} className='caption2 hover:underline'>
                                        {t('nav.about')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={'/pages/contact'} className='caption2 hover:underline'>
                                        {t('nav.contact')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={'/pages/contact'} className='caption2 hover:underline'>
                                        {t('nav.support')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href={'/pages/faqs'} className='caption2 hover:underline'>
                                        {t('nav.help')}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="right-content flex items-center gap-5 max-md:hidden">
                            <div
                                ref={languageRef}
                                role="button"
                                aria-label={t('common.selectLanguage') || 'Select language'}
                                aria-expanded={isOpenLanguage}
                                aria-haspopup="true"
                                tabIndex={0}
                                className="choose-type choose-language language-selector flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/20"
                                onClick={() => {
                                    setIsOpenLanguage(!isOpenLanguage)
                                    setIsOpenCurrence(false)
                                }}
                                onKeyDown={handleKeyDown}
                            >
                                <Icon.Globe size={16} className="text-secondary flex-shrink-0" />
                                <div className="select relative">
                                    <p className="selected caption2 text-secondary">{currentLanguage}</p>
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
                                    <Icon.CaretDown size={12} className="text-secondary" />
                                </motion.div>
                            </div>
                            <div
                                className="choose-type choose-currency flex items-center gap-1.5"
                                onClick={() => {
                                    setIsOpenCurrence(!isOpenCurrence)
                                    setIsOpenLanguage(false)
                                }}
                            >
                                <div className="select relative">
                                    <p className="selected caption2">{currence}</p>
                                    <ul className={`list-option bg-white ${isOpenCurrence ? 'open' : ''}`}>
                                        {
                                            ['USD', 'EUR', 'GBP'].map((item, index) => (
                                                <li key={index} className="caption2" onClick={() => setCurrence(item)}>{item}</li>
                                            ))
                                        }
                                    </ul>
                                </div>
                                <Icon.CaretDown size={12} />
                            </div>
                            <Link href={'https://www.facebook.com/'} target='_blank'>
                                <i className="icon-facebook text-black"></i>
                            </Link>
                            <Link href={'https://www.instagram.com/'} target='_blank'>
                                <i className="icon-instagram text-black"></i>
                            </Link>
                            <Link href={'https://www.youtube.com/'} target='_blank'>
                                <i className="icon-youtube text-black"></i>
                            </Link>
                            <Link href={'https://twitter.com/'} target='_blank'>
                                <i className="icon-twitter text-black"></i>
                            </Link>
                            <Link href={'https://pinterest.com/'} target='_blank'>
                                <i className="icon-pinterest text-black"></i>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default TopNavThree