'use client'

import React, { useState, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter, usePathname } from '@/i18n/routing'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useClickOutside } from '@/hooks/useClickOutside';

const Footer = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()
    const [isOpenLanguage, setIsOpenLanguage] = useState(false)
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
    const languageRef = useRef<HTMLDivElement>(null)
    const currentLanguage = locale === 'en' ? t('language.english') : t('language.indonesia')

    useClickOutside(languageRef, () => {
        setIsOpenLanguage(false)
        setFocusedIndex(null)
    })

    const handleLanguageSelect = (newLocale: 'en' | 'id') => {
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
            handleLanguageSelect(languages[focusedIndex])
        }
    }
    return (
        <>
            <footer id="footer" className='footer'>
                <div className="footer-main bg-surface">
                    <div className="container">
                        <div className="content-footer py-[60px] flex justify-between flex-wrap gap-y-8">
                            <div className="company-infor basis-1/4 max-lg:basis-full pr-7">
                                <Link href={'/'} className="logo" aria-label="Eyesoul Eyewear home">
                                    <div className="heading4">Eyesoul Eyewear</div>
                                </Link>
                            </div>
                            <div className="right-content flex flex-wrap gap-y-8 basis-3/4 max-lg:basis-full">
                                <nav className="list-nav flex justify-between basis-full gap-4" aria-label="Footer navigation">
                                    <div className="item flex flex-col basis-1/3 ">
                                        <h3 className="text-button-uppercase pb-3">{t('footer.information')}</h3>
                                        <Link className='caption1 has-line-before duration-300 w-fit' href={'/pages/contact'}>{t('footer.contactUs')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/pages/service'}>{t('footer.services')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/pages/insurance'}>{t('footer.insurance')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/my-account'}>{t('footer.myAccount')}</Link>
                                    </div>
                                    <div className="item flex flex-col basis-1/3 ">
                                        <h3 className="text-button-uppercase pb-3">{t('footer.quickShop')}</h3>
                                        <Link className='caption1 has-line-before duration-300 w-fit' href={'/shop/default'}>{t('footer.shopAll')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/shop/default'}>{t('footer.newArrivals')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/shop/default'}>{t('footer.bestSellers')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/blog/default'}>{t('footer.blog')}</Link>
                                    </div>
                                    <div className="item flex flex-col basis-1/3 ">
                                        <h3 className="text-button-uppercase pb-3">{t('footer.customerServices')}</h3>
                                        <Link className='caption1 has-line-before duration-300 w-fit' href={'/pages/faqs'}>{t('footer.ordersFaqs')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/pages/faqs'}>{t('footer.shipping')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/pages/faqs'}>{t('footer.privacyPolicy')}</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/pages/faqs'}>{t('footer.returnRefund')}</Link>
                                    </div>
                                </nav>
                            </div>
                        </div>
                        <div className="footer-bottom py-3 flex items-center justify-between gap-5 max-lg:justify-center max-lg:flex-col border-t border-line">
                            <div className="left flex items-center gap-8">
                                <div className="copyright caption1 text-secondary">{t('footer.copyright', { year: new Date().getFullYear() })}</div>
                                <div className="select-block flex items-center gap-5 max-md:hidden">
                                    <div
                                        ref={languageRef}
                                        role="button"
                                        aria-label={t('common.selectLanguage') || 'Select language'}
                                        aria-expanded={isOpenLanguage}
                                        aria-haspopup="true"
                                        tabIndex={0}
                                        className="choose-type choose-language language-selector flex items-center gap-2.5 px-4 py-2 bg-surface/40 hover:bg-surface/60 transition-[background-color] duration-200 ease-out cursor-pointer focus:outline-none"
                                        onClick={() => {
                                            setIsOpenLanguage(!isOpenLanguage)
                                        }}
                                        onKeyDown={handleKeyDown}
                                    >
                                        <div className="select relative">
                                            <p className="selected caption1 text-secondary">{currentLanguage}</p>
                                            {isOpenLanguage && (
                                                <ul
                                                    className="list-option bg-white open"
                                                    role="listbox"
                                                >
                                                    <li
                                                        role="option"
                                                        aria-selected={locale === 'en'}
                                                        className={`caption1 cursor-pointer ${locale === 'en' ? 'selected text-black' : 'text-secondary'} ${focusedIndex === 0 ? 'bg-surface' : ''}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleLanguageSelect('en')
                                                        }}
                                                        onMouseEnter={() => setFocusedIndex(0)}
                                                    >
                                                        {t('language.english')}
                                                    </li>
                                                    <li
                                                        role="option"
                                                        aria-selected={locale === 'id'}
                                                        className={`caption1 cursor-pointer ${locale === 'id' ? 'selected text-black' : 'text-secondary'} ${focusedIndex === 1 ? 'bg-surface' : ''}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleLanguageSelect('id')
                                                        }}
                                                        onMouseEnter={() => setFocusedIndex(1)}
                                                    >
                                                        {t('language.indonesia')}
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                        <div className="flex-shrink-0">
                                            <Icon.CaretDown size={14} className={`text-secondary transition-transform ${isOpenLanguage ? 'rotate-180' : ''}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="right flex items-center gap-4">
                                <a 
                                    href="https://www.instagram.com/eyesoul.eyewear/" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center text-secondary hover:text-black transition-colors duration-300"
                                    aria-label="Follow us on Instagram"
                                >
                                    <i className="icon-instagram text-xl"></i>
                                </a>
                                <Link 
                                    href="/admin/login" 
                                    className="flex items-center gap-2 text-secondary hover:text-black transition-colors duration-300"
                                    aria-label="Admin login"
                                >
                                    <Icon.ShieldCheck size={18} />
                                    <span className="caption2 max-md:hidden">{t('footer.admin')}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer