'use client'
import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import { StoreLocationType } from '@/type/StoreLocationType'

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
    const [storeLocations, setStoreLocations] = useState<StoreLocationType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)

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
    }, [])
    return (
        <>
            <div id="header" className='relative w-full'>
                <Breadcrumb heading={t('pages.storeLocation.heading')} subHeading={t('pages.storeLocation.heading')} />
            </div>
            <div className='store-location md:py-20 py-10'>
                <div className="container">
                    <div className="text-center mb-12">
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
                            <div className="map-section mb-16">
                                {storeLocations.length > 0 && (
                                    <StoreLocationMap 
                                        locations={storeLocations} 
                                        selectedLocationId={selectedLocationId}
                                    />
                                )}
                            </div>

                            {/* Store Locations Grid */}
                            <div className="store-locations grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
                                {storeLocations.map((store) => (
                            <div 
                                key={store.id} 
                                className="store-card bg-surface p-6 rounded-[30px] border border-line cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => setSelectedLocationId(store.id)}
                            >
                                <div className="heading4 mb-4">{store.name}</div>
                                
                                <div className="store-info space-y-4">
                                    <div className="address flex items-start gap-3">
                                        <Icon.MapPin size={20} className="text-black mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-button-uppercase text-secondary2 mb-1">{t('pages.storeLocation.address')}</div>
                                            <p className="body2">{store.address}</p>
                                        </div>
                                    </div>

                                    <div className="phone flex items-start gap-3">
                                        <Icon.Phone size={20} className="text-black mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-button-uppercase text-secondary2 mb-1">{t('pages.storeLocation.phone')}</div>
                                            <a href={`tel:${store.phone}`} className="body2 hover:underline">
                                                {store.phone}
                                            </a>
                                        </div>
                                    </div>

                                    {store.email && (
                                        <div className="email flex items-start gap-3">
                                            <Icon.Envelope size={20} className="text-black mt-1 flex-shrink-0" />
                                            <div>
                                                <div className="text-button-uppercase text-secondary2 mb-1">{t('pages.storeLocation.email')}</div>
                                                <a href={`mailto:${store.email}`} className="body2 hover:underline">
                                                    {store.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    <div className="hours flex items-start gap-3">
                                        <Icon.Clock size={20} className="text-black mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-button-uppercase text-secondary2 mb-1">{t('pages.storeLocation.openingHours')}</div>
                                            <div className="space-y-1">
                                                <p className="body2">{store.hours.weekdays}</p>
                                                <p className="body2">{store.hours.saturday}</p>
                                                <p className="body2">{store.hours.sunday}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${store.coordinates.lat},${store.coordinates.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="button-main w-full text-center inline-block"
                                        >
                                            {t('pages.storeLocation.getDirections')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                                ))}
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


