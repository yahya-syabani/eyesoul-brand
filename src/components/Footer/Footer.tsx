'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useClickOutside } from '@/hooks/useClickOutside';

const Footer = () => {
    const [isOpenLanguage, setIsOpenLanguage] = useState(false)
    const [language, setLanguage] = useState('English')
    const languageRef = useRef<HTMLDivElement>(null)

    useClickOutside(languageRef, () => {
        setIsOpenLanguage(false)
    })

    const handleLanguageSelect = (item: string) => {
        setLanguage(item)
        setIsOpenLanguage(false)
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
                                        <h3 className="text-button-uppercase pb-3">Infomation</h3>
                                        <Link className='caption1 has-line-before duration-300 w-fit' href={'/pages/contact'}>Contact us</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/my-account'}>My Account</Link>
                                    </div>
                                    <div className="item flex flex-col basis-1/3 ">
                                        <h3 className="text-button-uppercase pb-3">Quick Shop</h3>
                                        <Link className='caption1 has-line-before duration-300 w-fit' href={'/shop/default'}>Shop All</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/shop/default'}>New Arrivals</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/shop/default'}>Best Sellers</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/blog/default'}>Blog</Link>
                                    </div>
                                    <div className="item flex flex-col basis-1/3 ">
                                        <h3 className="text-button-uppercase pb-3">Customer Services</h3>
                                        <Link className='caption1 has-line-before duration-300 w-fit' href={'/pages/faqs'}>Orders FAQs</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/pages/faqs'}>Shipping</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/pages/faqs'}>Privacy Policy</Link>
                                        <Link className='caption1 has-line-before duration-300 w-fit pt-2' href={'/pages/faqs'}>Return & Refund</Link>
                                    </div>
                                </nav>
                            </div>
                        </div>
                        <div className="footer-bottom py-3 flex items-center justify-between gap-5 max-lg:justify-center max-lg:flex-col border-t border-line">
                            <div className="left flex items-center gap-8">
                                <div className="copyright caption1 text-secondary">©{new Date().getFullYear()} Eyesoul Eyewear. All Rights Reserved.</div>
                                <div className="select-block flex items-center gap-5 max-md:hidden">
                                    <div
                                        ref={languageRef}
                                        className="choose-type choose-language flex items-center gap-1.5"
                                        onClick={() => {
                                            setIsOpenLanguage(!isOpenLanguage)
                                        }}
                                    >
                                        <div className="select relative">
                                            <p className="selected caption2 text-secondary">{language}</p>
                                            <ul className={`list-option bg-white ${isOpenLanguage ? 'open' : ''}`}>
                                                {
                                                    ['English', 'Indonesia'].map((item, index) => (
                                                        <li 
                                                            key={index} 
                                                            className="caption2" 
                                                            onClick={() => handleLanguageSelect(item)}
                                                        >
                                                            {item}
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                        <Icon.CaretDown size={12} color='#1F1F1F' />
                                    </div>
                                </div>
                            </div>
                            <div className="right flex items-center">
                                <Link 
                                    href="/admin/login" 
                                    className="flex items-center gap-2 text-secondary hover:text-black transition-colors duration-300"
                                    aria-label="Admin login"
                                >
                                    <Icon.ShieldCheck size={18} />
                                    <span className="caption2 max-md:hidden">Admin</span>
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