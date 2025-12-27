'use client'

import React, { useRef, useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useModalStoreLocationContext } from '@/context/ModalStoreLocationContext'
import { useModalA11y } from '@/hooks/useModalA11y'
import { useDebouncedEffect } from '@/hooks/useDebouncedEffect'
import { StoreLocationType } from '@/type/StoreLocationType'

// Helper function to calculate if store is currently open
const getStoreStatus = (hours: StoreLocationType['hours']): { isOpen: boolean; statusText: string } => {
    const now = new Date()
    const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const currentTime = now.getHours() * 60 + now.getMinutes() // Time in minutes
    
    let currentHours: string = ''
    
    if (currentDay === 0) {
        currentHours = hours.sunday
    } else if (currentDay === 6) {
        currentHours = hours.saturday
    } else {
        currentHours = hours.weekdays
    }
    
    // Parse hours string (e.g., "9:00 AM - 8:00 PM")
    // Simple parsing - try to extract time range
    const timeMatch = currentHours.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i)
    
    if (!timeMatch) {
        // If we can't parse, assume closed
        return { isOpen: false, statusText: 'Closed' }
    }
    
    const [, openHour, openMin, openPeriod, closeHour, closeMin, closePeriod] = timeMatch
    
    const parseTime = (hour: string, min: string, period: string): number => {
        let h = parseInt(hour, 10)
        const m = parseInt(min, 10)
        if (period.toUpperCase() === 'PM' && h !== 12) h += 12
        if (period.toUpperCase() === 'AM' && h === 12) h = 0
        return h * 60 + m
    }
    
    const openTime = parseTime(openHour, openMin, openPeriod)
    const closeTime = parseTime(closeHour, closeMin, closePeriod)
    
    const isOpen = currentTime >= openTime && currentTime < closeTime
    
    return {
        isOpen,
        statusText: isOpen ? 'Open Now' : 'Closed'
    }
}

// Helper function to copy to clipboard
const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        try {
            document.execCommand('copy')
            document.body.removeChild(textArea)
            return true
        } catch (fallbackErr) {
            document.body.removeChild(textArea)
            return false
        }
    }
}

const ModalStoreLocation = () => {
    const t = useTranslations()
    const { isModalOpen, stores, expandedStoreIds, toggleStoreExpand, closeModalStoreLocation } = useModalStoreLocationContext();
    const dialogRef = useRef<HTMLDivElement | null>(null)
    const contentRef = useRef<HTMLDivElement | null>(null)
    const searchInputRef = useRef<HTMLInputElement | null>(null)
    
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [copiedField, setCopiedField] = useState<string | null>(null)
    // State to control when open class is applied (for animation)
    const [shouldShowOpen, setShouldShowOpen] = useState(false)

    // Delay adding open class to allow animation on open
    useEffect(() => {
        if (isModalOpen) {
            // Reset first, then add open class after element is in DOM
            setShouldShowOpen(false)
            // Use requestAnimationFrame to ensure DOM has updated
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setShouldShowOpen(true)
                })
            })
        } else {
            setShouldShowOpen(false)
        }
    }, [isModalOpen])

    useModalA11y({ isOpen: isModalOpen, onClose: closeModalStoreLocation, containerRef: dialogRef })

    // Debounce search query
    useDebouncedEffect(() => {
        setDebouncedSearchQuery(searchQuery)
    }, [searchQuery], 300)

    // Filter stores based on search query
    const filteredStores = useMemo(() => {
        if (!debouncedSearchQuery.trim()) {
            return stores
        }
        
        const query = debouncedSearchQuery.toLowerCase().trim()
        return stores.filter(store => 
            store.name.toLowerCase().includes(query) ||
            store.address.toLowerCase().includes(query) ||
            (store.email && store.email.toLowerCase().includes(query))
        )
    }, [stores, debouncedSearchQuery])

    // Clear search when modal closes
    useEffect(() => {
        if (!isModalOpen) {
            setSearchQuery('')
            setDebouncedSearchQuery('')
        }
    }, [isModalOpen])

    // Focus search input when modal opens
    useEffect(() => {
        if (isModalOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus()
            }, 300)
        }
    }, [isModalOpen])

    // Scroll to first expanded item when modal opens
    useEffect(() => {
        if (isModalOpen && expandedStoreIds.size > 0 && contentRef.current) {
            const firstExpandedId = Array.from(expandedStoreIds)[0]
            const expandedElement = contentRef.current.querySelector(`[data-store-id="${firstExpandedId}"]`)
            if (expandedElement) {
                setTimeout(() => {
                    expandedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                }, 300)
            }
        }
    }, [isModalOpen, expandedStoreIds])

    const handleViewOnMap = (storeId: string) => {
        closeModalStoreLocation()
        window.dispatchEvent(new CustomEvent('store-location-view-on-map', { detail: { storeId } }))
    }

    const handleCopyToClipboard = async (text: string, fieldId: string) => {
        const success = await copyToClipboard(text)
        if (success) {
            setCopiedField(fieldId)
            setTimeout(() => setCopiedField(null), 2000)
        }
    }

    const handleClearSearch = () => {
        setSearchQuery('')
        setDebouncedSearchQuery('')
        searchInputRef.current?.focus()
    }

    // Always render when stores exist to allow CSS animations to work
    // Return null only if no stores to display
    if (stores.length === 0) {
        return null;
    }

    const modalClassName = `modal-store-location-main py-6 ${shouldShowOpen ? 'open' : ''}`;

    return (
        <>
            <div 
                className={`modal-store-location-block`} 
                onClick={closeModalStoreLocation} 
                aria-hidden={!isModalOpen} 
                role="presentation"
            >
                <div
                    className={modalClassName}
                    onClick={(e) => { e.stopPropagation() }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="store-location-modal-title"
                    tabIndex={-1}
                    ref={dialogRef}
                >
                    {/* Header */}
                    <div className="modal-store-location-header pb-3 border-b border-line">
                        <div className="flex items-center justify-between mb-3 relative">
                            <h2 id="store-location-modal-title" className="heading5">{t('pages.storeLocation.heading') || 'Store Locations'}</h2>
                            <button
                                className="close-btn absolute right-0 top-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center duration-300 cursor-pointer hover:bg-black hover:text-white focus:outline-2 focus:outline-black focus:outline-offset-2"
                                onClick={closeModalStoreLocation}
                                aria-label={t('pages.storeLocation.closeModal') || 'Close store locations'}
                                type="button"
                            >
                                <Icon.X size={14} aria-hidden="true" />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="search-bar relative">
                            <div className="relative">
                                <Icon.MagnifyingGlass 
                                    size={20} 
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary2 pointer-events-none"
                                    aria-hidden="true"
                                />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('pages.storeLocation.searchPlaceholder') || 'Search by store name, city, or address'}
                                    className="w-full pl-12 pr-10 py-3 rounded-xl border border-line bg-white focus:outline-2 focus:outline-black focus:outline-offset-0 focus:border-black transition-all duration-200"
                                    aria-label={t('pages.storeLocation.searchPlaceholder') || 'Search stores'}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface hover:bg-black hover:text-white flex items-center justify-center transition-colors duration-200 focus:outline-2 focus:outline-black focus:outline-offset-0"
                                        aria-label="Clear search"
                                    >
                                        <Icon.X size={12} aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                            {debouncedSearchQuery && (
                                <div className="mt-2 text-sm text-secondary2" role="status" aria-live="polite">
                                    {t('pages.storeLocation.searchResults', { count: filteredStores.length })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Scrollable Content with Collapsible List */}
                    <div 
                        ref={contentRef}
                        className="modal-store-location-content py-4 overflow-y-auto flex-1"
                    >
                                                        {filteredStores.length === 0 ? (
                            <div className="empty-state py-8 text-center">
                                <Icon.MagnifyingGlass size={40} className="mx-auto text-secondary2 mb-3" aria-hidden="true" />
                                <p className="body1 text-secondary2">{t('pages.storeLocation.noResults') || 'No stores found matching your search'}</p>
                            </div>
                        ) : (
                            <div className="store-location-list space-y-4">
                                {filteredStores.map((store) => {
                                    const isExpanded = expandedStoreIds.has(store.id)
                                    const storeStatus = getStoreStatus(store.hours)
                                    
                                    return (
                                        <article
                                            key={store.id}
                                            data-store-id={store.id}
                                            className={`store-list-item bg-surface rounded-2xl border border-line overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-black/30 ${
                                                isExpanded ? 'expanded' : ''
                                            }`}
                                        >
                                            {/* Header - Always Visible */}
                                            <button
                                                className="store-item-header w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer focus:outline-2 focus:outline-black focus:outline-offset-2"
                                                onClick={() => toggleStoreExpand(store.id)}
                                                aria-expanded={isExpanded}
                                                aria-controls={`store-details-${store.id}`}
                                                type="button"
                                            >
                                                {/* Store Info */}
                                                <div className="store-info flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="heading4 md:text-lg text-base font-bold text-black truncate">
                                                            {store.name}
                                                        </h3>
                                                        {/* Status Badge */}
                                                        <span className={`status-badge px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                                                            storeStatus.isOpen 
                                                                ? 'bg-green-100 text-green-700' 
                                                                : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            {storeStatus.isOpen 
                                                                ? t('pages.storeLocation.openNow') 
                                                                : t('pages.storeLocation.closed')
                                                            }
                                                        </span>
                                                    </div>
                                                    {!isExpanded && (
                                                        <p className="body3 text-secondary2 line-clamp-1">
                                                            {store.address}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                {/* Expand/Collapse Icon */}
                                                <div className="expand-icon flex-shrink-0">
                                                    <Icon.CaretDown
                                                        size={20}
                                                        className={`text-black transition-transform duration-300 ease-out ${
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
                                                <div className="store-details pb-4 pt-0 space-y-4 w-full">
                                                    {/* Store Image - Full Size (if exists) */}
                                                    {store.imageUrl && (
                                                        <div className="store-image-full w-full aspect-[16/9] relative rounded-xl overflow-hidden">
                                                            <Image
                                                                src={store.imageUrl}
                                                                alt={`${store.name} - ${t('pages.storeLocation.storeImage')}`}
                                                                fill
                                                                className="object-cover"
                                                                sizes="(max-width: 575px) calc(100vw - 32px), (max-width: 767px) calc(100vw - 40px), (max-width: 1023px) 500px, 600px"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Information Grid */}
                                                    <div className="store-info-grid space-y-4">
                                                        {/* Address Section */}
                                                        <div className="info-item address-section">
                                                            <div className="flex items-start gap-3">
                                                                <div className="info-icon-wrapper w-8 h-8 rounded-lg bg-surface flex items-center justify-center flex-shrink-0">
                                                                    <Icon.MapPin size={18} className="text-black" aria-hidden="true" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-xs uppercase text-secondary2 mb-1 font-semibold tracking-wide">
                                                                        {t('pages.storeLocation.address')}
                                                                    </div>
                                                                    <div className="flex items-start gap-2">
                                                                        <p className="body1 text-black leading-relaxed break-words flex-1">
                                                                            {store.address}
                                                                        </p>
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation()
                                                                                handleCopyToClipboard(store.address, `address-${store.id}`)
                                                                            }}
                                                                            className="copy-btn flex-shrink-0 w-7 h-7 rounded-lg bg-surface hover:bg-black hover:text-white flex items-center justify-center transition-colors duration-200 focus:outline-2 focus:outline-black focus:outline-offset-0"
                                                                            aria-label={t('pages.storeLocation.copy') || 'Copy address'}
                                                                            title={t('pages.storeLocation.copy') || 'Copy address'}
                                                                        >
                                                                            {copiedField === `address-${store.id}` ? (
                                                                                <Icon.Check size={14} aria-hidden="true" />
                                                                            ) : (
                                                                                <Icon.Copy size={14} aria-hidden="true" />
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Contact Info Grid */}
                                                        <div className="contact-section grid md:grid-cols-2 grid-cols-1 gap-3">
                                                            {/* Phone */}
                                                            <div className="info-item phone-item">
                                                                <div className="flex items-start gap-3">
                                                                    <div className="info-icon-wrapper w-8 h-8 rounded-lg bg-surface flex items-center justify-center flex-shrink-0">
                                                                        <Icon.Phone size={18} className="text-black" aria-hidden="true" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="text-xs uppercase text-secondary2 mb-1 font-semibold tracking-wide">
                                                                            {t('pages.storeLocation.phone')}
                                                                        </div>
                                                                        <div className="flex items-start gap-2">
                                                                            <a 
                                                                                href={`tel:${store.phone}`} 
                                                                                className="body1 text-black hover:underline hover:text-black/80 transition-colors duration-200 break-all flex-1"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                                aria-label={`${t('pages.storeLocation.call')} ${store.phone}`}
                                                                            >
                                                                                {store.phone}
                                                                            </a>
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    handleCopyToClipboard(store.phone, `phone-${store.id}`)
                                                                                }}
                                                                                className="copy-btn flex-shrink-0 w-7 h-7 rounded-lg bg-surface hover:bg-black hover:text-white flex items-center justify-center transition-colors duration-200 focus:outline-2 focus:outline-black focus:outline-offset-0"
                                                                                aria-label={t('pages.storeLocation.copy') || 'Copy phone'}
                                                                                title={t('pages.storeLocation.copy') || 'Copy phone'}
                                                                            >
                                                                                {copiedField === `phone-${store.id}` ? (
                                                                                    <Icon.Check size={14} aria-hidden="true" />
                                                                                ) : (
                                                                                    <Icon.Copy size={14} aria-hidden="true" />
                                                                                )}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Email */}
                                                            {store.email && (
                                                                <div className="info-item email-item">
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="info-icon-wrapper w-8 h-8 rounded-lg bg-surface flex items-center justify-center flex-shrink-0">
                                                                            <Icon.Envelope size={18} className="text-black" aria-hidden="true" />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="text-xs uppercase text-secondary2 mb-1 font-semibold tracking-wide">
                                                                                {t('pages.storeLocation.email')}
                                                                            </div>
                                                                            <div className="flex items-start gap-2">
                                                                                <a 
                                                                                    href={`mailto:${store.email}`} 
                                                                                    className="body1 text-black hover:underline hover:text-black/80 transition-colors duration-200 break-all flex-1"
                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                    aria-label={`${t('pages.storeLocation.email')} ${store.email}`}
                                                                                >
                                                                                    {store.email}
                                                                                </a>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation()
                                                                                        handleCopyToClipboard(store.email!, `email-${store.id}`)
                                                                                    }}
                                                                                    className="copy-btn flex-shrink-0 w-7 h-7 rounded-lg bg-surface hover:bg-black hover:text-white flex items-center justify-center transition-colors duration-200 focus:outline-2 focus:outline-black focus:outline-offset-0"
                                                                                    aria-label={t('pages.storeLocation.copy') || 'Copy email'}
                                                                                    title={t('pages.storeLocation.copy') || 'Copy email'}
                                                                                >
                                                                                    {copiedField === `email-${store.id}` ? (
                                                                                        <Icon.Check size={14} aria-hidden="true" />
                                                                                    ) : (
                                                                                        <Icon.Copy size={14} aria-hidden="true" />
                                                                                    )}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Opening Hours */}
                                                        <div className="info-item hours-section">
                                                            <div className="flex items-start gap-3">
                                                                <div className="info-icon-wrapper w-8 h-8 rounded-lg bg-surface flex items-center justify-center flex-shrink-0">
                                                                    <Icon.Clock size={18} className="text-black" aria-hidden="true" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="text-xs uppercase text-secondary2 mb-1 font-semibold tracking-wide">
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
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="action-buttons pt-2 flex flex-col gap-2">
                                                        {/* Get Directions */}
                                                        <a
                                                            href={`https://www.google.com/maps/search/?api=1&query=${store.coordinates.lat},${store.coordinates.lng}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="button-main w-full text-center inline-flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:outline-2 focus:outline-black focus:outline-offset-2"
                                                            onClick={(e) => e.stopPropagation()}
                                                            aria-label={`${t('pages.storeLocation.getDirections')} - ${store.name}`}
                                                        >
                                                            <Icon.ArrowRight size={18} aria-hidden="true" />
                                                            {t('pages.storeLocation.getDirections')}
                                                        </a>
                                                        
                                                        {/* View on Map */}
                                                        <button
                                                            type="button"
                                                            className="view-on-map-btn w-full px-4 py-2.5 text-sm font-medium text-black bg-transparent border-2 border-line rounded-xl hover:bg-black hover:text-white hover:border-black transition-all duration-300 focus:outline-2 focus:outline-black focus:outline-offset-2 inline-flex items-center justify-center gap-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleViewOnMap(store.id)
                                                            }}
                                                            aria-label={`${t('pages.storeLocation.viewOnMap')} - ${store.name}`}
                                                        >
                                                            <Icon.MapPin size={18} aria-hidden="true" />
                                                            {t('pages.storeLocation.viewOnMap') || 'View on Map'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalStoreLocation
