'use client'

import React, { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import ServiceCard from '@/components/Service/ServiceCard'
import servicesData from '@/data/Services.json'

const Services = () => {
  const t = useTranslations()
  const tServices = useTranslations('pages.service.services')

  // Get translated service data
  const translatedServices = useMemo(() => {
    return servicesData.map((service) => ({
      ...service,
      title: tServices(`${service.id}.title`),
      description: tServices(`${service.id}.description`),
    }))
  }, [tServices])

  return (
    <>
      <div id="header" className="relative w-full">
        <Breadcrumb heading={t('pages.service.heading')} subHeading={t('pages.service.heading')} />
      </div>

      {/* Hero Image Section */}
      <div className="service-hero md:pt-20 pt-10">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="hero-image-wrapper rounded-[30px] overflow-hidden"
          >
            <div className="relative w-full h-[400px] md:h-[500px]">
              {/* Placeholder */}
              <div className="absolute inset-0 bg-line flex items-center justify-center z-0">
                <div className="text-center">
                  <div className="caption1 text-secondary mb-2">1200 × 500</div>
                  <div className="caption2 text-secondary2">Image Placeholder</div>
                </div>
              </div>
              {/* Text overlay - always on top */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-center text-white px-4"
                >
                  <h1 className="heading1 md:heading-display mb-4">{t('pages.service.heading')}</h1>
                  <p className="body1 max-w-2xl mx-auto">
                    {t('pages.service.heroDescription')}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Services Grid Section */}
      <div className="services-grid-section md:py-20 py-10 bg-surface">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="heading3 mb-4">{t('pages.service.sectionHeading')}</h2>
            <p className="body1 text-secondary max-w-2xl mx-auto">
              {t('pages.service.sectionDescription')}
            </p>
          </motion.div>

          <div className="services-grid grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 md:gap-8">
            {translatedServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                title={service.title}
                description={service.description}
                image={service.image}
                icon={service.icon}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Services

