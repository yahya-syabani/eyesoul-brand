'use client'
import React from 'react'
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'

interface StoreLocation {
    id: number
    name: string
    address: string
    phone: string
    email?: string
    hours: {
        weekdays: string
        saturday: string
        sunday: string
    }
    mapUrl: string
    coordinates: {
        lat: number
        lng: number
    }
}

const storeLocations: StoreLocation[] = [
    {
        id: 1,
        name: 'Jakarta Central Store',
        address: 'Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220',
        phone: '+62 21 5555 1234',
        email: 'jakarta@eyesoul.com',
        hours: {
            weekdays: 'Mon - Fri: 9:00am - 9:00pm',
            saturday: 'Saturday: 10:00am - 8:00pm',
            sunday: 'Sunday: 11:00am - 7:00pm'
        },
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.935283293612!2d106.81756661477038!3d-6.194621295520468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bce8!2sJl.%20Sudirman%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid',
        coordinates: {
            lat: -6.1946,
            lng: 106.8176
        }
    },
    {
        id: 2,
        name: 'Surabaya Store',
        address: 'Jl. Tunjungan No. 45, Surabaya, Jawa Timur 60264',
        phone: '+62 31 7777 5678',
        email: 'surabaya@eyesoul.com',
        hours: {
            weekdays: 'Mon - Fri: 9:00am - 9:00pm',
            saturday: 'Saturday: 10:00am - 8:00pm',
            sunday: 'Sunday: 11:00am - 7:00pm'
        },
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.715489290856!2d112.75278961477247!3d-7.257473794751906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f963d13b3e5d%3A0x5a6b5e4b5e4b5e4b!2sJl.%20Tunjungan%2C%20Surabaya!5e0!3m2!1sen!2sid!4v1234567890124!5m2!1sen!2sid',
        coordinates: {
            lat: -7.2575,
            lng: 112.7528
        }
    },
    {
        id: 3,
        name: 'Bandung Store',
        address: 'Jl. Dago No. 78, Bandung, Jawa Barat 40135',
        phone: '+62 22 8888 9012',
        email: 'bandung@eyesoul.com',
        hours: {
            weekdays: 'Mon - Fri: 9:00am - 9:00pm',
            saturday: 'Saturday: 10:00am - 8:00pm',
            sunday: 'Sunday: 11:00am - 7:00pm'
        },
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.935283293612!2d107.60856661477038!3d-6.902621295520468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6392c764b12d%3A0x3d2ad6e1e0e9bce8!2sJl.%20Dago%2C%20Bandung!5e0!3m2!1sen!2sid!4v1234567890125!5m2!1sen!2sid',
        coordinates: {
            lat: -6.9026,
            lng: 107.6086
        }
    }
]

const StoreLocationPage = () => {
    return (
        <>
            <div id="header" className='relative w-full'>
                <Breadcrumb heading='Store Location' subHeading='Store Location' />
            </div>
            <div className='store-location md:py-20 py-10'>
                <div className="container">
                    <div className="text-center mb-12">
                        <div className="heading3">Find Our Stores</div>
                        <div className="body1 text-secondary2 mt-3 max-w-2xl mx-auto">
                            Visit us at one of our locations. Our friendly staff is ready to help you find exactly what you're looking for.
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="map-section mb-16">
                        <div className="w-full h-[500px] rounded-[30px] overflow-hidden border border-line">
                            <iframe
                                src={storeLocations[0].mapUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Store Location Map"
                            ></iframe>
                        </div>
                    </div>

                    {/* Store Locations Grid */}
                    <div className="store-locations grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
                        {storeLocations.map((store) => (
                            <div key={store.id} className="store-card bg-surface p-6 rounded-[30px] border border-line">
                                <div className="heading4 mb-4">{store.name}</div>
                                
                                <div className="store-info space-y-4">
                                    <div className="address flex items-start gap-3">
                                        <Icon.MapPin size={20} className="text-black mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-button-uppercase text-secondary2 mb-1">Address</div>
                                            <p className="body2">{store.address}</p>
                                        </div>
                                    </div>

                                    <div className="phone flex items-start gap-3">
                                        <Icon.Phone size={20} className="text-black mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-button-uppercase text-secondary2 mb-1">Phone</div>
                                            <a href={`tel:${store.phone}`} className="body2 hover:underline">
                                                {store.phone}
                                            </a>
                                        </div>
                                    </div>

                                    {store.email && (
                                        <div className="email flex items-start gap-3">
                                            <Icon.Envelope size={20} className="text-black mt-1 flex-shrink-0" />
                                            <div>
                                                <div className="text-button-uppercase text-secondary2 mb-1">Email</div>
                                                <a href={`mailto:${store.email}`} className="body2 hover:underline">
                                                    {store.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    <div className="hours flex items-start gap-3">
                                        <Icon.Clock size={20} className="text-black mt-1 flex-shrink-0" />
                                        <div>
                                            <div className="text-button-uppercase text-secondary2 mb-1">Opening Hours</div>
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
                                            Get Directions
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default StoreLocationPage


