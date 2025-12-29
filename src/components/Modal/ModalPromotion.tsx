'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useModalPromotionContext } from '@/context/ModalPromotionContext'
import { useModalA11y } from '@/hooks/useModalA11y'

const ModalPromotion = () => {
    const { selectedPromotion, closePromotion } = useModalPromotionContext()
    const dialogRef = useRef<HTMLDivElement | null>(null)
    const isOpen = selectedPromotion !== null

    useModalA11y({ isOpen, onClose: closePromotion, containerRef: dialogRef })

    if (!selectedPromotion) {
        return null
    }

    return (
        <div 
            className={`modal-promotion-block`} 
            onClick={closePromotion} 
            aria-hidden={!isOpen} 
            role="presentation"
        >
            <div
                className={`modal-promotion-main py-6 relative ${isOpen ? 'open' : ''}`}
                onClick={(e) => { e.stopPropagation() }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="promotion-modal-title"
                tabIndex={-1}
                ref={dialogRef}
            >
                <div className="heading pb-6 px-6 flex items-center justify-center relative border-b border-line">
                    <h2 id="promotion-modal-title" className="heading5">Promotion Details</h2>
                    <button
                        className="close-btn absolute right-6 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white focus:outline-2 focus:outline-black focus:outline-offset-2"
                        onClick={closePromotion}
                        aria-label="Close promotion"
                        type="button"
                    >
                        <Icon.X size={14} aria-hidden="true" />
                    </button>
                </div>

                <div className="promotion-content flex-1 flex overflow-hidden max-md:flex-col pt-6">
                    {/* Left: Image */}
                    <div className="left lg:w-1/2 md:w-2/5 flex-shrink-0 px-6 h-full">
                        <div className="relative w-full h-full rounded-2xl overflow-hidden">
                            <Image
                                src={selectedPromotion.imageUrl}
                                alt={selectedPromotion.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 50vw"
                            />
                        </div>
                    </div>

                    {/* Right: Title and Description */}
                    <div className="right flex-1 px-6 flex flex-col min-w-0">
                        <div className="promotion-info flex flex-col h-full">
                            <h3 className="heading4 mb-4 flex-shrink-0">{selectedPromotion.title}</h3>
                            <div className="promotion-description body1 text-secondary flex-1 overflow-y-auto">
                                {selectedPromotion.description}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalPromotion

