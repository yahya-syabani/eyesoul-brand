import { FC } from 'react'
import { MapPinIcon, ClockIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { BrandButton } from '../BrandButton'

interface StoreInfo {
  name: string
  address: string
  city?: string | null
  phone?: string | null
  email?: string | null
  hours?: { day: string; open?: string | null; close?: string | null }[] | null
  mapsUrl?: string | null
}

export const LocationMapSection: FC<{ store: StoreInfo | null }> = ({ store }) => {
  if (!store) return null

  // Fallback for missing hours
  const displayHours = store.hours && store.hours.length > 0 
    ? store.hours 
    : [
        { day: 'Mon - Fri', open: '10:00', close: '20:00' },
        { day: 'Sat - Sun', open: '10:00', close: '18:00' },
      ]

  return (
    <section className="container py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch rounded-3xl border border-brand-border/50 bg-brand-surface overflow-hidden">
        
        {/* Info Column */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="font-display text-3xl font-semibold text-brand-ink mb-6">Visit our {store.name.toLowerCase()}</h2>
          
          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <MapPinIcon className="h-6 w-6 text-brand-ink shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-brand-ink">Address</h4>
                <p className="text-brand-muted-foreground whitespace-pre-line mt-1 text-sm leading-relaxed">
                  {store.address}
                  <br />
                  {store.city}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <ClockIcon className="h-6 w-6 text-brand-ink shrink-0 mt-0.5" />
              <div className="w-full">
                <h4 className="font-medium text-brand-ink mb-2">Opening Hours</h4>
                <div className="space-y-1 w-full max-w-xs">
                  {displayHours.map((h, i) => (
                    <div key={i} className="flex justify-between text-sm text-brand-muted-foreground border-b border-brand-border/30 pb-1 last:border-0 last:pb-0">
                      <span className="capitalize">{h.day}</span>
                      <span>{h.open} - {h.close}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {(store.phone || store.email) && (
              <div className="flex items-start gap-4 pt-2">
                <div className="flex flex-col gap-3">
                  {store.phone && (
                    <a href={`tel:${store.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-sm font-medium text-brand-ink hover:text-brand-accent-hover transition-colors">
                      <PhoneIcon className="h-5 w-5" />
                      {store.phone}
                    </a>
                  )}
                  {store.email && (
                    <a href={`mailto:${store.email}`} className="flex items-center gap-3 text-sm font-medium text-brand-ink hover:text-brand-accent-hover transition-colors">
                      <EnvelopeIcon className="h-5 w-5" />
                      {store.email}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-brand-border/30 flex gap-4">
            <BrandButton href={store.mapsUrl || "https://maps.google.com"} variant="secondary" className="w-full justify-center">
              Get Directions
            </BrandButton>
          </div>
        </div>

        {/* Map Column (Generic iFrame placeholder) */}
        <div className="relative h-64 lg:h-auto min-h-[300px] bg-brand-muted/20">
           <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.24009712165!2d106.74100055273436!3d-6.229746400000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 grayscale contrast-125 opacity-80 mix-blend-multiply hover:grayscale-0 hover:opacity-100 hover:mix-blend-normal transition-all duration-500"
            title="Store Location"
          ></iframe>
        </div>
        
      </div>
    </section>
  )
}
