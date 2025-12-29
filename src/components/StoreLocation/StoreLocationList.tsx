'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { StoreLocationType } from '@/type/StoreLocationType'
import { useModalStoreLocationContext } from '@/context/ModalStoreLocationContext'

interface StoreLocationListProps {
    stores: StoreLocationType[]
    onStoreClick?: (storeId: string) => void
}

const StoreLocationList: React.FC<StoreLocationListProps> = ({ stores, onStoreClick }) => {
    const t = useTranslations()
    const { openModalWithStore } = useModalStoreLocationContext()
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

    const toggleExpand = (storeId: string) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev)
            if (newSet.has(storeId)) {
                newSet.delete(storeId)
            } else {
                newSet.add(storeId)
            }
            return newSet
        })
    }

    const handleStoreClick = (store: StoreLocationType) => {
        // Toggle expand/collapse
        toggleExpand(store.id)
        
        // Open modal with the specific store
        // Need to get all stores - for now, use the stores prop
        openModalWithStore(stores, store.id)
        
        // Call parent callback if provided (for map integration)
        if (onStoreClick) {
            onStoreClick(store.id)
        }
    }

    return (
        <div className="store-location-list space-y-4">
            {stores.map((store) => {
                const isExpanded = expandedItems.has(store.id)
                
                return (
                    <article
                        key={store.id}
                        className={`store-list-item bg-surface rounded-[30px] border-2 border-line overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-black/20 ${
                            isExpanded ? 'expanded' : ''
                        }`}
                    >
                        {/* Header - Always Visible */}
                        <button
                            className="store-item-header w-full p-6 flex items-center justify-between gap-4 text-left cursor-pointer focus:outline-2 focus:outline-black focus:outline-offset-2"
                            onClick={() => handleStoreClick(store)}
                            aria-expanded={isExpanded}
                            aria-controls={`store-details-${store.id}`}
                            type="button"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                {/* Store Image Thumbnail */}
                                {store.imageUrl && (
                                    <div className="store-thumbnail w-20 h-20 md:w-24 md:h-24 flex-shrink-0 relative rounded-lg overflow-hidden">
                                        <Image
                                            src={store.imageUrl}
                                            alt={store.name}
                                            fill
                                            className="object-cover"
                                            sizes="96px"
                                        />
                                    </div>
                                )}
                                
                                {/* Store Name */}
                                <div className="store-info flex-1 min-w-0">
                                    <h3 className="heading4 md:text-xl text-lg font-bold text-black">
                                        {store.name}
                                    </h3>
                                    {!isExpanded && (
                                        <p className="body3 text-secondary2 mt-1 line-clamp-1">
                                            {store.address}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            {/* Expand/Collapse Icon */}
                            <div className="expand-icon flex-shrink-0">
                                <Icon.CaretDown
                                    size={20}
                                    className={`text-black transition-transform duration-300 ${
                                        isExpanded ? 'rotate-180' : ''
                                    }`}
                                    aria-hidden="true"
                                />
                            </div>
                        </button>

                        {/* Collapsible Content */}
                        <div
                            id={`store-details-${store.id}`}
                            className="store-item-content"
                        >
                            <div className="store-details px-6 pb-6 space-y-5">
                                {/* Store Image - Full Size (if exists) */}
                                {store.imageUrl && (
                                    <div className="store-image-full w-full aspect-video relative rounded-lg overflow-hidden">
                                        <Image
                                            src={store.imageUrl}
                                            alt={`${store.name} - ${t('pages.storeLocation.storeImage')}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    </div>
                                )}

                                {/* Address Section */}
                                <div className="address-section">
                                    <div className="flex items-start gap-3">
                                        <Icon.MapPin size={20} className="text-black mt-0.5 flex-shrink-0" aria-hidden="true" />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs uppercase text-secondary2 mb-2 font-medium">
                                                {t('pages.storeLocation.address')}
                                            </div>
                                            <p className="body1 text-black leading-relaxed break-words">
                                                {store.address}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info Group */}
                                <div className="contact-section grid md:grid-cols-2 grid-cols-1 gap-4">
                                    {/* Phone */}
                                    <div className="phone-item flex items-start gap-3">
                                        <Icon.Phone size={20} className="text-black mt-0.5 flex-shrink-0" aria-hidden="true" />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs uppercase text-secondary2 mb-2 font-medium">
                                                {t('pages.storeLocation.phone')}
                                            </div>
                                            <a 
                                                href={`tel:${store.phone}`} 
                                                className="body1 text-black hover:underline hover:text-black/80 transition-colors duration-200 break-all"
                                                onClick={(e) => e.stopPropagation()}
                                                aria-label={`${t('pages.storeLocation.call')} ${store.phone}`}
                                            >
                                                {store.phone}
                                            </a>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    {store.email && (
                                        <div className="email-item flex items-start gap-3">
                                            <Icon.Envelope size={20} className="text-black mt-0.5 flex-shrink-0" aria-hidden="true" />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs uppercase text-secondary2 mb-2 font-medium">
                                                    {t('pages.storeLocation.email')}
                                                </div>
                                                <a 
                                                    href={`mailto:${store.email}`} 
                                                    className="body1 text-black hover:underline hover:text-black/80 transition-colors duration-200 break-all"
                                                    onClick={(e) => e.stopPropagation()}
                                                    aria-label={`${t('pages.storeLocation.email')} ${store.email}`}
                                                >
                                                    {store.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Opening Hours */}
                                <div className="hours-section">
                                    <div className="flex items-start gap-3">
                                        <Icon.Clock size={20} className="text-black mt-0.5 flex-shrink-0" aria-hidden="true" />
                                        <div className="flex-1">
                                            <div className="text-xs uppercase text-secondary2 mb-2 font-medium">
                                                {t('pages.storeLocation.openingHours')}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="body1 text-black">{store.hours.weekdays}</p>
                                                <p className="body1 text-black">{store.hours.saturday}</p>
                                                <p className="body1 text-black">{store.hours.sunday}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="action-buttons pt-2 flex flex-col gap-3">
                                    {/* Get Directions */}
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${store.coordinates.lat},${store.coordinates.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="button-main w-full text-center inline-block transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:outline-2 focus:outline-black focus:outline-offset-2"
                                        onClick={(e) => e.stopPropagation()}
                                        aria-label={`${t('pages.storeLocation.getDirections')} - ${store.name}`}
                                    >
                                        {t('pages.storeLocation.getDirections')}
                                    </a>
                                    
                                    {/* View on Map */}
                                    <button
                                        type="button"
                                        className="w-full px-4 py-2.5 text-sm font-medium text-black bg-transparent border-2 border-line rounded-lg hover:bg-black hover:text-white hover:border-black transition-all duration-300 focus:outline-2 focus:outline-black focus:outline-offset-2"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (onStoreClick) {
                                                onStoreClick(store.id)
                                            }
                                        }}
                                        aria-label={`${t('pages.storeLocation.viewOnMap')} - ${store.name}`}
                                    >
                                        {t('pages.storeLocation.viewOnMap') || 'View on Map'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>
                )
            })}
        </div>
    )
}

export default StoreLocationList

