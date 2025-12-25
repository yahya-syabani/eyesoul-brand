'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import * as Icon from '@phosphor-icons/react/dist/ssr'
import { usePathname } from 'next/navigation'
import useLoginPopup from '@/store/useLoginPopup'
import useMenuMobile from '@/store/useMenuMobile'
import { useModalCartContext } from '@/context/ModalCartContext'
import { useModalWishlistContext } from '@/context/ModalWishlistContext'
import { useModalSearchContext } from '@/context/ModalSearchContext'
import { useCart } from '@/context/CartContext'
import { useTheme } from '@/context/ThemeContext'

interface Props {
  props: string
}

const MenuOne: React.FC<Props> = ({ props }) => {
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
      <div
        className={`header-menu style-one fixed top-0 left-0 right-0 w-full md:h-[74px] h-[56px] ${fixedHeader ? 'visible' : 'hidden'} ${props}`}
      >
        <div className="container mx-auto h-full">
          <div className="header-main flex justify-between h-full">
            <div className="menu-mobile-icon lg:hidden flex items-center" onClick={handleMenuMobile}>
              <i className="icon-category text-2xl"></i>
            </div>

            <div className="left flex items-center gap-16">
              <Link href="/" className="flex items-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2">
                <div className="heading4">Eyesoul Eyewear</div>
              </Link>
              <div className="menu-main h-full max-lg:hidden">
                <ul className="flex items-center gap-8 h-full">
                  {navItems.map((item) => (
                    <li key={item.href} className="h-full">
                      <Link
                        href={item.href}
                        className={`text-button-uppercase duration-300 h-full flex items-center justify-center ${
                          isActive(item.href) ? 'active' : ''
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="right flex gap-12">
              <div className="max-md:hidden search-icon flex items-center cursor-pointer relative">
                <Icon.MagnifyingGlass size={24} color={iconColor} onClick={openModalSearch} />
                <div className="line absolute bg-line w-px h-6 -right-6"></div>
              </div>

              <div className="list-action flex items-center gap-4">
                <div className="user-icon flex items-center justify-center cursor-pointer">
                  <Icon.User size={24} color={iconColor} onClick={handleLoginPopup} />
                  <div
                    className={`login-popup absolute top-[74px] w-[320px] p-7 rounded-xl bg-white box-shadow-small ${
                      openLoginPopup ? 'open' : ''
                    }`}
                  >
                    <Link href="/login" className="button-main w-full text-center">
                      Login
                    </Link>
                    <div className="text-secondary text-center mt-3 pb-4">
                      Don’t have an account?
                      <Link href="/register" className="text-black pl-1 hover:underline">
                        Register
                      </Link>
                    </div>
                    <div className="bottom pt-4 border-t border-line"></div>
                    <Link href="/pages/contact" className="body1 hover:underline">
                      Support
                    </Link>
                  </div>
                </div>

                <div className="max-md:hidden wishlist-icon flex items-center cursor-pointer" onClick={openModalWishlist}>
                  <Icon.Heart size={24} color={iconColor} />
                </div>

                <div className="cart-icon flex items-center relative cursor-pointer" onClick={openModalCart}>
                  <Icon.Handbag size={24} color={iconColor} />
                  <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">
                    {cartState.cartArray.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="menu-mobile" className={`${openMenuMobile ? 'open' : ''}`}>
        <div className="menu-container bg-white h-full">
          <div className="container h-full">
            <div className="menu-main h-full overflow-hidden">
              <div className="heading py-2 relative flex items-center justify-center">
                <div
                  className="close-menu-mobile-btn absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface flex items-center justify-center"
                  onClick={handleMenuMobile}
                >
                  <Icon.X size={14} />
                </div>
                <Link href="/" className="heading5" onClick={handleMenuMobile}>
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
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-line flex items-center justify-between">
                <button className="flex items-center gap-2" onClick={openModalSearch} type="button">
                  <Icon.MagnifyingGlass size={20} />
                  Search
                </button>
                <button className="flex items-center gap-2" onClick={openModalWishlist} type="button">
                  <Icon.Heart size={20} />
                  Wishlist
                </button>
                <button className="flex items-center gap-2" onClick={openModalCart} type="button">
                  <Icon.Handbag size={20} />
                  Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MenuOne



