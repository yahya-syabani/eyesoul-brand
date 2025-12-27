'use client'
import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import { StoreLocationType } from '@/type/StoreLocationType'
import { useModalStoreLocationContext } from '@/context/ModalStoreLocationContext'

// Dynamically import map component to avoid SSR issues with Leaflet
const StoreLocationMap = dynamic(() => import('@/components/StoreLocation/StoreLocationMap'), {
    ssr: false,
    loading: () => {
        // Note: Translation needs to be handled differently for dynamic component
        return (
            <div className="w-full h-[500px] rounded-[30px] overflow-hidden border border-line flex items-center justify-center bg-surface">
                <div className="body1 text-secondary">Loading map...</div>
            </div>
        )
    }
})

const StoreLocationPage = () => {
    const t = useTranslations()
    const { openModalWithAllStores, openModalWithStore } = useModalStoreLocationContext()
    const [storeLocations, setStoreLocations] = useState<StoreLocationType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
    const mapSectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const loadStoreLocations = async () => {
            try {
                setLoading(true)
                const res = await fetch('/api/store-locations', { cache: 'no-store' })
                if (!res.ok) {
                    throw new Error('Failed to load store locations')
                }
                const json = await res.json()
                // Filter to only show active stores
                const activeLocations = (json.data || []).filter((loc: StoreLocationType) => loc.isActive)
                setStoreLocations(activeLocations)
            } catch (err) {
                console.error('Error loading store locations:', err)
                setError(t('pages.storeLocation.errorLoading'))
            } finally {
                setLoading(false)
            }
        }

        loadStoreLocations()
    }, [t])

    // Handle custom event from modal to view store on map
    useEffect(() => {
        const handleViewOnMap = (event: CustomEvent) => {
            const storeId = event.detail?.storeId
            if (storeId) {
                setSelectedLocationId(storeId)
                setTimeout(() => {
                    mapSectionRef.current?.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    })
                }, 100)
            }
        }

        window.addEventListener('store-location-view-on-map', handleViewOnMap as EventListener)
        return () => {
            window.removeEventListener('store-location-view-on-map', handleViewOnMap as EventListener)
        }
    }, [])

    const handleOpenModal = () => {
        if (storeLocations.length > 0) {
            openModalWithAllStores(storeLocations)
        }
    }

    const handleMarkerClick = (storeId: string) => {
        if (storeLocations.length > 0) {
            setSelectedLocationId(storeId)
            openModalWithStore(storeLocations, storeId)
        }
    }
    return (
        <>
            <div id="header" className='relative w-full'>
                <Breadcrumb heading={t('pages.storeLocation.heading')} subHeading={t('pages.storeLocation.heading')} />
            </div>
            <div className='store-location md:py-12 py-8'>
                <div className="container">
                    <div className="text-center mb-8">
                        <div className="heading3">{t('pages.storeLocation.findStores')}</div>
                        <div className="body1 text-secondary2 mt-3 max-w-2xl mx-auto">
                            {t('pages.storeLocation.description')}
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="body1 text-secondary">{t('pages.storeLocation.loadingStores')}</div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <div className="body1 text-red-500">{error}</div>
                        </div>
                    ) : storeLocations.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="body1 text-secondary">{t('pages.storeLocation.noStores')}</div>
                        </div>
                    ) : (
                        <>
                            {/* Map Section */}
                            <div ref={mapSectionRef} className="map-section mb-8" id="store-location-map">
                                {storeLocations.length > 0 && (
                                    <StoreLocationMap 
                                        locations={storeLocations} 
                                        selectedLocationId={selectedLocationId}
                                        onMarkerClick={handleMarkerClick}
                                    />
                                )}
                            </div>

                            {/* Button to Open Store List Modal */}
                            <div className="text-center">
                                        <button
                                    onClick={handleOpenModal}
                                    className="button-main px-8 py-4 text-lg font-medium transition-all duration-300 hover:shadow-lg focus:outline-2 focus:outline-black focus:outline-offset-2"
                                    aria-label={t('pages.storeLocation.viewAllStores') || 'View all stores'}
                                            type="button"
                                >
                                    {t('pages.storeLocation.viewAllStores') || 'View All Stores'}
                                        </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default StoreLocationPage


