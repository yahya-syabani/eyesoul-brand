'use client'

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import InsuranceCard from './InsuranceCard'
import { InsuranceType } from '@/type/InsuranceType'

interface InsuranceGridProps {
  insurances: InsuranceType[]
  compact?: boolean
  limit?: number
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const InsuranceGrid: React.FC<InsuranceGridProps> = ({
  insurances,
  compact = false,
  limit,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  const displayInsurances = limit ? insurances.slice(0, limit) : insurances

  return (
    <motion.div
      ref={ref}
      className="insurance-grid grid gap-6 grid-cols-3 w-full"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {displayInsurances.map((insurance, index) => (
        <InsuranceCard
          key={insurance.id}
          insurance={insurance}
          index={index}
          compact={compact}
        />
      ))}
    </motion.div>
  )
}

export default InsuranceGrid

