'use client'

import { FC, useEffect, useState } from 'react'
import { BrandButton } from '@/components/brand/BrandButton'

interface StickyBookingCTAProps {
  bookingUrl?: string | null
  whatsappNumber?: string | null
  ctaLabel?: string
}

export const StickyBookingCTA: FC<StickyBookingCTAProps> = ({ 
  bookingUrl, 
  whatsappNumber, 
  ctaLabel = 'Book Appointment' 
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero section (approx 400px)
      if (window.scrollY > 400) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!bookingUrl && !whatsappNumber) return null

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 bg-brand-surface/90 backdrop-blur-md border-t border-brand-border/50 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] transform transition-transform duration-300 md:hidden flex gap-3 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {whatsappNumber && (
        <BrandButton 
          href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`} 
          variant="secondary" 
          className="flex-1 justify-center whitespace-nowrap"
        >
          WhatsApp
        </BrandButton>
      )}
      {bookingUrl && (
        <BrandButton 
          href={bookingUrl} 
          variant="primary" 
          className="flex-[2] justify-center"
        >
          {ctaLabel}
        </BrandButton>
      )}
    </div>
  )
}
