'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Link, usePathname } from '@/i18n/routing'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import useLoginPopup from '@/store/useLoginPopup'
import useMenuMobile from '@/store/useMenuMobile'
import { useModalCartContext } from '@/context/ModalCartContext'
import { useModalWishlistContext } from '@/context/ModalWishlistContext'
import { useModalSearchContext } from '@/context/ModalSearchContext'
import { useCart } from '@/context/CartContext'
import ThemeToggle from '@/components/Theme/ThemeToggle'
import { useTheme } from '@/context/ThemeContext'

const MenuTwo = () => {
  const pathname = usePathname()
  const { openLoginPopup, handleLoginPopup } = useLoginPopup()
  const { openMenuMobile, handleMenuMobile } = useMenuMobile()
  const { openModalCart } = useModalCartContext()
  const { openModalWishlist } = useModalWishlistContext()
  const { openModalSearch } = useModalSearchContext()
  const { cartState } = useCart()
  const { resolvedTheme } = useTheme()
  
  const iconColor = resolvedTheme === 'dark' ? '#E5E5E5' : '#1F1F1F'

  const [fixedHeader, setFixedHeader] = useState(true)
  const lastScrollPosition = useRef(0)

  useEffect(() => {
    let ticking = false
    const scrollThreshold = 10

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY
          // Top banner height: 30px mobile, 44px desktop
          const topBannerHeight = window.innerWidth >= 768 ? 44 : 30
          const totalTopHeight = topBannerHeight + scrollThreshold
          
          // At top (including top banner), always show
          if (scrollPosition <= totalTopHeight) {
            setFixedHeader(true)
          } else {
            // Below threshold: show when scrolling up, hide when scrolling down
            const isScrollingUp = scrollPosition < lastScrollPosition.current - scrollThreshold
            setFixedHeader(isScrollingUp)
          }
          
          lastScrollPosition.current = scrollPosition
          ticking = false
        })
        ticking = true
      }
    }

    // Set initial state based on current scroll position
    const initialScroll = window.scrollY
    lastScrollPosition.current = initialScroll
    const topBannerHeight = window.innerWidth >= 768 ? 44 : 30
    const totalTopHeight = topBannerHeight + scrollThreshold
    
    if (initialScroll <= totalTopHeight) {
      setFixedHeader(true)
    } else {
      // If not at top initially, start hidden
      setFixedHeader(false)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/shop/default') return pathname.startsWith('/shop')
    if (href === '/blog/default') return pathname.startsWith('/blog')
    return pathname === href
  }

  const navItems = [
    { href: '/shop/default', label: 'Shop' },
    { href: '/pages/about', label: 'About' },
    { href: '/pages/contact', label: 'Contact' },
    { href: '/blog/default', label: 'Blog' },
  ]

  return (
    <>
      <header
        className={`header-menu style-one fixed top-0 left-0 right-0 bg-white w-full md:h-[74px] h-[56px] ${fixedHeader ? 'visible' : 'hidden'}`}
      >
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
                      Login
                    </Link>
                    <div className="text-secondary text-center mt-3 pb-4">
                      Don't have an account?
                      <Link href="/register" className="text-black pl-1 hover:underline">
                        Register
                      </Link>
                    </div>
                    <div className="bottom pt-4 border-t border-line" aria-hidden="true"></div>
                    <Link href="/pages/contact" className="body1 hover:underline">
                      Support
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
      </header>

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
                  Search
                </button>
                <button className="flex items-center gap-2" onClick={openModalWishlist} type="button" aria-label="Open wishlist">
                  <Icon.Heart size={20} aria-hidden="true" />
                  Wishlist
                </button>
                <button className="flex items-center gap-2" onClick={openModalCart} type="button" aria-label="Open shopping cart">
                  <Icon.Handbag size={20} aria-hidden="true" />
                  Cart
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

export default MenuTwo



