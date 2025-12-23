'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useModalCompareContext } from '@/context/ModalCompareContext'
import { useCompare } from '@/context/CompareContext'
import { useToast } from '@/context/ToastContext'
import { useModalA11y } from '@/hooks/useModalA11y'

const ModalCompare = () => {
    const { isModalOpen, closeModalCompare } = useModalCompareContext();
    const { compareState, removeFromCompare, clearCompare } = useCompare()
    const { warning } = useToast()
    const dialogRef = useRef<HTMLDivElement | null>(null)

    useModalA11y({ isOpen: isModalOpen, onClose: closeModalCompare, containerRef: dialogRef })

    return (
        <>
            <div className={`modal-compare-block`} onClick={closeModalCompare} aria-hidden={!isModalOpen} role="presentation">
                <div
                    className={`modal-compare-main py-6 ${isModalOpen ? 'open' : ''}`}
                    onClick={(e) => { e.stopPropagation() }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="compare-modal-title"
                    tabIndex={-1}
                    ref={dialogRef}
                >
                    <h2 id="compare-modal-title" className="sr-only">Compare products</h2>
                    <button
                        className="close-btn absolute 2xl:right-6 right-4 2xl:top-6 md:-top-4 top-3 lg:w-10 w-6 lg:h-10 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white"
                        onClick={closeModalCompare}
                        aria-label="Close compare"
                        type="button"
                    >
                        <Icon.X className='body1' aria-hidden="true" />
                    </button>
                    <div className="container h-full flex items-center w-full">
                        <div className="content-main flex items-center justify-between xl:gap-10 gap-6 w-full max-md:flex-wrap">
                            <div className="heading5 flex-shrink-0 max-md:w-full">Compare <br className='max-md:hidden' />Products</div>
                            <div className="list-product flex items-center w-full gap-4">
                                {compareState.compareArray.slice(0, 3).map((product) => (
                                    <div key={product.id} className='item p-3 border border-line rounded-xl relative'>
                                        <div className="infor flex items-center gap-4">
                                            <div className="bg-img w-[100px] h-[100px] flex-shrink-0 rounded-lg overflow-hidden">
                                                <Image
                                                    src={product.images[0]}
                                                    width={500}
                                                    height={500}
                                                    alt={product.name}
                                                    className='w-full h-full'
                                                />
                                            </div>
                                            <div className=''>
                                                <div className="name text-title">{product.name}</div>
                                                <div className="product-price text-title mt-2">${product.price}.00</div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="close-btn absolute -right-4 -top-4 w-8 h-8 rounded-full bg-red text-white flex items-center justify-center duration-300 cursor-pointer hover:bg-black"
                                            onClick={() => removeFromCompare(product.id)}
                                            aria-label={`Remove ${product.name} from compare`}
                                        >
                                            <Icon.X size={14} aria-hidden="true" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="block-button flex flex-col gap-4 flex-shrink-0">
                                {
                                    compareState.compareArray.length < 2 ? (
                                        <>
                                            <a
                                                href='#!'
                                                className='button-main whitespace-nowrap'
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    warning('Minimum 2 products required to compare!')
                                                }}
                                            >
                                                Compare Products
                                            </a>
                                        </>
                                    ) : (
                                        <>
                                            <Link href={'/compare'} onClick={closeModalCompare} className='button-main whitespace-nowrap'>Compare Products</Link>
                                        </>
                                    )
                                }
                                <button
                                    type="button"
                                    onClick={() => {
                                        closeModalCompare()
                                        clearCompare()
                                    }}
                                    className="button-main whitespace-nowrap border border-black bg-white text-black"
                                >
                                    Clear All Products
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ModalCompare