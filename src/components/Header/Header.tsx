'use client'

import React, { useState, useRef } from 'react'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { motion, AnimatePresence } from 'framer-motion'
import useLoginPopup from '@/store/useLoginPopup'
import useMenuMobile from '@/store/useMenuMobile'
import { useModalCartContext } from '@/context/ModalCartContext'
import { useModalWishlistContext } from '@/context/ModalWishlistContext'
import { useModalSearchContext } from '@/context/ModalSearchContext'
import { useCart } from '@/context/CartContext'
import ThemeToggle from '@/components/Theme/ThemeToggle'
import { useTheme } from '@/context/ThemeContext'
import { useClickOutside } from '@/hooks/useClickOutside'

interface HeaderProps {
  topNavProps?: string
  slogan?: string
}

const Header: React.FC<HeaderProps> = ({ 
  topNavProps = 'style-two bg-purple', 
  slogan 
}) => {
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const { openLoginPopup, handleLoginPopup } = useLoginPopup()
  const { openMenuMobile, handleMenuMobile } = useMenuMobile()
  const { openModalCart } = useModalCartContext()
  const { openModalWishlist } = useModalWishlistContext()
  const { openModalSearch } = useModalSearchContext()
  const { cartState } = useCart()
  const { resolvedTheme } = useTheme()
  
  const iconColor = resolvedTheme === 'dark' ? '#E5E5E5' : '#1F1F1F'

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

  const isActive = (href: string) => {
    if (href === '/shop/default') return pathname.startsWith('/shop')
    if (href === '/blog/default') return pathname.startsWith('/blog')
    if (href === '/pages/service') return pathname === '/pages/service'
    return pathname === href
  }

  const navItems = [
    { href: '/shop/default', label: t('nav.shop') },
    { href: '/pages/about', label: t('nav.about') },
    { href: '/pages/service', label: t('nav.service') },
    { href: '/pages/contact', label: t('nav.contact') },
    { href: '/blog/default', label: t('nav.blog') },
  ]

  return (
    <>
      <header
        className="header-merged fixed top-0 left-0 right-0 w-full z-[102]"
      >
        {/* Top Banner Section */}
        <div className={`top-nav md:h-[44px] h-[30px] ${topNavProps}`}>
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
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-button-uppercase text-white max-md:hidden whitespace-nowrap">
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

        {/* Main Navigation Section */}
        <div className="header-menu bg-white md:h-[74px] h-[56px]">
          <div className="container mx-auto h-full">
            <div className="header-main flex justify-between h-full">
              <button
                className="menu-mobile-icon lg:hidden flex items-center"
                onClick={handleMenuMobile}
                aria-label="Open mobile menu"
                type="button"
              >
                <i className="icon-category text-2xl" aria-hidden="true"></i>
              </button>

              <Link href="/" className="flex items-center" aria-label="Eyesoul Eyewear home">
                <div className="heading4">Eyesoul Eyewear</div>
              </Link>

              <nav className="menu-main h-full max-lg:hidden" aria-label="Main navigation">
                <ul className="flex items-center gap-8 h-full">
                  {navItems.map((item) => (
                    <li key={item.href} className="h-full">
                      <Link
                        href={item.href}
                        className={`text-button-uppercase duration-300 h-full flex items-center justify-center ${
                          isActive(item.href) ? 'active' : ''
                        }`}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="right flex gap-12">
                <button
                  className="max-md:hidden search-icon flex items-center cursor-pointer relative"
                  onClick={openModalSearch}
                  aria-label="Open search"
                  type="button"
                >
                  <Icon.MagnifyingGlass size={24} color={iconColor} aria-hidden="true" />
                  <div className="line absolute bg-line w-px h-6 -right-6" aria-hidden="true"></div>
                </button>

                <div className="list-action flex items-center gap-4">
                  <div className="max-md:hidden">
                    <ThemeToggle />
                  </div>
                  <div className="user-icon flex items-center justify-center cursor-pointer relative">
                    <button
                      onClick={handleLoginPopup}
                      aria-label="User account menu"
                      aria-expanded={openLoginPopup}
                      type="button"
                    >
                      <Icon.User size={24} color={iconColor} aria-hidden="true" />
                    </button>
                    <div
                      className={`login-popup absolute top-[74px] w-[320px] p-7 rounded-xl bg-white box-shadow-small ${
                        openLoginPopup ? 'open' : ''
                      }`}
                      role="menu"
                      aria-hidden={!openLoginPopup}
                    >
                      <Link href="/login" className="button-main w-full text-center">
                        {t('nav.login')}
                      </Link>
                      <div className="text-secondary text-center mt-3 pb-4">
                        {t('auth.dontHaveAccount')}
                        <Link href="/register" className="text-black pl-1 hover:underline">
                          {t('nav.register')}
                        </Link>
                      </div>
                      <div className="bottom pt-4 border-t border-line" aria-hidden="true"></div>
                      <Link href="/pages/contact" className="body1 hover:underline">
                        {t('nav.support')}
                      </Link>
                    </div>
                  </div>

                  <button
                    className="max-md:hidden wishlist-icon flex items-center cursor-pointer"
                    onClick={openModalWishlist}
                    aria-label="Open wishlist"
                    type="button"
                  >
                    <Icon.Heart size={24} color={iconColor} aria-hidden="true" />
                  </button>

                  <button
                    className="cart-icon flex items-center relative cursor-pointer"
                    onClick={openModalCart}
                    aria-label={`Open shopping cart, ${cartState.cartArray.length} items`}
                    type="button"
                  >
                    <Icon.Handbag size={24} color={iconColor} aria-hidden="true" />
                    <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full" aria-hidden="true">
                      {cartState.cartArray.length}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <aside
        id="menu-mobile"
        className={`${openMenuMobile ? 'open' : ''}`}
        aria-label="Mobile navigation menu"
        aria-hidden={!openMenuMobile}
      >
        <div className="menu-container bg-white h-full">
          <div className="container h-full">
            <nav className="menu-main h-full overflow-hidden">
              <div className="heading py-2 relative flex items-center justify-center">
                <button
                  className="close-menu-mobile-btn absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface flex items-center justify-center"
                  onClick={handleMenuMobile}
                  aria-label="Close mobile menu"
                  type="button"
                >
                  <Icon.X size={14} aria-hidden="true" />
                </button>
                <Link href="/" className="heading5" onClick={handleMenuMobile} aria-label="Eyesoul Eyewear home">
                  Eyesoul Eyewear
                </Link>
              </div>

              <div className="list-nav mt-6">
                <ul>
                  {navItems.map((item) => (
                    <li key={item.href} className="mt-5">
                      <Link
                        href={item.href}
                        onClick={handleMenuMobile}
                        className={`text-xl font-semibold flex items-center justify-between ${
                          isActive(item.href) ? 'active' : ''
                        }`}
                        aria-current={isActive(item.href) ? 'page' : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-line flex items-center justify-between flex-wrap gap-4">
                <button className="flex items-center gap-2" onClick={openModalSearch} type="button" aria-label="Open search">
                  <Icon.MagnifyingGlass size={20} aria-hidden="true" />
                  {t('common.search')}
                </button>
                <button className="flex items-center gap-2" onClick={openModalWishlist} type="button" aria-label="Open wishlist">
                  <Icon.Heart size={20} aria-hidden="true" />
                  {t('nav.wishlist')}
                </button>
                <button className="flex items-center gap-2" onClick={openModalCart} type="button" aria-label="Open shopping cart">
                  <Icon.Handbag size={20} aria-hidden="true" />
                  {t('nav.cart')}
                </button>
                <div className="lg:hidden">
                  <ThemeToggle />
                </div>
              </div>
            </nav>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Header

