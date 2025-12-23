'use client'

import { useRouter } from 'next/navigation'
import React, { useRef, useState, useEffect } from 'react'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import productData from '@/data/Product.json'
import { useModalQuickviewContext } from '@/context/ModalQuickviewContext';
import Image from 'next/image';
import { useModalA11y } from '@/hooks/useModalA11y'

const ModalNewsletter = () => {
    const [open, setOpen] = useState<boolean>(false)
    const router = useRouter()
    const { openQuickview } = useModalQuickviewContext()
    const dialogRef = useRef<HTMLDivElement | null>(null)

    const handleDetailProduct = (productId: string) => {
        // redirect to shop with category selected
        router.push(`/product/default?id=${productId}`);
    };

    useEffect(() => {
        setTimeout(() => {
            setOpen(true)
        }, 3000)
    }, [])

    useModalA11y({ isOpen: open, onClose: () => setOpen(false), containerRef: dialogRef })

    return (
        <div className="modal-newsletter" onClick={() => setOpen(false)} aria-hidden={!open} role="presentation">
            <div className="container h-full flex items-center justify-center w-full">
                <div
                    className={`modal-newsletter-main ${open ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation() }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="newsletter-modal-title"
                    tabIndex={-1}
                    ref={dialogRef}
                >
                    <div className="main-content flex rounded-[20px] overflow-hidden w-full">
                        <div
                            className="left lg:w-1/2 sm:w-2/5 max-sm:hidden bg-green flex flex-col items-center justify-center gap-5 py-14">
                            <div className="text-xs font-semibold uppercase text-center">Special Offer</div>
                            <div
                                className="lg:text-[70px] text-4xl lg:leading-[78px] leading-[42px] font-bold uppercase text-center">
                                Black<br />Fridays</div>
                            <div className="text-button-uppercase text-center">New customers save <span
                                className="text-red">30%</span>
                                with the code</div>
                            <div className="text-button-uppercase text-red bg-white py-2 px-4 rounded-lg">GET20off</div>
                            <button type="button" className="button-main w-fit bg-black text-white hover:bg-white uppercase">
                                Copy coupon code
                            </button>
                        </div>
                        <div className="right lg:w-1/2 sm:w-3/5 w-full bg-white sm:pt-10 sm:pl-10 max-sm:p-6 relative">
                            <button
                                type="button"
                                className="close-newsletter-btn w-10 h-10 flex items-center justify-center border border-line rounded-full absolute right-5 top-5 cursor-pointer"
                                onClick={() => setOpen(false)}
                                aria-label="Close newsletter"
                            >
                                <Icon.X weight='bold' className='text-xl' aria-hidden="true" />
                            </button>
                            <h2 id="newsletter-modal-title" className="heading5 pb-5">You May Also Like</h2>
                            <div className="list flex flex-col gap-5 overflow-x-auto sm:pr-6">
                                {productData.slice(11, 16).map((item) => (
                                    <div
                                        key={item.id}
                                        className='product-item item pb-5 flex items-center justify-between gap-3 border-b border-line'
                                    >
                                        <div
                                            className="infor flex items-center gap-5 cursor-pointer"
                                            onClick={() => handleDetailProduct(item.id)}
                                        >
                                            <div className="bg-img flex-shrink-0">
                                                <Image width={5000} height={5000} src={item.thumbImage[0]} alt={item.name}
                                                    className='w-[100px] aspect-square flex-shrink-0 rounded-lg' />
                                            </div>
                                            <div className=''>
                                                <div className="name text-button">{item.name}</div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="product-price text-title">${item.price}.00</div>
                                                    <div className="product-origin-price text-title text-secondary2">
                                                        <del>${item.originPrice}.00</del>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            className="quick-view-btn button-main sm:py-3 py-2 sm:px-5 px-4 bg-black hover:bg-green text-white rounded-full whitespace-nowrap"
                                            onClick={() => openQuickview(item)}
                                            type="button"
                                        >
                                            QUICK VIEW
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalNewsletter
