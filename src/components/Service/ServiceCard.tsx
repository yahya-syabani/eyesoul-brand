'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface ServiceCardProps {
  id: string
  title: string
  description: string
  image: string
  icon?: string
  index: number
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  image,
  icon,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      whileHover={{
        scale: 1.05,
        y: -5,
        transition: { duration: 0.3 },
      }}
      className="service-card bg-white rounded-[20px] overflow-hidden border border-line hover:border-black transition-colors duration-300 cursor-pointer"
    >
      <div className="service-image relative w-full h-[250px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {icon && (
          <div className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg">
            <i className={`${icon} text-2xl text-black`}></i>
          </div>
        )}
      </div>
      <div className="service-content p-6">
        <h3 className="heading6 mb-3">{title}</h3>
        <p className="body1 text-secondary">{description}</p>
      </div>
    </motion.div>
  )
}

export default ServiceCard

